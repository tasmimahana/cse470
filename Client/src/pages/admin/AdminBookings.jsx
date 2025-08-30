import { useState, useEffect } from "react";
import { adminAPI } from "../../lib/api";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Heart,
  MapPin,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    serviceType: "",
    status: "",
    search: "",
    dateRange: "",
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.serviceType) params.serviceType = filters.serviceType;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const response = await adminAPI.getAllBookings(params);
      setBookings(response.data.data || response.data || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      if (newStatus === 'confirmed') {
        await adminAPI.confirmBooking(bookingId);
      } else {
        // For other status updates, we'll use the regular booking API
        const { bookingAPI } = await import("../../lib/api");
        await bookingAPI.updateBooking(bookingId, { status: newStatus });
      }
      toast.success("Booking status updated successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case "veterinary":
        return "bg-blue-100 text-blue-800";
      case "grooming":
        return "bg-purple-100 text-purple-800";
      case "daycare":
        return "bg-green-100 text-green-800";
      case "training":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

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
              <Calendar className='h-8 w-8 text-blue-600 mr-3' />
              Booking Management
            </h1>
            <p className='text-gray-600 mt-2'>
              Monitor and manage all service bookings and appointments
            </p>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-blue-100 p-3 rounded-lg'>
                  <Calendar className='h-6 w-6 text-blue-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Total Bookings</p>
                  <p className='text-2xl font-bold text-gray-900'>{bookings.length}</p>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-green-100 p-3 rounded-lg'>
                  <CheckCircle className='h-6 w-6 text-green-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Confirmed</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {confirmedBookings.length}
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
                    {pendingBookings.length}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-purple-100 p-3 rounded-lg'>
                  <CheckCircle className='h-6 w-6 text-purple-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Completed</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {completedBookings.length}
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
                  Search Bookings
                </label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <input
                    type='text'
                    placeholder='Search by user or pet...'
                    className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Service Type
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={filters.serviceType}
                  onChange={(e) =>
                    setFilters({ ...filters, serviceType: e.target.value })
                  }
                >
                  <option value=''>All Services</option>
                  <option value='veterinary'>Veterinary</option>
                  <option value='grooming'>Grooming</option>
                  <option value='daycare'>Daycare</option>
                  <option value='training'>Training</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Status
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value=''>All Status</option>
                  <option value='pending'>Pending</option>
                  <option value='confirmed'>Confirmed</option>
                  <option value='completed'>Completed</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
              </div>
              <div className='flex items-end'>
                <button
                  onClick={() => setFilters({ serviceType: "", status: "", search: "", dateRange: "" })}
                  className='w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className='bg-white rounded-lg shadow overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900'>
                Bookings ({bookings.length})
              </h3>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Customer & Pet
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Service
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Provider
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date & Time
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center'>
                            <span className='text-blue-600 font-medium text-sm'>
                              {booking.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>
                              {booking.user?.name || 'Unknown User'}
                            </div>
                            <div className='text-sm text-gray-500 flex items-center'>
                              <Heart className='h-3 w-3 mr-1' />
                              {booking.pet?.name || 'Unknown Pet'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getServiceTypeColor(
                            booking.serviceType
                          )}`}
                        >
                          {booking.serviceType?.charAt(0).toUpperCase() +
                            booking.serviceType?.slice(1) || 'Unknown'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {booking.providerName || 'Not specified'}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {new Date(booking.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          {getStatusIcon(booking.status)}
                          <span
                            className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status?.charAt(0).toUpperCase() +
                              booking.status?.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowBookingModal(true);
                            }}
                            className='text-blue-600 hover:text-blue-900'
                          >
                            <Eye className='h-4 w-4' />
                          </button>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                              className='text-green-600 hover:text-green-900'
                              title='Confirm booking'
                            >
                              <CheckCircle className='h-4 w-4' />
                            </button>
                          )}
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                              className='text-red-600 hover:text-red-900'
                              title='Cancel booking'
                            >
                              <XCircle className='h-4 w-4' />
                            </button>
                          )}
                          {booking.status === 'confirmed' && new Date(booking.date) < new Date() && (
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'completed')}
                              className='text-purple-600 hover:text-purple-900'
                              title='Mark as completed'
                            >
                              <CheckCircle className='h-4 w-4' />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {bookings.length === 0 && (
            <div className='text-center py-12'>
              <Calendar className='h-16 w-16 text-gray-300 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>No bookings found</h3>
              <p className='text-gray-600'>
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedBooking(null);
          }}
          onStatusUpdate={handleUpdateStatus}
        />
      )}
    </AdminLayout>
  );
};

// Booking Details Modal
const BookingDetailsModal = ({ booking, onClose, onStatusUpdate }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-gray-900'>Booking Details</h3>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600'
            >
              ×
            </button>
          </div>

          <div className='space-y-6'>
            {/* Service and Status */}
            <div className='bg-gray-50 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='text-xl font-bold text-gray-900'>
                    {booking.serviceType?.charAt(0).toUpperCase() +
                      booking.serviceType?.slice(1)} Service
                  </h4>
                  <p className='text-gray-600'>Booking #{booking._id.slice(-6)}</p>
                </div>
                <div className='text-right'>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {booking.status?.charAt(0).toUpperCase() +
                      booking.status?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h4 className='font-medium text-gray-900 mb-3'>Customer Information</h4>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-gray-600'>Name</label>
                  <p className='font-medium'>{booking.user?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Email</label>
                  <p className='font-medium'>{booking.user?.email || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Pet Information */}
            <div>
              <h4 className='font-medium text-gray-900 mb-3'>Pet Information</h4>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-gray-600'>Pet Name</label>
                  <p className='font-medium'>{booking.pet?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Species & Breed</label>
                  <p className='font-medium'>
                    {booking.pet?.species || 'Unknown'}
                    {booking.pet?.breed && ` • ${booking.pet.breed}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h4 className='font-medium text-gray-900 mb-3'>Appointment Details</h4>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-gray-600'>Service Provider</label>
                  <p className='font-medium'>{booking.providerName || 'Not specified'}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Date</label>
                  <p className='font-medium'>
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Time</label>
                  <p className='font-medium'>
                    {new Date(booking.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Booked On</label>
                  <p className='font-medium'>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div>
                <h4 className='font-medium text-gray-900 mb-3'>Notes</h4>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <p className='text-gray-700'>{booking.notes}</p>
                </div>
              </div>
            )}

            {/* Status Actions */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h4 className='font-medium text-gray-900 mb-3'>Update Status</h4>
              <div className='flex flex-wrap gap-3'>
                {booking.status === 'pending' && (
                  <button
                    onClick={() => {
                      onStatusUpdate(booking._id, 'confirmed');
                      onClose();
                    }}
                    className='flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
                  >
                    <CheckCircle className='h-4 w-4 mr-2' />
                    Confirm Booking
                  </button>
                )}
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <button
                    onClick={() => {
                      onStatusUpdate(booking._id, 'cancelled');
                      onClose();
                    }}
                    className='flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
                  >
                    <XCircle className='h-4 w-4 mr-2' />
                    Cancel Booking
                  </button>
                )}
                {booking.status === 'confirmed' && new Date(booking.date) < new Date() && (
                  <button
                    onClick={() => {
                      onStatusUpdate(booking._id, 'completed');
                      onClose();
                    }}
                    className='flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700'
                  >
                    <CheckCircle className='h-4 w-4 mr-2' />
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
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

export default AdminBookings;