import { useState, useEffect } from "react";
import { trainingAPI } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import {
  Search,
  Filter,
  Play,
  BookOpen,
  Clock,
  Star,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

const Training = () => {
  const { isAdmin } = useAuth();
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchResources();
      fetchCategories();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchResources = async () => {
    try {
      // Show search loading only if it's a search operation
      if (filters.search) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search.trim();

      console.log('Fetching training resources with params:', params);
      const response = await trainingAPI.getAllResources(params);

      setResources(response.data.resources || []);

    } catch (error) {
      console.error("Fetch training resources error:", error);
      toast.error("Failed to load training resources");
      setResources([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await trainingAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to load categories");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await trainingAPI.deleteResource(id);
        toast.success("Resource deleted successfully");
        fetchResources();
      } catch (error) {
        toast.error("Failed to delete resource");
      }
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Training Resources
            </h1>
            <p className='text-gray-600 mt-2'>
              Learn how to train and care for your pets with expert guidance
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className='mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <Plus className='h-5 w-5 mr-2' />
              Add Resource
            </button>
          )}
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Search
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search by title, description, or category...'
                  className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
                {searchLoading && (
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                    <div className='animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full'></div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Category
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value=''>All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-end'>
              <button
                onClick={() => setFilters({ category: "", search: "" })}
                className='w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {resources.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {resources.map((resource) => (
              <div
                key={resource._id}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
              >
                <div className='relative'>
                  {resource.videoUrl ? (
                    <div className='bg-gray-200 h-48 flex items-center justify-center'>
                      <Play className='h-12 w-12 text-gray-400' />
                    </div>
                  ) : (
                    <div className='bg-blue-100 h-48 flex items-center justify-center'>
                      <BookOpen className='h-12 w-12 text-blue-500' />
                    </div>
                  )}
                  <div className='absolute top-2 right-2'>
                    <span className='px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full'>
                      {resource.category}
                    </span>
                  </div>
                </div>
                <div className='p-4'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                    {resource.title}
                  </h3>
                  <p className='text-gray-700 text-sm mb-4 line-clamp-3'>
                    {resource.description}
                  </p>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center text-sm text-gray-500'>
                      <Clock className='h-4 w-4 mr-1' />
                      <span>
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      {resource.videoUrl && (
                        <a
                          href={resource.videoUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors'
                        >
                          <Play className='h-4 w-4 mr-1' />
                          Watch
                        </a>
                      )}
                      {isAdmin && (
                        <>
                          <button className='p-1 text-gray-400 hover:text-blue-500 transition-colors'>
                            <Edit className='h-4 w-4' />
                          </button>
                          <button
                            onClick={() => handleDelete(resource._id)}
                            className='p-1 text-gray-400 hover:text-red-500 transition-colors'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <BookOpen className='h-16 w-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No resources found
            </h3>
            <p className='text-gray-600'>
              Try adjusting your filters or check back later for new resources.
            </p>
          </div>
        )}

        {/* Add Resource Modal */}
        {showAddModal && (
          <AddResourceModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchResources();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Add Resource Modal Component
const AddResourceModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await trainingAPI.createResource(formData);
      toast.success("Resource added successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to add resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg w-full max-w-md'>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Add Training Resource
          </h3>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Title
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description
              </label>
              <textarea
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Category
              </label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Video URL (Optional)
              </label>
              <input
                type='url'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
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
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
              >
                {loading ? "Adding..." : "Add Resource"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Training;