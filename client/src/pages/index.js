import React from 'react'
import Home from './home'
import Login  from './login'

const UnAuthenticatedPages = ()=> {
  return <Login/>
}

const AuthenticatedPages = ()=> {
 return (
  <Home/>
 )
}

const index =()=> {
  return (
    <div>
      <AuthenticatedPages/>
    </div>
  )
}

export default index