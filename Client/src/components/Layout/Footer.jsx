import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand */}
          <div className='col-span-1 md:col-span-2'>
            <div className='flex items-center space-x-2 mb-4'>
              <Heart className='h-8 w-8 text-blue-400' />
              <span className='text-2xl font-bold'>PetCare</span>
            </div>
            <p className='text-gray-300 mb-4 max-w-md'>
              Connecting loving pets with caring families. We provide comprehensive
              pet adoption and care services to ensure every pet finds their
              perfect home.
            </p>
            <div className='flex space-x-4'>
              <div className='flex items-center text-gray-300'>
                <Mail className='h-4 w-4 mr-2' />
                <span>info@petcare.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/pets'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Browse Pets
                </Link>
              </li>
              <li>
                <Link
                  to='/services'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to='/training'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Training
                </Link>
              </li>
              <li>
                <Link
                  to='/donate'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Support</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/contact'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to='/help'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to='/privacy'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to='/terms'
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-300'>
          <p>&copy; 2024 PetCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;