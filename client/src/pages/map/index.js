import React, { useState, useRef, useEffect } from 'react'
import styles from '../../styles/map.module.css'
import { Avatar, Popover, Tabs } from 'antd';
import { CommentOutlined, CarTwoTone, CustomerServiceOutlined, TwitterOutlined, CarOutlined, SmileOutlined, InfoCircleOutlined } from '@ant-design/icons';
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
import { io } from 'socket.io-client';
const URL = 'http://localhost:4000';

export const socket = io(URL);
export default function index() {

  const [currentPositionDrop, setCurrentPositionDrop] = useState({})
  const [currentPosition, setCurrentPosition] = useState({})
  useEffect(() => {
    socket.on('connection');
  }, []);

  const [mapWidth, setMatWidth] = useState('70vw')
  const { pickUpAddr, pickUpCords, dropAddr, dropCords } = useSelector(state => state.rides)
  useEffect(() => {
    navigator?.geolocation?.getCurrentPosition(position => setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude }))
  }, [])
  const dispatch = useDispatch()
  const { isLoaded, loadError } = useJsApiLoader({ libraries: ['places'], googleMapsApiKey: "AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0" })
  const containerStyle = {
    width: mapWidth,
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
    

    const {dropAddr,dropCords,pickUpAddr,pickUpCords} = useSelector(state=>state.rides)
    const {userDetails} = useSelector(state=>state.users)

    const pickUpRef = useRef(null);
    const dropRef = useRef(null);
    const [isEdit, setIsEdit] = useState(false)
    const [isBargained, setIsBargained] = useState(false)
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
    const [fixedEstimatedPrice, setFixedEstimatedPrice] = useState(Math.ceil(initialPrice))
    const handleSetChangePrice = (e)=> {
     
      const estPrice =Number(e.target.textContent)
      if(estPrice> (estimatedPrice-50) ){
       setEstimatedPrice(Number(e.target.textContent))
      }else{
        setEstimatedPrice(fixedEstimatedPrice)
      }
      setIsBargained(true)
     }
    useEffect(() => {
      setEstimatedPrice(Math.ceil(initialPrice))
      setFixedEstimatedPrice(Math.ceil(initialPrice))
    }, [selectedVehicle])

    const handleRideRequest =()=> {
      const rideDetails ={
        dropAddr,
        dropCords,
        pickUpAddr,
        pickUpCords,
        bargainedPrice: estimatedPrice,
        distance,
        estimatedPrice: fixedEstimatedPrice,
        passenger: userDetails._id
      }
      socket.emit("rideDetails", rideDetails);

    }
    const onLoad = marker => {
      console.log('marker: ', marker)
    }

    const UserRideForm= () => {
      return (
        <div>
 <Tabs onChange={(text) => setSelectedVehicle(text)} defaultActiveKey="1" items={vehiclesItems} style={{
          background: 'white',
        }} centered={true} />
        <div className='flex justify-center'>
          <div>
            <div className='pr-4 '>
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
                        key={1}>
                        <input type='text'
                          className='mt-7  w-full border hover:border-[#79BE1D] rounded-[20px]'
                          ref={dropRef}
                          defaultValue={dropAddr}
                          onChange={(e) => dispatch(setAddress({ inputField: e.target.value, flag: 'dropAddr' }))}
                          placeholder='Destination address' />
                      </Autocomplete>
                    </form>
                  </>
                )}

              </>
              <div >
              <p className='mt-2 mb-2'>
                Distance: {distance / 1000}  km
              </p>
               <div className='text-green-600 mt-1 mb-2'  >
                  <InfoCircleOutlined className='relative bottom-1 mr-1 ' />
                  Estimated Price: Rs {fixedEstimatedPrice}
                </div>
            
              {isBargained && <div className='text-green-600 mt-1 mb-2'  >
                  <InfoCircleOutlined className='relative bottom-1 mr-1 ' />
                  offered Price: Rs {estimatedPrice}
                </div>}
                <div onClick={() => setIsEdit(true)} className='mt-4 mb-4' >
                  <div className='text-gray-500'> Offer your price </div>
                  <div className='mt-2 flex gap-5 justify-center align-top'>
                    <button
                      className='text-black px-3 py-1  rounded-lg bg-black text-white border-2 hover:border-red-700'
                      onClick={() => {
                        if (estimatedPrice <= Math.ceil(initialPrice) - 50) return
                        setEstimatedPrice(estimatedPrice - 10)
                        setIsBargained(true)
                      }
                      }

                    >- 10</button>

                    <div className='flex gap-1 hover:cursor-pointer '>
                      NPR
                      <div className={styles.offer_input} onBlur={handleSetChangePrice} contentEditable={isEdit}>{estimatedPrice} </div> 
                    </div>

                    <button onClick={() =>{
                        setEstimatedPrice(estimatedPrice + 10)
                        setIsBargained(true)
                    }} className=' px-3 py-1   rounded-lg bg-black text-white border-2 hover:border-green-600'>+10 </button>
                  </div>
                </div>
               
              </div>
              <div className='bg-black text-white rounded-lg py-2 px-16  w-10 hover:bg-[#7ABD1F] transition ease-in-out duration-300  flex justify-center mt-5'>
                <button
                onClick={handleRideRequest}
                 className='text-black px-3 py-1  rounded-lg bg-black text-white border-2 hover:border-red-700'
                >Proceed</button>
              </div>
            </div>

            
            <div>
            </div>
          </div>
        </div>
        </div>
       
      )
    }


    return (
      <div>
        <>
          <div className=' grid grid-cols-10 '>
            <div className='h-screen bg-white col-span-3'>
              {userDetails.mode !== 'Driver' ? <UserRideForm/> : "hello"}
            </div>
            <div className='col-span-7'>
              <div style={{ display: "flex", gap: '2rem' }}>
                {isLoaded ? (
                  <>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={generateCenter()}
                      zoom={13}
                    >
                      <MarkerF
                        draggable={true}
                        onDragEnd={handleDragEnd}
                        onLoad={onLoad}
                        position={pickUpCords}
                      />
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
                    </GoogleMap>
                  </>
                ) : "loading"}
              </div>
            </div>
          </div>

        </>

      </div>
    )
  }

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

  const onLoad = marker => {
    console.log('marker: ', marker)
  }
  //usercard content
  const pickUpRef = useRef(null);
  const dropRef = useRef(null);

  const handlePickUpChange = () => {
    dispatch(setAddress({ inputField: pickUpRef.current.value, flag: 'pickUpAddr' }))
  }
  const handleDestChange = () => {
    dispatch(setAddress({ inputField: dropRef.current.value, flag: 'dropAddr' }))
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
      <div className='flex '>
        <div ><MapView /></div>
      </div>

    </>
  )
}



