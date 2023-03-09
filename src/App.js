import React, { useState,useEffect } from 'react';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import { saveAs } from 'file-saver';
import './App.css'

const App = () => {
  const [maxUsers,setMaxUsers] = useState(5);
  const [amount, setAmount] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [recievedAmount,setReceivedAmount] = useState('');
  const [paymentStatus,setPaymentStatus] = useState(false)

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userData, setUserData] = useState([])

  const fetchData=async()=>{
    const response = await fetch('https://get-excell-data.onrender.com/')
    const data = await response.json()
    setUserData(data)
  }

  useEffect(()=>{
    fetchData()
  },[])
  
  

  const handlePayment = async () => {
    try {
      const response = await axios.post('https://get-excell-data.onrender.com/pay', {
        amount: amount
      });
      
      if(response.data.clientSecret !== undefined){
        setPaymentStatus(true)
        setClientSecret(response.data.clientSecret);
        setReceivedAmount(response.data.amount)
      }
    } catch (err) {
      console.log(err);
    }
  };


  const handleUserSelect = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setSelectedUsers((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedUsers((prevSelected) =>
        prevSelected.filter((user) => user !== value)
      );
    }
  };

  const handleDownload = () => {
    // Convert selected users data to CSV format
    if(paymentStatus){
      const csvData = 'Full Name,Age,Gender,Date of Birth,Email Id,Mobile Number,Enterprenuer Type,Expeted CTC,Experience Letter,Highest Qualification,Key Skills,Languages,Present Location,Pincode\n'+selectedUsers
      .map((userId) => {
        const user = userData.find((u) => u.emailId === userId);
        
        return `${user.name},${user.age},${user.gender},${user.dob},${user.emailId},${user.mobileNum},${user.enterpreneurType},${user.expectedCtc},${user.experienceLetter},${user.highestQualification},${user.keySkills},${user.languages},${user.presentLocation},${user.pincode},`;
      })
      .join('\n');

    // Create a Blob object from the CSV data
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

    // Use FileSaver.js library to save the file
    saveAs(blob, 'users.csv');
    }else{
      alert('Please Pay to get data')
    }
   
  };

  const handleSelectAll = (e) => {
    if(e.target.checked){
    const allUserIds = userData.map((user) => user.emailId);
    setSelectedUsers(allUserIds);
    }else{
      setSelectedUsers([])
    }
  };
 
  const profileIconFemaleUrl = ('https://www.vhv.rs/dpng/d/426-4264903_user-avatar-png-picture-avatar-profile-dummy-transparent.png')
  const profileIconMaleUrl = ('https://www.366icons.com/media/01/profile-avatar-account-icon-16699.png')
  
  console.log(userData)
  console.log(selectedUsers)
  console.log(clientSecret)
  console.log(recievedAmount)
  console.log(paymentStatus)

  if(paymentStatus ){
    if(recievedAmount === '2'){
      return(
        <div className='App-header '>
          <h1 className='main-heading'>Download Users Data in Excel Format</h1>
          <h1>Payment of 2 Success </h1>
          <img src='https://img.freepik.com/premium-vector/transfer-money-concept-illustration_86047-117.jpg?w=740' alt='success-img' className='w-50'/>
          <div className='button-container'>
        <div>
          <input
            type="checkbox"
            checked={selectedUsers.length === userData.length}
            onChange={handleSelectAll}
          />
          <label>Export all Candiates dat to Excell</label>
        </div>
        <button onClick={handleDownload} disabled={!selectedUsers.length} className="button" >
          Get Excell Data
        </button>
      </div>
      {userData.map((user) => (
        <ul key={user.emailId} className="list-container">
          <div className='main-container'>
            <div className='left-card-container'>
              <div className='input-container'>
                <input
                  type="checkbox"
                  value={user.emailId}
                  checked={selectedUsers.includes(user.emailId)}
                  onChange={handleUserSelect}
                />
                <label>Export to Excell</label>
              </div>
              <div className='profile-container'>
                {user.gender === 'Male'?(<img src={profileIconMaleUrl} className='w-25' alt={user.name}/>):(<img src={profileIconFemaleUrl} className="w-25" alt={user.name}/>)}
                <h1 className='name'>{user.name}</h1>
                <div className='sub-div'>
                  <p className='p'>{user.gender}</p>
                  <p className='p'>{user.age}</p>
                  <p className='p'>{user.dob}</p>
                </div>
                <p className='mail'>{user.emailId}</p>
              </div>
            </div>
            <div className='right-card-container'>
              <div className='item-container'>
                <li className='li'>Full Name</li>
                <p className='sub-li'>[ {user.name} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Age</li>
                <p className='sub-li'>[ {user.age} ]</p> 
              </div>
              <div className='item-container'>
                <li className='li'>Gender</li>
                <p className='sub-li'>[ {user.gender} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Date of Birth</li>
                <p className='sub-li'>[ {user.dob} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Mail Id</li>
                <p className='sub-li'>[ {user.emailId} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Mobile Number</li>
                <p className='sub-li'>[ {user.mobileNum} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Enterprenuer Type</li>
                <p className='sub-li'>[ {user.enterpreneurType} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Expected CTC</li>
                <p className='sub-li'>[ {user.expectedCtc} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Experience Letter</li>
                <p className='sub-li'>[ {user.experienceLetter} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Highest Qualification</li>
                <p className='sub-li'>[ {user.highestQualification} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Key Skill</li>
                <p className='sub-li'>[ {user.keySkills} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Languages</li>
                <p className='sub-li'>[ {user.languages} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Present Location</li>
                <p className='sub-li'>[ {user.presentLocation} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Pincode</li>
                <p className='sub-li'>[ {user.pincode} ]</p>
              </div>
            </div>
          </div>
        </ul>
      ))}
        </div>
      )
    }
    if(recievedAmount === '1'){
      return(
        <div className='App-header '>
          <h1 className='main-heading'>Download Users Data in Excel Format</h1>
          <img src='https://img.freepik.com/premium-vector/transfer-money-concept-illustration_86047-117.jpg?w=740' alt='success-img' className='w-50'/>
          <div className='button-container'>
        <div>
          <input
            type="checkbox"
            checked={selectedUsers.length === userData.length}
            onChange={handleSelectAll}
          />
          <label>Export all Candiates dat to Excell</label>
        </div>
        <button onClick={handleDownload} disabled={!selectedUsers.length} className="button" >
          Get Excell Data
        </button>
      </div>
      {userData.map((user) => (
        <ul key={user.emailId} className="list-container">
          <div className='main-container'>
            <div className='left-card-container'>
              <div className='input-container'>
                <input
                  type="checkbox"
                  value={user.emailId}
                  checked={selectedUsers.includes(user.emailId)}
                  onChange={handleUserSelect}
                />
                <label>Export to Excell</label>
              </div>
              <div className='profile-container'>
                {user.gender === 'Male'?(<img src={profileIconMaleUrl} className='w-25' alt={user.name}/>):(<img src={profileIconFemaleUrl} className="w-25" alt={user.name}/>)}
                <h1 className='name'>{user.name}</h1>
                <div className='sub-div'>
                  <p className='p'>{user.gender}</p>
                  <p className='p'>{user.age}</p>
                  <p className='p'>{user.dob}</p>
                </div>
                <p className='mail'>{user.emailId}</p>
              </div>
            </div>
            <div className='right-card-container'>
              <div className='item-container'>
                <li className='li'>Full Name</li>
                <p className='sub-li'>[ {user.name} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Age</li>
                <p className='sub-li'>[ {user.age} ]</p> 
              </div>
              <div className='item-container'>
                <li className='li'>Gender</li>
                <p className='sub-li'>[ {user.gender} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Date of Birth</li>
                <p className='sub-li'>[ {user.dob} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Mail Id</li>
                <p className='sub-li'>[ {user.emailId} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Mobile Number</li>
                <p className='sub-li'>[ {user.mobileNum} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Enterprenuer Type</li>
                <p className='sub-li'>[ {user.enterpreneurType} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Expected CTC</li>
                <p className='sub-li'>[ {user.expectedCtc} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Experience Letter</li>
                <p className='sub-li'>[ {user.experienceLetter} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Highest Qualification</li>
                <p className='sub-li'>[ {user.highestQualification} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Key Skill</li>
                <p className='sub-li'>[ {user.keySkills} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Languages</li>
                <p className='sub-li'>[ {user.languages} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Present Location</li>
                <p className='sub-li'>[ {user.presentLocation} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Pincode</li>
                <p className='sub-li'>[ {user.pincode} ]</p>
              </div>
            </div>
          </div>
        </ul>
      ))}
        </div>
      )
    }
  }else{
    return (
      <div className='App-header '>
        <h1 className='main-heading'>Download Users Data in Excel Format</h1>
        <label>
          Amount (in rupees):
          <input type="number" 
          value={amount} 
          onChange={handleAmountChange} 
          placeholder="enter amount 1 or 2 rupees"
          className="amount"/>
        </label>
        <StripeCheckout
          stripeKey="pk_test_51MboFUSGJuyFqtziGcgR6PlblPb6Cyl5x8osGEdfjH4sxZ6QIkJ5HOVOta4cgh1a0bmSVxOo93cP1Dg7CqzwoO4E00Uds6N1Ai"
          token={handlePayment}
          amount={amount * 100}
          currency="INR"
        />
        <div className='button-container'>
        <div>
          <input
            type="checkbox"
            checked={selectedUsers.length === userData.length}
            onChange={handleSelectAll}
          />
          <label>Export all Candiates dat to Excell</label>
        </div>
        <button onClick={handleDownload} disabled={!selectedUsers.length} className="button" >
          Get Excell Data
        </button>
      </div>
      {userData.map((user) => (
        <ul key={user.emailId} className="list-container">
          <div className='main-container'>
            <div className='left-card-container'>
              <div className='input-container'>
                <input
                  type="checkbox"
                  value={user.emailId}
                  checked={selectedUsers.includes(user.emailId)}
                  onChange={handleUserSelect}
                />
                <label>Export to Excell</label>
              </div>
              <div className='profile-container'>
                {user.gender === 'Male'?(<img src={profileIconMaleUrl} className='w-25' alt={user.name}/>):(<img src={profileIconFemaleUrl} className="w-25" alt={user.name}/>)}
                <h1 className='name'>{user.name}</h1>
                <div className='sub-div'>
                  <p className='p'>{user.gender}</p>
                  <p className='p'>{user.age}</p>
                  <p className='p'>{user.dob}</p>
                </div>
                <p className='mail'>{user.emailId}</p>
              </div>
            </div>
            <div className='right-card-container'>
              <div className='item-container'>
                <li className='li'>Full Name</li>
                <p className='sub-li'>[ {user.name} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Age</li>
                <p className='sub-li'>[ {user.age} ]</p> 
              </div>
              <div className='item-container'>
                <li className='li'>Gender</li>
                <p className='sub-li'>[ {user.gender} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Date of Birth</li>
                <p className='sub-li'>[ {user.dob} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Mail Id</li>
                <p className='sub-li'>[ {user.emailId} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Mobile Number</li>
                <p className='sub-li'>[ {user.mobileNum} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Enterprenuer Type</li>
                <p className='sub-li'>[ {user.enterpreneurType} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Expected CTC</li>
                <p className='sub-li'>[ {user.expectedCtc} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Experience Letter</li>
                <p className='sub-li'>[ {user.experienceLetter} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Highest Qualification</li>
                <p className='sub-li'>[ {user.highestQualification} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Key Skill</li>
                <p className='sub-li'>[ {user.keySkills} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Languages</li>
                <p className='sub-li'>[ {user.languages} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Present Location</li>
                <p className='sub-li'>[ {user.presentLocation} ]</p>
              </div>
              <div className='item-container'>
                <li className='li'>Pincode</li>
                <p className='sub-li'>[ {user.pincode} ]</p>
              </div>
            </div>
          </div>
        </ul>
      ))}
      </div>
    );
  }

  
};


export default  App ;
