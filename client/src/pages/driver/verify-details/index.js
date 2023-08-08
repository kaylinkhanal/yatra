import React, {useState} from 'react'
import { Formik, Form, Field } from 'formik';

const VerifyDetails = () => {
    const [file,setFile] = useState(null)
  const handleVerification=async(values)=>{
    console.log(file)

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