import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { setUserDetails } from '@/redux/reducerSlice/users';

function CustomForm(props) {
  const dispatch = useDispatch()
  const { userDetails } = useSelector(state => state.users)
  const handleSubmit = async (values) => {
    try {
      const { confirmPassword, ...formFields } = values
      const requestOptions = {
        method: props.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formFields)
      };
      const res = await fetch(`http://localhost:4000${props.submitEndpoint}/${userDetails._id}`, requestOptions)
      const data = await res.json()
      if (data && res.status == 200) {
        dispatch(setUserDetails(data))
        console.log(data.msg)
      } else {
        msg.info(res.statusText);
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <Formik
        initialValues={props.initialValues}
        onSubmit={values => {
          console.log(values);
          handleSubmit(values)

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