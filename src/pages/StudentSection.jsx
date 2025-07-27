import AdminNavbar from '../components/AdminNavbar';
import { useState } from 'react';
import ViewStudents from './ViewStudents';

const StudentSection = () => {
  const [currentOperation, setCurrentOperation] = useState('view');
  
  return (
    <div>
      <br/>
      <AdminNavbar />
      <div className="manage-students-container">
        

        {/* Main Content */}
        <div className="content" >
          {currentOperation === 'view' && <ViewStudents/>}
        </div>
      </div>
    </div>
  );
};

export default StudentSection;
