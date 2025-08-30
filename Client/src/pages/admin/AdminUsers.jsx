import { useState, useEffect } from "react";
import { adminAPI } from "../../lib/api";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  User,
  Mail,
  Calendar,
  MoreVertical,
  UserCheck,
  UserX,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: "",
    isVerified: "",
    search: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.role) params.role = filters.role;
      if (filters.isVerified) params.isVerified = filters.isVerified;
      if (filters.search) params.search = filters.search;

      const response = await adminAPI.getAllUsers(params);
      setUsers(response.data.data || response.data || []);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, { role: newRole });
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationStatus = (isVerified) => {
    return isVerified ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <UserCheck className="h-3 w-3 mr-1" />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <UserX className="h-3 w-3 mr-1" />
        Unverified
      </span>
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className='py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center'>
              <Users className='h-8 w-8 text-blue-600 mr-3' />
              User Management
            </h1>
            <p className='text-gray-600 mt-2'>
              Manage user accounts, roles, and permissions
            </p>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-blue-100 p-3 rounded-lg'>
                  <Users className='h-6 w-6 text-blue-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Total Users</p>
                  <p className='text-2xl font-bold text-gray-900'>{users.length}</p>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-purple-100 p-3 rounded-lg'>
                  <Shield className='h-6 w-6 text-purple-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Admins</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-green-100 p-3 rounded-lg'>
                  <UserCheck className='h-6 w-6 text-green-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Verified</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {users.filter(u => u.isVerified).length}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='bg-red-100 p-3 rounded-lg'>
                  <UserX className='h-6 w-6 text-red-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Unverified</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {users.filter(u => !u.isVerified).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className='bg-white rounded-lg shadow p-6 mb-8'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Search Users
                </label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <input
                    type='text'
                    placeholder='Search by name or email...'
                    className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Role
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
                  }
                >
                  <option value=''>All Roles</option>
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Verification Status
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={filters.isVerified}
                  onChange={(e) =>
                    setFilters({ ...filters, isVerified: e.target.value })
                  }
                >
                  <option value=''>All Users</option>
                  <option value='true'>Verified</option>
                  <option value='false'>Unverified</option>
                </select>
              </div>
              <div className='flex items-end'>
                <button
                  onClick={() => setFilters({ role: "", isVerified: "", search: "" })}
                  className='w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className='bg-white rounded-lg shadow overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h3 className='text-lg font-medium text-gray-900'>
                Users ({users.length})
              </h3>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      User
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Role
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Joined
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {users.map((user) => (
                    <tr key={user._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center'>
                            <span className='text-blue-600 font-medium text-sm'>
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>
                              {user.name}
                            </div>
                            <div className='text-sm text-gray-500'>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getRoleColor(user.role)}`}
                          disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                        >
                          <option value='user'>User</option>
                          <option value='admin'>Admin</option>
                        </select>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {getVerificationStatus(user.isVerified)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className='text-blue-600 hover:text-blue-900'
                          >
                            <Edit className='h-4 w-4' />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className='text-red-600 hover:text-red-900'
                            disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {users.length === 0 && (
            <div className='text-center py-12'>
              <Users className='h-16 w-16 text-gray-300 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>No users found</h3>
              <p className='text-gray-600'>
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => {
              setShowUserModal(false);
              setSelectedUser(null);
            }}
            onUpdate={fetchUsers}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <DeleteConfirmationModal
            user={selectedUser}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedUser(null);
            }}
            onConfirm={() => handleDeleteUser(selectedUser._id)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

// User Details Modal
const UserDetailsModal = ({ user, onClose, onUpdate }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [user._id]);

  const fetchUserDetails = async () => {
    try {
      const response = await adminAPI.getUser(user._id);
      setUserDetails(response.data.data || response.data);
    } catch (error) {
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg p-6'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-gray-900'>User Details</h3>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600'
            >
              ×
            </button>
          </div>

          {userDetails && (
            <div className='space-y-6'>
              {/* Basic Info */}
              <div className='bg-gray-50 rounded-lg p-4'>
                <h4 className='font-medium text-gray-900 mb-3'>Basic Information</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm text-gray-600'>Name</label>
                    <p className='font-medium'>{userDetails.name}</p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600'>Email</label>
                    <p className='font-medium'>{userDetails.email}</p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600'>Role</label>
                    <p className='font-medium capitalize'>{userDetails.role}</p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600'>Status</label>
                    <p className='font-medium'>
                      {userDetails.isVerified ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600'>Joined</label>
                    <p className='font-medium'>
                      {new Date(userDetails.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm text-gray-600'>Last Updated</label>
                    <p className='font-medium'>
                      {new Date(userDetails.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className='grid grid-cols-3 gap-4'>
                <div className='bg-blue-50 rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-blue-600'>
                    {userDetails.pets?.length || 0}
                  </p>
                  <p className='text-sm text-gray-600'>Pets Listed</p>
                </div>
                <div className='bg-green-50 rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-green-600'>
                    {userDetails.bookings?.length || 0}
                  </p>
                  <p className='text-sm text-gray-600'>Bookings Made</p>
                </div>
                <div className='bg-purple-50 rounded-lg p-4 text-center'>
                  <p className='text-2xl font-bold text-purple-600'>
                    ${userDetails.donations?.reduce((sum, d) => sum + d.amount, 0) || 0}
                  </p>
                  <p className='text-sm text-gray-600'>Total Donated</p>
                </div>
              </div>

              {/* Recent Activity */}
              {userDetails.pets && userDetails.pets.length > 0 && (
                <div>
                  <h4 className='font-medium text-gray-900 mb-3'>Recent Pets</h4>
                  <div className='space-y-2'>
                    {userDetails.pets.slice(0, 3).map((pet) => (
                      <div key={pet._id} className='flex items-center p-3 bg-gray-50 rounded-lg'>
                        <img
                          src={pet.imageUrl || '/api/placeholder/40/40'}
                          alt={pet.name}
                          className='h-10 w-10 rounded-full object-cover'
                        />
                        <div className='ml-3'>
                          <p className='text-sm font-medium'>{pet.name}</p>
                          <p className='text-xs text-gray-500'>
                            {pet.species} • {pet.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className='flex justify-end mt-6'>
            <button
              onClick={onClose}
              className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ user, onClose, onConfirm }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-md'>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Delete User
          </h3>
          <p className='text-gray-600 mb-6'>
            Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
          </p>
          <div className='flex justify-end space-x-3'>
            <button
              onClick={onClose}
              className='px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;