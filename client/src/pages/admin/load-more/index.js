import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import Table from '@/components/Table'

const ContainerHeight = 300;
const LoadMore = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0)
  const appendData = async(page=1, size=2) => {
    const res = await fetch(`http://localhost:4000/users-loadmore?page=${page}&size=${size}`)
        const data = await res.json()
        // console.log(data.userList)
        setUsers([...users, ...data.userList]);
        setTotalCount(data.count)
        // if(users.length <= totalCount  ){
        //   message.success(`${size} more items loaded!`);
        // }else{
        //   message.error(`It is all, Nothing more`);
        // }
    
  };
  useEffect(() => {
    appendData();
  }, []);
  const onScroll = () => {
    console.log(users.length)
    console.log(totalCount)
    if(users.length == totalCount){
          message.error(`No more users`);
        }
    appendData(users.length,2)
    
    // console.log('Scrolled')
    // console.log(e.currentTarget.scrollHeight - e.currentTarget.scrollTop)
    // if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop == ContainerHeight) {
    //   alert('lets append')
    //   appendData(users.length,4)
    // }
  };
  return (
    <div className='container'>
      <div
        // style={{
        //   height: ContainerHeight,
        //   overflow: 'scroll',
        // }}
        // onScroll={onScroll}
      >
        <Table users={users}/>
      </div>
      <button onClick={onScroll}>Load more</button>
    </div>
    
  );
};
export default LoadMore;