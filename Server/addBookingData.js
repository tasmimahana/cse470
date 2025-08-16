require("dotenv").config();
const connectDB = require("./db/connect");
const Booking = require("./models/booking");
const User = require("./models/User");
const Pet = require("./models/pet");

const addBookingData = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectDB(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get users and pets for bookings
    const users = await User.find({ role: "user" }).limit(3);
    const pets = await Pet.find().limit(3);

    if (users.length === 0 || pets.length === 0) {
      console.log('❌ No users or pets found for bookings');
      return;
    }

    // Add some test bookings
    const testBookings = [
      {
        user: users[0]._id,
        pet: pets[0]._id,
        serviceType: "veterinary",
        providerName: "Dr. Sarah Johnson",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        status: "pending",
        notes: "Annual checkup and vaccinations needed",
      },
      {
        user: users[1]._id,
        pet: pets[1]._id,
        serviceType: "grooming",
        providerName: "Lisa Thompson",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: "confirmed",
        notes: "Full grooming package requested",
      },
      {
        user: users[2]._id,
        pet: pets[2]._id,
        serviceType: "daycare",
        providerName: "Happy Tails Daycare",
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        status: "confirmed",
        notes: "First time daycare, pet is very social",
      },
      {
        user: users[0]._id,
        pet: pets[1]._id,
        serviceType: "training",
        providerName: "Professional Pet Training",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: "completed",
        notes: "Basic obedience training completed successfully",
      },
      {
        user: users[1]._id,
        pet: pets[0]._id,
        serviceType: "veterinary",
        providerName: "Dr. Michael Chen",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        status: "pending",
        notes: "Emergency consultation requested",
      }
    ];

    console.log('📅 Adding test bookings...');
    await Booking.insertMany(testBookings);
    console.log(`✅ Added ${testBookings.length} test bookings`);

    // Test the bookings
    console.log('\n📊 Booking Stats:');
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    console.log({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
    });

    console.log('\n✅ Test booking data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to add test booking data:', error);
    process.exit(1);
  }
};

addBookingData();