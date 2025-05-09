import React from 'react';
import {
  GraduationCap,
  Settings,
  Rocket,
  Mail,
  User
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 py-14 px-6 md:px-20">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-10 md:p-16 space-y-12">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-blue-700 font-serif mb-4">About Ed Tech</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A modern learning platform for Students, Teachers, and Admins — making learning seamless, teaching effective, and managing effortless.
          </p>
        </div>

        {/* Mission */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Rocket className="text-pink-500" size={24} /> Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            At <span className="font-semibold text-blue-700">Ed Tech</span>, our mission is to empower students with knowledge, equip teachers with modern tools, and enable admins to manage efficiently — creating a seamless ecosystem for everyone.
          </p>
        </div>

        {/* Roles */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <GraduationCap className="text-green-500" size={24} /> Platform Roles
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Student */}
            <div className="border border-blue-100 rounded-xl p-6 bg-blue-50 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-3">
                <GraduationCap size={20} /> Students
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Explore diverse teacher-uploaded courses</li>
                <li>Purchase access to premium content</li>
                <li>Track progress, complete quizzes & earn certificates</li>
                <li>Enjoy a personalized learner dashboard</li>
              </ul>
            </div>

            {/* Teacher */}
            <div className="border border-green-100 rounded-xl p-6 bg-green-50 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2 mb-3">
              <User size={20} /> Instructor
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Upload structured, high-quality content</li>
                <li>Engage with learners via feedback tools</li>
                <li>Monitor student activity and course analytics</li>
                <li>Build your educator brand</li>
              </ul>
            </div>

            {/* Admin */}
            <div className="border border-red-100 rounded-xl p-6 bg-red-50 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-red-600 flex items-center gap-2 mb-3">
                <Settings size={20} /> Admins
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Approve Instructor and moderate content</li>
                <li>Manage users and platform security</li>
                <li>Oversee video uploads and roles</li>
                <li>Analyze performance and generate reports</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Rocket className="text-yellow-500" size={24} /> Why Choose Ed Tech?
          </h2>
          <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
            <li>Role-based access for smooth navigation</li>
            <li>Secure payment & certificate issuing system</li>
            <li>Interactive dashboards for all users</li>
            <li>Responsive UI built with React & Tailwind CSS</li>
            <li>Video-centric, practical learning experience</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Mail className="text-blue-500" size={24} /> Contact Us
          </h2>
          <p className="text-gray-700">
            Have questions or feedback? Reach out to us at{' '}
            <a href="mailto:support@edtech.com" className="text-blue-600 font-medium hover:underline">
              support@edtech.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
