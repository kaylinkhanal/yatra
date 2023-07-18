import Image from 'next/image'
import Logo from '../../public/yatra-logo.png'
export default function Header() {
  return (
   <header>
    <div className="container">
       <nav>
        <div className="logo">
           <a href='/'><Image src={Logo} alt="Picture of the author"/></a>
        </div>
        <ul className="nav-menus">
            <li><a href="/login">Login</a></li>
            <li><a className="active" href="/register">Signup</a></li>
        </ul>
       </nav>
    </div>
        
    </header>
    
  )
}
