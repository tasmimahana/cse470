import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { petAPI } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { ArrowLeft, Upload } from "lucide-react";
import toast from "react-hot-toast";

const schema = yup.object({
  name: yup.string().required("Pet name is required"),
  species: yup.string().required("Species is required"),
  breed: yup.string(),
  age: yup.number().positive("Age must be positive").integer("Age must be a whole number"),
  gender: yup.string().required("Gender is required"),
  description: yup.string().required("Description is required"),
  imageUrl: yup.string().url("Must be a valid URL"),
});

const AddPet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState("");

  console.log("Current user in AddPet:", user);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "available",
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async (data) => {
    try {
      console.log("Submitting pet data:", data);
      const response = await petAPI.createPet(data);
      console.log("Pet creation response:", response);
      const petData = response.data.data || response.data;
      toast.success("Pet added successfully! Waiting for admin approval.");
      navigate(`/pets/${petData._id}`);
    } catch (error) {
      console.error("Add pet error:", error);
      const errorMessage = error.response?.data?.msg || error.response?.data?.message || "Failed to add pet";
      toast.error(errorMessage);
    }
  };

  const handleImageUrlChange = (url) => {
    setValue("imageUrl", url);
    setImagePreview(url);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center text-gray-600 hover:text-gray-900 mb-4'
          >
            <ArrowLeft className='h-5 w-5 mr-2' />
            Back
          </button>
          <h1 className='text-3xl font-bold text-gray-900'>Add New Pet</h1>
          <p className='text-gray-600 mt-2'>
            Fill out the form below to list a pet for adoption
          </p>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Pet Name *
                </label>
                <input
                  {...register("name")}
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter pet name'
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Species *
                </label>
                <select
                  {...register("species")}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select species</option>
                  <option value='Dog'>Dog</option>
                  <option value='Cat'>Cat</option>
                  <option value='Bird'>Bird</option>
                  <option value='Rabbit'>Rabbit</option>
                  <option value='Other'>Other</option>
                </select>
                {errors.species && (
                  <p className='mt-1 text-sm text-red-600'>{errors.species.message}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Breed
                </label>
                <input
                  {...register("breed")}
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter breed (optional)'
                />
                {errors.breed && (
                  <p className='mt-1 text-sm text-red-600'>{errors.breed.message}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Age (years)
                </label>
                <input
                  {...register("age")}
                  type='number'
                  min='0'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter age'
                />
                {errors.age && (
                  <p className='mt-1 text-sm text-red-600'>{errors.age.message}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Gender *
                </label>
                <select
                  {...register("gender")}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Select gender</option>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </select>
                {errors.gender && (
                  <p className='mt-1 text-sm text-red-600'>{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Status
                </label>
                <select
                  {...register("status")}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='available'>Available</option>
                  <option value='pending'>Pending</option>
                  <option value='adopted'>Adopted</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Tell us about this pet...'
              />
              {errors.description && (
                <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Pet Photo
              </label>
              <div className='space-y-4'>
                <input
                  {...register("imageUrl")}
                  type='url'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter image URL'
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                />
                {errors.imageUrl && (
                  <p className='mt-1 text-sm text-red-600'>{errors.imageUrl.message}</p>
                )}
                
                {imageUrl && (
                  <div className='mt-4'>
                    <img
                      src={imageUrl}
                      alt='Pet preview'
                      className='w-full max-w-sm h-48 object-cover rounded-lg border'
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className='flex justify-end space-x-4 pt-6 border-t'>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isSubmitting ? "Adding Pet..." : "Add Pet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPet;