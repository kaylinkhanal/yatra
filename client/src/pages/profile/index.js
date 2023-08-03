import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useSelector } from 'react-redux'
import { Col, Row, Avatar, Card, Image, Button, Space, Modal, message } from 'antd'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const SignupSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  newPassword: Yup.string()
    .min(5, 'Password Too Short!')
    .required('Required'),
  confirmNewPassword: Yup.string()
    .min(5, 'Password Too Short!')
    .required('Required')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

const ChangePassForm = ({ handleChangePassword }) => {
  return (
    <>

      <div>
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={values => {
            handleChangePassword(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field name="currentPassword" type="password" placeholder="Current password" />
              {errors.currentPassword && touched.currentPassword ? (
                <div>{errors.currentPassword}</div>
              ) : null}
              <Field name="newPassword" type="password" placeholder="New password" />
              {errors.newPassword && touched.newPassword ? (
                <div>{errors.newPassword}</div>
              ) : null}
              <Field name="confirmNewPassword" type="password" placeholder="New password" />
              {errors.confirmNewPassword && touched.confirmNewPassword ? <div>{errors.confirmNewPassword}</div> : null}
              <button type="submit">Change password</button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default function Profile() {
  const { userDetails } = useSelector(state => state.users)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = () => {
    alert("submit to backend")
  }
  const [msg, contextHolder] = message.useMessage();


  const handleChangePassword = async (values) => {
    const { confirmNewPassword, ...formFields } = values
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formFields)
    };
    const res = await fetch(`http://localhost:4000/change-password/${userDetails._id}`, requestOptions)
    const data = await res.json();
    if (data && res.status == 200) {
      setIsModalOpen(false)
      msg.info(data.msg)
    } else if (data && res.status == 401) {
      msg.info(data.msg)
    }

  }


  return (
    <>
      {contextHolder}
      <Header />
      <section className='user--profile'>
        <div className='container'>
          <h2>Your Profile</h2>
          <Row>
            <Col span={12}>
              <Card
                title="Avatar"
                bordered={false}
                style={{
                  width: 300,
                }}
              >
                <Image
                  width={'100%'}
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />
                <Space
                  direction="vertical"
                  style={{
                    width: '100%',
                    marginTop: '20px'
                  }}
                >
                  <Button type="dashed" block>
                    Change Avatar
                  </Button>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="account--details"
                title="Account Details"
                bordered={true}
                style={{
                  width: '100%',
                }}
              >
                <p><span>Full Name: </span>{userDetails.fullName}</p>
                <p><span>Email: </span><a href={`mailto:${userDetails.email}`}>{userDetails.email}</a></p>
                <p><span>Phone: </span>{userDetails.phoneNumber}</p>
              </Card>
              <Card className="account--details"
                title="Account Settings"
                bordered={true}
                style={{
                  width: '100%',
                }}
              >
                <Space
                  direction="vertical"
                  style={{
                    width: '50%',
                    marginTop: '20px'
                  }}
                >
                  <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Change Password
                  </Button>
                  <Modal
                    footer={null}
                    title="Change Password" open={isModalOpen} onOk={handleSubmit} onCancel={() => setIsModalOpen(false)} >
                    <ChangePassForm handleChangePassword={handleChangePassword} />
                  </Modal>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <Footer />
    </>
  )
}