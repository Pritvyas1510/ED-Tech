import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import apiRequest from '../../../Axois/AxoisInstant';

const Adminhome = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const res = await apiRequest.get('/get-instructors');
      setInstructors(res.data.instructors || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (instructorId) => {
    try {
      await apiRequest.put(`/approve-instructor/${instructorId}`);
      toast.success('Instructor approved successfully');
      fetchInstructors();
    } catch (error) {
      console.error('Error approving instructor:', error);
      toast.error('Failed to approve instructor');
    }
  };

  const handleRemoveApproval = async (instructorId) => {
    try {
      await apiRequest.put(`/remove-instructor-approval/${instructorId}`);
      toast.success('Instructor approval removed successfully');
      fetchInstructors();
    } catch (error) {
      console.error('Error removing instructor approval:', error);
      toast.error('Failed to remove instructor approval');
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <div className="p-6">
      <p className="text-4xl font-bold text-black mb-6">Admin </p>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-black mb-4">Instructor Approvals</h2>

        {loading ? (
          <p className="text-gray-500">Loading instructors...</p>
        ) : instructors.length === 0 ? (
          <p className="text-gray-500">No instructors found.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300 text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor._id} className="text-black">
                  <td className="border border-gray-300 p-2">
                    {instructor.firstName || ''} {instructor.lastName || ''}
                  </td>
                  <td className="border border-gray-300 p-2">{instructor.email}</td>
                  <td className="border border-gray-300 p-2">
                    {instructor.approved ? (
                      <span className="text-green-700 font-semibold">Approved</span>
                    ) : (
                      <span className="text-yellow-700 font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 ">
                    {instructor.approved ? (
                      <button
                        onClick={() => handleRemoveApproval(instructor._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Remove Approval
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(instructor._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Adminhome;