import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Card, Modal } from 'antd';
const Profile = () => {
    const {userDetails} = useSelector(state=>state.users)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleSubmit= ()=> {
        alert("submit to backend")
    }
    return(
  <Card title="Your Profile">
    <Card type="inner" title="User Details" extra={<a href="#">Edit</a>}>
      Full Name: {userDetails.fullName} <br/>
      Email: {userDetails.email} <br/>
      Phone: {userDetails.phoneNumber} <br/>
      mode: {userDetails.mode}<br/>
    </Card>
    <Card
      style={{
        marginTop: 16,
      }}
      title="Security"
      extra={<a href="#">More</a>}
    >
     <span onClick={()=>setIsModalOpen(true)}>Change Password </span><br/>
     Delete Account
    </Card>
    <Modal title="Basic Modal" open={isModalOpen} onOk={handleSubmit} onCancel={()=>setIsModalOpen(false)} >
      {/* add formik form  here*/}
      </Modal>
  </Card>
)};
export default Profile;