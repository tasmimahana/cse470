import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { bookingAPI, petAPI } from "../../lib/api";
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  ArrowLeft,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";

const VeterinaryService = () => {
  const { isAuthenticated } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const services = [
    {
      name: "General Health Checkup",
      price: "$75",
      duration: "30 mins",
      description: "Comprehensive health examination including vital signs, weight check, and general wellness assessment.",
    },
    {
      name: "Vaccination",
      price: "$45",
      duration: "15 mins",
      description: "Essential vaccinations to protect your pet from common diseases and infections.",
    },
    {
      name: "Emergency Care",
      price: "$150",
      duration: "60 mins",
      description: "Immediate medical attention for urgent health issues and emergencies.",
    },
    {
      name: "Dental Care",
      price: "$120",
      duration: "45 mins",
      description: "Professional dental cleaning and oral health examination.",
    },
    {
      name: "Surgery Consultation",
      price: "$200",
      duration: "45 mins",
      description: "Pre-surgical consultation and planning for various surgical procedures.",
    },
    {
      name: "Diagnostic Tests",
      price: "$100",
      duration: "30 mins",
      description: "Blood work, X-rays, and other diagnostic procedures as needed.",
    },
  ];

  const veterinarians = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Small Animal Medicine",
      experience: "8 years",
      rating: 4.9,
      image: "/api/placeholder/150/150",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Emergency & Critical Care",
      experience: "12 years",
      rating: 4.8,
      image: "/api/placeholder/150/150",
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Surgery & Orthopedics",
      experience: "10 years",
      rating: 4.9,
      image: "/api/placeholder/150/150",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <Link
            to='/services'
            className='inline-flex items-center text-blue-100 hover:text-white mb-6'
          >
            <ArrowLeft className='h-5 w-5 mr-2' />
            Back to Services
          </Link>
          <div className='flex items-center mb-6'>
            <Stethoscope className='h-12 w-12 mr-4' />
            <div>
              <h1 className='text-4xl font-bold'>Veterinary Care</h1>
              <p className='text-xl text-blue-100 mt-2'>
                Professional medical care for your beloved pets
              </p>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
            <div className='flex items-center'>
              <CheckCircle className='h-6 w-6 mr-3 text-green-300' />
              <span>Licensed Veterinarians</span>
            </div>
            <div className='flex items-center'>
              <CheckCircle className='h-6 w-6 mr-3 text-green-300' />
              <span>24/7 Emergency Care</span>
            </div>
            <div className='flex items-center'>
              <CheckCircle className='h-6 w-6 mr-3 text-green-300' />
              <span>Modern Equipment</span>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Services Grid */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Our Services</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {services.map((service, index) => (
              <div key={index} className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900'>{service.name}</h3>
                  <span className='text-2xl font-bold text-blue-600'>{service.price}</span>
                </div>
                <div className='flex items-center text-gray-600 mb-3'>
                  <Clock className='h-4 w-4 mr-2' />
                  <span className='text-sm'>{service.duration}</span>
                </div>
                <p className='text-gray-700 mb-4'>{service.description}</p>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Veterinarians */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Our Veterinarians</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {veterinarians.map((vet, index) => (
              <div key={index} className='bg-white rounded-lg shadow-md p-6 text-center'>
                <img
                  src={vet.image}
                  alt={vet.name}
                  className='w-24 h-24 rounded-full mx-auto mb-4 object-cover'
                />
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>{vet.name}</h3>
                <p className='text-blue-600 font-medium mb-1'>{vet.specialty}</p>
                <p className='text-gray-600 mb-3'>{vet.experience} experience</p>
                <div className='flex items-center justify-center'>
                  <Star className='h-4 w-4 text-yellow-400 fill-current' />
                  <span className='ml-1 text-gray-700'>{vet.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Info */}
        <section className='bg-white rounded-lg shadow-md p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Contact Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Location & Hours</h3>
              <div className='space-y-3'>
                <div className='flex items-center'>
                  <MapPin className='h-5 w-5 text-gray-400 mr-3' />
                  <span>123 Pet Care Street, City, State 12345</span>
                </div>
                <div className='flex items-center'>
                  <Phone className='h-5 w-5 text-gray-400 mr-3' />
                  <span>(555) 123-4567</span>
                </div>
                <div className='flex items-center'>
                  <Clock className='h-5 w-5 text-gray-400 mr-3' />
                  <div>
                    <p>Mon-Fri: 8:00 AM - 8:00 PM</p>
                    <p>Sat-Sun: 9:00 AM - 6:00 PM</p>
                    <p className='text-red-600 font-medium'>Emergency: 24/7</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>What to Bring</h3>
              <ul className='space-y-2 text-gray-700'>
                <li>• Previous medical records</li>
                <li>• Current medications</li>
                <li>• Vaccination history</li>
                <li>• List of symptoms or concerns</li>
                <li>• Your pet's favorite treats</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          serviceType="veterinary"
          onClose={() => setShowBookingModal(false)}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

// Booking Modal Component
const BookingModal = ({ serviceType, onClose, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    serviceType: serviceType,
    pet: "",
    providerName: "",
    date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [userPets, setUserPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);

  // Fetch user's pets when modal opens
  useEffect(() => {
    const fetchUserPets = async () => {
      if (!isAuthenticated) {
        setPetsLoading(false);
        return;
      }

      try {
        console.log("Fetching user pets...");
        const response = await petAPI.getUserPets();
        console.log("getUserPets response:", response.data);
        const pets = response.data.data || response.data || [];
        console.log("Extracted pets:", pets);
        setUserPets(pets);
      } catch (error) {
        console.error("Failed to fetch user pets:", error);
        toast.error("Failed to load your pets");
      } finally {
        setPetsLoading(false);
      }
    };

    fetchUserPets();
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to book a service");
      return;
    }

    if (!formData.pet) {
      toast.error("Please select a pet");
      return;
    }

    setLoading(true);
    try {
      await bookingAPI.createBooking(formData);
      toast.success("Appointment booked successfully!");
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      const message = error.response?.data?.msg || error.response?.data?.error || "Failed to book appointment";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
        <div className='bg-white rounded-lg w-full max-w-md p-6 text-center'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Login Required
          </h3>
          <p className='text-gray-600 mb-4'>
            Please login to book a veterinary appointment.
          </p>
          <div className='flex justify-center space-x-3'>
            <button
              onClick={onClose}
              className='px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Cancel
            </button>
            <Link
              to='/login'
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-md'>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Book Veterinary Appointment
          </h3>

          {petsLoading ? (
            <div className='text-center py-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
              <p className='text-gray-600 mt-2'>Loading your pets...</p>
            </div>
          ) : userPets.length === 0 ? (
            <div className='text-center py-4'>
              <p className='text-gray-600 mb-4'>
                You don't have any pets registered yet. Please add a pet first to book appointments.
              </p>
              <div className='flex justify-center space-x-3'>
                <button
                  onClick={onClose}
                  className='px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50'
                >
                  Cancel
                </button>
                <Link
                  to='/pets/add'
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                >
                  Add Pet
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Select Pet
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={formData.pet}
                  onChange={(e) =>
                    setFormData({ ...formData, pet: e.target.value })
                  }
                  required
                >
                  <option value=''>Choose your pet</option>
                  {userPets.map((pet) => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name} ({pet.species} - {pet.breed})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Preferred Veterinarian
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={formData.providerName}
                  onChange={(e) =>
                    setFormData({ ...formData, providerName: e.target.value })
                  }
                  required
                >
                  <option value=''>Select a veterinarian</option>
                  <option value='Dr. Sarah Johnson'>Dr. Sarah Johnson</option>
                  <option value='Dr. Michael Chen'>Dr. Michael Chen</option>
                  <option value='Dr. Emily Rodriguez'>Dr. Emily Rodriguez</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Preferred Date & Time
                </label>
                <input
                  type='datetime-local'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Reason for Visit / Notes
                </label>
                <textarea
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder='Describe symptoms or reason for visit...'
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
                  disabled={loading}
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
                >
                  {loading ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VeterinaryService;