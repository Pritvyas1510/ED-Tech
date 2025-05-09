import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AddSection = () => {
  const { courseId } = useParams();
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editSectionId, setEditSectionId] = useState(null);

  // New states for modal
  const [showModal, setShowModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/course/getSections/${courseId}`,
          { withCredentials: true }
        );
        setSections(data.data || []);
      } catch (error) {
        console.error("Error fetching sections:", error);
        toast.error("Failed to fetch sections.");
      }
    };
    fetchSections();
  }, [courseId]);

  const onSubmit = async (formData) => {
    setLoading(true);
    setError("");

    try {
      if (editMode) {
        const { data } = await axios.post(
          "http://localhost:3000/api/v1/course/updateSection",
          {
            sectionId: editSectionId,
            sectionName: formData.sectionName,
            courseId,
          },
          { withCredentials: true }
        );
        setSections(data.data.courseContent || []);
        toast.success("Section updated successfully");
        setEditMode(false);
        setEditSectionId(null);
      } else {
        const { data } = await axios.post(
          "http://localhost:3000/api/v1/course/addSection",
          { courseId, sectionName: formData.sectionName },
          { withCredentials: true }
        );
        const newSection = data.updatedCourseDetails.courseContent.slice(-1)[0];
        setSections((prev) => [...prev, newSection]);
        toast.success("Section added successfully");
      }

      reset();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to process request.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show modal instead of direct delete
  const handleDelete = (sectionId) => {
    setSectionToDelete(sectionId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/course/deleteSection",
        { sectionId: sectionToDelete, courseId },
        { withCredentials: true }
      );
      setSections(data.data.courseContent || []);
      toast.success("Section deleted successfully");
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Failed to delete section");
    } finally {
      setShowModal(false);
      setSectionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSectionToDelete(null);
  };

  const handleEdit = (section) => {
    reset({ sectionName: section.sectionName });
    setEditMode(true);
    setEditSectionId(section._id);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-lg mt-10 min-h-screen text-gray-900">
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
        >
          Section Manage
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-8 border-b border-gray-300 pb-2">
        {editMode ? "Edit Section" : "Manage Sections"}
      </h2>

      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
      {loading && <p className="text-gray-700 mb-4 font-medium">Processing...</p>}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 mb-10 bg-gray-50 p-6 rounded-lg shadow-md"
      >
        <div>
          <label className="block mb-2 font-medium text-gray-900">
            Section Name
          </label>
          <input
            {...register("sectionName", { required: true })}
            className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter section title"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {editMode ? "Update Section" : "Add Section"}
        </button>
      </form>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Existing Sections</h3>
        {sections.length === 0 ? (
          <p className="text-gray-600 font-medium">No sections added yet.</p>
        ) : (
          <ul className="space-y-3">
            {sections.map((section) => (
              <li
                key={section._id}
                className="bg-gray-50 text-gray-900 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center"
              >
                <span>{section.sectionName}</span>
                <div className="space-x-3">
                  <button
                    onClick={() => handleEdit(section)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(section._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-white/10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete this section?
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

export default AddSection;
