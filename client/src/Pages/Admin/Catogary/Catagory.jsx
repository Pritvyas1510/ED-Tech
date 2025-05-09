import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const Category = () => {
  const { register, handleSubmit, reset } = useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get("http://localhost:3000/api/v1/course/showAllCategories");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories", error);
      setError('Failed to fetch categories.');
      toast.error('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:3000/api/v1/course/createCategory', {
        name: data.name,
        description: data.description
      }, {
        withCredentials: true
      });
      toast.success("Category Created Successfully!");
      reset();
      fetchCategories();
    } catch (error) {
      console.error("Error creating category", error);
      const errorMessage = error.response?.data?.message || "Failed to create category.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowModal(true);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setLoading(true);
    setError('');
    setShowModal(false);

    try {
      await axios.post(`http://localhost:3000/api/v1/course/deleteCategory/${categoryToDelete._id }`, 
        { id: categoryToDelete._id },
        { withCredentials: true }
      );
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
      const errorMessage = error.response?.data?.message || "Failed to delete category.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-950 mb-10">📂 Category Management</h1>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      {loading && <p className="text-gray-600 mb-4 text-center">Loading...</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-xl p-6 space-y-5 border border-gray-300">
        <h2 className="text-2xl font-bold text-gray-950">➕ Create New Category</h2>
        <div>
          <input
            {...register("name", { required: true })}
            type="text"
            placeholder="Category Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950"
          />
        </div>
        <div>
          <textarea
            {...register("description", { required: true })}
            placeholder="Category Description"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold px-6 py-2 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating...' : 'Create Category'}
        </button>
      </form>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-950 mb-6">📃 Existing Categories</h2>
        {categories.length === 0 && !loading ? (
          <p className="text-gray-600">No categories found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-white border border-gray-200 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-950">{cat.name}</h3>
                  <p className="text-gray-700 mt-2">{cat.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteClick(cat)}
                  disabled={loading}
                  className={`bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded-lg transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-white/10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete {categoryToDelete?.name}?
            </h3>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;