import React, { useEffect, useState } from 'react';
import apiRequest from '../../../Axois/AxoisInstant';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userNameToDelete, setUserNameToDelete] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiRequest.get('/all-users');
      setUsers(res.data.users);
      console.log('Fetched users:', res.data.users); // Debug user list
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (id, userName) => {
    setUserToDelete(id);
    setUserNameToDelete(userName);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in localStorage');
      }

      await axios.delete(`http://localhost:3000/api/v1/profile/deleteUser/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success('User deleted successfully');
      await fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to delete user');
    } finally {
      setShowModal(false);
      setUserToDelete(null);
      setUserNameToDelete('');
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setUserToDelete(null);
    setUserNameToDelete('');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by role
  const admins = users.filter((user) => user.accountType === 'Admin');
  const instructors = users.filter((user) => user.accountType === 'Instructor');
  const students = users.filter((user) => user.accountType === 'Student');

  // Reusable table component for rendering users
  const UserTable = ({ title, users }) => (
    <div className="mb-8">
      <h2 className="text-4xl text-center font-extrabold text-blue-600 mt-10 mb-5">{title}</h2>
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto text-black">
        {users.length === 0 ? (
          <p className="text-gray-600">No {title.toLowerCase()} found.</p>
        ) : (
          <table className="w-full table-auto border border-gray-300 rounded-lg text-black">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border capitalize">{user.accountType}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() =>
                        handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:bg-red-300"
                      disabled={user.accountType === 'Admin' && admins.length === 1}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <p className="text-4xl font-bold text-black mb-6">All Registered Users</p>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : (
        <div>
          <UserTable title="Admins" users={admins} />
          <UserTable title="Instructors" users={instructors} />
          <UserTable title="Students" users={students} />
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-white/10 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete {userNameToDelete}?
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

export default AllUsers;