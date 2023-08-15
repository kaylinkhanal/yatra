import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '@/components/Header'
import Heroimg from '../../../public/assets/fewa-banner.jpeg'
import Footer from '@/components/Footer'
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Tabs } from 'antd';
export default function index() {

  const containerStyle = {
    width: '400px',
    height: '400px'
  };

  const center = {
    lat: -3.745,
    lng: -38.523
  };
  const [tabId, setTabId] = useState(1)
  const items = [
    {
      key: 1,
      label: `Passenger mode`,
    },
    {
      key: 2,
      label: `Drive mode`,
    },
  ];
  const onChange = (key) => {
    setTabId(key)
  };
  const UserCard = () => {
    return (
      <div className='flex justify-center items-center'> 
      <div className='flex gap-4' >
        <div className='pr-4'>
          <h2 className='mb-3' >Request a ride now </h2>
          <form className=''>
            <input className='focus:outline focus:outline-[0.5px] focus:outline-[#79BE1D]' type='text' placeholder='Pick up address' />
            <input className='focus:outline focus:outline-[0.5px] focus:outline-[#79BE1D]' type='text' placeholder='Drop off address' />
          </form>
          <button className='px-[30px] py-[15px] mt-3 rounded-[20px] bg-black hover:bg-[#79BE1D] transition ease-in-out duration-300 text-white'>
            <a href='/passenger' >Request now</a>
          </button>
        </div>

        <div class>
          <LoadScript
            googleMapsApiKey="AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0"
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
            >
              { /* Child components, such as markers, info windows, etc. */}
              <></>
            </GoogleMap>
          </LoadScript>
        </div>

      </div>
      </div>
    )
  }

  const DriverCard = () => {
    return (
      <div className='w-[600px] h-[350px]'>
        <h2>Get in the driver’s seat <br/> and get paid</h2>
        
        <button className='px-[30px] py-[15px] mt-10 rounded-[20px] bg-black hover:bg-[#79BE1D] transition ease-in-out duration-300 text-white'>
            <a href='/passenger' >Drive now</a>
          </button>
      </div>
    )
  }

  return (
    <>
      <Header />
      <section className='hero' style={{ backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(122, 189, 31, 0.73)),url(${Heroimg.src})` }}>
        <div className='container'>
          <div className='request--box'>
            <Tabs defaultActiveKey={1} items={items} onChange={onChange} />
            {tabId == 1 ? <UserCard /> : <DriverCard />}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}