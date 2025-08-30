import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { bookingAPI, petAPI } from "../../lib/api";
import {
  Home,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  ArrowLeft,
  Users,
  Camera,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";

const DaycareService = () => {
  const { isAuthenticated } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const packages = [
    {
      name: "Half Day Care",
      price: "$25",
      duration: "4 hours",
      description: "Perfect for busy mornings or afternoons. Includes playtime, snacks, and rest.",
    },
    {
      name: "Full Day Care",
      price: "$45",
      duration: "8 hours",
      description: "Complete day of fun and care. Includes meals, playtime, training, and rest periods.",
    },
    {
      name: "Weekly Package",
      price: "$200",
      duration: "5 days",
      description: "Monday to Friday full daycare with 10% discount. Perfect for working pet parents.",
    },
    {
      name: "Puppy Socialization",
      price: "$35",
      duration: "3 hours",
      description: "Specialized program for puppies 3-6 months old focusing on socialization and basic training.",
    },
    {
      name: "Senior Pet Care",
      price: "$30",
      duration: "6 hours",
      description: "Gentle care for senior pets with comfortable rest areas and light activities.",
    },
    {
      name: "Special Needs Care",
      price: "$55",
      duration: "8 hours",
      description: "Specialized care for pets with medical conditions or special requirements.",
    },
  ];

  const activities = [
    {
      name: "Supervised Playtime",
      icon: Users,
      description: "Safe, supervised play sessions with compatible pets",
    },
    {
      name: "Training Sessions",
      icon: CheckCircle,
      description: "Basic obedience and behavioral training throughout the day",
    },
    {
      name: "Rest & Relaxation",
      icon: Home,
      description: "Quiet time and nap periods in comfortable, individual spaces",
    },
    {
      name: "Photo Updates",
      icon: Camera,
      description: "Regular photo and video updates sent to pet parents",
    },
  ];

  const staff = [
    {
      name: "Jennifer Adams",
      role: "Daycare Manager",
      experience: "7 years",
      certification: "Certified Pet Care Professional",
      image: "/api/placeholder/150/150",
    },
    {
      name: "David Wilson",
      role: "Play Supervisor",
      experience: "5 years",
      certification: "Animal Behavior Specialist",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Maria Garcia",
      role: "Senior Care Specialist",
      experience: "9 years",
      certification: "Pet First Aid Certified",
      image: "/api/placeholder/150/150",
    },
  ];

  const schedule = [
    { time: "7:00 AM", activity: "Drop-off & Morning Greetings" },
    { time: "8:00 AM", activity: "Breakfast & Medication (if needed)" },
    { time: "9:00 AM", activity: "Morning Playtime & Socialization" },
    { time: "11:00 AM", activity: "Training Session & Mental Stimulation" },
    { time: "12:00 PM", activity: "Lunch & Rest Time" },
    { time: "2:00 PM", activity: "Afternoon Play & Outdoor Time" },
    { time: "4:00 PM", activity: "Quiet Time & Individual Attention" },
    { time: "5:00 PM", activity: "Evening Snack & Preparation for Pickup" },
    { time: "6:00 PM", activity: "Pickup & Daily Report" },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-gradient-to-r from-green-600 to-teal-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <Link
            to='/services'
            className='inline-flex items-center text-green-100 hover:text-white mb-6'
          >
            <ArrowLeft className='h-5 w-5 mr-2' />
            Back to Services
          </Link>
          <div className='flex items-center mb-6'>
            <Home className='h-12 w-12 mr-4' />
            <div>
              <h1 className='text-4xl font-bold'>Pet Daycare</h1>
              <p className='text-xl text-green-100 mt-2'>
                A safe, fun, and caring environment for your pet while you're away
              </p>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
            <div className='flex items-center'>
              <CheckCircle className='h-6 w-6 mr-3 text-green-300' />
              <span>Trained & Certified Staff</span>
            </div>
            <div className='flex items-center'>
              <CheckCircle className='h-6 w-6 mr-3 text-green-300' />
              <span>Safe & Secure Facility</span>
            </div>
            <div className='flex items-center'>
              <CheckCircle className='h-6 w-6 mr-3 text-green-300' />
              <span>Regular Updates & Photos</span>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Packages */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Daycare Packages</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {packages.map((pkg, index) => (
              <div key={index} className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
                <div className='flex justify-between items-start mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900'>{pkg.name}</h3>
                  <span className='text-2xl font-bold text-green-600'>{pkg.price}</span>
                </div>
                <div className='flex items-center text-gray-600 mb-3'>
                  <Clock className='h-4 w-4 mr-2' />
                  <span className='text-sm'>{pkg.duration}</span>
                </div>
                <p className='text-gray-700 mb-4'>{pkg.description}</p>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className='w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors'
                >
                  Book Package
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Schedule */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Daily Schedule</h2>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='space-y-4'>
              {schedule.map((item, index) => (
                <div key={index} className='flex items-center p-4 border-l-4 border-green-500 bg-green-50'>
                  <div className='flex-shrink-0 w-20'>
                    <span className='text-sm font-semibold text-green-700'>{item.time}</span>
                  </div>
                  <div className='ml-4'>
                    <span className='text-gray-900'>{item.activity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Daily Activities</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {activities.map((activity, index) => (
              <div key={index} className='bg-white rounded-lg shadow-md p-6 text-center'>
                <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <activity.icon className='h-8 w-8 text-green-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>{activity.name}</h3>
                <p className='text-gray-600 text-sm'>{activity.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Staff */}
        <section className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Our Caring Staff</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {staff.map((member, index) => (
              <div key={index} className='bg-white rounded-lg shadow-md p-6 text-center'>
                <img
                  src={member.image}
                  alt={member.name}
                  className='w-24 h-24 rounded-full mx-auto mb-4 object-cover'
                />
                <h3 className='text-xl font-semibold text-gray-900 mb-1'>{member.name}</h3>
                <p className='text-green-600 font-medium mb-1'>{member.role}</p>
                <p className='text-gray-600 text-sm mb-2'>{member.experience} experience</p>
                <p className='text-gray-500 text-xs'>{member.certification}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements & Policies */}
        <section className='mb-16'>
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Requirements & Policies</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Health Requirements</h3>
                <ul className='space-y-2 text-gray-700'>
                  <li>• Up-to-date vaccinations (DHPP, Rabies, Bordetella)</li>
                  <li>• Negative fecal exam within 6 months</li>
                  <li>• Spayed/neutered (6+ months old)</li>
                  <li>• Flea and tick prevention</li>
                  <li>• Health certificate from veterinarian</li>
                </ul>
              </div>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Behavioral Requirements</h3>
                <ul className='space-y-2 text-gray-700'>
                  <li>• Must be social with other pets</li>
                  <li>• Non-aggressive behavior</li>
                  <li>• House trained preferred</li>
                  <li>• Comfortable with human handling</li>
                  <li>• Evaluation required for first-time visitors</li>
                </ul>
              </div>
            </div>
            <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <h4 className='font-semibold text-yellow-800 mb-2'>Important Notes:</h4>
              <ul className='text-yellow-700 text-sm space-y-1'>
                <li>• Drop-off: 7:00 AM - 9:00 AM</li>
                <li>• Pick-up: 4:00 PM - 6:00 PM</li>
                <li>• Late pick-up fee: $1 per minute after 6:00 PM</li>
                <li>• 24-hour cancellation policy</li>
              </ul>
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
                  <span>789 Daycare Drive, City, State 12345</span>
                </div>
                <div className='flex items-center'>
                  <Phone className='h-5 w-5 text-gray-400 mr-3' />
                  <span>(555) 456-7890</span>
                </div>
                <div className='flex items-center'>
                  <Clock className='h-5 w-5 text-gray-400 mr-3' />
                  <div>
                    <p>Monday-Friday: 7:00 AM - 6:00 PM</p>
                    <p>Saturday: 8:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>What to Bring</h3>
              <ul className='space-y-2 text-gray-700'>
                <li>• Your pet's food (if special diet)</li>
                <li>• Any medications with instructions</li>
                <li>• Favorite toy or blanket</li>
                <li>• Emergency contact information</li>
                <li>• Vaccination records (first visit)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          serviceType="daycare"
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
    providerName: "Pet Daycare Center",
    date: "",
    notes: "",
    package: "",
    dropOffTime: "",
    pickUpTime: "",
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
        console.log("getUserPets response:", response);
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
      // Combine package info with notes
      const bookingData = {
        ...formData,
        notes: `Package: ${formData.package}, Drop-off: ${formData.dropOffTime}, Pick-up: ${formData.pickUpTime}${formData.notes ? ` - ${formData.notes}` : ''}`
      };
      await bookingAPI.createBooking(bookingData);
      toast.success("Daycare booking confirmed!");
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      const message = error.response?.data?.msg || error.response?.data?.error || "Failed to book daycare";
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
            Please login to book a daycare service.
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
              className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
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
      <div className='bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Book Daycare Service
          </h3>

          {petsLoading ? (
            <div className='text-center py-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto'></div>
              <p className='text-gray-600 mt-2'>Loading your pets...</p>
            </div>
          ) : userPets.length === 0 ? (
            <div className='text-center py-4'>
              <p className='text-gray-600 mb-4'>
                You don't have any pets registered yet. Please add a pet first to book daycare.
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
                  className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
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
                  Package
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                  value={formData.package}
                  onChange={(e) =>
                    setFormData({ ...formData, package: e.target.value })
                  }
                  required
                >
                  <option value=''>Select a package</option>
                  <option value='Half Day Care'>Half Day Care - $25</option>
                  <option value='Full Day Care'>Full Day Care - $45</option>
                  <option value='Weekly Package'>Weekly Package - $200</option>
                  <option value='Puppy Socialization'>Puppy Socialization - $35</option>
                  <option value='Senior Pet Care'>Senior Pet Care - $30</option>
                  <option value='Special Needs Care'>Special Needs Care - $55</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Date
                </label>
                <input
                  type='date'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Drop-off Time
                  </label>
                  <select
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                    value={formData.dropOffTime}
                    onChange={(e) =>
                      setFormData({ ...formData, dropOffTime: e.target.value })
                    }
                    required
                  >
                    <option value=''>Select time</option>
                    <option value='7:00 AM'>7:00 AM</option>
                    <option value='7:30 AM'>7:30 AM</option>
                    <option value='8:00 AM'>8:00 AM</option>
                    <option value='8:30 AM'>8:30 AM</option>
                    <option value='9:00 AM'>9:00 AM</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Pick-up Time
                  </label>
                  <select
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                    value={formData.pickUpTime}
                    onChange={(e) =>
                      setFormData({ ...formData, pickUpTime: e.target.value })
                    }
                    required
                  >
                    <option value=''>Select time</option>
                    <option value='4:00 PM'>4:00 PM</option>
                    <option value='4:30 PM'>4:30 PM</option>
                    <option value='5:00 PM'>5:00 PM</option>
                    <option value='5:30 PM'>5:30 PM</option>
                    <option value='6:00 PM'>6:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Special Instructions / Notes
                </label>
                <textarea
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder='Dietary restrictions, medications, behavioral notes...'
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
                  className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50'
                >
                  {loading ? "Booking..." : "Book Daycare"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaycareService;