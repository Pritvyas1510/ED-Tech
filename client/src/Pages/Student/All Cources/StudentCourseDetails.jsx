import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../AuthContex/AuthContex';

const StudentCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const response = await axios.post(`http://localhost:3000/api/v1/course/getCourseDetails`, { courseId: id });
        if (response.data.data.courseDetails.status !== 'Published') {
          throw new Error('Course is not published');
        }
        setCourse(response.data.data.courseDetails);
        setSections(response.data.data.courseDetails.courseContent);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error.response ? error.response.data : error.message);
        setError('Course not found or not published.');
        setLoading(false);
      }
    }
    fetchCourseDetails();
  }, [id]);

  const handleBuyNow = async () => {
    if (!user) {
      navigate(`/login?redirect=/student/courses/${id}`);
      return;
    }
    if (!isStudent) {
      toast.error('Only students can purchase courses.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`http://localhost:3000/api/v1/payment/capturePayment`, { coursesId: [id] }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const { message: order } = response.data;
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create payment order');
      }
      const razorpayKey = import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay key is missing. Please check .env configuration.');
      }
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please check the script in index.html.');
      }
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'EdTech Platform',
        description: `Purchase of ${course.courseName}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(`http://localhost:3000/api/v1/payment/verifyPayment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              coursesId: [id],
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (verifyResponse.data.success) {
              toast.success('Course purchased successfully!');
              navigate('/mycourses');
            } else {
              toast.error(verifyResponse.data.message || 'Payment verification failed.');
            }
          } catch (error) {
            toast.error(error.response?.data?.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.contactNumber || '',
        },
        theme: { color: '#4f46e5' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      const errorMessage = error.response?.status === 404
        ? 'Payment endpoint not found. Please check if the backend server is configured correctly.'
        : error.response?.data?.message || error.message || 'Failed to initiate payment. Please check if the server is running.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <p className="text-center text-black">Loading course details <span className="loading loading-dots loading-xl ml-2"></span></p>;
  if (!course) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-xl overflow-hidden">
        <div className='grid grid-cols-2 grid-rows-1'>

        <div className="p-14">
            <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 mb-2">{course.courseName}</h1>
            <h2 className="text-2xl font-bold text-black mb-4 mt-10">Courses Details</h2>
            <p className="text-gray-600 mb-4 text-justify">{course.courseDescription}</p>
          </div>
        <div className="relative">
          <img
            src={course.thumbnail || 'https://picsum.photos/1200/400?text=Course+Thumbnail'}
            alt={course.courseName}
            className="w-[400px] justify-self-end object-cover mx-10 my-5"
          />
          
        
        </div>
        </div>

        <div className="p-8 md:p-12">
          {error && <p className="text-red-600 mb-6">{error}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-black mb-4">What You'll Learn</h2>
              <p className="text-gray-600 mb-4">{course.courseDescription}</p>
             
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
           
            <h1 className="text-xl md:text-xl font-semibold text-gray-800 mb-2 capitalize">purchase Your {course.courseName} Courses</h1>
              <p className="text-2xl font-bold text-black my-4">Price: ₹{course.price}</p>
              <button
                onClick={handleBuyNow}
                disabled={loading}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Buy Now'}
              </button>
              
            </div>
          </div>

          <h2 className="text-2xl font-bold text-black mb-6">Course Content</h2>
          {sections.length === 0 ? (
            <p className="text-gray-600">No sections available yet.</p>
          ) : (
            sections.map((section) => (
              <div key={section._id} className="mb-6 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-black mb-4">{section.sectionName}</h3>
                <div className="space-y-4">
                  {section.subSection && section.subSection.length > 0 ? (
                    section.subSection.map((subsection) => (
                      <div key={subsection._id} className="border-l-4 border-indigo-500 pl-4">
                        <p className="text-lg font-medium text-black">{subsection.title}</p>
                        <p className="text-gray-600 mb-2">{subsection.description}</p>
                        {subsection.thumbnail && (
                          <img
                            src={subsection.thumbnail}
                            alt={subsection.title}
                            className="w-48 h-28 object-cover rounded-lg mb-2"
                          />
                        )}
                        {subsection.videoUrl && (
                          <video
                            src={subsection.videoUrl}
                            controls
                            className="w-full max-w-lg rounded-lg"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No subsections available.</p>
                  )}
                </div>
              </div>
            ))
          )}
          <div className='justify-self-end text-2xl'>
          {course.instructor && (
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Instructor:</span> {course.instructor.firstName} {course.instructor.lastName}
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseDetails;
