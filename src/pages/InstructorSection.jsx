import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import ViewInstructors from './ViewInstructors';
const InstructorSection = () => {
  const [currentOperation, setCurrentOperation] = useState('view');

  return (
    <div>
      <br/>
      <AdminNavbar />
      <div className="manage-instructors-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div className="content">
          {currentOperation === 'view' && <ViewInstructors />}
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
