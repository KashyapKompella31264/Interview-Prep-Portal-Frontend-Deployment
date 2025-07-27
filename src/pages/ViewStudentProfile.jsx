import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import StudentNavbar from '../components/StudentNavbar';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit ,FiAlertTriangle } from 'react-icons/fi';

const ViewStudentProfile = () => {
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const token=localStorage.getItem("token");
  const jwtdecode=jwtDecode(token);
  const studentId=jwtdecode.id;
  useEffect(() => {
    const fetchProfile = async () => {
      try {

        const response = await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/${studentId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        setError('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  const handlesave = async () =>{
    try{
      const res=await fetch(`https://interview-prep-portal-backend-application.onrender.com/student/updatestudent/${studentId}`,{
        method:'PUT',
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json",
        },
        body:JSON.stringify(profile),
      });
      if(res.ok){
        const updatestedProfile=await res.json();
        setProfile(updatestedProfile);
        setEditing(false);
      }else{
        setError('Failed to update profile');
      }
    }catch(error){
      alert(error);
    }
  };
  return (
    <div className="profile-container">
      <StudentNavbar />
      
      <main className="profile-content">
        <div className="profile-header">
          <h1>
            Student Profile
            <span className="header-underline"></span>
          </h1>
          {error && (
            <div className="error-message">
              {/* <FiAlertTriangle />  */}{error}
            </div>
          )}
        </div>

        {loading ? (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading profile...</p>
  </div>
) : profile && (
  <div className="profile-card">
    <div className="profile-section">
      <div className="profile-avatar">
        {profile.name && profile.name[0]}
      </div>
      <div className="profile-info">
        {editing ? (
          <>
            
          </>
        ) : (
          <h2 className="profile-name">
            {profile.name}
            <span className="profile-age">, {profile.age}</span>
          </h2>
        )}
        <p className="profile-id">Student ID: #{profile.id}</p>
      </div>
    </div>

    <div className="details-grid">
      <div className="detail-item">
        <FiUser className="detail-icon" />
        <div>
          <label>Full Name</label>
          {editing ? (
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="input-field"
            />
          ) : (
            <p>{profile.name || 'Not specified'}</p>
          )}
        </div>
      </div>
      <div className='detail-item'>
        <div>
        <label>Age</label>
            {editing?(
              <input
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              className="input-field small"
            />
            ):(
              <p>{profile.age}</p>
            )}
        </div>
      </div>
      <div className="detail-item">
        <FiMail className="detail-icon" />
        <div>
          <label>Email Address</label>
          {editing ? (
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="input-field"
            />
          ) : (
            <p>{profile.email}</p>
          )}
        </div>
      </div>

      <div className="detail-item">
        <FiPhone className="detail-icon" />
        <div>
          <label>Phone Number</label>
          {editing ? (
            <input
              type="text"
              value={profile.phno}
              onChange={(e) => setProfile({ ...profile, phno: e.target.value })}
              className="input-field"
            />
          ) : (
            <p>{profile.phno || 'Not provided'}</p>
          )}
        </div>
      </div>

      <div className="detail-item">
        <FiMapPin className="detail-icon" />
        <div>
          <label>Address</label>
          {editing ? (
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="input-field"
            />
          ) : (
            <p>{profile.address || 'No address on file'}</p>
          )}
        </div>
      </div>
    </div>

    <button className="edit-button" onClick={editing ? handlesave : () => setEditing(true)} >
      {editing ? 'Save' : <><FiEdit /> Edit Profile</>}
    </button>
  </div>
)}

      </main>
    </div>
  );
};

export default ViewStudentProfile;
