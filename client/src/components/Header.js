import Image from 'next/image'
import { Avatar, Space, Popover } from 'antd';
import { CustomLogo } from './Logo';
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import { handleLogout } from '../redux/reducerSlice/users'
import Link from 'next/link';


export default function Header() {
  const router = useRouter()
  const dispatch = useDispatch()
  const userLogout = () => {
    dispatch(handleLogout())
  }
  const { isLoggedIn, userDetails } = useSelector(state => state.users)
  const content = (
    <div>

      <Link href="/profile" className='hover:text-green-500'>Profile</Link>
      <p onClick={userLogout} className='hover:cursor-pointer hover:text-red-500'>Logout</p>
    </div>
  );

  return (
    <header className=''>

      <div className="">
        <nav className='flex justify-around mx-16'>
          <div className="logo ">
            <Link href='/'>
              <CustomLogo />

            </Link>
          </div>
          {isLoggedIn ? (
            <div>

              <Popover placement="bottom" title={userDetails.fullName} content={content} trigger="click">

                <Avatar
                  size="large"
                  style={{
                    backgroundColor: '#fde3cf',
                    color: '#f56a00',
                    marginTop: '33px',
                    fontSize: '1.5rem',
                    marginRight: '10px'
                  }}
                >
                  {userDetails.fullName[0]}
                </Avatar>
              </Popover>
            </div>
          ) : <ul className="nav-menus">
            <li> <a href="/login " className=''>Login</a></li>
            <li><a className="active" href="/register">Signup</a></li>
          </ul>}


        </nav>

      </div>

    </header>

  )
}
