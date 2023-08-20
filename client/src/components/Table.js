import React, { useState } from 'react';
import { Divider, Radio, Table, Popconfirm, Card } from 'antd';

import { Switch, Modal, Image, message } from 'antd';

import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import CustomForm from './CustomForm';
const CustomTable = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [selectionType, setSelectionType] = useState('checkbox');
  const deleteUser = async (ID) => {
    try {
      await fetch(`http://localhost:4000/delete-user/${ID}`, { 
        method: 'DELETE',
      });
      message.success(`Delete user successfully.`);
      // setUsers(users.filter(user => user._id !== userId));
      props.fetchUserDetails()
      
    } catch (error) {
      console.error(error);
    }
  };
  const AccountUserFields = [
    { value: 'fullName', type: 'text', },
    { value: 'email', type: 'text' },
    { value: 'phoneNumber', type: 'text' },
    { value: 'licenseNumber', type: 'text' },
  ]
  let editProfileInitials = {}
  AccountUserFields.forEach((item) => {
    editProfileInitials[item.value] =
      currentUser[item.value]
  })
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      render: (text) => <a onClick={() => alert(text)}>{text}</a>,
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
      title: 'License Number',
      dataIndex: 'licenseNumber',
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      render: (value, currentUser) => {
        return <Switch disabled defaultChecked={currentUser.verified} checked={currentUser.verified} onChange={null} />
      }
    },
    {
      title: 'Actions',
      dataIndex: '',
      render: (value) => {
        return (
          <div>
            <EditOutlined className='text-blue-500' onClick={() => {
              setCurrentUser(value)
              setIsEditOpen(true)
            }} />
         
            <Popconfirm
              title="Delete the User"
              description="Are you sure to delete this user?"
              // onConfirm={confirm}
              onCancel={() => setIsEditOpen(false)}
              onConfirm={() => deleteUser(value._id)} 
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"

            >
                <DeleteOutlined className=" cursor-pointer text-red-500 font-bold text-md pl-4" />
            </Popconfirm>
          </div>
        )
      }
    },
  ];

  const handleSubmit = async (values) => {
    try {

      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      };
      const res = await fetch(`http://localhost:4000/users/${currentUser._id}`, requestOptions)
      const data = await res.json()
      if (data) {
        messageApi.info(data.msg);
        props.fetchUserDetails();
        setIsEditOpen(false)
      } else {
        messageApi.info(res.statusText);
      }
    } catch (error) {
      console.log(error)
    }
  }

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
      {contextHolder}

      <Divider />

      <Table
        pagination={false}
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={props.users}
      
      />

      <Modal title="Verify User Details" open={isEditOpen} onCancel={() => setIsEditOpen(false)} width={1000} footer={false}
      >
        <div style={{
          "display": "flex"
        }}>
          <Image
            width={300}
            src={`http://localhost:4000/liscense-img/${currentUser._id}`}
          />
          <Card
            title="User Details"
            bordered={false}
            style={{
              width: 500,
            }}
          >
            <CustomForm
              title={"Update"}
              submitEndpoint="/users"
              method="PUT"
              dropDownItems={[
                {
                  key: 'Passenger',
                  label: 'Passenger',
                },
                {
                  key: 'Driver',
                  label: 'Driver',
                },
                {
                  key: 'Blocked',
                  label: 'Blocked',
                },
              ]}
              handleSubmit={handleSubmit}
              initialValues={editProfileInitials} AccountUserFields={AccountUserFields} currentUser={currentUser}
              Switch={true}></CustomForm>

          </Card>

        </div>
      </Modal>
    </div>
  );
};
export default CustomTable;