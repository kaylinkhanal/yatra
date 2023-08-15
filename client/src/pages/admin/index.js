import React from 'react'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd';
import Table from '../../components/Table'
import { Pagination } from 'antd';
function index() {
    const [users, setUsers] = useState([])

    const [totalCount, setTotalCount] = useState(0)

     const fetchUserDetails = async(page=1, size=10) => {
        const res = await fetch(`http://localhost:4000/users?page=${page}&size=${size}`)
        const data = await res.json()
        setUsers(data.userList)
        setTotalCount(data.count)
    }
    useEffect(()=>{
        fetchUserDetails()
    },[])
  return (
    <div>
        {users.length>0 ? (
            <div>
            <div><input/></div>
           {
            users.map((item,id)=>{
            return (
                <div style={{margin:'10px' ,backgroundColor: id%5==0 ? 'grey':'lightgrey', padding:'5px', width:'200px'}}>
                    {item.verified.toString()}
                    {item.fullName}
                    </div>
            )}
            )
            }
            <Pagination 
            showSizeChanger
            onChange={(page ,size)=>fetchUserDetails(page, size)} defaultCurrent={1} total={44} />
            </div>): <Skeleton />}
        

        {users.length>0 ? <Table users={users}/> : <Skeleton/>}
    </div>
  )
}

export default index