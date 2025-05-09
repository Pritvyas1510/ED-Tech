import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const StudentCourse = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/course/getFullCourseDetails",
          { courseId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourse(response.data.data.courseDetails);
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast.error("Failed to load course details");
      }
    };

    const fetchCourseProgress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/profile/getCourseProgress/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCompletedVideos(response.data.completedVideos || []);
      } catch (error) {
        console.error("Error fetching course progress:", error);
        toast.error("Failed to load course progress");
      }
    };

    fetchCourseDetails();
    fetchCourseProgress();
  }, [courseId]);

  const handleVideoEnded = async () => {
    if (!selectedVideo) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/course/updateCourseProgress",
        {
          courseId,
          subsectionId: selectedVideo._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.message) {
        // Only update completedVideos after successful backend confirmation
        setCompletedVideos((prev) => {
          if (!prev.includes(selectedVideo._id)) {
            return [...prev, selectedVideo._id];
          }
          return prev;
        });
        toast.success("Course progress updated successfully!");
      }
    } catch (error) {
      console.error("Error updating course progress:", error);
      if (error.response?.data?.error === "Subsection already completed") {
        toast("This video is already marked as completed.", {
          icon: "ℹ️",
        });
      } else if (error.response?.data?.message === "Course progress Does Not Exist") {
        toast.error("Course progress not found. Please contact support.");
      } else {
        toast.error("Failed to update course progress.");
      }
    }
  };

  if (!course) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading Course Details...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {course.courseName}
      </h1>
      <img
        src={course.thumbnail}
        alt="Course"
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="text-gray-700 mb-6">{course.courseDescription}</p>

      <div className="space-y-4">
        {course.courseContent.map((section) => (
          <div key={section._id} className="border rounded-lg p-4 bg-gray-50">
            <button
              onClick={() =>
                setActiveSection(
                  activeSection === section._id ? null : section._id
                )
              }
              className="text-lg font-semibold text-left w-full"
            >
              {section.sectionName}
            </button>

            {activeSection === section._id && (
              <div className="mt-2 space-y-2 ml-4">
                {section.subSection.map((sub) => (
                  <div
                    key={sub._id}
                    onClick={() => {
                      setActiveSubSection(sub._id);
                      setSelectedVideo(sub);
                    }}
                    className={`cursor-pointer p-2 rounded-lg flex items-center ${
                      activeSubSection === sub._id
                        ? "bg-blue-100"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <span className="mr-2">
                      {completedVideos.includes(sub._id) ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        "🎥"
                      )}
                    </span>
                    {sub.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="mt-8 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
          <p className="text-gray-600 mb-2">{selectedVideo.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            Duration: {selectedVideo.timeDuration} sec
          </p>
          <video
            src={selectedVideo.videoUrl}
            controls
            controlsList="nodownload"
            onEnded={handleVideoEnded}
            className="w-full max-h-[400px] rounded"
          />
        </div>
      )}
    </div>
  );
};

export default StudentCourse;