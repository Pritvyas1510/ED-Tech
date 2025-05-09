import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";

const CourseLectures = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/course/getFullCourseDetails",
        { courseId },
        { withCredentials: true }
      );
      console.log("Course Details:", response.data);
      setCourse(response.data.data?.courseDetails);
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const playVideo = (lecture) => {
    if (lecture.videoUrl) {
      setSelectedLecture({
        videoUrl: lecture.videoUrl,
        title: lecture.title || "Untitled Lecture",
        description: lecture.description || "No description available",
      });
    } else {
      alert("Video URL not available for this lecture.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl font-semibold text-gray-800 flex items-center">
          Loading Lectures... <span className="loading loading-spinner loading-sm ml-2"></span>
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-semibold text-red-500">Course not found</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 bg-gray-100 p-4 h-screen overflow-y-auto shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{course?.courseName}</h2>
        <ul className="space-y-3">
          {course.courseContent?.length > 0 ? (
            course.courseContent.map((section, index) => (
              <li key={section._id || index}>
                <button
                  className="flex items-center justify-between w-full p-2 bg-white rounded shadow text-left text-gray-800 hover:bg-gray-50"
                  onClick={() => toggleDropdown(index)}
                >
                  {section.sectionName || "Untitled Section"}
                  {openIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openIndex === index && (
                  <ul className="mt-2 ml-4 space-y-2">
                    {section.subSection?.length > 0 ? (
                      section.subSection.map((lecture) => (
                        <li
                          key={lecture._id}
                          className="text-sm text-gray-700 cursor-pointer hover:underline"
                          onClick={() => playVideo(lecture)}
                        >
                          {lecture.title || "Untitled Lecture"}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500 italic">No lectures available</li>
                    )}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">No course content available</li>
          )}
        </ul>
      </aside>

      <main className="flex-1 p-3 bg-gray-50">
        {selectedLecture ? (
          <div className="w-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 ">
              {selectedLecture.title}
            </h3>
            <div className="w-full h-[570px]">
              <video
                src={selectedLecture.videoUrl}
                title="Selected Lecture Video"
                controls
                controlsList="nodownload"
                className="w-full h-full rounded-lg shadow-lg"
                onContextMenu={(e) => e.preventDefault()}
              ></video>
            </div>
            <p className="mt-4 text-gray-600">{selectedLecture.description}</p>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center justify-center h-full">
            <h1 className="text-5xl font-bold text-gray-700">
              Welcome to <span className="text-orange-500">Ed</span> Tech
            </h1>
            <p className="mt-4 text-lg text-gray-500">Select a lecture from the left to begin learning.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseLectures;