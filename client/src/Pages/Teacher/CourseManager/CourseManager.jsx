import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CourseManager = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/course/getInstructorCourses', {
          withCredentials: true,
        });
        setCourses(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error.response ? error.response.data : error.message);
        setError('Failed to fetch courses.');
        toast.error('Failed to fetch courses.');
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading courses...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Courses</h1>
      <button
        onClick={() => navigate('/createcourses')}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mb-4"
      >
        Create New Course
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => navigate(`/courses/${course._id}`)}
          >
            <img src={course.thumbnail} alt={course.courseName} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{course.courseName}</h2>
              <p className="text-gray-600">{course.courseDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManager;