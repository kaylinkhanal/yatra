import { Router } from 'next/router'
import React from 'react'
import { useRouter } from 'next/router';
import Map from '../map'
function Driver() {
  const router =useRouter()
  const handleVerification = ()=>{
    router.push('/driver/verify-details')
  }
  return (
    <div>
      <button
      onClick={handleVerification}
      >Verify Your Details</button>
      <Map/>
    </div>
  )
}

export default Driver