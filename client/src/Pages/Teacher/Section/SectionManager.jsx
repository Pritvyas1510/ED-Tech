import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    let userEmail = null;
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        userEmail = parsedUser.email || null;
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
    console.log('User email:', userEmail);
    setUserName(userEmail);

    async function fetchCourses() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/v1/course/getAllCourses', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log('Courses:', response.data.data);
        setCourses(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error.response ? error.response.data : error.message);
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleDeleteClick = (courseId) => {
    setCourseToDelete(courseId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to delete a course.');
        setShowModal(false);
        return;
      }
      console.log('Deleting course:', courseToDelete);
      const response = await axios.delete('http://localhost:3000/api/v1/course/deleteCourse', {
        data: { courseId: courseToDelete },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Delete response:', response.data);
      if (response.data.success) {
        setCourses(courses.filter(course => course._id !== courseToDelete));
        toast.success('Course deleted successfully!');
      } else {
        toast.error('Failed to delete course: ' + response.data.message);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting course:', error.response ? error.response.data : error.message);
      toast.error('Failed to delete course: ' + (error.response?.data?.message || 'Server error'));
      setShowModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setCourseToDelete(null);
  };

  if (loading) return <p>Loading courses...</p>;

  const filteredCourses = userName
    ? courses.filter(course => course.instructor?.email === userName || course.createdBy === userName)
    : [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-black mb-4">Your Courses</h1>
      {filteredCourses.length === 0 ? (
        <p>{userName ? 'No courses found.' : 'Please log in to view your courses.'}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">
          {filteredCourses.map(course => (
            <div key={course._id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
              <Link to={`/courses/${course._id}`}>
                <img
                  src={course.thumbnail || 'https://via.placeholder.com/150'}
                  alt={course.courseName}
                  className="w-38 justify-self-center object-cover"
                />
                <div className="p-4 flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800">{course.courseName}</h2>
                  <p className="text-gray-600">{course.courseDescription}</p>
                </div>
              </Link>
              <div className="p-4 mt-auto">
                <button
                  onClick={() => handleDeleteClick(course._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none w-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800">Are you sure you want to delete this course?</h3>
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

export default CourseList;