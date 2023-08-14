import React, { useState } from 'react';
import { Divider, Radio, Table, Popconfirm } from 'antd';

import { Skeleton, Switch, Button, Modal, Tooltip, message } from 'antd';


import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';


// Delete user code here ---->
const deleteText = <span>Delete User</span>;
const editText = <span>Edit User</span>;
// const confirm = () => {
//   // alert('Delete User from database');
//   message.success('Delete this user successfully.');

// }



const deleteUser = async (ID) => {
  try {
    await fetch(`http://localhost:4000/delete-user/${ID}`, { 
      method: 'DELETE',
    });
    message.success(`Delete user successfully.`);
    // fetchUsers();
    
  } catch (error) {
    console.error(error);
  }
};


const CustomTable = (props) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [selectionType, setSelectionType] = useState('checkbox');


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
      render: (value) => {
        return <Switch defaultChecked={value} onChange={null} />
      }
    },
    {
      title: 'Actions',
      dataIndex: '',
      render: (value) => {
        return (
          <div>
              <Tooltip className='' placement="top" title={editText}> 
            <EditOutlined className='text-blue-500' onClick={() => {
              setCurrentUser(value)
              setIsEditOpen(true)
            }} />
            </Tooltip>
         
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
              <Tooltip className='' placement="top" title={deleteText}>
                <DeleteOutlined className=" cursor-pointer text-red-500 font-bold text-md pl-4" />
              </Tooltip>
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
      <Modal title="Basic Modal" open={isEditOpen} onCancel={() => setIsEditOpen(false)}>
        {JSON.stringify(currentUser)}
      </Modal>
    </div>
  );
};
export default CustomTable;