// Static data for Pet Management System
// This file contains sample data for all database collections

const staticData = {
  // Users data
  users: [
    {
      _id: "507f1f77bcf86cd799439011",
      name: "John Admin",
      email: "admin@petmanagement.com",
      password: "$2a$10$example.hashed.password.here", // "password123"
      role: "admin",
      isVerified: true,
      verified: new Date("2024-01-15T10:00:00Z"),
      verificationToken: "",
    },
    {
      _id: "507f1f77bcf86cd799439012",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      password: "$2a$10$example.hashed.password.here", // "password123"
      role: "user",
      isVerified: true,
      verified: new Date("2024-02-01T14:30:00Z"),
      verificationToken: "",
    },
    {
      _id: "507f1f77bcf86cd799439013",
      name: "Mike Wilson",
      email: "mike@example.com",
      password: "$2a$10$example.hashed.password.here", // "password123"
      role: "user",
      isVerified: true,
      verified: new Date("2024-02-10T09:15:00Z"),
      verificationToken: "",
    },
    {
      _id: "507f1f77bcf86cd799439014",
      name: "Emma Davis",
      email: "emma@example.com",
      password: "$2a$10$example.hashed.password.here", // "password123"
      role: "user",
      isVerified: false,
      verificationToken: "abc123def456ghi789",
    }
  ],

  // Pets data
  pets: [
    {
      _id: "507f1f77bcf86cd799439021",
      name: "Buddy",
      species: "Dog",
      breed: "Golden Retriever",
      age: 3,
      gender: "Male",
      description: "Friendly and energetic dog, great with kids. Loves playing fetch and going for walks.",
      imageUrl: "https://example.com/images/buddy.jpg",
      status: "available",
      addedBy: "507f1f77bcf86cd799439012",
      approved: true,
      createdAt: new Date("2024-01-20T10:00:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439022",
      name: "Whiskers",
      species: "Cat",
      breed: "Persian",
      age: 2,
      gender: "Female",
      description: "Calm and affectionate cat. Enjoys quiet environments and gentle petting.",
      imageUrl: "https://example.com/images/whiskers.jpg",
      status: "available",
      addedBy: "507f1f77bcf86cd799439013",
      approved: true,
      createdAt: new Date("2024-01-25T15:30:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439023",
      name: "Charlie",
      species: "Dog",
      breed: "Labrador Mix",
      age: 5,
      gender: "Male",
      description: "Well-trained and loyal companion. Good with other pets and children.",
      imageUrl: "https://example.com/images/charlie.jpg",
      status: "adopted",
      addedBy: "507f1f77bcf86cd799439012",
      approved: true,
      createdAt: new Date("2024-02-01T11:00:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439024",
      name: "Luna",
      species: "Cat",
      breed: "Siamese",
      age: 1,
      gender: "Female",
      description: "Playful kitten looking for a loving home. Very social and curious.",
      imageUrl: "https://example.com/images/luna.jpg",
      status: "available",
      addedBy: "507f1f77bcf86cd799439014",
      approved: false,
      createdAt: new Date("2024-02-15T09:45:00Z"),
    }
  ],

  // Bookings data
  bookings: [
    {
      _id: "507f1f77bcf86cd799439031",
      user: "507f1f77bcf86cd799439012",
      pet: "507f1f77bcf86cd799439021",
      serviceType: "veterinary",
      providerName: "Dr. Smith Veterinary Clinic",
      date: new Date("2024-03-15T14:00:00Z"),
      notes: "Annual checkup and vaccination",
      status: "confirmed",
      createdAt: new Date("2024-02-20T10:30:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439032",
      user: "507f1f77bcf86cd799439013",
      pet: "507f1f77bcf86cd799439022",
      serviceType: "grooming",
      providerName: "Paws & Claws Grooming",
      date: new Date("2024-03-10T11:00:00Z"),
      notes: "Full grooming service including nail trim",
      status: "pending",
      createdAt: new Date("2024-02-25T16:15:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439033",
      user: "507f1f77bcf86cd799439012",
      pet: "507f1f77bcf86cd799439023",
      serviceType: "daycare",
      providerName: "Happy Tails Daycare",
      date: new Date("2024-02-28T08:00:00Z"),
      notes: "Full day care service",
      status: "completed",
      createdAt: new Date("2024-02-15T12:00:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439034",
      user: "507f1f77bcf86cd799439014",
      pet: "507f1f77bcf86cd799439024",
      serviceType: "training",
      providerName: "Pet Training Academy",
      date: new Date("2024-03-20T10:00:00Z"),
      notes: "Basic obedience training session",
      status: "pending",
      createdAt: new Date("2024-03-01T09:00:00Z"),
    }
  ],

  // Donations data
  donations: [
    {
      _id: "507f1f77bcf86cd799439041",
      user: "507f1f77bcf86cd799439012",
      amount: 50.00,
      cause: "Local Animal Shelter",
      paymentStatus: "successful",
      createdAt: new Date("2024-02-01T10:00:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439042",
      user: "507f1f77bcf86cd799439013",
      amount: 25.00,
      cause: "Pet Rescue Foundation",
      paymentStatus: "successful",
      createdAt: new Date("2024-02-10T14:30:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439043",
      user: "507f1f77bcf86cd799439014",
      amount: 100.00,
      cause: "Emergency Pet Care Fund",
      paymentStatus: "pending",
      createdAt: new Date("2024-02-20T09:15:00Z"),
    }
  ],

  // Health logs data
  healthLogs: [
    {
      _id: "507f1f77bcf86cd799439051",
      pet: "507f1f77bcf86cd799439021",
      vaccination: "Rabies",
      weight: 32.5,
      notes: "Annual checkup completed. Pet is in excellent health.",
      date: new Date("2024-02-15T10:00:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439052",
      pet: "507f1f77bcf86cd799439022",
      vaccination: "FVRCP",
      weight: 8.2,
      notes: "Routine vaccination. Cat is healthy and active.",
      date: new Date("2024-02-10T11:30:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439053",
      pet: "507f1f77bcf86cd799439023",
      vaccination: "DHPP",
      weight: 28.7,
      notes: "Pre-adoption health check. All tests normal.",
      date: new Date("2024-01-30T14:15:00Z"),
    }
  ],

  // Notifications data
  notifications: [
    {
      _id: "507f1f77bcf86cd799439061",
      user: "507f1f77bcf86cd799439012",
      message: "Your booking for Buddy's vet appointment has been confirmed for March 15th.",
      read: false,
      createdAt: new Date("2024-02-20T10:35:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439062",
      user: "507f1f77bcf86cd799439013",
      message: "Thank you for your donation to Pet Rescue Foundation!",
      read: true,
      createdAt: new Date("2024-02-10T14:35:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439063",
      user: "507f1f77bcf86cd799439014",
      message: "Your pet Luna is pending approval. We'll notify you once it's reviewed.",
      read: false,
      createdAt: new Date("2024-02-15T09:50:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439064",
      user: "507f1f77bcf86cd799439012",
      message: "Reminder: Buddy's grooming appointment is tomorrow at 2 PM.",
      read: false,
      createdAt: new Date("2024-03-09T18:00:00Z"),
    }
  ],

  // Training resources data
  trainingResources: [
    {
      _id: "507f1f77bcf86cd799439071",
      title: "Basic Dog Obedience Training",
      description: "Learn fundamental commands like sit, stay, come, and heel. Perfect for new dog owners.",
      category: "obedience",
      videoUrl: "https://example.com/videos/basic-obedience.mp4",
      createdAt: new Date("2024-01-10T12:00:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439072",
      title: "Cat Litter Training Guide",
      description: "Step-by-step guide to successfully litter train your cat or kitten.",
      category: "training",
      videoUrl: "https://example.com/videos/litter-training.mp4",
      createdAt: new Date("2024-01-15T14:30:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439073",
      title: "Pet Grooming Basics",
      description: "Learn how to properly groom your pet at home, including brushing, nail trimming, and bathing.",
      category: "grooming",
      videoUrl: "https://example.com/videos/grooming-basics.mp4",
      createdAt: new Date("2024-01-20T10:15:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439074",
      title: "Recognizing Pet Health Issues",
      description: "Important signs and symptoms to watch for in your pet's health and when to contact a vet.",
      category: "health",
      videoUrl: "https://example.com/videos/health-signs.mp4",
      createdAt: new Date("2024-01-25T16:45:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439075",
      title: "Puppy Socialization Tips",
      description: "Essential guide to properly socializing your puppy with other dogs and people.",
      category: "socialization",
      videoUrl: "https://example.com/videos/puppy-socialization.mp4",
      createdAt: new Date("2024-02-01T11:20:00Z"),
    }
  ],

  // Tokens data (refresh tokens)
  tokens: [
    {
      _id: "507f1f77bcf86cd799439081",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.token.here",
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      isValid: true,
      user: "507f1f77bcf86cd799439012",
      createdAt: new Date("2024-02-20T10:00:00Z"),
      updatedAt: new Date("2024-02-20T10:00:00Z"),
    },
    {
      _id: "507f1f77bcf86cd799439082",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.another.example.token",
      ip: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      isValid: true,
      user: "507f1f77bcf86cd799439013",
      createdAt: new Date("2024-02-18T14:30:00Z"),
      updatedAt: new Date("2024-02-18T14:30:00Z"),
    }
  ]
};

// Helper function to get data by collection name
const getCollectionData = (collectionName) => {
  return staticData[collectionName] || [];
};

// Export individual collections for easier access
const {
  users,
  pets,
  bookings,
  donations,
  healthLogs,
  notifications,
  trainingResources,
  tokens
} = staticData;

module.exports = {
  staticData,
  getCollectionData,
  users,
  pets,
  bookings,
  donations,
  healthLogs,
  notifications,
  trainingResources,
  tokens
};