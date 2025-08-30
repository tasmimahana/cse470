import { useState, useEffect } from "react";
import { adminAPI } from "../../lib/api";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  DollarSign,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Calendar,
  User,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    paymentStatus: "",
    cause: "",
    search: "",
    dateRange: "",
  });
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDonationModal, setShowDonationModal] = useState(false);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchDonations();
      fetchDonationStats();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchDonations = async () => {
    try {
      // Show search loading only if it's a search operation
      if (filters.search) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      const params = {};
      if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
      if (filters.cause) params.cause = filters.cause;
      if (filters.search) params.search = filters.search.trim();

      console.log('Fetching donations with params:', params);
      const response = await adminAPI.getAllDonations(params);
      setDonations(response.data.data || response.data || []);
    } catch (error) {
      console.error("Fetch donations error:", error);
      toast.error("Failed to load donations");
      setDonations([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const fetchDonationStats = async () => {
    try {
      const response = await adminAPI.getDonationStats();
      setStats(response.data.data || response.data);
    } catch (error) {
      console.error("Fetch donation stats error:", error);
    }
  };

  const handleUpdateStatus = async (donationId, newStatus) => {
    try {
      await adminAPI.updateDonationStatus(donationId, { paymentStatus: newStatus });
      toast.success("Donation status updated successfully");
      fetchDonations();
      fetchDonationStats();
    } catch (error) {
      toast.error("Failed to update donation status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "successful":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "successful":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const causes = [...new Set(donations.map(d => d.cause).filter(Boolean))];

  const successfulDonations = donations.filter(d => d.paymentStatus === 'successful');
  const pendingDonations = donations.filter(d => d.paymentStatus === 'pending');
  const failedDonations = donations.filter(d => d.paymentStatus === 'failed');
  const totalAmount = successfulDonations.reduce((sum, d) => sum + d.amount, 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className='py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center'>
              <DollarSign className='h-8 w-8 text-blue-600 mr-3' />
              Donation Management
            </h1>
            <p className='text-gray-600 mt-2'>
              Monitor and manage all donations and contributions
            </p>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-green-100 p-3 rounded-lg'>
                  <DollarSign className='h-6 w-6 text-green-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Total Raised</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    ${totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-blue-100 p-3 rounded-lg'>
                  <Heart className='h-6 w-6 text-blue-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Total Donations</p>
                  <p className='text-2xl font-bold text-gray-900'>{donations.length}</p>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-green-100 p-3 rounded-lg'>
                  <CheckCircle className='h-6 w-6 text-green-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Successful</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {successfulDonations.length}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-yellow-100 p-3 rounded-lg'>
                  <Clock className='h-6 w-6 text-yellow-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Pending</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {pendingDonations.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className='bg-white rounded-lg shadow p-6 mb-8'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Search Donations
                </label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <input
                    type='text'
                    placeholder='Search by user name, email, or cause...'
                    className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                  {searchLoading && (
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                      <div className='animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full'></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Payment Status
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={filters.paymentStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, paymentStatus: e.target.value })
                  }
                >
                  <option value=''>All Status</option>
                  <option value='successful'>Successful</option>
                  <option value='pending'>Pending</option>
                  <option value='failed'>Failed</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Cause
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={filters.cause}
                  onChange={(e) =>
                    setFilters({ ...filters, cause: e.target.value })
                  }
                >
                  <option value=''>All Causes</option>
                  {causes.map((cause) => (
                    <option key={cause} value={cause}>
                      {cause}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex items-end'>
                <button
                  onClick={() => setFilters({ paymentStatus: "", cause: "", search: "", dateRange: "" })}
                  className='w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Donations Table */}
          <div className='bg-white rounded-lg shadow overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900'>
                Donations ({donations.length})
              </h3>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Donor
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Cause
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {donations.map((donation) => (
                    <tr key={donation._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center'>
                            <span className='text-blue-600 font-medium text-sm'>
                              {donation.user?.name?.charAt(0).toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>
                              {donation.user?.name || 'Anonymous'}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {donation.user?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-lg font-bold text-gray-900'>
                          ${donation.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{donation.cause}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          {getStatusIcon(donation.paymentStatus)}
                          <span
                            className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              donation.paymentStatus
                            )}`}
                          >
                            {donation.paymentStatus.charAt(0).toUpperCase() +
                              donation.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => {
                              setSelectedDonation(donation);
                              setShowDonationModal(true);
                            }}
                            className='text-blue-600 hover:text-blue-900'
                          >
                            <Eye className='h-4 w-4' />
                          </button>
                          {donation.paymentStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(donation._id, 'successful')}
                                className='text-green-600 hover:text-green-900'
                                title='Mark as successful'
                              >
                                <CheckCircle className='h-4 w-4' />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(donation._id, 'failed')}
                                className='text-red-600 hover:text-red-900'
                                title='Mark as failed'
                              >
                                <XCircle className='h-4 w-4' />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {donations.length === 0 && (
            <div className='text-center py-12'>
              <DollarSign className='h-16 w-16 text-gray-300 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>No donations found</h3>
              <p className='text-gray-600'>
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Donation Details Modal */}
      {showDonationModal && selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => {
            setShowDonationModal(false);
            setSelectedDonation(null);
          }}
          onStatusUpdate={handleUpdateStatus}
        />
      )}
    </AdminLayout>
  );
};

// Donation Details Modal
const DonationDetailsModal = ({ donation, onClose, onStatusUpdate }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-gray-900'>Donation Details</h3>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600'
            >
              ×
            </button>
          </div>

          <div className='space-y-6'>
            {/* Amount and Status */}
            <div className='bg-gray-50 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='text-2xl font-bold text-gray-900'>
                    ${donation.amount.toFixed(2)}
                  </h4>
                  <p className='text-gray-600'>Donation Amount</p>
                </div>
                <div className='text-right'>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${donation.paymentStatus === 'successful'
                      ? 'bg-green-100 text-green-800'
                      : donation.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {donation.paymentStatus.charAt(0).toUpperCase() +
                      donation.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Donor Information */}
            <div>
              <h4 className='font-medium text-gray-900 mb-3'>Donor Information</h4>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-gray-600'>Name</label>
                  <p className='font-medium'>{donation.user?.name || 'Anonymous'}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Email</label>
                  <p className='font-medium'>{donation.user?.email || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Donation Details */}
            <div>
              <h4 className='font-medium text-gray-900 mb-3'>Donation Details</h4>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-gray-600'>Cause</label>
                  <p className='font-medium'>{donation.cause}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Date</label>
                  <p className='font-medium'>
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Time</label>
                  <p className='font-medium'>
                    {new Date(donation.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Transaction ID</label>
                  <p className='font-medium text-xs'>{donation._id}</p>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            {donation.paymentStatus === 'pending' && (
              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                <h4 className='font-medium text-gray-900 mb-3'>Update Status</h4>
                <div className='flex space-x-3'>
                  <button
                    onClick={() => {
                      onStatusUpdate(donation._id, 'successful');
                      onClose();
                    }}
                    className='flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
                  >
                    <CheckCircle className='h-4 w-4 mr-2' />
                    Mark as Successful
                  </button>
                  <button
                    onClick={() => {
                      onStatusUpdate(donation._id, 'failed');
                      onClose();
                    }}
                    className='flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
                  >
                    <XCircle className='h-4 w-4 mr-2' />
                    Mark as Failed
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className='flex justify-end mt-6'>
            <button
              onClick={onClose}
              className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDonations;