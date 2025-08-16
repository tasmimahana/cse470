import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Heart,
  Calendar,
  DollarSign,
  Bell,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: location.pathname === "/admin",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: location.pathname === "/admin/users",
    },
    {
      name: "Pets",
      href: "/admin/pets",
      icon: Heart,
      current: location.pathname === "/admin/pets",
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: Calendar,
      current: location.pathname === "/admin/bookings",
    },
    {
      name: "Donations",
      href: "/admin/donations",
      icon: DollarSign,
      current: location.pathname === "/admin/donations",
    },
    {
      name: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
      current: location.pathname === "/admin/notifications",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white shadow-sm border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-4">
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${item.current
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${item.current ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                        } mr-3 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1">
          {/* Mobile menu button */}
          <div className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
          </div>

          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;