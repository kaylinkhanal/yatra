import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'


function CustomForm(props) {

  return (
    <div>
      <Formik
        initialValues={props.initialValues}
        onSubmit={values => {
          props.handleSubmit(values)
        }}
      >
        {({ errors, touched }) => (
          <Form>
            {props.AccountUserFields.map((item) => {
              return <Field name={item.value} type={item.type} placeholder={item.value} />
            })}
            <button type="submit">{props.title}</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CustomForm