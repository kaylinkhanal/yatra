import React, { useState } from 'react';
import { Divider, Radio, Table,Popconfirm } from 'antd';

import { Skeleton,Switch, Button, Modal } from 'antd';

import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';




const CustomTable = (props) => {
  const [isEditOpen, setIsEditOpen] =useState(false)
  const [currentUser , setCurrentUser] = useState({})
  const [selectionType, setSelectionType] = useState('checkbox');
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
    <Modal title="Basic Modal" open={isEditOpen}  onCancel={()=>setIsEditOpen(false)}>
   {JSON.stringify(currentUser)}
  </Modal>
    </div>
  );
};
export default CustomTable;