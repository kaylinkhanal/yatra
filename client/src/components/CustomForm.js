import React from 'react'
import { Formik, Form, Field } from 'formik'
import { Button, message, Space } from 'antd';
import * as Yup from 'yup'
import { setUserDetails } from '@/redux/reducerSlice/users';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
function CustomForm(props) {
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch()
  const router = useRouter()
  const handleEditProfile = async(values) =>{
    try{
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
    };
    const res = await fetch(`http://localhost:4000/user/${values._id}`,requestOptions)
    const data = await res.json()
    console.log(data);
    if(data && data.success && res.status==200) { 
      // dispatch(setUserDetails(data.userDetails))
      // router.push('/profile')
      msg.info(data.msg);
      
    }else{
      msg.info(data.msg);
    }
    }catch(err){
      msg.info('Something went wrong!!');
    }
  }
  
  return (
    <div>
      {contextHolder}
    <Formik
      initialValues={props.initialValues}
      onSubmit={values => {
        // same shape as initial values
        handleEditProfile(values)
        // console.log(values);
      }}
    >
      {({ errors, touched }) => (
        <Form>
            {props.AccountUserFields.map((item)=>{
                 return  <Field name={item.value} type={item.type} placeholder={item.value}/>
            })}
          <button type="submit">{props.title}</button>
        </Form>
      )}
    </Formik>
  </div>
  )
}

export default CustomForm