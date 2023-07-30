import Image from 'next/image'
import { Avatar, Space } from 'antd';
import {CustomLogo} from './Logo';

export default function Header() {
  return (
   <header>
    <div className="container">
       <nav>
        <div className="logo">
           <a href='/'>
              <CustomLogo/>
         
            </a>
        </div>
        <ul className="nav-menus">
            <li><a href="/login">Login</a></li>
            <li><a className="active" href="/register">Signup</a></li>
        </ul>
        <Avatar
                size="large"
      style={{
        backgroundColor: '#fde3cf',
        color: '#f56a00',
        marginTop:'33px',
        fontSize: '1.5rem',
        marginRight: '10px'
      }}
    >
      U
    </Avatar>
       </nav>

    </div>
        
    </header>
    
  )
}
