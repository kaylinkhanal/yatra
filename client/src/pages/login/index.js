import React from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link'
import { Button, message, Space } from 'antd';
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useRouter } from 'next/navigation'
import { setUserDetails } from '@/redux/reducerSlice/users';
import { useDispatch } from 'react-redux';

const Login = () => {
  const router = useRouter()
  const [msg, contextHolder] = message.useMessage();   
  const dispatch = useDispatch()
  const handleLogin=async(values)=>{
  try{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
  };
  const res = await fetch('http://localhost:4000/login',requestOptions)
  const data = await res.json()
  if(data && data.success && res.status==200) { 
    dispatch(setUserDetails(data))
    router.push('/')
    msg.info(data.msg);
  }else{
    msg.info(data.msg);
  }
  }catch(err){
    msg.info('Something went wrong!!');
  }




}
    const LoginSchema = Yup.object().shape({
      phoneNumber: Yup.string().required('Required'),
      password: Yup.string().required('Required')
    });
    return(
        <>
         {contextHolder}
        <Header/>
      <div className='container'> 
      <div className="app--login">
        <h2>Please Login</h2>
        <Formik
         initialValues={{
            phoneNumber: '',
           password:''
         }}
         validationSchema={LoginSchema}
         onSubmit={values => {
           // same shape as initial values
         handleLogin(values)
         }}
       >
         {({ errors, touched }) => (
           <Form>
            <Field name="phoneNumber"  placeholder="Phone Number"/>
             {errors.phoneNumber && touched.phoneNumber ? <div>{errors.phoneNumber}</div> : null}
             <Field name="password" type="password" placeholder="Password"/>
             {errors.password && touched.password ? <div>{errors.password}</div> : null}
             <button type="submit">Login</button>
           </Form>
         )}
       </Formik>
        <p>Don't have an account? <Link href="/register">Sign up</Link></p>
      </div>
      </div>
      <Footer/>
      </>
    )
  }

export default Login;