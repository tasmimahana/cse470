import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Menu,
  X,
  Heart,
  User,
  LogOut,
  Settings,
  Bell,
  Shield,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setShowUserMenu(false);
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Pets", href: "/pets" },
    { name: "Services", href: "/services" },
    { name: "Training", href: "/training" },
    { name: "Donate", href: "/donate" },
  ];

  return (
    <nav className='bg-white shadow-lg sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Link to='/' className='flex items-center space-x-2'>
              <Heart className='h-8 w-8 text-blue-600' />
              <span className='text-xl font-bold text-gray-900'>PetCare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className='text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors'
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className='hidden md:flex items-center space-x-4'>
            {isAuthenticated ? (
              <div className='relative'>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className='flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none'
                >
                  <User className='h-5 w-5' />
                  <span className='text-sm font-medium'>{user?.name}</span>
                </button>

                {showUserMenu && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'>
                    <Link
                      to='/dashboard'
                      className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className='h-4 w-4 mr-2' />
                      Dashboard
                    </Link>
                    <Link
                      to='/profile'
                      className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className='h-4 w-4 mr-2' />
                      Profile
                    </Link>
                    <Link
                      to='/notifications'
                      className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Bell className='h-4 w-4 mr-2' />
                      Notifications
                    </Link>
                    {isAdmin && (
                      <Link
                        to='/admin'
                        className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Shield className='h-4 w-4 mr-2' />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      <LogOut className='h-4 w-4 mr-2' />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <Link
                  to='/login'
                  className='text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='text-gray-700 hover:text-blue-600 focus:outline-none'
            >
              {isOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className='md:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className='text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium'
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to='/dashboard'
                  className='text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium'
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to='/profile'
                  className='text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium'
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to='/admin'
                    className='text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium'
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className='text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium w-full text-left'
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium'
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium'
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
