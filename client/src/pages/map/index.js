import React, { useState, useRef, useEffect } from 'react'
import styles from '../../styles/map.module.css'
import { Avatar, Popover, Tabs } from 'antd';
import { CommentOutlined, CarTwoTone, CustomerServiceOutlined, TwitterOutlined, CarOutlined, SmileOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import DOTTEDLINE from '../../../public/assets/dots-couple-with-a-vertical-line-union-svgrepo-com (3).svg'
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
import Image from 'next/image';
const URL = 'http://localhost:4000';

export const socket = io(URL);
const RideList = (props) => {
  return (
    <div className='flex flex-col gap-3'>
      {props.newRideList.length > 0 && props.newRideList.map(item => {
        return (
          <div className='border-gray-400 border-2 m-4 px-2 py-4 rounded-lg'>
            <div className='flex px-5 py-2 justify-around'>
              <div>              <Avatar
                size="large"
                style={{
                  backgroundColor: '#fde3cf',
                  color: '#f56a00',
                  fontSize: '1.5rem',
                  marginRight: '2rem',
                }}
              >
                {"A"}
              </Avatar>
                <span className='mt-2'>{item.passenger.fullName}</span></div>
              <div className='flex gap-3'>
                <button className='bg-black px-3 rounded-[5px] mt-2 text-center hover:bg-[#7ABD1F] transition ease-in-out duration-300 text-white  '>Accept</button>
                <button
                onClick={()=> props.removeRides(item._id)}
                className='bg-black px-3 rounded-[5px] mt-2 text-center hover:bg-[#db4f45] transition ease-in-out duration-300 text-white  '>Decline</button>
              </div>
            </div>
            <hr></hr>
            <div className='px-24 py-2'>
              <div className='text-green-600'>Offered Price:{item.bargainedPrice}</div>
              {item.bargainedPrice !== item.estimatedPrice ? <div className='text-red-600'><InfoCircleOutlined className='relative bottom-1 mr-1  ' />
                Estimated Price: Rs {item.estimatedPrice}</div> : null}
            </div>
            <div className=' flex'>
              <div className='flex flex-col justify-center relative left-3'>
                {item.distance / 1000}km
              </div>
              <div className=''>
                <Image src={DOTTEDLINE} alt="Picture of the author" width={70} />
              </div>
              <div className='flex flex-col justify-around'>
                <div>{item.pickUpAddr?.split(',')[0]}</div>
                <hr></hr>
                <div>{item.dropAddr?.split(',')[0]}</div>
              </div>
            </div>
          </div>
        )
      })}

    </div>
  )
}
export default function index() {

  const dispatch = useDispatch()
  const { userDetails } = useSelector(state => state.users)
  const userLogout = () => {
    dispatch(handleLogout())
  }
  const profileButtonContent = (
    <div>
      <Link href="/profile" className='block hover:text-green-500'>Profile</Link>
      <Link href="/" onClick={userLogout} className='block hover:text-red-500'>Logout</Link>
    </div>
  );
  const MapView = () => {
    const [newRideList, setNewRideList] = useState({})
    const fetchRides = async (page = 1, size = 10) => {
      const res = await fetch(`http://localhost:4000/rides`)
      const data = await res.json()
      setNewRideList(data.rideList)
  }
    useEffect(() => {
      fetchRides()
      socket.on('connection')

    }, []);
    useEffect(() => {
      socket.on('rideDetails', (rideDetails) => {
        setNewRideList(rideDetails)
  
      })
    })
    const removeRides=(removeId)=> {
      const existingRides = [...newRideList]
      debugger;
      const updatedList=  existingRides.filter((item)=>item._id !== removeId)
      setNewRideList(updatedList)
    }
    
    
    const [currentPositionDrop, setCurrentPositionDrop] = useState({})
    const [currentPosition, setCurrentPosition] = useState({})
    const [isMapDraggable, setIsMapDraggable] = useState(true)
    const handleMapDrag = () => {
      if (userDetails.mode == "Driver") {
        setIsMapDraggable(false);
      }
      else {
        return setIsMapDraggable(true)
      }
    }
    useEffect(() => {
      try{
        navigator?.geolocation?.getCurrentPosition(position => setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude }))
      }catch(err){
        console.log(err)
      }
      handleMapDrag()
    }, [])
    const { dropAddr, dropCords, pickUpAddr, pickUpCords } = useSelector(state => state.rides)
    const { userDetails } = useSelector(state => state.users)
    const pickUpRef = useRef(null);
    const dropRef = useRef(null);
    const [isEdit, setIsEdit] = useState(false)
    const [isBargained, setIsBargained] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState('Bike')
    const distance = getDistance(
      pickUpCords,
      dropCords
    );
    const { isLoaded } = useJsApiLoader({ libraries: ['places'], googleMapsApiKey: "AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0" })
    const mapContainerStyle = { width: '70vw', height: '95vh' };
    const { pricePerUnitKm, basePrice, nightPricePercentile } = priceMapping[selectedVehicle]
    const initialPrice = (pricePerUnitKm * (distance / 1000)) + basePrice
    const [estimatedPrice, setEstimatedPrice] = useState(Math.ceil(initialPrice))
    const [fixedEstimatedPrice, setFixedEstimatedPrice] = useState(Math.ceil(initialPrice))
    const [isActivelyRequestingRide, setIsActivelyRequestingRide] = useState(false)

    const handleSetChangePrice = (e) => {
      const estPrice = Number(e.target.textContent)
      if (estPrice > (estimatedPrice - 50)) {
        setEstimatedPrice(Number(e.target.textContent))
      } else {
        setEstimatedPrice(fixedEstimatedPrice)
      }
      setIsBargained(true)
    }

    useEffect(() => {
      setEstimatedPrice(Math.ceil(initialPrice))
      setFixedEstimatedPrice(Math.ceil(initialPrice))
    }, [selectedVehicle])
    useEffect(() => {
      setIsActivelyRequestingRide(false)
    }, [distance])
    const handlePickUpEnd = (e) => {
      const { lat, lng } = e.latLng
      const pickUpCords = { lat: lat(), lng: lng() }
      fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${pickUpCords.lat}&lon=${pickUpCords.lng}&apiKey=a1dd45a7dfc54f55a44b69d125722fcb`)
        .then(res => res.json())
        .then(data => dispatch(setAddress({ inputField: data.features[0].properties.formatted, flag: 'pickUpAddr' }))
        )
      setCurrentPosition(pickUpCords)
      dispatch(setPickUpCords(pickUpCords))
    }
    const generateCenter = () => {
      if (pickUpCords.lat) {
        return pickUpCords
      } else {
        return center
      }
    }
    const handleDropEnd = (e) => {
      const { lat, lng } = e.latLng
      const dropCords = { lat: lat(), lng: lng() }
      fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${dropCords.lat}&lon=${dropCords.lng}&apiKey=a1dd45a7dfc54f55a44b69d125722fcb`)
        .then(res => res.json())
        .then(data => dispatch(setAddress({ inputField: data.features[0].properties.formatted, flag: 'dropAddr' }))
        )
      setCurrentPositionDrop(dropCords)
      dispatch(setDropCords(dropCords))
    }

    const onLoad = marker => {
      console.log('marker: ', marker)
    }
    const center = { "lat": 27.6854872, "lng": 85.3447924 }
    const handlePickUpChange = () => {
      dispatch(setAddress({ inputField: pickUpRef.current.value, flag: 'pickUpAddr' }))
    }
    const handleDestChange = () => {
      dispatch(setAddress({ inputField: dropRef.current.value, flag: 'dropAddr' }))
    }

    const UserRideForm = () => {
      const handleRideRequest = (request) => {
        if (request == 'request') {
          setIsActivelyRequestingRide(true)
          const rideDetails = {
            dropAddr,
            dropCords,
            pickUpAddr,
            pickUpCords,
            bargainedPrice: estimatedPrice,
            distance,
            estimatedPrice: fixedEstimatedPrice,
            passenger: userDetails._id,
            vehicleType: selectedVehicle
          }
            ;
          socket.emit("rideDetails", rideDetails);
        }
        else if (request == 'cancel') {
          setIsActivelyRequestingRide(false)
        }

      }
      return (
        <div>
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

                  {isBargained && <div className='text-green-600 mt-1 mb-2'  >
                    <InfoCircleOutlined className='relative bottom-1 mr-1 ' />
                    Estimated Price: Rs {fixedEstimatedPrice}
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
                        <span className='text-xl mt-1 text-green-500'>NPR</span>
                        <div className='text-xl mt-1 text-green-500' onBlur={handleSetChangePrice} contentEditable={isEdit}>{estimatedPrice} </div>
                      </div>

                      <button onClick={() => {
                        setEstimatedPrice(estimatedPrice + 10)
                        setIsBargained(true)
                      }} className=' px-3 py-1   rounded-lg bg-black text-white border-2 hover:border-green-600'>+10 </button>
                    </div>
                  </div>

                </div>
                <div className=''>
                  {!isActivelyRequestingRide ? <button
                    onClick={() => handleRideRequest('request')}
                    className='bg-black px-8 rounded-[20px] mt-6 text-center hover:bg-[#7ABD1F] transition ease-in-out duration-300 text-white py-[15px]'
                  >Request Ride</button> : <button
                    onClick={() => handleRideRequest('cancel')}
                    className='bg-black px-8 rounded-[20px] mt-6 text-center hover:bg-[#7ABD1F] transition ease-in-out duration-300 text-white py-[15px]'
                  >Cancel Ride</button>}
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
              {userDetails.mode !== "Driver" ? <Tabs onChange={(text) => setSelectedVehicle(text)} defaultActiveKey="Bike" items={[
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
              ]} style={{
                background: 'white',
              }} centered={true} /> : null}
              {userDetails.mode !== 'Driver' ? <UserRideForm /> : <RideList
              removeRides= {removeRides}
              newRideList={newRideList} />}
              {/* {userDetails.mode !== 'Driver' ? <UserRideForm /> : <div>{JSON.stringify(newRideList)}</div>} */}
            </div>
            <div className='col-span-7'>
              <div style={{ display: "flex", gap: '2rem' }}>
                {isLoaded ? (
                  <>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={generateCenter()}
                      zoom={13}
                    >
                      <MarkerF
                        draggable={isMapDraggable}
                        onDragEnd={handlePickUpEnd}
                        onLoad={onLoad}
                        position={pickUpCords}
                      />
                      <MarkerF
                        onDragEnd={handleDropEnd}
                        // icon={"https://web.archive.org/web/20230701011019/https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
                        onLoad={onLoad}
                        draggable={isMapDraggable}
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
  return (
    <>
      <div className='w-screen h-10vh bg-black flex justify-between p-5 ' style={{
        borderBottom: '5px solid green ',
        borderRadius: '2px',
      }}>
        <div className='w-28 flex hover:cursor-pointer'><CustomLogo /></div>
        <div className=''>

          <Popover placement="bottom" title={userDetails?.fullName} content={profileButtonContent} trigger="click">
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



