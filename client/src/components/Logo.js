
import Image from 'next/image'
import React from 'react'
import Logo from '../../public/yatra-logo.png'
import Link from 'next/link'
export const CustomLogo = () => {
  return (
    <div>
      <Link href={'/'}><Image src={Logo} alt="Picture of the author" /></Link>
    </div>
  )
}
