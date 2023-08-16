import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Skeleton, Switch, Button, Modal, Image, message, Dropdown, Space, Typography } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  DownOutlined
} from '@ant-design/icons';

function CustomForm(props) {
  const [dropDownKey, setDropDownKey] = useState(props.currentUser?.mode)
  const [verified, serVerified] = useState(props.currentUser?.verified)
  const items = props.dropDownItems
  const handleItemClick = (e) => {
    setDropDownKey(e.key)
  };
  return (
    <div>
      <Formik
        initialValues={props.initialValues}
        onSubmit={values => {
          values.mode = dropDownKey
          values.verified = verified
          props.handleSubmit(values)
        }}
      >
        {({ errors, touched }) => (
          <Form>
            {props.AccountUserFields.map((item) => {
              return <Field name={item.value} type={item.type} placeholder={item.value} />
            })}
            {props.dropDownItems ? <Dropdown
              menu={{
                items,
                selectable: true,
                defaultSelectedKeys: ['3'],
                onClick: handleItemClick
              }}
            >
              <Typography.Link>
                <Space style={{
                  "display": "flex"
                }}>
                  {dropDownKey}
                  <DownOutlined style={{
                    "display": "inline"
                  }} />
                </Space>
              </Typography.Link>
            </Dropdown> : null}
            {props.Switch ? <div style={{
              "marginTop": "1.5rem",
            }}>Verified< Switch defaultChecked={props.currentUser.verified} onChange={(e) => {
              serVerified(!verified);
            }} /></div> : null}
            <button type="submit">{props.title}</button>
          </Form>
        )}
      </Formik>
    </div >
  )
}

export default CustomForm