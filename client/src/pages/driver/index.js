import { Router } from 'next/router'
import React from 'react'
import { useRouter } from 'next/router';

function Driver() {
  const router =useRouter()
  const handleVerification = ()=>{
    router.push('/driver/verify-details')
  }
  return (
    <div>Hi i am Driver
      <button
      onClick={handleVerification}
      >Verify Your Details</button>

    </div>
  )
}

export default Driver