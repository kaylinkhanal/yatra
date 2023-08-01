import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Card, Modal } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  newPassword: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
    confirmNewPassword: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required')
});

 const ChangePassForm = () => {
  return (
    <div>
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={values => {
          // same shape as initial values
          console.log(values);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field name="currentPassword" />
            {errors.currentPassword && touched.currentPassword ? (
              <div>{errors.currentPassword}</div>
            ) : null}
            <Field name="newPassword" />
            {errors.newPassword && touched.newPassword ? (
              <div>{errors.newPassword}</div>
            ) : null}
            <Field name="confirmNewPassword" type="confirmNewPassword" />
            {errors.confirmNewPassword && touched.confirmNewPassword ? <div>{errors.confirmNewPassword}</div> : null}
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  )
 }
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
    <Modal
    footer={null}
    title="Change Password" open={isModalOpen} onOk={handleSubmit} onCancel={()=>setIsModalOpen(false)} >
      <ChangePassForm/>
      </Modal>
  </Card>
)};
export default Profile;