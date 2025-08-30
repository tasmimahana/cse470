import { Link } from "react-router-dom";
import {
  Stethoscope,
  Scissors,
  Home,
  Heart,
  Calendar,
  Clock,
  Star,
  ArrowRight,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      id: "vet",
      title: "Veterinary Care",
      description:
        "Professional medical care for your pets with certified veterinarians.",
      icon: Stethoscope,
      features: [
        "Regular check-ups and vaccinations",
        "Emergency medical care",
        "Surgical procedures",
        "Dental care",
        "Health monitoring and advice",
      ],
      color: "bg-blue-500",
      link: "/services/veterinary",
    },
    {
      id: "grooming",
      title: "Pet Grooming",
      description:
        "Keep your pets looking and feeling their best with our grooming services.",
      icon: Scissors,
      features: [
        "Full-service bathing and drying",
        "Hair cutting and styling",
        "Nail trimming",
        "Ear cleaning",
        "Flea and tick treatments",
      ],
      color: "bg-purple-500",
      link: "/services/grooming",
    },
    {
      id: "daycare",
      title: "Pet Daycare",
      description:
        "Safe and fun daycare services for your pets while you're away.",
      icon: Home,
      features: [
        "Supervised playtime",
        "Socialization with other pets",
        "Exercise and activities",
        "Feeding and medication",
        "Regular updates and photos",
      ],
      color: "bg-green-500",
      link: "/services/daycare",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "The veterinary care here is exceptional. Dr. Smith took great care of my cat during her surgery.",
      rating: 5,
      service: "Veterinary Care",
    },
    {
      name: "Mike Chen",
      text: "My dog loves the daycare! The staff is so caring and sends me updates throughout the day.",
      rating: 5,
      service: "Pet Daycare",
    },
    {
      name: "Emily Davis",
      text: "Best grooming service in town. My poodle always comes home looking amazing!",
      rating: 5,
      service: "Pet Grooming",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            Professional Pet Services
          </h1>
          <p className='text-xl md:text-2xl mb-8 max-w-3xl mx-auto'>
            Comprehensive care for your beloved pets with experienced
            professionals and state-of-the-art facilities.
          </p>
          <Link
            to='/register'
            className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center'
          >
            Get Started
            <ArrowRight className='ml-2 h-5 w-5' />
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Our Services
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              We offer a complete range of services to keep your pets healthy,
              happy, and well-cared for.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {services.map((service) => (
              <div
                key={service.id}
                className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow'
              >
                <div className='p-8'>
                  <div
                    className={`${service.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}
                  >
                    <service.icon className='h-8 w-8 text-white' />
                  </div>
                  <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                    {service.title}
                  </h3>
                  <p className='text-gray-600 mb-6'>{service.description}</p>

                  <ul className='space-y-3 mb-8'>
                    {service.features.map((feature, index) => (
                      <li
                        key={index}
                        className='flex items-center text-gray-700'
                      >
                        <div className='w-2 h-2 bg-blue-500 rounded-full mr-3'></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={service.link}
                    className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center'
                  >
                    <Calendar className='mr-2 h-5 w-5' />
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              How It Works
            </h2>
            <p className='text-xl text-gray-600'>
              Simple steps to book and manage your pet's care
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Calendar className='h-8 w-8 text-blue-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                1. Book Online
              </h3>
              <p className='text-gray-600'>
                Choose your service and preferred time slot through our easy
                booking system.
              </p>
            </div>

            <div className='text-center'>
              <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Clock className='h-8 w-8 text-green-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                2. Get Confirmation
              </h3>
              <p className='text-gray-600'>
                Receive instant confirmation and reminders about your
                appointment.
              </p>
            </div>

            <div className='text-center'>
              <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Heart className='h-8 w-8 text-purple-600' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                3. Enjoy Service
              </h3>
              <p className='text-gray-600'>
                Bring your pet for professional care from our experienced team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              What Our Customers Say
            </h2>
            <p className='text-xl text-gray-600'>
              Don't just take our word for it - hear from happy pet parents
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <div key={index} className='bg-white rounded-lg shadow p-6'>
                <div className='flex items-center mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='h-5 w-5 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <p className='text-gray-700 mb-4'>"{testimonial.text}"</p>
                <div>
                  <p className='font-semibold text-gray-900'>
                    {testimonial.name}
                  </p>
                  <p className='text-sm text-gray-600'>{testimonial.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-blue-600 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to Book Your Pet's Care?
          </h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Join thousands of satisfied pet parents who trust us with their
            beloved companions.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/register'
              className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
            >
              Create Account
            </Link>
            <Link
              to='/login'
              className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
            >
              Sign In to Book
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
