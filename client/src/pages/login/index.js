import React, {useState} from 'react'
import { Formik, Form, Field,ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link'
import { Button, message, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'; 
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useRouter } from 'next/navigation'
import { setUserDetails } from '@/redux/reducerSlice/users';
import { useDispatch } from 'react-redux';

const Login = () => {
  const router = useRouter()
  
  const [msg, contextHolder] = message.useMessage();   
  const [showPassword, setShowPassword] = useState(false);
  

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
      password: Yup.string()
      .min(8, 'Password must be at least 8 characters long!')
      .matches(/^(?=.*?[!@#$%^&*])/, 'Password must contain at least one special character!')
      .required('Required')
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
             <div style={{ position: 'relative' }}>
                  <Field name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" />
                  <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeTwoTone />}
                  </span>
                </div>
                <ErrorMessage name="password" component="div" />

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