import React, { useState, useRef, useEffect } from 'react'
import styles from '../../styles/map.module.css'
import { Avatar, Popover, Tabs } from 'antd';
import { CommentOutlined, CarTwoTone, CustomerServiceOutlined, TwitterOutlined, CarOutlined, SmileOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

import priceMapping from '../../config/priceMapping.json'
import { GoogleMap, useJsApiLoader, Autocomplete, MarkerF, Polyline } from '@react-google-maps/api';
import { setAddress, setDropCords, setPickUpCords } from '../../redux/reducerSlice/rides'
import { getDistance } from 'geolib';
import { useDispatch, useSelector } from 'react-redux'
import { CustomLogo } from '@/components/Logo';
import { handleLogout } from '../../redux/reducerSlice/users'
import { useRouter } from 'next/router';
import Link from 'next/link';


export default function index() {
  const { pickUpAddr, pickUpCords, dropAddr, dropCords } = useSelector(state => state.rides)
  const [formStep, setFormStep] = useState(1)
  const [currentPosition, setCurrentPosition] = useState({})
  const [currentPositionDrop, setCurrentPositionDrop] = useState({})


  useEffect(() => {
    navigator?.geolocation?.getCurrentPosition(position => setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude }))
  }, [])
  const dispatch = useDispatch()
  const { isLoaded, loadError } = useJsApiLoader({ libraries: ['places'], googleMapsApiKey: "AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0" })
  const containerStyle = {
    width: '100vw',
    height: '95vh'
  };

  const center = { "lat": 27.6854872, "lng": 85.3447924 }
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

  const FloatBtn = (props) => (
    <>
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{
          right: 94,
        }}
        icon={<CommentOutlined />}
      >
        <FloatButton onClick={() => props.setSelectedVehicle('car')} icon={<CarTwoTone />} />
        <FloatButton onClick={() => props.setSelectedVehicle('bike')} icon={<CommentOutlined />} />
      </FloatButton.Group>
    </>
  );

  const MapView = () => {


    const pickUpRef = useRef(null);
    const dropRef = useRef(null);
    const [isEdit, setIsEdit] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState('bike')
    // const handlePickUpChange = ()=> {
    //   dispatch(setAddress({inputField: pickUpRef.current.value, flag:'pickUpAddr'}))
    // }

    const distance = getDistance(
      pickUpCords,
      dropCords
    );
    // const handleDestChange = ()=> {
    //   dispatch(setAddress({inputField: destRef.current.value, flag:'dropAddr'}))
    // }
    const { pricePerUnitKm, basePrice, nightPricePercentile } = priceMapping[selectedVehicle.toLowerCase()]
    const generateCenter = () => {
      if (pickUpCords.lat) {
        return pickUpCords
      } else {
        return center
      }
    }
    const initialPrice = (pricePerUnitKm * (distance / 1000)) + basePrice
    const [estimatedPrice, setEstimatedPrice] = useState(Math.ceil(initialPrice))

    useEffect(() => {
      setEstimatedPrice(Math.ceil(initialPrice))
    }, [selectedVehicle])

    const onLoad = marker => {
      console.log('marker: ', marker)
    }

    return (
      <div >
        {isLoaded ? (
          <div>          <GoogleMap
            mapContainerStyle={containerStyle}
            center={generateCenter()}
            zoom={12}
          >
            <MarkerF
              draggable={true}
              onDragEnd={handleDragEnd}
              onLoad={onLoad}
              position={pickUpCords}
            />
            <div className={styles.mapDrp}>
              <p>
                Distance: {distance / 1000}  km
              </p>
              <p>
                Estimated Price: Rs {estimatedPrice}
              </p>
              <div className={styles.bargain_price}>
                <p onClick={() => setIsEdit(true)}>Offer your price
                  <button onClick={() => setEstimatedPrice(estimatedPrice + 10)}>+ 10 </button>
                  <span contentEditable={isEdit}>NPR {estimatedPrice}</span>

                  <button
                    onClick={() => {
                      if (estimatedPrice <= Math.ceil(initialPrice) - 50) return
                      setEstimatedPrice(estimatedPrice - 10)
                    }
                    }
                  >- 10</button>
                </p>
              </div>
            </div>

            <MarkerF
              onDragEnd={handleDragEndDest}
              // icon={"https://web.archive.org/web/20230701011019/https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
              onLoad={onLoad}
              draggable={true}
              position={dropCords}
            />

            {/* <FloatBtn /> */}

            { /* Child components, such as markers, info windows, etc. */}
            <></>
          </GoogleMap></div>
        ) : "loading"}

      </div>
    )
  }
  //user card
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
      <div>      <div style={{ display: "flex", gap: '2rem' }}>
        <div className='pr-4'>
          <>

            {isLoaded && (
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

              </>
            )}


            {isLoaded && (
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

              </>
            )}

          </>
          <div className='bg-black px-8 rounded-[20px] mt-6 text-center hover:bg-[#79BE1D] transition ease-in-out duration-300 text-white py-[15px]'>
            <Link href='/map' >Proceed</Link>
          </div>
        </div>
        <div>
        </div>
      </div></div>
    )
  }
  //navbar
  const router = useRouter()
  const userLogout = () => {
    dispatch(handleLogout())
  }
  const { isLoggedIn, userDetails } = useSelector(state => state.users)
  const content = (
    <div>
      <Link href="/profile">Profile</Link>
      <p onClick={userLogout}>Logout</p>
    </div>
  );
  const vehiclesItems = [
    {
      key: 'Bike',
      label: <span>Bike <TwitterOutlined /></span>,

    },
    {
      key: 'Car',
      label: <span>Car <CarOutlined /></span>,

    },
    {
      key: 'Boat',
      label: <span>Boat <SmileOutlined /></span>,
    },
  ];
  //for map and simple card

  const [isEdit, setIsEdit] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState('bike')
  // const handlePickUpChange = ()=> {
  //   dispatch(setAddress({inputField: pickUpRef.current.value, flag:'pickUpAddr'}))
  // }

  const distance = getDistance(
    pickUpCords,
    dropCords
  );
  // const handleDestChange = ()=> {
  //   dispatch(setAddress({inputField: destRef.current.value, flag:'dropAddr'}))
  // }
  const { pricePerUnitKm, basePrice, nightPricePercentile } = priceMapping[selectedVehicle.toLowerCase()]
  const generateCenter = () => {
    if (pickUpCords.lat) {
      return pickUpCords
    } else {
      return center
    }
  }
  const initialPrice = (pricePerUnitKm * (distance / 1000)) + basePrice
  const [estimatedPrice, setEstimatedPrice] = useState(Math.ceil(initialPrice))

  const onLoad = marker => {
    console.log('marker: ', marker)
  }


  return (
    <>
      <div className='w-screen h-10vh bg-black flex justify-between p-5 ' style={{
        borderBottom: '5px solid green ',
        borderRadius: '2px',
      }}>
        <div className='w-28 flex hover:cursor-pointer'><CustomLogo /></div>
        <div className=''>

          <Popover placement="bottom" title={userDetails?.fullName} content={content} trigger="click">

            <Avatar
              size="large"
              style={{
                backgroundColor: '#fde3cf',
                color: '#f56a00',
                fontSize: '1.5rem',
                marginRight: '2rem',
              }}
            >
              {userDetails?.fullName?.[0]}
            </Avatar>
          </Popover>
        </div>
      </div>
      <div >

        <MapView />
      </div>

    </>
  )
}


