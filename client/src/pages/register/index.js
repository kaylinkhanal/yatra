import React from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation'
import { Button, message } from 'antd';
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { setUserDetails } from '@/redux/reducerSlice/users';
import { useDispatch } from 'react-redux';
import Image from 'next/image';

const Register = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [msg, contextHolder] = message.useMessage();
  const SignupSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    password: Yup.string()
      .min(5, 'Password Too Short!')
      .required('Required'),
    confirmPassword: Yup.string()
      .min(5, 'Password Too Short!')
      .required('Required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    email: Yup.string().email('Invalid email').required('Required'),
  });


  const handleRegister = async (values) => {
    const { confirmPassword, ...formFields } = values
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formFields)
    };
    const res = await fetch('http://localhost:4000/register', requestOptions)
    const data = await res.json()
    if (data && res.status == 200) {
      debugger;
      dispatch(setUserDetails(data))
      router.push('/')
      setTimeout(() => {
        msg.info(data.msg);
      }, 2000);
    } else {
      msg.info(res.statusText);
    }
  }
  return (
    <>
      {contextHolder}
      <Header />
      <div className='container'>
        <div className="app--login min-h-screen ">
          <h2 className='text-3xl font-bold mt-12 text-center'>Sign up for Yatra</h2>
          <Formik
            initialValues={{
              fullName: '',
              email: '',
              phoneNumber: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, { resetForm }) => {
              handleRegister(values)
              resetForm()
            }}
          >
            {({ errors, touched }) => (
              <Form className='py-5  h-[800px]'>
                <Field name="fullName" placeholder="Full Name" />
                {errors.fullName && touched.fullName ? (
                  <div>{errors.fullName}</div>
                ) : null}
                <Field name="email" type="email" placeholder="Valid Email" />
                {errors.email && touched.email ? <div>{errors.email}</div> : null}
                <Field name="phoneNumber" type="text" placeholder="Phone Number" />
                {errors.phoneNumber && touched.phoneNumber ? <div>{errors.phoneNumber}</div> : null}
              
                <Field name="password" type="password" placeholder="Password" />
                {errors.password && touched.password ? <div>{errors.password}</div> : null}
                <Field name="confirmPassword" type="password" placeholder="Confirm Password" />
                {errors.confirmPassword && touched.confirmPassword ? <div>{errors.confirmPassword}</div> : null}
               

                <button className='px-[14px] py-[18px] w-full mt-3 rounded-[20px] text-white bg-black ' type="submit">Signup</button>

                <div class="my-8 mt-3 border-b text-center">
                  <div class="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide bg-white font-medium  transform translate-y-1/2">
                    Or
                  </div>
                </div>



                {/* <button className='px-[14px] py-[18px] w-full mt-2 rounded-[20px] text-black bg-gray-200 ' type="submit">
                  <svg class="w-4" viewBox="0 0 533.5 544.3">
                    <path
                      d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                      fill="#4285f4"
                    />
                    <path
                      d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                      fill="#34a853"
                    />
                    <path
                      d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                      fill="#fbbc04"
                    />
                    <path
                      d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                      fill="#ea4335"
                    />
                  </svg> Signup with Google</button> */}

                <button
                  class="px-[14px]  py-[18px] w-full mt-3 rounded-[20px] border flex justify-center gap-2 border-slate-200  text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition text-center duration-150">
                  <Image class="w-6 h-6" width={'10'} height={'10'} src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                  <span>Continue with Google</span>
                </button>
                <p className='text-center text-gray-800 mt-8 '>Already have an account? <a href="/login" className='text-black ml-1 font-semibold hover:underline' >Sign in</a></p>





              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Footer />
      <div>


      </div>
    </>
  )
}

export default Register;
