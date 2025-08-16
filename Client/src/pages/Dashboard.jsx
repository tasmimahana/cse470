import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { userAPI } from "../lib/api";
import {
  Heart,
  Calendar,
  DollarSign,
  PlusCircle,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await userAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  const { stats, recentPets, recentBookings, recentDonations } =
    dashboardData || {};

  const statCards = [
    {
      title: "My Pets",
      value: stats?.totalPets || 0,
      icon: Heart,
      color: "bg-blue-500",
      link: "/pets",
    },
    {
      title: "Available Pets",
      value: stats?.availablePets || 0,
      icon: Eye,
      color: "bg-green-500",
      link: "/pets",
    },
    {
      title: "Bookings",
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: "bg-purple-500",
      link: "/services",
    },
    {
      title: "Donations",
      value: `$${stats?.totalDonationAmount || 0}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      link: "/donate",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Welcome back, {user?.name}!
          </h1>
          <p className='text-gray-600 mt-2'>
            Here's what's happening with your pets and bookings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {statCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className='bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow'
            >
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
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Link
              to='/pets/add'
              className='flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors'
            >
              <PlusCircle className='h-8 w-8 text-blue-500 mr-3' />
              <div>
                <h3 className='font-semibold text-gray-900'>Add Pet</h3>
                <p className='text-sm text-gray-600'>
                  List a new pet for adoption
                </p>
              </div>
            </Link>
            <Link
              to='/services'
              className='flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors'
            >
              <Calendar className='h-8 w-8 text-green-500 mr-3' />
              <div>
                <h3 className='font-semibold text-gray-900'>Book Service</h3>
                <p className='text-sm text-gray-600'>
                  Schedule vet, daycare, or grooming
                </p>
              </div>
            </Link>
            <Link
              to='/donate'
              className='flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors'
            >
              <DollarSign className='h-8 w-8 text-yellow-500 mr-3' />
              <div>
                <h3 className='font-semibold text-gray-900'>Donate</h3>
                <p className='text-sm text-gray-600'>
                  Support pet shelters and rescues
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Recent Pets */}
          <div className='bg-white rounded-lg shadow'>
            <div className='p-6 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold text-gray-900'>Recent Pets</h2>
                <Link
                  to='/pets'
                  className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                >
                  View all
                </Link>
              </div>
            </div>
            <div className='p-6'>
              {recentPets && recentPets.length > 0 ? (
                <div className='space-y-4'>
                  {recentPets.slice(0, 3).map((pet) => (
                    <div key={pet._id} className='flex items-center space-x-4'>
                      <div className='flex-shrink-0'>
                        <img
                          className='h-12 w-12 rounded-full object-cover'
                          src={pet.imageUrl || "/api/placeholder/48/48"}
                          alt={pet.name}
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {pet.name}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {pet.species} • {pet.status}
                        </p>
                      </div>
                      <div className='flex-shrink-0'>
                        {pet.approved ? (
                          <CheckCircle className='h-5 w-5 text-green-500' />
                        ) : (
                          <Clock className='h-5 w-5 text-yellow-500' />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 text-center py-4'>
                  No pets added yet
                </p>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className='bg-white rounded-lg shadow'>
            <div className='p-6 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold text-gray-900'>
                  Recent Bookings
                </h2>
                <Link
                  to='/services'
                  className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                >
                  View all
                </Link>
              </div>
            </div>
            <div className='p-6'>
              {recentBookings && recentBookings.length > 0 ? (
                <div className='space-y-4'>
                  {recentBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking._id}
                      className='flex items-center space-x-4'
                    >
                      <div className='flex-shrink-0'>
                        <Calendar className='h-8 w-8 text-blue-500' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900'>
                          {booking.serviceType} - {booking.pet?.name}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {new Date(booking.date).toLocaleDateString()} •{" "}
                          {booking.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 text-center py-4'>
                  No bookings yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
