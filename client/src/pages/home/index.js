import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '@/components/Header'
import Link from 'next/link'
import Heroimg from '../../../public/assets/fewa-banner.jpeg'
import Footer from '@/components/Footer'
import { GoogleMap, useJsApiLoader, Autocomplete, MarkerF } from '@react-google-maps/api';
import { Button, Tabs } from 'antd';
import { setAddress, setDropCords, setPickUpCords } from '../../redux/reducerSlice/rides';
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router'


export default function index() {
  const { pickUpAddr, pickUpCords, dropAddr, dropCords } = useSelector(state => state.rides)
  const [formStep, setFormStep] = useState(1)
  const [currentPosition, setCurrentPosition] = useState({})
  const [currentPositionDrop, setCurrentPositionDrop] = useState({})
  const router = useRouter;



  useEffect(() => {
    navigator?.geolocation?.getCurrentPosition(position => setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude }))
  }, [])
  const dispatch = useDispatch()
  const { isLoaded, loadError } = useJsApiLoader({ libraries: ['places'], googleMapsApiKey: "AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0" })
  const containerStyle = {
    width: '400px',
    height: '400px'
  };

  const center = { "lat": 27.6854872, "lng": 85.3447924 }
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

  const handleDragEnd = (e) => {
    const { lat, lng } = e.latLng
    const pickUpCords = { lat: lat(), lng: lng() }
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${pickUpCords.lat}&lon=${pickUpCords.lng}&apiKey=a1dd45a7dfc54f55a44b69d125722fcb`)
      .then(res => res.json())
      .then(data => dispatch(setAddress({ inputField: data.features[0].properties.formatted, flag: 'pickUpAddr' }))
      )
    setCurrentPosition(pickUpCords)
    dispatch(setPickUpCords(pickUpCords))
  }

  const handleDragEndDest = (e) => {
    debugger;
    const { lat, lng } = e.latLng
    const dropCords = { lat: lat(), lng: lng() }
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${dropCords.lat}&lon=${dropCords.lng}&apiKey=a1dd45a7dfc54f55a44b69d125722fcb`)
      .then(res => res.json())
      .then(data => dispatch(setAddress({ inputField: data.features[0].properties.formatted, flag: 'dropAddr' }))
      )
    setCurrentPositionDrop(dropCords)
    dispatch(setDropCords(dropCords))
  }


  const onChange = (key) => {
    setTabId(key)
  };
  const UserCard = () => {
    const pickUpRef = useRef(null);
    const dropRef = useRef(null);

    const handlePickUpChange = () => {
      dispatch(setAddress({ inputField: pickUpRef.current.value, flag: 'pickUpAddr' }))
    }
    const handleDestChange = () => {
      dispatch(setAddress({ inputField: dropRef.current.value, flag: 'dropAddr' }))
    }
    const generateCenter = () => {
      if (formStep === 1 && currentPosition.lat) {
        return currentPosition
      } else if (formStep === 2 && currentPositionDrop.lat) {
        return currentPositionDrop
      } else {
        return center
      }
    }

    const onLoad = marker => {


      console.log('marker: ', marker)
    }
    return (
      <div style={{ display: "flex", gap: '2rem' }}>
        <div className='pr-4'>
          <h2 className='font-bold  mt-2 leading-[60px]'>Let's begin our  <br /> <span className='text-[#79BE1D] font-bold'> Yatra</span> together </h2>
          <>
            {isLoaded && formStep == 1 && (
              <>

                <Autocomplete
                  className='mt-7 py-[15px] px-[10px] w-full border hover:border-[#79BE1D] rounded-[20px]  '
                  onPlaceChanged={handlePickUpChange}
                  key={1}>
                  <input type='text'
                    className='w-full outline-none'
                    ref={pickUpRef}
                    defaultValue={pickUpAddr}
                    placeholder='Pick up address' />
                </Autocomplete>
                <button className='bg-black px-8 rounded-[20px] mt-6 text-center hover:bg-[#79BE1D] transition ease-in-out duration-300 text-white py-[15px]' onClick={() => setFormStep(2)}>Next</button>
              </>
            )}


            {isLoaded && formStep == 2 && (
              <>
                <form>
                  <Autocomplete
                    onPlaceChanged={handleDestChange}
                    key={2}>
                    <input type='text'
                      className='mt-7  w-full border hover:border-[#79BE1D] rounded-[20px]'
                      ref={dropRef}
                      defaultValue={dropAddr}
                      // onChange={(e) => dispatch(setAddress({ inputField: e.target.value, flag: 'dropAddr' }))}
                      placeholder='Destination address' />
                  </Autocomplete>
                </form>
                <div className='flex gap-10'>
                  <button className='bg-black px-8 rounded-[20px] mt-6 text-center hover:bg-[#79BE1D] transition ease-in-out duration-300 text-white py-[15px]' onClick={() => setFormStep(1)}>Previous</button>
                  {formStep == 2 ? <Link href={'/map'} className='m-0 p-0'>
                    <button className='bg-black px-8 rounded-[20px] mt-6 text-center hover:bg-[#79BE1D] transition ease-in-out duration-300 text-white py-[15px] '>Proceed</button>
                  </Link> : null}
                </div>
              </>
            )}

          </>

        </div>
        <div>
          {isLoaded ? (
            <>


              <GoogleMap
                mapContainerStyle={containerStyle}
                center={generateCenter()}
                zoom={14}
              >
                {formStep === 1 && (
                  <MarkerF
                    onDragEnd={handleDragEnd}
                    draggable={true}
                    onLoad={onLoad}
                    position={currentPosition.lat ? currentPosition : center}
                  />
                )}
                {formStep === 2 && (
                  <MarkerF
                    onDragEnd={handleDragEndDest}
                    draggable={true}
                    // icon={"https://web.archive.org/web/20230701011019/https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
                    onLoad={onLoad}
                    position={currentPositionDrop.lat ? currentPositionDrop : center}
                  />
                )}


                { /* Child components, such as markers, info windows, etc. */}
                <></>
              </GoogleMap>
            </>

          ) : "loading"}


        </div>

      </div>
    )
  }

  const DriverCard = () => {
    return (
      <div className='py-5'>
        <h2 className='leading-[60px]'>Get in the driver’s <br />seat and get <span className='text-[#79BE1D] font-bold'>Paid! </span> </h2>
        <div className='btn'>
          <a className='bg-black px-8 rounded-[20px] mt-10 text-center hover:bg-[#79BE1D] transition ease-in-out duration-300 text-white py-[15px]' href='/driver' >Drive now</a>
        </div>
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