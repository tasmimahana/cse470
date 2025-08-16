import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userAPI } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { User, Mail, Lock, Save, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const profileSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const passwordSchema = yup.object({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

const Profile = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data) => {
    try {
      await userAPI.updateProfile(data);
      // Update user context if email changed
      if (data.email !== user.email) {
        await login({ email: data.email, password: "dummy" }); // This will refresh user data
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await userAPI.updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully");
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update password");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Profile Settings</h1>
          <p className='text-gray-600 mt-2'>
            Manage your account settings and preferences
          </p>
        </div>

        <div className='bg-white rounded-lg shadow'>
          {/* Tabs */}
          <div className='border-b border-gray-200'>
            <nav className='flex space-x-8 px-6'>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "password"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Change Password
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {activeTab === "profile" && (
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-6'>
                  Profile Information
                </h3>
                <form
                  onSubmit={handleProfileSubmit(onProfileSubmit)}
                  className='space-y-6'
                >
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Full Name
                      </label>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                          <User className='h-5 w-5 text-gray-400' />
                        </div>
                        <input
                          {...registerProfile("name")}
                          type='text'
                          className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          placeholder='Enter your full name'
                        />
                      </div>
                      {profileErrors.name && (
                        <p className='mt-1 text-sm text-red-600'>
                          {profileErrors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Email Address
                      </label>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                          <Mail className='h-5 w-5 text-gray-400' />
                        </div>
                        <input
                          {...registerProfile("email")}
                          type='email'
                          className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          placeholder='Enter your email'
                        />
                      </div>
                      {profileErrors.email && (
                        <p className='mt-1 text-sm text-red-600'>
                          {profileErrors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <h4 className='text-sm font-medium text-gray-900 mb-2'>
                      Account Information
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='text-gray-600'>Role:</span>
                        <span className='ml-2 font-medium capitalize'>
                          {user?.role}
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-600'>Member since:</span>
                        <span className='ml-2 font-medium'>
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-600'>Email verified:</span>
                        <span
                          className={`ml-2 font-medium ${
                            user?.isVerified ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {user?.isVerified ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <button
                      type='submit'
                      disabled={isProfileSubmitting}
                      className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                      <Save className='h-4 w-4 mr-2' />
                      {isProfileSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-6'>
                  Change Password
                </h3>
                <form
                  onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                  className='space-y-6'
                >
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Current Password
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Lock className='h-5 w-5 text-gray-400' />
                      </div>
                      <input
                        {...registerPassword("oldPassword")}
                        type={showPasswords.old ? "text" : "password"}
                        className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter current password'
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        onClick={() => togglePasswordVisibility("old")}
                      >
                        {showPasswords.old ? (
                          <EyeOff className='h-5 w-5 text-gray-400' />
                        ) : (
                          <Eye className='h-5 w-5 text-gray-400' />
                        )}
                      </button>
                    </div>
                    {passwordErrors.oldPassword && (
                      <p className='mt-1 text-sm text-red-600'>
                        {passwordErrors.oldPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      New Password
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Lock className='h-5 w-5 text-gray-400' />
                      </div>
                      <input
                        {...registerPassword("newPassword")}
                        type={showPasswords.new ? "text" : "password"}
                        className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter new password'
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPasswords.new ? (
                          <EyeOff className='h-5 w-5 text-gray-400' />
                        ) : (
                          <Eye className='h-5 w-5 text-gray-400' />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className='mt-1 text-sm text-red-600'>
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Confirm New Password
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Lock className='h-5 w-5 text-gray-400' />
                      </div>
                      <input
                        {...registerPassword("confirmPassword")}
                        type={showPasswords.confirm ? "text" : "password"}
                        className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Confirm new password'
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center'
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className='h-5 w-5 text-gray-400' />
                        ) : (
                          <Eye className='h-5 w-5 text-gray-400' />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className='mt-1 text-sm text-red-600'>
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className='bg-yellow-50 border border-yellow-200 rounded-md p-4'>
                    <div className='flex'>
                      <div className='ml-3'>
                        <h3 className='text-sm font-medium text-yellow-800'>
                          Password Requirements
                        </h3>
                        <div className='mt-2 text-sm text-yellow-700'>
                          <ul className='list-disc list-inside space-y-1'>
                            <li>At least 6 characters long</li>
                            <li>Should be different from your current password</li>
                            <li>Consider using a mix of letters, numbers, and symbols</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <button
                      type='submit'
                      disabled={isPasswordSubmitting}
                      className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                      <Save className='h-4 w-4 mr-2' />
                      {isPasswordSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;