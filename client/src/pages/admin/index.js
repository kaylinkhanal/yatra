import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';


 const Register = () => {

    const handleAddProducts = (values)=>{
        fetch('http://localhost:4000/products', 
        {method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(values)})
    }


 return (
  <div>
    <h1>Add product</h1>
    <Formik
      initialValues={{
        productName: '',
        category: '',
        productPrice: '',
        productDescription: ''
      }}
      onSubmit={values => {
        handleAddProducts(values)
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <div className='form'>
          <Field placeholder="productName" name="productName" />
          {errors.productName && touched.productName ? (
            <div>{errors.productName}</div>
          ) : null}<br/>
          <Field placeholder="category" name="category" />
          {errors.category && touched.category ? (
            <div>{errors.category}</div>
          ) : null}<br/>
          <Field placeholder="productPrice"  name="productPrice" type="productPrice" />
          {errors.productPrice && touched.productPrice ? <div>{errors.productPrice}</div> : null}<br/>

          <Field type="textarea" placeholder="productDescription"  name="productDescription" type="productDescription" />
          {errors.productDescription && touched.productDescription ? <div>{errors.productDescription}</div> : null}<br/>
          <button type="submit">Submit</button>
          </div>
         
        </Form>
      )}
    </Formik>
  </div>
)
}
export default Register