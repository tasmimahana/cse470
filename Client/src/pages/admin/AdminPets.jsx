import { useState, useEffect } from "react";
import { adminAPI, petAPI } from "../../lib/api";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  Heart,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: "",
    status: "",
    approved: "",
    search: "",
  });
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.species) params.species = filters.species;
      if (filters.status) params.status = filters.status;
      if (filters.approved) params.approved = filters.approved;
      if (filters.search) params.search = filters.search;

      const response = await petAPI.getAllPets(params);
      setPets(response.data.pets || response.data.data || []);
    } catch (error) {
      console.error("Fetch pets error:", error);
      toast.error("Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePet = async (petId) => {
    try {
      await petAPI.approvePet(petId);
      toast.success("Pet approved successfully");
      fetchPets();
    } catch (error) {
      toast.error("Failed to approve pet");
    }
  };

  const handleBulkApprove = async () => {
    const pendingPets = pets.filter(pet => !pet.approved);
    if (pendingPets.length === 0) {
      toast.info("No pets pending approval");
      return;
    }

    try {
      const petIds = pendingPets.map(pet => pet._id);
      await adminAPI.bulkApprovePets({ petIds });
      toast.success(`${petIds.length} pets approved successfully`);
      fetchPets();
    } catch (error) {
      toast.error("Failed to bulk approve pets");
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      await petAPI.deletePet(petId);
      toast.success("Pet deleted successfully");
      setShowDeleteModal(false);
      setSelectedPet(null);
      fetchPets();
    } catch (error) {
      toast.error("Failed to delete pet");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "adopted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalStatus = (approved) => {
    return approved ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Approved
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Pending
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

  const pendingCount = pets.filter(pet => !pet.approved).length;
  const approvedCount = pets.filter(pet => pet.approved).length;
  const availableCount = pets.filter(pet => pet.status === 'available').length;
  const adoptedCount = pets.filter(pet => pet.status === 'adopted').length;

  return (
    <AdminLayout>
      <div className='py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 flex items-center'>
                <Heart className='h-8 w-8 text-blue-600 mr-3' />
                Pet Management
              </h1>
              <p className='text-gray-600 mt-2'>
                Manage pet listings, approvals, and adoptions
              </p>
            </div>
            <div className='flex space-x-3'>
              {pendingCount > 0 && (
                <button
                  onClick={handleBulkApprove}
                  className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center'
                >
                  <CheckCircle className='h-4 w-4 mr-2' />
                  Approve All ({pendingCount})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='bg-blue-100 p-3 rounded-lg'>
                <Heart className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Total Pets</p>
                <p className='text-2xl font-bold text-gray-900'>{pets.length}</p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='bg-yellow-100 p-3 rounded-lg'>
                <Clock className='h-6 w-6 text-yellow-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Pending Approval</p>
                <p className='text-2xl font-bold text-gray-900'>{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='bg-green-100 p-3 rounded-lg'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Available</p>
                <p className='text-2xl font-bold text-gray-900'>{availableCount}</p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='bg-purple-100 p-3 rounded-lg'>
                <Heart className='h-6 w-6 text-purple-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Adopted</p>
                <p className='text-2xl font-bold text-gray-900'>{adoptedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Search Pets
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search by name or breed...'
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
                Species
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={filters.species}
                onChange={(e) =>
                  setFilters({ ...filters, species: e.target.value })
                }
              >
                <option value=''>All Species</option>
                <option value='Dog'>Dog</option>
                <option value='Cat'>Cat</option>
                <option value='Bird'>Bird</option>
                <option value='Rabbit'>Rabbit</option>
                <option value='Other'>Other</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Status
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value=''>All Status</option>
                <option value='available'>Available</option>
                <option value='pending'>Pending</option>
                <option value='adopted'>Adopted</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Approval
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={filters.approved}
                onChange={(e) =>
                  setFilters({ ...filters, approved: e.target.value })
                }
              >
                <option value=''>All Pets</option>
                <option value='true'>Approved</option>
                <option value='false'>Pending Approval</option>
              </select>
            </div>
            <div className='flex items-end'>
              <button
                onClick={() => setFilters({ species: "", status: "", approved: "", search: "" })}
                className='w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Pets Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {pets.map((pet) => (
            <div key={pet._id} className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
              <div className='relative'>
                <img
                  src={pet.imageUrl || '/api/placeholder/300/200'}
                  alt={pet.name}
                  className='w-full h-48 object-cover'
                />
                <div className='absolute top-2 right-2 flex flex-col space-y-1'>
                  {getApprovalStatus(pet.approved)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pet.status)}`}>
                    {pet.status}
                  </span>
                </div>
              </div>
              <div className='p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-lg font-semibold text-gray-900'>{pet.name}</h3>
                  <div className='flex items-center space-x-1'>
                    <button
                      onClick={() => {
                        setSelectedPet(pet);
                        setShowPetModal(true);
                      }}
                      className='text-blue-600 hover:text-blue-800'
                    >
                      <Eye className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPet(pet);
                        setShowDeleteModal(true);
                      }}
                      className='text-red-600 hover:text-red-800'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
                <div className='space-y-1 text-sm text-gray-600 mb-3'>
                  <p>{pet.species} {pet.breed && `• ${pet.breed}`}</p>
                  <p>{pet.age} years old • {pet.gender}</p>
                  {pet.owner && (
                    <div className='flex items-center'>
                      <User className='h-3 w-3 mr-1' />
                      <span>{pet.owner.name}</span>
                    </div>
                  )}
                </div>
                <p className='text-gray-700 text-sm mb-4 line-clamp-2'>
                  {pet.description}
                </p>
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-gray-500'>
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </span>
                  {!pet.approved && (
                    <button
                      onClick={() => handleApprovePet(pet._id)}
                      className='bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center'
                    >
                      <CheckCircle className='h-3 w-3 mr-1' />
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {pets.length === 0 && (
          <div className='text-center py-12'>
            <Heart className='h-16 w-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>No pets found</h3>
            <p className='text-gray-600'>
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* Pet Details Modal */}
      {showPetModal && selectedPet && (
        <PetDetailsModal
          pet={selectedPet}
          onClose={() => {
            setShowPetModal(false);
            setSelectedPet(null);
          }}
          onUpdate={fetchPets}
          onApprove={handleApprovePet}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPet && (
        <DeleteConfirmationModal
          pet={selectedPet}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedPet(null);
          }}
          onConfirm={() => handleDeletePet(selectedPet._id)}
        />
      )}
      </div>
    </AdminLayout>
  );
};

// Pet Details Modal
const PetDetailsModal = ({ pet, onClose, onUpdate, onApprove }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-gray-900'>Pet Details</h3>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600'
            >
              ×
            </button>
          </div>

          <div className='space-y-6'>
            {/* Pet Image */}
            <div className='text-center'>
              <img
                src={pet.imageUrl || '/api/placeholder/400/300'}
                alt={pet.name}
                className='w-full max-w-md h-64 object-cover rounded-lg mx-auto'
              />
            </div>

            {/* Basic Info */}
            <div className='bg-gray-50 rounded-lg p-4'>
              <h4 className='font-medium text-gray-900 mb-3'>Basic Information</h4>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-gray-600'>Name</label>
                  <p className='font-medium'>{pet.name}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Species</label>
                  <p className='font-medium'>{pet.species}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Breed</label>
                  <p className='font-medium'>{pet.breed || 'Not specified'}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Age</label>
                  <p className='font-medium'>{pet.age} years old</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Gender</label>
                  <p className='font-medium'>{pet.gender}</p>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Status</label>
                  <p className='font-medium capitalize'>{pet.status}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className='font-medium text-gray-900 mb-2'>Description</h4>
              <p className='text-gray-700 bg-gray-50 rounded-lg p-4'>
                {pet.description}
              </p>
            </div>

            {/* Owner Info */}
            {pet.owner && (
              <div className='bg-blue-50 rounded-lg p-4'>
                <h4 className='font-medium text-gray-900 mb-3'>Owner Information</h4>
                <div className='flex items-center space-x-4'>
                  <div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 font-medium'>
                      {pet.owner.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className='font-medium'>{pet.owner.name}</p>
                    <p className='text-sm text-gray-600'>{pet.owner.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
              <div>
                <label className='text-gray-500'>Created</label>
                <p>{new Date(pet.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className='text-gray-500'>Last Updated</label>
                <p>{new Date(pet.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className='flex justify-end space-x-3 mt-6'>
            {!pet.approved && (
              <button
                onClick={() => {
                  onApprove(pet._id);
                  onClose();
                }}
                className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
              >
                Approve Pet
              </button>
            )}
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
const DeleteConfirmationModal = ({ pet, onClose, onConfirm }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-md'>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Delete Pet
          </h3>
          <p className='text-gray-600 mb-6'>
            Are you sure you want to delete <strong>{pet.name}</strong>? This action cannot be undone.
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
              Delete Pet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPets;