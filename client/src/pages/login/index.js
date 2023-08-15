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
        <h2 className='text-3xl font-semibold mt-12 text-center'>Login to Ride or Drive</h2>
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
           <Form className='py-5 mt-3  h-[500px]'>
            <Field className="focus:outline  focus:outline-[0.5px] focus:outline-[#79BE1D]" name="phoneNumber"  placeholder="Phone Number"/>
             {errors.phoneNumber && touched.phoneNumber ? <div>{errors.phoneNumber}</div> : null}
             <Field className="focus:outline focus:outline-[0.5px] focus:outline-[#79BE1D]" name="password" type="password" placeholder="Password"/>
             {errors.password && touched.password ? <div>{errors.password}</div> : null}
             <button id='loginBtn'  className='hover:bg-[#79BE1D] transition ease-in-out duration-300 loginBTN px-[14px] py-[18px] w-full mt-4 rounded-[20px] text-white font-lg bg-black ' type="submit">Login</button>
          
            <p className='text-center text-gray-800 mt-8'>Don't have an account? <Link  href="/register"> <span className='text-black ml-1 font-semibold hover:underline'> Sign up </span> </Link></p>
            
           </Form>
         )}
       </Formik>
      </div>
      </div>
      <Footer/>
      </>
    )
  }

export default Login;