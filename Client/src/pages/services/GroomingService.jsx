import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { bookingAPI, petAPI } from "../../lib/api";
import {
  Scissors,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const GroomingService = () => {
  const { isAuthenticated } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const services = [
    {
      name: "Basic Bath & Brush",
      price: "$35",
      duration: "45 mins",
      description: "Complete bath with premium shampoo, thorough brushing, and basic nail trim.",
    },
    {
      name: "Full Grooming Package",
      price: "$65",
      duration: "90 mins",
      description: "Bath, haircut, nail trim, ear cleaning, and teeth brushing for a complete makeover.",
    },
    {
      name: "Nail Trim Only",
      price: "$15",
      duration: "15 mins",
      description: "Professional nail trimming to keep your pet's nails healthy and comfortable.",
    },
    {
      name: "De-shedding Treatment",
      price: "$45",
      duration: "60 mins",
      description: "Specialized treatment to reduce shedding and keep your home cleaner.",
    },
    {
      name: "Flea & Tick Treatment",
      price: "$55",
      duration: "75 mins",
      description: "Thorough flea and tick removal with medicated bath and preventive treatment.",
    },
    {
      name: "Premium Spa Package",
      price: "$95",
      duration: "120 mins",
      description: "Luxury treatment including aromatherapy bath, massage, and premium styling.",
    },
  ];

  const groomers = [
    {
      name: "Lisa Thompson",
      specialty: "Dog Grooming Specialist",
      experience: "6 years",
      rating: 4.9,
      image: "/api/placeholder/150/150",
    },
    {
      name: "Carlos Martinez",
      specialty: "Cat Grooming Expert",
      experience: "8 years",
      rating: 4.8,
      image: "/api/placeholder/150/150",
    },
    {
      name: "Amanda Foster",
      specialty: "Show Dog Styling",
      experience: "10 years",
      rating: 5.0,
      image: "/api/placeholder/150/150",
    },
  ];

  const beforeAfter = [
    {
      before: "/api/placeholder/200/150",
      after: "/api/placeholder/200/150",
      petName: "Buddy",
      service: "Full Grooming Package",
    },
    {
      before: "/api/placeholder/200/150",
      after: "/api/placeholder/200/150",
      petName: "Princess",
      service: "Premium Spa Package",
    },
    {
      before: "/api/placeholder/200/150",
      after: "/api/placeholder/200/150",
      petName: "Max",
      service: "De-shedding Treatment",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <Link
            to='/services'
            className='inline-flex items-center text-purple-100 hover:text-white mb-6'
          >
            <ArrowLeft className='h-5 w-5 mr-2' />
            Back to Services
          </Link>
          <div className='flex items-center mb-6'>
            <Scissors className='h-12 w-12 mr-4' />
            <div>
              <h1 className='text-4xl font-bold'>Pet Grooming</h1>
              <p className='text-xl text-purple-100 mt-2'>
                Professional grooming to keep your pet looking and feeling great
              </p>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
            <div className='flex items-center'>
              <CheckCircle className='h-6 w-6 mr-3 text-green-300' />
              <span>Certified Groomers</span>
            </div>
            <div className='flex items-center'>
              <CheckCircle className='h-6 w-6 mr-3 text-green-300' />
              <span>Premium Products</span>
            </div>
            <div className='flex items-center'>
              <CheckCircle className='h-6 w-6 mr-3 text-green-300' />
              <span>Stress-Free Environment</span>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Services Grid */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Grooming Services</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {services.map((service, index) => (
              <div key={index} className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900'>{service.name}</h3>
                  <span className='text-2xl font-bold text-purple-600'>{service.price}</span>
                </div>
                <div className='flex items-center text-gray-600 mb-3'>
                  <Clock className='h-4 w-4 mr-2' />
                  <span className='text-sm'>{service.duration}</span>
                </div>
                <p className='text-gray-700 mb-4'>{service.description}</p>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className='w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors'
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Before & After Gallery */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Before & After</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {beforeAfter.map((item, index) => (
              <div key={index} className='bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='grid grid-cols-2'>
                  <div className='relative'>
                    <img src={item.before} alt='Before' className='w-full h-32 object-cover' />
                    <div className='absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs'>
                      Before
                    </div>
                  </div>
                  <div className='relative'>
                    <img src={item.after} alt='After' className='w-full h-32 object-cover' />
                    <div className='absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs'>
                      After
                    </div>
                  </div>
                </div>
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-900'>{item.petName}</h3>
                  <p className='text-sm text-gray-600'>{item.service}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Groomers */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Our Professional Groomers</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {groomers.map((groomer, index) => (
              <div key={index} className='bg-white rounded-lg shadow-md p-6 text-center'>
                <img
                  src={groomer.image}
                  alt={groomer.name}
                  className='w-24 h-24 rounded-full mx-auto mb-4 object-cover'
                />
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>{groomer.name}</h3>
                <p className='text-purple-600 font-medium mb-1'>{groomer.specialty}</p>
                <p className='text-gray-600 mb-3'>{groomer.experience} experience</p>
                <div className='flex items-center justify-center'>
                  <Star className='h-4 w-4 text-yellow-400 fill-current' />
                  <span className='ml-1 text-gray-700'>{groomer.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grooming Tips */}
        <section className='mb-16'>
          <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
              <Sparkles className='h-6 w-6 mr-2 text-purple-600' />
              Grooming Tips for Pet Parents
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-3'>Between Appointments</h3>
                <ul className='space-y-2 text-gray-700'>
                  <li>• Brush your pet regularly to prevent matting</li>
                  <li>• Check ears weekly for signs of infection</li>
                  <li>• Trim nails every 2-3 weeks</li>
                  <li>• Brush teeth 2-3 times per week</li>
                </ul>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-3'>Preparing for Grooming</h3>
                <ul className='space-y-2 text-gray-700'>
                  <li>• Exercise your pet beforehand to tire them out</li>
                  <li>• Bring their favorite treats</li>
                  <li>• Inform us of any behavioral concerns</li>
                  <li>• Schedule regular appointments every 6-8 weeks</li>
                </ul>
              </div>
            </div>
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
                  <span>456 Grooming Lane, City, State 12345</span>
                </div>
                <div className='flex items-center'>
                  <Phone className='h-5 w-5 text-gray-400 mr-3' />
                  <span>(555) 987-6543</span>
                </div>
                <div className='flex items-center'>
                  <Clock className='h-5 w-5 text-gray-400 mr-3' />
                  <div>
                    <p>Mon-Fri: 9:00 AM - 7:00 PM</p>
                    <p>Saturday: 8:00 AM - 6:00 PM</p>
                    <p>Sunday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>What We Provide</h3>
              <ul className='space-y-2 text-gray-700'>
                <li>• Premium shampoos and conditioners</li>
                <li>• Professional grooming tools</li>
                <li>• Calming aromatherapy</li>
                <li>• Individual attention for each pet</li>
                <li>• Post-grooming treats and photos</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          serviceType="grooming"
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
    servicePackage: "",
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
      // Combine service package info with notes
      const bookingData = {
        ...formData,
        notes: formData.servicePackage + (formData.notes ? ` - ${formData.notes}` : '')
      };
      await bookingAPI.createBooking(bookingData);
      toast.success("Grooming appointment booked successfully!");
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
            Please login to book a grooming appointment.
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
              className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700'
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
            Book Grooming Appointment
          </h3>

          {petsLoading ? (
            <div className='text-center py-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto'></div>
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
                  className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700'
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
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
                  Service Package
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                  value={formData.servicePackage}
                  onChange={(e) =>
                    setFormData({ ...formData, servicePackage: e.target.value })
                  }
                  required
                >
                  <option value=''>Select a service</option>
                  <option value='Basic Bath & Brush'>Basic Bath & Brush - $35</option>
                  <option value='Full Grooming Package'>Full Grooming Package - $65</option>
                  <option value='Nail Trim Only'>Nail Trim Only - $15</option>
                  <option value='De-shedding Treatment'>De-shedding Treatment - $45</option>
                  <option value='Flea & Tick Treatment'>Flea & Tick Treatment - $55</option>
                  <option value='Premium Spa Package'>Premium Spa Package - $95</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Preferred Groomer
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                  value={formData.providerName}
                  onChange={(e) =>
                    setFormData({ ...formData, providerName: e.target.value })
                  }
                  required
                >
                  <option value=''>Select a groomer</option>
                  <option value='Lisa Thompson'>Lisa Thompson</option>
                  <option value='Carlos Martinez'>Carlos Martinez</option>
                  <option value='Amanda Foster'>Amanda Foster</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Preferred Date & Time
                </label>
                <input
                  type='datetime-local'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
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
                  Special Requests / Notes
                </label>
                <textarea
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder='Any special requests or behavioral notes...'
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
                  className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50'
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

export default GroomingService;