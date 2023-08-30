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
      <p onClick={userLogout} className='hover:text-red-500 hover:cursor-pointer'>Logout</p>
    </div>
  );

  return (
    <header >
      <div className="">
        <nav className='flex mx-64'>
          <div className="logo ">
            <Link href='/'>
              <CustomLogo />

            </Link>
          </div>
          {isLoggedIn ? (
            <div>

              <Popover placement="bottom" title={userDetails.fullName} content={content} trigger="click">
                <div>                <Avatar
                  size="large"
                  style={{
                    backgroundColor: '#fde3cf',
                    color: '#f56a00',
                    marginTop: '33px',
                    fontSize: '1.5rem',
                    marginRight: '10px'
                  }}
                >
                  {userDetails?.fullName?.[0]}
                </Avatar>
                  <div className='inline text-lg relative top-5'>Hi {userDetails.fullName.split(' ')[0]}</div></div>
              </Popover>
            </div>
          ) : <ul className="nav-menus">
            <li> <Link href="/login " className=''>Login</Link></li>
            <li><Link className="active" href="/register">Signup</Link></li>
          </ul>}


        </nav>

      </div>

    </header>

  )
}
