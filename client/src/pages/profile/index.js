import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { setUserDetails } from '@/redux/reducerSlice/users';
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Avatar, Card, Image, Button, Space, Modal, message } from 'antd'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import CustomForm from '@/components/CustomForm'
import { handleLogout } from '../../redux/reducerSlice/users'
import {
EditOutlined,
SettingOutlined,
PaperClipOutlined,
} from '@ant-design/icons';
const SignupSchema = Yup.object().shape({

  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long!')
    .matches(/^(?=.*?[!@#$%^&*])/, 'Password must contain at least one special character!')
    .required('Required'),
  confirmNewPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long!')
    .required('Required')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

const deleteUserSchema = Yup.object().shape({
  password: Yup.string().required('Required'),
})

const ChangePassForm = ({handleChangePassword}) => {
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
          handleChangePassword(values);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field name="currentPassword" type="password" placeholder="Current password" />
            {errors.currentPassword && touched.currentPassword ? (
              <div>{errors.currentPassword}</div>
            ) : null}
            <Field name="newPassword" type="password" placeholder="New password" />
            {errors.newPassword && touched.newPassword ? (
              <div>{errors.newPassword}</div>
            ) : null}
            <Field name="confirmNewPassword" type="password" placeholder="New password" />
            {errors.confirmNewPassword && touched.confirmNewPassword ? <div>{errors.confirmNewPassword}</div> : null}
            <button type="submit">Change password</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

const DeleteAccountForm = ({handleDeleteAccount}) =>{
  const dispatch = useDispatch()
  const router = useRouter()
  return(
    <div>
      <p className='text-base'>This will immediately delete all your credentials along with your user data.</p>
      <p className='font-medium pt-5 text-base'>To confirm please enter your password</p>
      <Formik
      initialValues={{
        password:'',
      }}
      validationSchema={deleteUserSchema}
      onSubmit={(values) => handleDeleteAccount(values,router,dispatch)}>
      {({ errors, touched }) => (
          <Form>
            <Field name="password" type="password" placeholder="Password" />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
            <button type='submit' className='border-[1px] border-red-600 text-red-600 py-1 px-4 rounded-xl my-2 hover:bg-red-100 ease-in-out duration-300'>Confirm Delete Account</button>
            <p className='text-red-700 py-2'>Warning! This action cannot be undone.</p>
          </Form>
      )}
      </Formik>
    </div>
  )
}


export default function Profile() {
  const [msg, contextHolder] = message.useMessage();   
  const { userDetails } = useSelector(state => state.users)
  const AccountUserFields = [
    { value: 'fullName', type: 'text', },
    { value: 'email', type: 'text' },
    { value: 'phoneNumber', type: 'text' },
  ]
  let tempObj = {}
  AccountUserFields.forEach((item) => {
    tempObj[item.value] =
      userDetails[item.value]
  })

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const dispatch = useDispatch()

  const handleSubmit = async (values) => {
    try {
      const { confirmPassword, ...formFields } = values
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formFields)
      };
      const res = await fetch(`http://localhost:4000/users/${userDetails._id}`, requestOptions)
      const data = await res.json()
      if (data && res.status == 200) {
        dispatch(setUserDetails(data))
        setIsAccountModalOpen(false)
      } else {
        msg.info(res.statusText);
      }
    } catch (error) {
      setIsAccountModalOpen(false)
      console.log(error)
    }
  }

  const handleChangePassword = async(values) =>{
    const userId = userDetails._id;
    
    const{confirmNewPassword,...formFields} = values
    const requestOptions ={
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formFields)
    };
    const res = await fetch(`http://localhost:4000/change-password/${userId}`,requestOptions)
    const data = await res.json();
  if(data && res.status==200){
    setIsModalOpen(false)
    msg.info(data.msg)
  }else if(data && res.status==401){
    msg.info(data.msg)
  }
  }
  
  const handleDeleteAccount = async(values,router,dispatch) =>{
    const userId = userDetails._id;
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }
  
    const res = await fetch(`http://localhost:4000/delete-account/${userId}`,requestOptions)
   
    const data = await res.json()
    if(data && res.status==200){

    setIsDeleteModalOpen(false)
    
    msg.info(data.msg)
    dispatch(handleLogout())
    router.push('/')
     
    }else if(data && res.status==401){
      msg.info(data.msg)
    }
  }
  return (
    <>
    {contextHolder}
      <Header />
      <section className='user--profile'>
        <div className='container ps-[22px] pe-[10px]  py-[10px]'>   
          <div className='flex gap-5 justify-center'>

              <Card
                className='!shadow-md border-[#74C236] border-[2px]'
                bordered={false}
                style={{
                  width: 410,
                  height: 353,
                }}
              >
                <Image
                  width={'100%'}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <Space
                  direction="vertical"
                  style={{
                    width: '100%',
                    marginTop: '20px'
                  }}
                >
                  <Button type="dashed" block>
                    Change Avatar
                  </Button>
                </Space>
              </Card>
              <div className='w-[100%]'>

          
              <Card className="account--details border-l-[20px] border-[#74C236]"
                title={<div className='flex items-baseline gap-2'><PaperClipOutlined  className='text-2xl' />Account Details</div>}
                extra={<span onClick={() => setIsAccountModalOpen(true)}><EditOutlined className='text-xl cursor-pointer' /></span>}
                bordered={true}
              
              >
                <p className='text-base'><span>Full Name: </span>{userDetails?.fullName}</p>
                <p className='text-base py-1'><span>Email: </span><a href={`mailto:${userDetails.email}`}>{userDetails.email}</a></p>
                <p className='text-base'><span>Phone: </span>{userDetails.phoneNumber}</p>
              </Card>

              <Card className="account--details border-l-[20px] border-[#74C236]"
                title={<div className='flex items-baseline gap-2'><SettingOutlined className='text-2xl' />Account Settings</div>}
                bordered={true}
              >
             
                <Space
                  direction="vertical"
                  style={{
                    width: '60%',
                    marginTop: '10px'
                  }}
            
                >
                  <div className='flex gap-5'>
                  <Button onClick={() => setIsModalOpen(true)}>
                    Change Password
                  </Button>

                  <Modal
                    footer={null}
                    title="Edit Account Details"
                    open={isAccountModalOpen}

                    onCancel={() => setIsAccountModalOpen(false)} >
                    <CustomForm title="Edit Account Details"
                      submitEndpoint="/users"
                      method="PUT"
                      handleSubmit={handleSubmit}
                      initialValues={tempObj} AccountUserFields={AccountUserFields} />
                  </Modal>
                  <Modal
                    footer={null}
                    title="Change Password"
                    open={isModalOpen}
                    onOk={handleSubmit}
                    onCancel={() => setIsModalOpen(false)} >
                    <ChangePassForm handleChangePassword={handleChangePassword} />
                  </Modal>
                  <Button danger onClick={()=>setIsDeleteModalOpen(true)}>Delete Account</Button>
                  <Modal
                  footer={null}
                  title={<h4 className='text-xl'>Are you sure you want to delete your account?</h4>}
                  open={isDeleteModalOpen}
                  onCancel={()=> setIsDeleteModalOpen(false)}>
                  <DeleteAccountForm handleDeleteAccount={handleDeleteAccount}/>
                  </Modal>
                  </div>
                </Space>
              </Card>
              </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}