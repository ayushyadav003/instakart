import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiConfig } from '../../services/ApiConfig';
import { ApiWithToken } from '../../services/ApiWithToken';
import { toast, ToastContainer } from 'react-toastify';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [verfiedForm,setVerfiedForm] = useState({
    BankVerified: false,
    documentVerified: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`${apiConfig.getSingleUser}/${userId}`);
        const resData = userResponse?.data;
        setUserData(resData);
        setVerfiedForm({
          BankVerified: resData.BankVerified,
          documentVerified: resData.documentVerified,
        });
        console.log('Profile data:', resData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally set an error state to display an error message
      }
    };
    fetchUserData();
  }, [userId]);

  const handleSelectChange = (field, value) => {
    console.log(field, value, 'field');
  
    // Convert string to boolean if the field is a boolean type
    const parsedValue = value === 'true' ? true : value === 'false' ? false : value;
    console.log(parsedValue, 'parsedValue');  
    setUserData((prevData) => ({
      ...prevData,
      [field]: parsedValue,
    }));
  };
  
  const handleSave = async () => {
      setIsEditing(false);
      toast.success("Profile Information Updated!");
     console.log(userData,'userData');
      try {
        const apiOptions = {
          url: `${apiConfig.updateProfileAdmin}/${userId}`,
          method: "PUT",
          data: {
            BankVerified:userData.BankVerified,
            documentVerified:userData.documentVerified},
        };

        console.log("API Options:", apiOptions);
  
        await ApiWithToken(apiOptions);
      } catch (error) {
        console.error("Failed to update profile:", error);
        toast.error("Failed to update profile information.");
      }
    };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="user-info-header">
        <div className="profile-icon">
          <span>{userData.fullName?.charAt(0).toUpperCase()}</span>
        </div>
        <div className="user-details">
          <h2 className="user-name">{userData.fullName}</h2>
          <p className="user-contact">{userData.mobile}</p>
          <p className="user-contact">{userData.email}</p>
        </div>
      </div>

      <div className="tab-container">
        <button
          className={activeTab === 'personal' ? 'active' : ''}
          onClick={() => setActiveTab('personal')}
        >
          Personal Information
        </button>
        <button
          className={activeTab === 'bank' ? 'active' : ''}
          onClick={() => setActiveTab('bank')}
        >
          Bank Details
        </button>
        <button
          className={activeTab === 'documents' ? 'active' : ''}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
      </div>

      <div className="information-section">
        {activeTab === 'personal' && (
          <div className="grid-container">
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={userData.fullName} readOnly />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={userData.email} readOnly />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={userData.mobile} readOnly />
            </div>
            <div className="form-group">
              <label>Business Name</label>
              <input type="text" value={userData.businessName || 'N/A'} readOnly />
            </div>
            <div className="form-group">
              <label>Bank Verified</label>
              <select
                value={userData.BankVerified}
                onChange={(e) => handleSelectChange('BankVerified', e.target.value)}
                disabled={!isEditing}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div className="form-group">
              <label>Document Verified</label>
              <select
                value={userData.documentVerified}
                onChange={(e) => handleSelectChange('documentVerified', e.target.value === 'true')}
                disabled={!isEditing}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'bank' && userData.bankDetails && (
          <div className="grid-container">
            <div className='form-group'>
              <label>Account Number</label>
              <input type="text" value={userData.bankDetails.accountNumber || 'N/A'} readOnly />
            </div>
            <div className='form-group'>
              <label>Account type</label>
              <input type="text" value={userData.bankDetails.accountType || 'N/A'} readOnly />
            </div>
            <div className='form-group'>
              <label>Bank Name</label>
              <input type="text" value={userData.bankDetails.bankName || 'N/A'} readOnly />
            </div>
            <div className='form-group'>
              <label>Beneficiary Name</label>
              <input type="text" value={userData.bankDetails.beneficiaryName || 'N/A'} readOnly />
            </div>
            <div className='form-group'>
              <label>IFSC</label>
              <input type="text" value={userData.bankDetails.ifsc || 'N/A'} readOnly />
            </div>
          </div>
        )}

        {activeTab === 'documents' && userData.documents && (
          <div className="grid-container document-grid">
            <div className='form-group'>
              <label>GST Number</label>
              <input type="text" value={userData.documents.gstNumber || 'N/A'} readOnly />
            </div>
            <div className='form-group'>
              <label>PAN Number</label>
              <input type="text" value={userData.documents.panNumber || 'N/A'} readOnly />
            </div>

            <div className='form-group'>
              <label>GST Image</label>
              <img src={userData.documents.gstImage || 'N/A'}  />
            </div>

            <div className='form-group'>
              <label>PAN Image</label>
              <img src={userData.documents.panImage || 'N/A'} />
            </div>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="button-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="button-container">
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}

<ToastContainer limit={1} position="bottom-right" autoClose={3000} />

    </div>
  );
};

export default UserProfile;