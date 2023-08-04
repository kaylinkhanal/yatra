// import React from 'react'
// import Home from './home'
// import Login  from './login'

// const UnAuthenticatedPages = ()=> {
//   return <Login/>
// }

// const AuthenticatedPages = ()=> {
//  return (
//   <Home/>
//  )
// }

// const index =()=> {
//   return (
//     <div>
//       <AuthenticatedPages/>
//     </div>
//   )
// }

// export default index

import React, {useEffect, useState} from 'react'

function index() {
  const [products,setProducts]= useState([])
  const fetchProducts= async()=> {
   const res= await fetch('http://localhost:4000/products')
    const {data} =await res.json()
    setProducts(data)
  }


  useEffect(() => {
    fetchProducts()
  },[])
  return (
    <div>
      {
        products.length>0 ? (
          <div>
            {products.map((item)=>{
              return <div className='card'>{item.productName}
              {item.productPrice}
              {item.category}
              </div>
            })}
            </div>
        ): "loading"
      }
     
    </div>
  )
}

export default index