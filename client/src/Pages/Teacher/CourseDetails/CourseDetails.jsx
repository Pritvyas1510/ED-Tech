import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [subsectionInputs, setSubsectionInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [subsectionLoading, setSubsectionLoading] = useState({});
  const [error, setError] = useState('');
  const [editingSubsection, setEditingSubsection] = useState(null);

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const response = await axios.post(`http://localhost:3000/api/v1/course/getCourseDetails`, { courseId: id });
        setCourse(response.data.data.courseDetails);
        setSections(response.data.data.courseDetails.courseContent);
      } catch (error) {
        console.error('Error fetching course details:', error.response?.data || error.message);
        setError('Failed to fetch course details.');
      } finally {
        setLoading(false);
      }
    }
    fetchCourseDetails();
  }, [id]);

  const handleSubsectionInputChange = (sectionId, field, value) => {
    setSubsectionInputs((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value },
    }));
  };

  const handleAddSubsection = async (sectionId) => {
    const inputs = subsectionInputs[sectionId] || {};
    if (!inputs.title?.trim() || !inputs.description?.trim() || !inputs.thumbnail || !inputs.video) {
      toast.error('All subsection fields are required.');
      return;
    }

    setSubsectionLoading((prev) => ({ ...prev, [sectionId]: true }));
    setError('');
    const formData = new FormData();
    formData.append('title', inputs.title);
    formData.append('sectionId', sectionId);
    formData.append('description', inputs.description);
    formData.append('video', inputs.video);
    formData.append('thumbnail', inputs.thumbnail);

    try {
      const response = await axios.post(`http://localhost:3000/api/v1/course/addSubSection`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      const updatedSection = response.data.data;
      setSections(sections.map((section) => (section._id === sectionId ? updatedSection : section)));
      setSubsectionInputs((prev) => ({
        ...prev,
        [sectionId]: {
          title: '',
          description: '',
          thumbnail: null,
          video: null,
        },
      }));
      toast.success('Subsection added successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add subsection.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubsectionLoading((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleClearForm = (sectionId) => {
    setSubsectionInputs((prev) => ({
      ...prev,
      [sectionId]: { title: '', description: '', thumbnail: null, video: null },
    }));
  };

  const handleDeleteSubsection = async (subsectionId, sectionId) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/v1/course/deleteSubSection`, { subSectionId: subsectionId, sectionId }, {
        withCredentials: true,
      });
      const updatedSection = response.data.data;
      setSections(sections.map((section) => (section._id === sectionId ? updatedSection : section)));
      toast.success('Subsection deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete subsection.');
    }
  };

  const handleUpdateSubsection = async (subSectionId, sectionId) => {
    const inputs = subsectionInputs[sectionId] || {};
    if (!inputs.title?.trim() || !inputs.description?.trim()) {
      toast.error('Title and Description are required for update.');
      return;
    }

    setSubsectionLoading((prev) => ({ ...prev, [sectionId]: true }));
    setError('');
    const formData = new FormData();
    formData.append('subSectionId', subSectionId);
    formData.append('sectionId', sectionId);
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);

    try {
      const response = await axios.post(`http://localhost:3000/api/v1/course/updateSubSection`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      const updatedSection = response.data.data;
      setSections(sections.map((section) => (section._id === sectionId ? updatedSection : section)));
      setEditingSubsection(null);
      setSubsectionInputs((prev) => ({ ...prev, [sectionId]: {} }));
      toast.success('Subsection updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update subsection.';
      toast.error(errorMessage);
    } finally {
      setSubsectionLoading((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleEditSubsection = (subsection, sectionId) => {
    setEditingSubsection({ ...subsection, sectionId });
    setSubsectionInputs((prev) => ({
      ...prev,
      [sectionId]: {
        title: subsection.title,
        description: subsection.description,
        thumbnail: null, // File inputs can't be prefilled
        video: null, // File inputs can't be prefilled
      },
    }));
  };

  const handleUpdateCourse = () => {
    navigate(`/updatecources/${id}`, { state: { course } });
  };

  if (loading) return <p className="text-center text-black">Loading course details <span className="loading loading-dots loading-xl ml-2"></span></p>;
  if (!course) return <p className="text-center text-red-600">Course not found.</p>;

  return (
    <div className="container mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-4">
        {course.courseName}
        {course.status === 'Draft' && <span className="text-gray-600"> (Draft)</span>}
      </h1>
      <p className="text-gray-600 mb-4">{course.courseDescription}</p>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => navigate(`/add-section/${id}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
        >
          Add Another Section
        </button>
        <button
          onClick={handleUpdateCourse}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
        >
          Update Course
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Sections</h2>
      {sections.map((section) => (
        <div
          key={section._id}
          className="mb-8 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">{section.sectionName}</h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 ">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left font-semibold text-gray-700 border-b">Title</th>
                    <th className="p-3 text-left font-semibold text-gray-700 border-b">Description</th>
                    <th className="p-3 text-center font-semibold text-gray-700 border-b min-w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {section.subSection?.length > 0 ? (
                    section.subSection.map((sub) => (
                      <tr
                        key={sub._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="p-3  border-b text-gray-800">{sub.title}</td>
                        <td
                          className="p-3 border-b text-gray-600 truncate max-w-xs"
                          title={sub.description}
                        >
                          {sub.description}
                        </td>
                        <td className="p-3 border-b text-center">
                          <div className="flex justify-center items-center space-x-3 whitespace-nowrap">
                            <button
                              onClick={() => handleEditSubsection(sub, section._id)}
                              className="bg-amber-400 hover:bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteSubsection(sub._id, section._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="p-3 text-center text-gray-500 border-b"
                      >
                        No subsections yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="w-full lg:w-1/2 bg-gray-50 p-6 rounded-xl shadow-sm">
              {editingSubsection ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Subsection</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={subsectionInputs[section._id]?.title || ''}
                        onChange={(e) =>
                          handleSubsectionInputChange(section._id, 'title', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={subsectionInputs[section._id]?.description || ''}
                        onChange={(e) =>
                          handleSubsectionInputChange(section._id, 'description', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                        rows="4"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleUpdateSubsection(editingSubsection._id, section._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                      >
                        {subsectionLoading[section._id] ? (
                          <>
                            Updating... <span className="loading loading-spinner loading-sm ml-2"></span>
                          </>
                        ) : (
                          'Update Subsection'
                        )}
                      </button>
                      <button
                        onClick={() => setEditingSubsection(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Subsection</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={subsectionInputs[section._id]?.title || ''}
                        onChange={(e) =>
                          handleSubsectionInputChange(section._id, 'title', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={subsectionInputs[section._id]?.description || ''}
                        onChange={(e) =>
                          handleSubsectionInputChange(section._id, 'description', e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                        rows="4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleSubsectionInputChange(section._id, 'thumbnail', e.target.files[0])
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md file:mr-4 file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleSubsectionInputChange(section._id, 'video', e.target.files[0])
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md file:mr-4 file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAddSubsection(section._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center"
                        disabled={subsectionLoading[section._id]}
                      >
                        {subsectionLoading[section._id] ? (
                          <>
                            Adding... <span className="loading loading-spinner loading-sm ml-2"></span>
                          </>
                        ) : (
                          'Add Subsection'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseDetails;