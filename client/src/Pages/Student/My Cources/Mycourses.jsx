import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/profile/getEnrolledCourses`,
        { withCredentials: true }
      );
      setEnrolledCourses(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
      setError("Failed to load enrolled courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fallbackCourseImage = "https://picsum.photos/300/200?text=Course+Thumbnail";
  const fallbackInstructorImage = "https://picsum.photos/40/40?text=Instructor";
  if (loading) {
    return (
      <div className="all-course-container max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-600" style={{ color: "#4f46e5 !important" }}>
          My Enrolled Courses
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-xl overflow-hidden">
              <div className="w-full h-48 bg-gray-300" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-300 rounded w-1/4" />
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-gray-300 rounded-full" />
                    <div className="h-4 bg-gray-300 rounded w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="all-course-container max-w-7xl mx-auto px-4 py-12" style={{ color: "#000000 !important" }}>
      <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-600" style={{ color: "#4f46e5 !important" }}>
        My Enrolled Courses
      </h1>

      {error && (
        <p className="text-red-600 text-center mb-6 font-medium" style={{ color: "#dc2626 !important" }}>{error}</p>
      )}

      {enrolledCourses.length === 0 ? (
        <p className="text-center text-gray-600 text-xl" style={{ color: "#4b5563 !important" }}>
          You have not enrolled in any courses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <Link
              key={course._id}
              to={`/mycourses/${course._id}`}
              className="group bg-white shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div className="relative">
                <img
                  src={course.thumbnail || fallbackCourseImage}
                  alt={course.courseName || "Course thumbnail"}
                  className="w-80 justify-self-center object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => (e.target.src = fallbackCourseImage)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-black mb-2 line-clamp-1" style={{ color: "#000000 !important" }}>
                  {course.courseName}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2" style={{ color: "#4b5563 !important" }}>
                  {course.courseDescription}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-indigo-600" style={{ color: "#4f46e5 !important" }}>
                    Lessons: {course.courseContent?.length || 0}
                  </span>

                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;