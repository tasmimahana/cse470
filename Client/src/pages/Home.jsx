import { Link } from "react-router-dom";
import { Heart, Shield, Clock, Users, ArrowRight } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Heart,
      title: "Pet Adoption",
      description:
        "Find your perfect companion from our extensive database of pets looking for loving homes.",
    },
    {
      icon: Shield,
      title: "Veterinary Care",
      description:
        "Book appointments with certified veterinarians for comprehensive pet health care.",
    },
    {
      icon: Clock,
      title: "Pet Services",
      description:
        "Schedule daycare, grooming, and training services for your beloved pets.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Join a community of pet lovers and access training resources and support.",
    },
  ];

  const stats = [
    { number: "1,200+", label: "Pets Adopted" },
    { number: "500+", label: "Happy Families" },
    { number: "50+", label: "Partner Shelters" },
    { number: "24/7", label: "Support Available" },
  ];

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6'>
              Find Your Perfect
              <span className='block text-yellow-300'>Furry Friend</span>
            </h1>
            <p className='text-xl md:text-2xl mb-8 max-w-3xl mx-auto'>
              Connect with loving pets in need of homes and access comprehensive
              pet care services all in one place.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to='/pets'
                className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center'
              >
                Browse Pets
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
              <Link
                to='/register'
                className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Everything Your Pet Needs
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              From adoption to ongoing care, we provide comprehensive services
              for pets and their families.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='text-center p-6 rounded-lg hover:shadow-lg transition-shadow'
              >
                <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4'>
                  <feature.icon className='h-8 w-8 text-blue-600' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {feature.title}
                </h3>
                <p className='text-gray-600'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Making a Difference Together
            </h2>
            <p className='text-xl text-gray-600'>
              Join thousands of families who have found their perfect companions
              through PetCare.
            </p>
          </div>

          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='text-4xl md:text-5xl font-bold text-blue-600 mb-2'>
                  {stat.number}
                </div>
                <div className='text-gray-600 font-medium'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-blue-600 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to Make a Difference?
          </h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Whether you're looking to adopt, volunteer, or support our mission,
            there are many ways to get involved.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/pets'
              className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
            >
              Adopt a Pet
            </Link>
            <Link
              to='/donate'
              className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
            >
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
