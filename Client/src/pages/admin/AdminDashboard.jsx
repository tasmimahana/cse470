import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAPI, petAPI, bookingAPI, donationAPI } from "../../lib/api";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  Users,
  Heart,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  UserCheck,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingPets, setPendingPets] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Try to fetch admin dashboard stats first
      let statsData = null;
      let pendingPetsData = [];
      let usersData = [];

      try {
        const statsResponse = await adminAPI.getDashboardStats();
        statsData = statsResponse.data.data || statsResponse.data;
        console.log("Admin stats response:", statsData);
      } catch (statsError) {
        console.warn("Admin stats endpoint failed, will calculate manually:", statsError);
      }

      // Fetch pending pets
      try {
        const pendingPetsResponse = await adminAPI.getPendingApprovals();
        pendingPetsData = pendingPetsResponse.data.data || pendingPetsResponse.data || [];
        console.log("Pending pets response:", pendingPetsData);
      } catch (petsError) {
        console.warn("Pending pets endpoint failed, trying alternative:", petsError);
        // Fallback: get all pets and filter for non-approved ones
        try {
          const allPetsResponse = await petAPI.getAllPets();
          const allPets = allPetsResponse.data.pets || allPetsResponse.data.data || [];
          pendingPetsData = allPets.filter(pet => !pet.approved);
        } catch (fallbackError) {
          console.error("Fallback pets fetch failed:", fallbackError);
        }
      }

      // Fetch recent users
      try {
        const usersResponse = await adminAPI.getAllUsers({ limit: 5 });
        usersData = usersResponse.data.data || usersResponse.data || [];
        console.log("Users response:", usersData);
      } catch (usersError) {
        console.warn("Users endpoint failed:", usersError);
      }

      // If admin stats failed, calculate manually
      if (!statsData) {
        console.log("Calculating stats manually...");

        // Get all data for manual calculation
        const [allUsersResponse, allPetsResponse, allBookingsResponse, allDonationsResponse] = await Promise.all([
          adminAPI.getAllUsers().catch(() => ({ data: { data: [] } })),
          petAPI.getAllPets().catch(() => ({ data: { pets: [] } })),
          bookingAPI.getAllBookings().catch(() => ({ data: { data: [] } })),
          donationAPI.getAllDonations().catch(() => ({ data: { data: [] } }))
        ]);

        const allUsers = allUsersResponse.data.data || allUsersResponse.data || [];
        const allPets = allPetsResponse.data.pets || allPetsResponse.data.data || [];
        const allBookings = allBookingsResponse.data.data || allBookingsResponse.data || [];
        const allDonations = allDonationsResponse.data.data || allDonationsResponse.data || [];

        // Calculate stats manually
        statsData = {
          totalUsers: allUsers.length,
          totalPets: allPets.length,
          pendingApprovals: allPets.filter(pet => !pet.approved).length,
          activeBookings: allBookings.filter(booking =>
            booking.status === 'confirmed' || booking.status === 'pending'
          ).length,
          totalDonations: allDonations.reduce((sum, donation) =>
            donation.paymentStatus === 'successful' ? sum + donation.amount : sum, 0
          ),
          monthlyRevenue: allDonations
            .filter(donation => {
              const donationDate = new Date(donation.createdAt);
              const currentDate = new Date();
              return donationDate.getMonth() === currentDate.getMonth() &&
                donationDate.getFullYear() === currentDate.getFullYear() &&
                donation.paymentStatus === 'successful';
            })
            .reduce((sum, donation) => sum + donation.amount, 0),
          userGrowth: 0, // Could calculate if we had historical data
          petGrowth: 0,
          donationGrowth: 0,
          bookingGrowth: 0,
          revenueGrowth: 0
        };

        console.log("Calculated stats:", statsData);
      }

      setStats(statsData);
      setPendingPets(pendingPetsData);
      setRecentUsers(usersData.slice(0, 5)); // Ensure we only show 5 recent users

    } catch (error) {
      console.error("Dashboard error:", error);

      // Check if it's a network error (backend not running)
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        toast.error("Backend server is not running. Please start the server on port 3000.");

        // Set demo data for development
        setStats({
          totalUsers: 25,
          totalPets: 18,
          pendingApprovals: 3,
          activeBookings: 12,
          totalDonations: 1250.50,
          monthlyRevenue: 450.75,
          userGrowth: 15,
          petGrowth: 8,
          donationGrowth: 22,
          bookingGrowth: 5,
          revenueGrowth: 12
        });

        // Set demo pending pets
        setPendingPets([
          {
            _id: 'demo1',
            name: 'Buddy',
            species: 'Dog',
            breed: 'Golden Retriever',
            imageUrl: '/api/placeholder/48/48',
            owner: { name: 'John Doe' }
          },
          {
            _id: 'demo2',
            name: 'Whiskers',
            species: 'Cat',
            breed: 'Persian',
            imageUrl: '/api/placeholder/48/48',
            owner: { name: 'Jane Smith' }
          }
        ]);

        // Set demo users
        setRecentUsers([
          {
            _id: 'user1',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'user',
            createdAt: new Date().toISOString()
          },
          {
            _id: 'user2',
            name: 'Bob Wilson',
            email: 'bob@example.com',
            role: 'user',
            createdAt: new Date().toISOString()
          }
        ]);

      } else {
        toast.error("Failed to load dashboard data: " + (error.response?.data?.msg || error.message));

        // Set default empty stats to prevent crashes
        setStats({
          totalUsers: 0,
          totalPets: 0,
          pendingApprovals: 0,
          activeBookings: 0,
          totalDonations: 0,
          monthlyRevenue: 0,
          userGrowth: 0,
          petGrowth: 0,
          donationGrowth: 0,
          bookingGrowth: 0,
          revenueGrowth: 0
        });
        setPendingPets([]);
        setRecentUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePet = async (petId) => {
    try {
      await petAPI.approvePet(petId);
      toast.success("Pet approved successfully");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to approve pet");
    }
  };

  const handleBulkApprove = async () => {
    if (pendingPets.length === 0) return;

    try {
      const petIds = pendingPets.map(pet => pet._id);
      await adminAPI.bulkApprovePets({ petIds });
      toast.success(`${petIds.length} pets approved successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to bulk approve pets");
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      change: stats?.userGrowth || 0,
    },
    {
      title: "Total Pets",
      value: stats?.totalPets || 0,
      icon: Heart,
      color: "bg-green-500",
      change: stats?.petGrowth || 0,
    },
    {
      title: "Pending Approvals",
      value: stats?.pendingApprovals || 0,
      icon: Clock,
      color: "bg-yellow-500",
      change: 0,
    },
    {
      title: "Total Donations",
      value: `$${(stats?.totalDonations || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-purple-500",
      change: stats?.donationGrowth || 0,
    },
    {
      title: "Active Bookings",
      value: stats?.activeBookings || 0,
      icon: Calendar,
      color: "bg-indigo-500",
      change: stats?.bookingGrowth || 0,
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats?.monthlyRevenue || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-pink-500",
      change: stats?.revenueGrowth || 0,
    },
  ];

  return (
    <AdminLayout>
      <div className='py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 flex items-center'>
                  <Shield className='h-8 w-8 text-blue-600 mr-3' />
                  Admin Dashboard
                </h1>
                <p className='text-gray-600 mt-2'>
                  Manage users, pets, and monitor system performance.
                </p>
              </div>
              <div className='flex space-x-3'>
                <button
                  onClick={fetchDashboardData}
                  className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center'
                >
                  <TrendingUp className='h-4 w-4 mr-2' />
                  Refresh Data
                </button>
                {pendingPets.length > 0 && (
                  <button
                    onClick={handleBulkApprove}
                    className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center'
                  >
                    <CheckCircle className='h-4 w-4 mr-2' />
                    Approve All ({pendingPets.length})
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {statCards.map((card, index) => (
              <div
                key={index}
                className='bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <card.icon className='h-6 w-6 text-white' />
                    </div>
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-600'>
                        {card.title}
                      </p>
                      <p className='text-2xl font-bold text-gray-900'>
                        {card.value}
                      </p>
                    </div>
                  </div>
                  {card.change !== 0 && (
                    <div className={`flex items-center ${card.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      <TrendingUp className={`h-4 w-4 mr-1 ${card.change < 0 ? 'rotate-180' : ''
                        }`} />
                      <span className='text-sm font-medium'>
                        {Math.abs(card.change)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Pending Pet Approvals */}
            <div className='bg-white rounded-lg shadow'>
              <div className='p-6 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-xl font-bold text-gray-900 flex items-center'>
                    <AlertTriangle className='h-5 w-5 text-yellow-500 mr-2' />
                    Pending Pet Approvals
                  </h2>
                  <span className='bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    {pendingPets.length} pending
                  </span>
                </div>
              </div>
              <div className='p-6'>
                {pendingPets.length > 0 ? (
                  <div className='space-y-4 max-h-96 overflow-y-auto'>
                    {pendingPets.map((pet) => (
                      <div
                        key={pet._id}
                        className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
                      >
                        <div className='flex items-center space-x-4'>
                          <img
                            className='h-12 w-12 rounded-full object-cover'
                            src={pet.imageUrl || "/api/placeholder/48/48"}
                            alt={pet.name}
                          />
                          <div>
                            <p className='text-sm font-medium text-gray-900'>
                              {pet.name}
                            </p>
                            <p className='text-sm text-gray-500'>
                              {pet.species} • {pet.breed}
                            </p>
                            <p className='text-xs text-gray-400'>
                              By {pet.owner?.name}
                            </p>
                          </div>
                        </div>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => handleApprovePet(pet._id)}
                            className='bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center'
                          >
                            <CheckCircle className='h-3 w-3 mr-1' />
                            Approve
                          </button>
                          <button className='bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors flex items-center'>
                            <Eye className='h-3 w-3 mr-1' />
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-4' />
                    <p className='text-gray-500'>No pending approvals</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Users */}
            <div className='bg-white rounded-lg shadow'>
              <div className='p-6 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-xl font-bold text-gray-900 flex items-center'>
                    <UserCheck className='h-5 w-5 text-blue-500 mr-2' />
                    Recent Users
                  </h2>
                  <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                    View all users
                  </button>
                </div>
              </div>
              <div className='p-6'>
                {recentUsers.length > 0 ? (
                  <div className='space-y-4'>
                    {recentUsers.map((user) => (
                      <div
                        key={user._id}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center space-x-4'>
                          <div className='h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center'>
                            <span className='text-blue-600 font-medium text-sm'>
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className='text-sm font-medium text-gray-900'>
                              {user.name}
                            </p>
                            <p className='text-sm text-gray-500'>{user.email}</p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {user.role}
                          </span>
                          <p className='text-xs text-gray-400 mt-1'>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 text-center py-4'>
                    No recent users
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='mt-8 bg-white rounded-lg shadow p-6'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Quick Actions</h2>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <Link
                to='/admin/users'
                className='flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors'
              >
                <Users className='h-8 w-8 text-blue-500 mr-3' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900'>Manage Users</h3>
                  <p className='text-sm text-gray-600'>View and edit user accounts</p>
                </div>
              </Link>
              <Link
                to='/admin/pets'
                className='flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors'
              >
                <Heart className='h-8 w-8 text-green-500 mr-3' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900'>Manage Pets</h3>
                  <p className='text-sm text-gray-600'>Review pet listings</p>
                </div>
              </Link>
              <Link
                to='/admin/bookings'
                className='flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors'
              >
                <Calendar className='h-8 w-8 text-purple-500 mr-3' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900'>View Bookings</h3>
                  <p className='text-sm text-gray-600'>Monitor service bookings</p>
                </div>
              </Link>
              <Link
                to='/admin/donations'
                className='flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors'
              >
                <DollarSign className='h-8 w-8 text-yellow-500 mr-3' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900'>Donations</h3>
                  <p className='text-sm text-gray-600'>Track donation activity</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;