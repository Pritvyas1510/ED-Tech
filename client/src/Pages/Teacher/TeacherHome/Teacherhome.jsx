import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Teacherhome = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/profile/instructorDashboard',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        console.log(response);
        
        const dashboardCourses = response.data.courses;
  
        // Fetch additional course details for each course
        const enrichedCourses = await Promise.all(
          dashboardCourses.map(async (course) => {
            try {
              const fullDetailsRes = await axios.post(
                'http://localhost:3000/api/v1/course/getFullCourseDetails',
                { courseId: course._id },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );
              console.log(fullDetailsRes);
              
              const fullDetails = fullDetailsRes.data.data.courseDetails;
              return {
                ...course,
                thumbnail: fullDetails.thumbnail,
                instructor: fullDetails.instructor,
                createdAt: fullDetails.createdAt,
                price: fullDetails.price,
              };
            } catch (error) {
              console.error(`Failed to fetch full details for course ${course._id}`, error);
              return course;
            }
          })
        );
  
        setCourses(enrichedCourses);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 text-xl">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 border-b pb-3">
        👨‍🏫 Instructor Dashboard
      </h1>

      {courses.length === 0 ? (
        <p className="text-gray-700 text-lg">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg transition duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {course.courseName}
              </h2>
              <p className="text-gray-600 mb-4">
                {course.courseDescription?.slice(0, 100)}...
              </p>
              <div className="text-sm space-y-2">
                <p className="text-gray-700">
                  📚 <span className="font-medium">Students Enrolled:</span>{' '}
                  {course.totalStudentsEnrolled}
                </p>
                <p className="text-gray-700">
                  💰 <span className="font-medium">Revenue:</span> ₹
                  {course.totalAmountGenerated}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(course)}
                className="mt-4 inline-block text-blue-600 font-semibold hover:underline"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-white/10 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-4 relative">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-lg"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {selectedCourse.courseName}
            </h2>

            <img
              src={selectedCourse.thumbnail}
              alt="Course Thumbnail"
              className="w-48 justify-self-center object-cover rounded mb-3"
            />

            <p className="text-gray-700 text-sm mb-3">{selectedCourse.courseDescription}</p>

            <div className="text-gray-800 space-y-1 mb-3">
              <p>👤 <strong>Instructor:</strong> {selectedCourse.instructor?.firstName} {selectedCourse.instructor?.lastName}</p>
              <p>💰 <strong>Price:</strong> ₹{selectedCourse.price}</p>
              <p>👥 <strong>Total Students:</strong> {selectedCourse.totalStudentsEnrolled || "N/A"}</p>
              <p>📈 <strong>Total Revenue:</strong> ₹{selectedCourse.totalAmountGenerated || "N/A"}</p>
              <p>📅 <strong>Created At:</strong> {new Date(selectedCourse.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teacherhome;