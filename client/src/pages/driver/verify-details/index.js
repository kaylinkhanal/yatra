import React, {useState} from 'react'
import { Formik, Form, Field } from 'formik';
import { useSelector } from 'react-redux';
const VerifyDetails = () => {
const {userDetails} =useSelector(state=>state.users)

    const [file,setFile] = useState(null)
  const handleVerification=async(values)=>{
    debugger;
    const data = new FormData()
    data.append('licenseImage', file)
    data.append('licenseNumber', values.licenseNumber)

    const requestOptions = {
      method: 'PUT',
      body: data
  };
  const res = await fetch('http://localhost:4000/verify-details/'+userDetails._id,requestOptions)
  }

  
    return(
        <>
      <div className='container'> 
      <div className="app--login">
        <Formik
         initialValues={{
            licenseNumber: ''
         }}
         onSubmit={values => {
           handleVerification(values)
         }}
       >
         {({ errors, touched }) => (
           <Form>
             <Field name="licenseNumber" placeholder="licenseNumber"/>
             {errors.licenseNumber && touched.licenseNumber ? <div>{errors.licenseNumber}</div> : null}
             <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
             <button type="submit">Login</button>
           </Form>
         )}
       </Formik>
       
      </div>
      </div>
      </>
    )
  }

export default VerifyDetails;