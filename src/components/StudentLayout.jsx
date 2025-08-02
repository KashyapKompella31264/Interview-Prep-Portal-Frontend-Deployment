// src/components/StudentLayout.jsx
import React from 'react';
import StudentNavbar from './StudentNavbar';

const StudentLayout = ({ title, children }) => {
  return (
    <div>
      <StudentNavbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6 border-b pb-2">{title}</h1>
        <div className="bg-white shadow-md rounded-lg p-4">{children}</div>
      </div>
    </div>
  );
};

export default StudentLayout;
