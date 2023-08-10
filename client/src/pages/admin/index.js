import React from 'react'
import { useEffect, useState } from 'react'

function index() {
    const [users, setUsers] = useState([])
    const fetchUserDetails = async() => {
        const res = await fetch('http://localhost:4000/users')
        const data = await res.json()
        setUsers(data.userList)
    }
    useEffect(()=>{
        fetchUserDetails()
    })
  return (
    <div>
        {users.length>0 && users.map(item=>{
            return (
                <div style={{margin:'10px'}}>
                    {item.verified.toString()}
                    {item.fullName}
                    </div>
            )
        })}
    </div>
  )
}

export default index