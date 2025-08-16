const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Pet = require('./models/pet');
const Booking = require('./models/booking');
const Donation = require('./models/donation');
const HealthLog = require('./models/healthLog');
const Notification = require('./models/notification');
const TrainingResource = require('./models/trainingResource');
const Token = require('./models/Token');

// Import static data
const { staticData } = require('./static');

// Function to hash passwords for users
const hashPasswords = async (users) => {
  const hashedUsers = [];
  for (const user of users) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    hashedUsers.push({
      ...user,
      password: hashedPassword
    });
  }
  return hashedUsers;
};

// Function to seed a specific collection
const seedCollection = async (Model, data, collectionName) => {
  try {
    const count = await Model.countDocuments();

    if (count === 0) {
      console.log(`Seeding ${collectionName}...`);

      // Special handling for users to hash passwords
      if (collectionName === 'users') {
        const hashedUsers = await hashPasswords(data);
        await Model.insertMany(hashedUsers);
      } else {
        await Model.insertMany(data);
      }

      console.log(`✅ Successfully seeded ${data.length} ${collectionName}`);
    } else {
      console.log(`⏭️  ${collectionName} already has data (${count} documents), skipping...`);
    }
  } catch (error) {
    console.error(`❌ Error seeding ${collectionName}:`, error.message);
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Define the seeding order (important for referential integrity)
    const seedingOrder = [
      { model: User, data: staticData.users, name: 'users' },
      { model: Pet, data: staticData.pets, name: 'pets' },
      { model: Booking, data: staticData.bookings, name: 'bookings' },
      { model: Donation, data: staticData.donations, name: 'donations' },
      { model: HealthLog, data: staticData.healthLogs, name: 'healthLogs' },
      { model: Notification, data: staticData.notifications, name: 'notifications' },
      { model: TrainingResource, data: staticData.trainingResources, name: 'trainingResources' },
      { model: Token, data: staticData.tokens, name: 'tokens' }
    ];

    // Seed each collection in order
    for (const { model, data, name } of seedingOrder) {
      await seedCollection(model, data, name);
    }

    console.log('🎉 Database seeding completed successfully!');

    // Log summary
    const totalUsers = await User.countDocuments();
    const totalPets = await Pet.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const totalHealthLogs = await HealthLog.countDocuments();
    const totalNotifications = await Notification.countDocuments();
    const totalTrainingResources = await TrainingResource.countDocuments();
    const totalTokens = await Token.countDocuments();

    console.log('\n📊 Database Summary:');
    console.log(`   Users: ${totalUsers}`);
    console.log(`   Pets: ${totalPets}`);
    console.log(`   Bookings: ${totalBookings}`);
    console.log(`   Donations: ${totalDonations}`);
    console.log(`   Health Logs: ${totalHealthLogs}`);
    console.log(`   Notifications: ${totalNotifications}`);
    console.log(`   Training Resources: ${totalTrainingResources}`);
    console.log(`   Tokens: ${totalTokens}`);

  } catch (error) {
    console.error('❌ Error during database seeding:', error.message);
  }
};

// Function to clear all collections (useful for development)
const clearDatabase = async () => {
  try {
    console.log('🗑️  Clearing database...');

    await User.deleteMany({});
    await Pet.deleteMany({});
    await Booking.deleteMany({});
    await Donation.deleteMany({});
    await HealthLog.deleteMany({});
    await Notification.deleteMany({});
    await TrainingResource.deleteMany({});
    await Token.deleteMany({});

    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
  }
};

// Function to reset database (clear and seed)
const resetDatabase = async () => {
  await clearDatabase();
  await seedDatabase();
};

module.exports = {
  seedDatabase,
  clearDatabase,
  resetDatabase
};