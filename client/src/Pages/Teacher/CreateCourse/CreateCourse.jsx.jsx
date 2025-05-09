import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/v1/course/showAllCategories");
        setCategories(data.data);
      } catch (err) {
        console.error("Error fetching categories", err);
        setError("Unable to fetch categories. Please try again later.");
      }
    };
    fetchCategories();
  }, []);

  const handleTagAdd = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("courseName", data.courseName);
    formData.append("courseDescription", data.courseDescription);
    formData.append("whatYouWillLearn", data.whatYouWillLearn);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("status", data.status || "Draft");
    formData.append("instructions", data.instructions ? data.instructions.split(",").map((i) => i.trim()) : []);
    formData.append("tag", JSON.stringify(tags)); // Send tags as JSON string
    if (thumbnail) formData.append("thumbnailImage", thumbnail);

    try {
      const response = await axios.post("http://localhost:3000/api/v1/course/createCourse", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const createdCourse = response.data.data; // Correctly extract course
      toast.success("Course created successfully!");
      reset();
      setTags([]);
      setThumbnail(null);
      setPreview("");
      navigate(`/add-section/${createdCourse._id}`);
    } catch (error) {
      console.error("Error creating course:", error.response?.data || error);
      const errorMessage = error.response?.data?.message || "Course creation failed.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-black mb-8 border-b pb-2">Create a New Course</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-600 mb-4">Creating course...</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-black">Course Name</label>
            <input
              {...register("courseName", { required: true })}
              className="w-full border border-gray-300 bg-white text-black placeholder-gray-500 rounded-lg p-3"
              placeholder="e.g. Mastering React"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-black">Price</label>
            <input
              {...register("price", { required: true })}
              type="number"
              className="w-full border border-gray-300 bg-white text-black placeholder-gray-500 rounded-lg p-3"
              placeholder="e.g. 999"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-black">Course Description</label>
          <textarea
            {...register("courseDescription", { required: true })}
            className="w-full border border-gray-300 bg-white text-black placeholder-gray-500 rounded-lg p-3"
            rows="3"
            placeholder="Give a short overview of your course"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-black">What Will Students Learn?</label>
          <textarea
            {...register("whatYouWillLearn", { required: true })}
            className="w-full border border-gray-300 bg-white text-black placeholder-gray-500 rounded-lg p-3"
            rows="3"
            placeholder="List outcomes or skills"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-black">Category</label>
            <select
              {...register("category", { required: true })}
              className="w-full border border-gray-300 bg-white text-black placeholder-gray-500 rounded-lg p-3"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-black">Status</label>
            <select
              {...register("status")}
              className="w-full border border-gray-300 bg-white text-black placeholder-gray-500 rounded-lg p-3"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-black">Tags</label>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            className="w-full border border-gray-300 bg-white text-black placeholder-gray-500 rounded-lg p-3"
            placeholder="Press Enter or comma to add a tag"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-black">Instructions</label>
          <input
            {...register("instructions")}
            className="w-full border border-gray-300 bg-white text-black placeholder-gray-500 rounded-lg p-3"
            placeholder="Separate with commas"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-black">Upload Thumbnail</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="border p-2 rounded-lg text-black"
            />
            {preview && <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg shadow" />}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;