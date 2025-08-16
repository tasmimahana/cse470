import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { petAPI, bookingAPI } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import {
  ArrowLeft,
  Heart,
  Calendar,
  MapPin,
  User,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchPet();
  }, [id]);

  const fetchPet = async () => {
    try {
      const response = await petAPI.getPet(id);
      setPet(response.data.pet);
    } catch (error) {
      toast.error("Failed to load pet details");
      navigate("/pets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await petAPI.deletePet(id);
        toast.success("Pet deleted successfully");
        navigate("/pets");
      } catch (error) {
        toast.error("Failed to delete pet");
      }
    }
  };

  const handleApprove = async () => {
    try {
      await petAPI.approvePet(id);
      toast.success("Pet approved successfully");
      fetchPet();
    } catch (error) {
      toast.error("Failed to approve pet");
    }
  };

  const handleBookService = async (serviceData) => {
    try {
      await bookingAPI.createBooking({
        pet: id,
        ...serviceData,
      });
      toast.success("Service booked successfully");
      setShowBookingModal(false);
    } catch (error) {
      toast.error("Failed to book service");
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Pet not found</h2>
          <Link
            to='/pets'
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            Back to pets
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && pet.owner && (
    pet.owner._id === user._id || 
    pet.owner._id === user.userId || 
    pet.owner === user._id || 
    pet.owner === user.userId
  );
  const canEdit = isOwner || isAdmin;

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className='flex items-center text-gray-600 hover:text-gray-900 mb-6'
        >
          <ArrowLeft className='h-5 w-5 mr-2' />
          Back
        </button>

        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='md:flex'>
            {/* Image */}
            <div className='md:w-1/2'>
              <img
                src={pet.imageUrl || "/api/placeholder/600/400"}
                alt={pet.name}
                className='w-full h-64 md:h-full object-cover'
              />
            </div>

            {/* Details */}
            <div className='md:w-1/2 p-6'>
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                    {pet.name}
                  </h1>
                  <div className='flex items-center space-x-4 text-gray-600 mb-4'>
                    <span>{pet.species}</span>
                    {pet.breed && <span>• {pet.breed}</span>}
                    {pet.age && <span>• {pet.age} years old</span>}
                    <span>• {pet.gender}</span>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pet.status === "available"
                        ? "bg-green-100 text-green-800"
                        : pet.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {pet.status}
                  </span>
                  {pet.approved ? (
                    <CheckCircle className='h-5 w-5 text-green-500' />
                  ) : (
                    <Clock className='h-5 w-5 text-yellow-500' />
                  )}
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  About {pet.name}
                </h3>
                <p className='text-gray-700 leading-relaxed'>{pet.description}</p>
              </div>

              {pet.owner && (
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    Owner Information
                  </h3>
                  <div className='flex items-center text-gray-600'>
                    <User className='h-4 w-4 mr-2' />
                    <span>{pet.owner.name}</span>
                  </div>
                </div>
              )}

              <div className='mb-6'>
                <p className='text-sm text-gray-500'>
                  Listed on {new Date(pet.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-wrap gap-3'>
                {pet.status === "available" && isAuthenticated && (
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    <Calendar className='h-4 w-4 mr-2' />
                    Book Service
                  </button>
                )}

                {canEdit && (
                  <>
                    <Link
                      to={`/pets/${id}/edit`}
                      className='flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                    >
                      <Edit className='h-4 w-4 mr-2' />
                      Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className='flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                    >
                      <Trash2 className='h-4 w-4 mr-2' />
                      Delete
                    </button>
                  </>
                )}

                {isAdmin && !pet.approved && (
                  <button
                    onClick={handleApprove}
                    className='flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                  >
                    <CheckCircle className='h-4 w-4 mr-2' />
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <BookingModal
            pet={pet}
            onClose={() => setShowBookingModal(false)}
            onBook={handleBookService}
          />
        )}
      </div>
    </div>
  );
};

// Booking Modal Component
const BookingModal = ({ pet, onClose, onBook }) => {
  const [formData, setFormData] = useState({
    serviceType: "vet",
    providerName: "",
    date: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook(formData);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Book Service for {pet.name}
        </h3>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Service Type
            </label>
            <select
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={formData.serviceType}
              onChange={(e) =>
                setFormData({ ...formData, serviceType: e.target.value })
              }
            >
              <option value='vet'>Veterinary</option>
              <option value='daycare'>Daycare</option>
              <option value='grooming'>Grooming</option>
              <option value='training'>Training</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Provider Name
            </label>
            <input
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={formData.providerName}
              onChange={(e) =>
                setFormData({ ...formData, providerName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Date & Time
            </label>
            <input
              type='datetime-local'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Notes (Optional)
            </label>
            <textarea
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>
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
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Book Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetDetail;