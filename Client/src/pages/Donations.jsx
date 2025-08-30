import { useState, useEffect } from "react";
import { donationAPI } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import {
  Heart,
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  Target,
  Gift,
} from "lucide-react";
import toast from "react-hot-toast";

const Donations = () => {
  const { isAuthenticated } = useAuth();
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const response = await donationAPI.getDonationStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to load donation stats");
    } finally {
      setLoading(false);
    }
  };

  const causes = [
    {
      id: "shelter",
      name: "Local Animal Shelters",
      description: "Support local shelters providing care for abandoned pets",
      icon: Heart,
      color: "bg-red-500",
      raised: 15420,
      goal: 25000,
    },
    {
      id: "medical",
      name: "Emergency Medical Fund",
      description: "Help cover emergency medical costs for pets in need",
      icon: Target,
      color: "bg-blue-500",
      raised: 8750,
      goal: 15000,
    },
    {
      id: "food",
      name: "Pet Food Bank",
      description: "Provide food and supplies to families struggling to feed their pets",
      icon: Gift,
      color: "bg-green-500",
      raised: 12300,
      goal: 20000,
    },
  ];

  const impactStats = [
    { label: "Pets Helped", value: "2,450+", icon: Heart },
    { label: "Families Supported", value: "890+", icon: Users },
    { label: "Total Raised", value: "$45,670", icon: DollarSign },
    { label: "Active Donors", value: "320+", icon: TrendingUp },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-pink-500 to-red-500 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            Make a Difference
          </h1>
          <p className='text-xl md:text-2xl mb-8 max-w-3xl mx-auto'>
            Your donation helps provide care, shelter, and love to pets in need.
            Every contribution makes a real impact.
          </p>
          <button
            onClick={() => setShowDonateModal(true)}
            className='bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center'
          >
            <Heart className='mr-2 h-5 w-5' />
            Donate Now
          </button>
        </div>
      </section>

      {/* Impact Stats */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Our Impact Together
            </h2>
            <p className='text-xl text-gray-600'>
              See how your donations are making a difference
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className='bg-white rounded-lg shadow p-6 text-center'
              >
                <div className='bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <stat.icon className='h-8 w-8 text-pink-600' />
                </div>
                <div className='text-3xl font-bold text-gray-900 mb-2'>
                  {stat.value}
                </div>
                <div className='text-gray-600'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Causes */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Choose Your Cause
            </h2>
            <p className='text-xl text-gray-600'>
              Support the causes that matter most to you
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {causes.map((cause) => (
              <div
                key={cause.id}
                className='bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow'
              >
                <div className='p-6'>
                  <div
                    className={`${cause.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}
                  >
                    <cause.icon className='h-8 w-8 text-white' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>
                    {cause.name}
                  </h3>
                  <p className='text-gray-600 mb-6'>{cause.description}</p>

                  {/* Progress Bar */}
                  <div className='mb-4'>
                    <div className='flex justify-between text-sm text-gray-600 mb-2'>
                      <span>Raised: ${cause.raised.toLocaleString()}</span>
                      <span>Goal: ${cause.goal.toLocaleString()}</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <div
                        className={`${cause.color} h-2 rounded-full`}
                        style={{
                          width: `${(cause.raised / cause.goal) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className='text-sm text-gray-600 mt-1'>
                      {Math.round((cause.raised / cause.goal) * 100)}% of goal
                      reached
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDonateModal(true)}
                    className='w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition-colors'
                  >
                    Donate to This Cause
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Donations Help */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              How Your Donation Helps
            </h2>
            <p className='text-xl text-gray-600'>
              Every dollar makes a real difference in a pet's life
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl font-bold text-blue-600'>$25</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Provides Food
              </h3>
              <p className='text-gray-600'>
                Feeds a pet for one week with nutritious meals
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl font-bold text-green-600'>$75</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Medical Care
              </h3>
              <p className='text-gray-600'>
                Covers basic veterinary check-up and vaccinations
              </p>
            </div>
            <div className='text-center'>
              <div className='bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl font-bold text-purple-600'>$150</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                Emergency Fund
              </h3>
              <p className='text-gray-600'>
                Helps with emergency medical procedures
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-pink-600 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-4'>
            Ready to Make a Difference?
          </h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Join our community of caring donors and help us create a better
            world for pets in need.
          </p>
          <button
            onClick={() => setShowDonateModal(true)}
            className='bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center'
          >
            <Heart className='mr-2 h-5 w-5' />
            Start Donating Today
          </button>
        </div>
      </section>

      {/* Donation Modal */}
      {showDonateModal && (
        <DonationModal
          onClose={() => setShowDonateModal(false)}
          onSuccess={() => {
            setShowDonateModal(false);
            if (isAuthenticated) fetchStats();
          }}
        />
      )}
    </div>
  );
};

// Donation Modal Component
const DonationModal = ({ onClose, onSuccess }) => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    amount: "",
    cause: "Local Animal Shelters",
  });
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [25, 50, 100, 250];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to make a donation");
      return;
    }

    setLoading(true);
    try {
      await donationAPI.createDonation({
        amount: parseFloat(formData.amount),
        cause: formData.cause,
      });
      toast.success("Thank you for your donation!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to process donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-md'>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Make a Donation
          </h3>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Donation Amount
              </label>
              <div className='grid grid-cols-4 gap-2 mb-3'>
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type='button'
                    onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                    className={`py-2 px-3 text-sm rounded-md border ${
                      formData.amount === amount.toString()
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <input
                type='number'
                min='1'
                step='0.01'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                placeholder='Enter custom amount'
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Choose Cause
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                value={formData.cause}
                onChange={(e) =>
                  setFormData({ ...formData, cause: e.target.value })
                }
              >
                <option value='Local Animal Shelters'>Local Animal Shelters</option>
                <option value='Emergency Medical Fund'>Emergency Medical Fund</option>
                <option value='Pet Food Bank'>Pet Food Bank</option>
                <option value='General Fund'>General Fund</option>
              </select>
            </div>
            {!isAuthenticated && (
              <div className='bg-yellow-50 border border-yellow-200 rounded-md p-3'>
                <p className='text-sm text-yellow-800'>
                  Please <a href='/login' className='underline'>login</a> or{' '}
                  <a href='/register' className='underline'>register</a> to make a donation.
                </p>
              </div>
            )}
            <div className='flex justify-end space-x-3'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading || !isAuthenticated}
                className='px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50'
              >
                {loading ? "Processing..." : "Donate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donations;