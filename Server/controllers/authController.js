const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  createHash,
} = require('../utils');
const crypto = require('crypto');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });
  const origin = process.env.ORIGIN;

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify account',
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('User not found');
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification Failed');
  }

  (user.isVerified = true), (user.verified = Date.now());
  user.verificationToken = '';

  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify your email');
  }
  const tokenUser = createTokenUser(user);


  // create refresh token
  let refreshToken = '';
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });


  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    // Also create a JWT token for frontend localStorage
    const { createJWT } = require('../utils');
    const accessToken = createJWT({ payload: { user: tokenUser } });

    res.status(StatusCodes.OK).json({
      user: tokenUser,
      token: accessToken
    });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  // Also create a JWT token for frontend localStorage
  const { createJWT } = require('../utils');
  const accessToken = createJWT({ payload: { user: tokenUser } });

  res.status(StatusCodes.OK).json({
    user: tokenUser,
    token: accessToken
  });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

// Test endpoint to debug authentication
const testAuth = async (req, res) => {
  console.log('Test auth endpoint hit');
  console.log('User from middleware:', req.user);
  res.status(StatusCodes.OK).json({
    msg: 'Authentication working!',
    user: req.user
  });
};

// Resend verification email
const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError.BadRequestError('Please provide email');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.NotFoundError('User not found');
  }

  if (user.isVerified) {
    throw new CustomError.BadRequestError('Email is already verified');
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(40).toString('hex');
  user.verificationToken = verificationToken;
  await user.save();

  const origin = process.env.ORIGIN;

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.OK).json({
    msg: 'Verification email sent successfully',
  });
};



module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  testAuth,
  resendVerificationEmail,
};
