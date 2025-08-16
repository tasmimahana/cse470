import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { petAPI } from "../lib/api";
import { Search, Filter, Heart, MapPin, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import placeDog from "/placeholders/placeDog.webp"

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: "",
    status: "available",
    approved: "true",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await petAPI.getAllPets(filters);
      setPets(response.data.pets);
    } catch (error) {
      toast.error("Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const species = ["Dog", "Cat", "Bird", "Rabbit", "Other"];

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Find Your Perfect Pet
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Browse through our collection of loving pets waiting for their
            forever homes.
          </p>
        </div>

        {/* Search and Filters */}
        <div className='bg-white rounded-lg shadow p-6 mb-8'>
          <div className='flex flex-col lg:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                <input
                  type='text'
                  placeholder='Search pets by name, species, or breed...'
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Species Filter */}
            <div className='lg:w-48'>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                value={filters.species}
                onChange={(e) =>
                  setFilters({ ...filters, species: e.target.value })
                }
              >
                <option value=''>All Species</option>
                {species.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className='mb-4'>
          <p className='text-gray-600'>
            Showing {filteredPets.length} pet
            {filteredPets.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Pet Grid */}
        {loading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredPets.map((pet) => (
              <div
                key={pet._id}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
              >
                <div className='aspect-w-1 aspect-h-1'>
                  <img
                    src={pet.imageUrl || placeDog}
                    alt={pet.name}
                    className='w-full h-48 object-cover'
                  />
                </div>
                <div className='p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {pet.name}
                    </h3>
                    <Heart className='h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer' />
                  </div>
                  <p className='text-gray-600 mb-2'>
                    {pet.species} {pet.breed && `• ${pet.breed}`}
                  </p>
                  {pet.age && (
                    <p className='text-sm text-gray-500 mb-2'>
                      {pet.age} year{pet.age !== 1 ? "s" : ""} old
                    </p>
                  )}
                  <p className='text-sm text-gray-700 mb-4 line-clamp-2'>
                    {pet.description}
                  </p>
                  <div className='flex items-center justify-between'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pet.status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {pet.status}
                    </span>
                    <Link
                      to={`/pets/${pet._id}`}
                      className='text-blue-600 hover:text-blue-800 font-medium text-sm'
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPets.length === 0 && !loading && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <Heart className='h-16 w-16 mx-auto' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No pets found
            </h3>
            <p className='text-gray-600'>
              Try adjusting your search criteria or check back later for new
              additions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pets;
