import React from 'react'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd';
import Table from '../../components/Table'
import { Pagination } from 'antd';
import { AutoComplete } from 'antd';
function index() {

const options = [
  {
    value: 'Burns Bay Road',
  },
  {
    value: 'Downing Street',
  },
  {
    value: 'Wall Street',
  },
];
    const [searchedResult, setSearchedResult] = useState([])
    const [users, setUsers] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const fetchUserDetails = async (page = 1, size = 10) => {
        const res = await fetch(`http://localhost:4000/users?page=${page}&size=${size}`)
        const data = await res.json()
        setUsers(data.userList)
        setTotalCount(data.count)
    }
    const searchUser = async(searchText) => {
        const res = await fetch(`http://localhost:4000/users?searchText=${searchText}`)
        const data = await res.json()
        if(data){
           const searchList=  data.userList.map((item)=>{
                return {value: item.fullName}
            })
            setSearchedResult(searchList)
        }
        
    }
    useEffect(() => {
        fetchUserDetails()
    }, [])
    
    return (
        <div>
            {users.length > 0 ? (
                <div>
                    {/* <div><input /></div>
                    {
                        users.map((item, id) => {
                            return (
                                <div style={{ margin: '10px', backgroundColor: id % 5 == 0 ? 'grey' : 'lightgrey', padding: '5px', width: '200px' }}>
                                    {item.verified.toString()}
                                    {item.fullName}
                                </div>
                            )
                        }
                        )
                    } */}
                 
                </div>) : <Skeleton />}
                <AutoComplete
    style={{
      width: 200,
    }}
    onChange={searchUser}
    options={searchedResult}
    placeholder="try to type `b`"
    filterOption={(inputValue, option) =>
      option?.value?.toUpperCase()?.indexOf(inputValue?.toUpperCase()) !== -1
    }
  />
        {users.length>0 ? <Table fetchUserDetails={fetchUserDetails}  users={users}/> : <Skeleton/>}
        <Pagination
                        showSizeChanger
                        onChange={(page, size) => fetchUserDetails(page, size)} defaultCurrent={1} total={totalCount} />
    </div>
  )
}

export default index