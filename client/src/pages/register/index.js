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
    .min(8, 'Password must be at least 8 characters long!')
      .matches(/^(?=.*?[!@#$%^&*])/, 'Password must contain at least one special character!')
      .required('Required'),
    confirmPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long!')
    .matches(/^(?=.*?[!@#$%^&*])/, 'Password must contain at least one special character!')
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
                <Field className="focus:outline focus:outline-[0.5px] focus:outline-[#79BE1D]" name="fullName" placeholder="Full Name" />
                {errors.fullName && touched.fullName ? (
                  <div>{errors.fullName}</div>
                ) : null}
                <Field className="focus:outline focus:outline-[0.5px] focus:outline-[#79BE1D]" name="email" type="email" placeholder="Valid Email" />
                {errors.email && touched.email ? <div>{errors.email}</div> : null}
                <Field className="focus:outline focus:outline-[0.5px] focus:outline-[#79BE1D]" name="phoneNumber" type="text" placeholder="Phone Number" />
                {errors.phoneNumber && touched.phoneNumber ? <div>{errors.phoneNumber}</div> : null}

                <Field className="focus:outline focus:outline-[0.5px] focus:outline-[#79BE1D]" name="password" type="password" placeholder="Password" />
                {errors.password && touched.password ? <div>{errors.password}</div> : null}
                <Field name="confirmPassword" type="password" placeholder="Confirm Password" />
                {errors.confirmPassword && touched.confirmPassword ? <div>{errors.confirmPassword}</div> : null}


                <button className='px-[14px] py-[18px] w-full mt-3 rounded-[20px] text-white bg-black hover:bg-[#79BE1D] transition ease-in-out duration-300' type="submit">Signup</button>

                <div class="my-8 mt-3 border-b text-center">
                  <div class="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide bg-white font-medium  transform translate-y-1/2">
                    Or
                  </div>
                </div>





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