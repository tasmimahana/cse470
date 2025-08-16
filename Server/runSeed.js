require("dotenv").config();
const connectDB = require("./db/connect");
const { seedDatabase, resetDatabase } = require("./seed");

const runSeed = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectDB(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if we should reset (clear and seed) or just seed
    const shouldReset = process.argv.includes('--reset');

    if (shouldReset) {
      console.log('🔄 Resetting database (clear and seed)...');
      await resetDatabase();
    } else {
      console.log('🌱 Seeding database...');
      await seedDatabase();
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();