import { useState, useEffect } from "react";
import { notificationAPI } from "../lib/api";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Calendar,
  AlertCircle,
  Info,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getUserNotifications();
      setNotifications(response.data.data || response.data.notifications || []);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      ));
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await notificationAPI.deleteNotification(id);
        setNotifications(notifications.filter(n => n._id !== id));
        toast.success("Notification deleted");
      } catch (error) {
        toast.error("Failed to delete notification");
      }
    }
  };

  const getNotificationIcon = (type, actionType) => {
    switch (type) {
      case "booking":
        if (actionType === "confirmed") return <CheckCheck className='h-5 w-5 text-green-500' />;
        if (actionType === "cancelled") return <AlertCircle className='h-5 w-5 text-red-500' />;
        if (actionType === "completed") return <Check className='h-5 w-5 text-blue-500' />;
        return <Calendar className='h-5 w-5 text-blue-500' />;
      case "donation":
        return <Heart className='h-5 w-5 text-pink-500' />;
      case "pet":
        if (actionType === "approved") return <CheckCheck className='h-5 w-5 text-green-500' />;
        if (actionType === "rejected") return <AlertCircle className='h-5 w-5 text-red-500' />;
        return <Heart className='h-5 w-5 text-green-500' />;
      case "admin":
        return <AlertCircle className='h-5 w-5 text-purple-500' />;
      case "system":
        return <Info className='h-5 w-5 text-gray-500' />;
      default:
        return <Bell className='h-5 w-5 text-blue-500' />;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Notifications</h1>
            <p className='text-gray-600 mt-2'>
              Stay updated with your pet care activities
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className='mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <CheckCheck className='h-5 w-5 mr-2' />
              Mark All as Read
            </button>
          )}
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='bg-blue-100 p-3 rounded-lg'>
                <Bell className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Total</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {notifications.length}
                </p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='bg-yellow-100 p-3 rounded-lg'>
                <AlertCircle className='h-6 w-6 text-yellow-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Unread</p>
                <p className='text-2xl font-bold text-gray-900'>{unreadCount}</p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='bg-green-100 p-3 rounded-lg'>
                <Check className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Read</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {notifications.length - unreadCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <div className='flex items-center space-x-4'>
            <Filter className='h-5 w-5 text-gray-400' />
            <div className='flex flex-wrap gap-2'>
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "read"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className='space-y-4'>
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow ${!notification.read ? "border-l-4 border-blue-500" : ""
                  }`}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex items-start space-x-4 flex-1'>
                    <div className='flex-shrink-0 mt-1'>
                      {getNotificationIcon(notification.type, notification.metadata?.actionType)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center space-x-2 mb-2'>
                        {!notification.read && (
                          <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                        )}
                        <span className='text-sm text-gray-500'>
                          {new Date(notification.createdAt).toLocaleDateString()} •{" "}
                          {new Date(notification.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {notification.metadata?.adminName && (
                          <span className='text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full'>
                            by {notification.metadata.adminName}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-gray-900 ${!notification.read ? "font-semibold" : ""
                          }`}
                      >
                        {notification.message}
                      </p>
                      <div className='flex items-center space-x-2 mt-2'>
                        {notification.type && (
                          <span className='inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full'>
                            {notification.type}
                          </span>
                        )}
                        {notification.metadata?.actionType && (
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${notification.metadata.actionType === 'approved' || notification.metadata.actionType === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : notification.metadata.actionType === 'cancelled' || notification.metadata.actionType === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                            }`}>
                            {notification.metadata.actionType.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-2 ml-4'>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className='p-2 text-gray-400 hover:text-blue-500 transition-colors'
                        title='Mark as read'
                      >
                        <Check className='h-4 w-4' />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className='p-2 text-gray-400 hover:text-red-500 transition-colors'
                      title='Delete notification'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <Bell className='h-16 w-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {filter === "all"
                ? "No notifications"
                : filter === "unread"
                  ? "No unread notifications"
                  : `No ${filter} notifications`}
            </h3>
            <p className='text-gray-600'>
              {filter === "all"
                ? "You're all caught up! New notifications will appear here."
                : filter === "unread"
                  ? "Great! You've read all your notifications."
                  : `You don't have any ${filter} notifications.`}
            </p>
          </div>
        )}

        {/* Notification Settings */}
        <div className='mt-8 bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Notification Preferences
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-medium text-gray-900'>
                  Booking Updates
                </h4>
                <p className='text-sm text-gray-600'>
                  Get notified about booking confirmations and changes
                </p>
              </div>
              <input
                type='checkbox'
                defaultChecked
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-medium text-gray-900'>
                  Pet Status Updates
                </h4>
                <p className='text-sm text-gray-600'>
                  Get notified when your pet listings are approved or updated
                </p>
              </div>
              <input
                type='checkbox'
                defaultChecked
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-medium text-gray-900'>
                  Donation Receipts
                </h4>
                <p className='text-sm text-gray-600'>
                  Get notified about donation confirmations and receipts
                </p>
              </div>
              <input
                type='checkbox'
                defaultChecked
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;