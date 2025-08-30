import { useState, useEffect } from "react";
import { adminAPI, notificationAPI } from "../../lib/api";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  Bell,
  Send,
  Users,
  User,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminNotifications = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    type: "system",
    message: "",
    targetType: "all", // "all", "specific"
    targetUsers: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.data || response.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (!notificationForm.message.trim()) {
      toast.error("Please enter a notification message");
      return;
    }

    if (notificationForm.targetType === "specific" && notificationForm.targetUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    try {
      setSendingNotification(true);

      if (notificationForm.targetType === "all") {
        // Send to all users - this would need a broadcast endpoint
        const response = await notificationAPI.createNotification({
          message: notificationForm.message,
          type: notificationForm.type,
          broadcast: true
        });
        toast.success("Notification sent to all users successfully");
      } else {
        // Send to specific users
        const promises = notificationForm.targetUsers.map(userId =>
          notificationAPI.createNotification({
            user: userId,
            message: notificationForm.message,
            type: notificationForm.type
          })
        );

        await Promise.all(promises);
        toast.success(`Notification sent to ${notificationForm.targetUsers.length} users successfully`);
      }

      // Reset form
      setNotificationForm({
        type: "system",
        message: "",
        targetType: "all",
        targetUsers: [],
      });

    } catch (error) {
      console.error("Failed to send notification:", error);
      toast.error("Failed to send notification");
    } finally {
      setSendingNotification(false);
    }
  };

  const handleUserToggle = (userId) => {
    setNotificationForm(prev => ({
      ...prev,
      targetUsers: prev.targetUsers.includes(userId)
        ? prev.targetUsers.filter(id => id !== userId)
        : [...prev.targetUsers, userId]
    }));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "system":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "booking":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pet":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "admin":
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className='py-8'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center'>
              <Bell className='h-8 w-8 text-blue-600 mr-3' />
              Send Notifications
            </h1>
            <p className='text-gray-600 mt-2'>
              Send notifications to users about important updates and announcements
            </p>
          </div>

          {/* Notification Form */}
          <div className='bg-white rounded-lg shadow p-6 mb-8'>
            <form onSubmit={handleSendNotification} className='space-y-6'>
              {/* Notification Type */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Notification Type
                </label>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                  {["system", "booking", "pet", "admin"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNotificationForm(prev => ({ ...prev, type }))}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${notificationForm.type === type
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      {getTypeIcon(type)}
                      <span className='ml-2 capitalize'>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Message
                </label>
                <textarea
                  rows={4}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter your notification message...'
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                  required
                />
                <p className='text-sm text-gray-500 mt-1'>
                  {notificationForm.message.length}/500 characters
                </p>
              </div>

              {/* Target Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Send To
                </label>
                <div className='space-y-3'>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='targetType'
                      value='all'
                      checked={notificationForm.targetType === 'all'}
                      onChange={(e) => setNotificationForm(prev => ({
                        ...prev,
                        targetType: e.target.value,
                        targetUsers: []
                      }))}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300'
                    />
                    <span className='ml-2 flex items-center'>
                      <Users className='h-4 w-4 mr-1' />
                      All Users ({users.length})
                    </span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='targetType'
                      value='specific'
                      checked={notificationForm.targetType === 'specific'}
                      onChange={(e) => setNotificationForm(prev => ({
                        ...prev,
                        targetType: e.target.value
                      }))}
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300'
                    />
                    <span className='ml-2 flex items-center'>
                      <User className='h-4 w-4 mr-1' />
                      Specific Users
                    </span>
                  </label>
                </div>
              </div>

              {/* User Selection */}
              {notificationForm.targetType === 'specific' && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Select Users ({notificationForm.targetUsers.length} selected)
                  </label>
                  <div className='max-h-60 overflow-y-auto border border-gray-200 rounded-md'>
                    {loading ? (
                      <div className='p-4 text-center'>
                        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto'></div>
                      </div>
                    ) : (
                      <div className='divide-y divide-gray-200'>
                        {users.map((user) => (
                          <label key={user._id} className='flex items-center p-3 hover:bg-gray-50 cursor-pointer'>
                            <input
                              type='checkbox'
                              checked={notificationForm.targetUsers.includes(user._id)}
                              onChange={() => handleUserToggle(user._id)}
                              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                            />
                            <div className='ml-3 flex items-center'>
                              <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                                <span className='text-blue-600 font-medium text-sm'>
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className='ml-3'>
                                <p className='text-sm font-medium text-gray-900'>{user.name}</p>
                                <p className='text-xs text-gray-500'>{user.email}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className='flex justify-end'>
                <button
                  type='submit'
                  disabled={sendingNotification}
                  className='inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {sendingNotification ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className='h-4 w-4 mr-2' />
                      Send Notification
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Actions */}
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Quick Actions</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <button
                onClick={() => setNotificationForm({
                  type: "system",
                  message: "System maintenance scheduled for tonight from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.",
                  targetType: "all",
                  targetUsers: []
                })}
                className='p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors'
              >
                <div className='flex items-center mb-2'>
                  <Info className='h-5 w-5 text-blue-500 mr-2' />
                  <span className='font-medium'>Maintenance Notice</span>
                </div>
                <p className='text-sm text-gray-600'>
                  Notify all users about scheduled maintenance
                </p>
              </button>

              <button
                onClick={() => setNotificationForm({
                  type: "system",
                  message: "New features have been added to improve your pet care experience. Check out the latest updates!",
                  targetType: "all",
                  targetUsers: []
                })}
                className='p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors'
              >
                <div className='flex items-center mb-2'>
                  <CheckCircle className='h-5 w-5 text-green-500 mr-2' />
                  <span className='font-medium'>Feature Update</span>
                </div>
                <p className='text-sm text-gray-600'>
                  Announce new features to all users
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;