import React, { useState } from 'react';
import { Divider, Radio, Table,Popconfirm } from 'antd';
import { Formik, Form, Field } from 'formik';
import { Skeleton,Switch, Button, Modal } from 'antd';



import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import { data } from 'autoprefixer';



const CustomTable = (props) => {
  const [isEditOpen, setIsEditOpen] =useState(false)
  const [currentUser , setCurrentUser] = useState({})
  const [selectionType, setSelectionType] = useState('checkbox');

  const EditProfileForm = ({ handleEditProfile }) => {

    return (
  
      <div>
        <Formik
         initialValues={{
         fullName:currentUser.fullName,
         email:currentUser?.email,
         phoneNumber:currentUser?.phoneNumber
  
        }}
  
          onSubmit={values => {
            // same shape as initial values
            handleEditProfile(values);
            props.fetchUserDetails()
            
            
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field name="fullName"  />
              {errors.fullname && touched.fullname ? (
                <div className="text-sm inline text-red-500">{errors.fullname}</div>
              ) : null}
              <Field name="email" type="email"  />
              {errors.email && touched.email ? <div>{errors.email}</div> : null}
              <Field name="phoneNumber" type="text" />
              {errors.phoneNumber && touched.phoneNumber ? <div>{errors.phoneNumber}</div> : null}
              <button type="submit">Submit</button>
            </Form>
          )}
        </Formik>
      </div>
    )
  }
  
  

  const handleEditProfile=async(values)=>{
    try {
      const { confirmPassword, ...formFields } = values
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formFields)
      };
      const res = await fetch(`http://localhost:4000/users/${currentUser._id}`, requestOptions)
      const data = await res.json();
      if (data && res.status == 200) {
        (setCurrentUser(data))
        
        setIsEditOpen(false)
      } else {
        msg.info(res.statusText);
      }
    } catch (error) {
      setIsEditOpen(false)
      console.log(error)
    }
  }
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      render: (text) => <a onClick={()=>alert(text)}>{text}</a>,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Mode',
      dataIndex: 'mode',
    },
    {
      title:'License Number',
      dataIndex: 'licenseNumber',
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      render: (value)=>{
      return <Switch defaultChecked={value} onChange={null} />}
    },
    {
      title: 'Actions',
      dataIndex: '',
      render: (value)=>{
      return (
        <div>
          <EditOutlined onClick={()=>{
            setCurrentUser(value)
            setIsEditOpen(true)}}/>
            
            

            
          <Popconfirm
      title="Delete the task"
      description="Are you sure to delete this task?"
      // onConfirm={confirm}
      onCancel={()=> setIsEditOpen(false)}
      okText="Yes"
      cancelText="No"
    >
      <DeleteOutlined />
    </Popconfirm>
        </div>
      )
    }
    },
  ];

  // rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};
  return (
    <div>
   

      <Divider />

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={props.users}
      />
    <Modal 
    footer={null}
    title="Basic Modal"
     open={isEditOpen} 
      onCancel={()=>setIsEditOpen(false)}>
   {/* {JSON.stringify(currentUser)} */}
   <EditProfileForm handleEditProfile={handleEditProfile}/>
  </Modal>
    </div>
  );
};
export default CustomTable;