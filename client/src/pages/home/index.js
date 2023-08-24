import React, { useState, useRef, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '@/components/Header'
import Link from 'next/link'
import Heroimg from '../../../public/assets/fewa-banner.jpeg'
import Footer from '@/components/Footer'
import { GoogleMap ,useJsApiLoader ,Autocomplete,MarkerF} from '@react-google-maps/api';
import { Tabs } from 'antd';
import {setAddress,setDropCords, setPickUpCords} from '../../redux/reducerSlice/rides'
export default function index() {
  const {pickUpAddr,pickUpCords,dropAddr, dropCords} = useSelector(state=>state.rides)    
  const [formStep, setFormStep] = useState(1)
  const [currentPosition, setCurrentPosition]= useState({})
  const [currentPositionDrop, setCurrentPositionDrop]= useState({})

 
  
  useEffect(() => {
      navigator?.geolocation?.getCurrentPosition(position=>setCurrentPosition({lat: position.coords.latitude, lng: position.coords.longitude}))
  }, [])
  const dispatch =useDispatch()
  const { isLoaded, loadError } = useJsApiLoader({ libraries: ['places'], googleMapsApiKey: "AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0" })
const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {"lat":27.6854872,"lng":85.3447924}
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

  const handleDragEnd = (e)=> {
   const {lat, lng}  = e.latLng
    const pickUpCords = {lat:lat(), lng: lng()}
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${pickUpCords.lat}&lon=${pickUpCords.lng}&apiKey=a1dd45a7dfc54f55a44b69d125722fcb`)
    .then(res => res.json())
    .then(data =>  dispatch(setAddress({inputField: data.features[0].properties.formatted, flag:'pickUpAddr'}))
        )
    setCurrentPosition(pickUpCords)
   dispatch(setPickUpCords(pickUpCords))
  }

  const handleDragEndDest = (e)=> {
    debugger;
    const {lat, lng}  = e.latLng
     const dropCords = {lat:lat(), lng: lng()}
     fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${dropCords.lat}&lon=${dropCords.lng}&apiKey=a1dd45a7dfc54f55a44b69d125722fcb`)
     .then(res => res.json())
     .then(data =>  dispatch(setAddress({inputField: data.features[0].properties.formatted, flag:'dropAddr'}))
         )
     setCurrentPositionDrop(dropCords)
    dispatch(setDropCords(dropCords))
   }

  
  const onChange = (key) => {
    setTabId(key)
  };
  const UserCard = ()=>{
    const pickUpRef = useRef(null);
    const destRef = useRef(null);

    const handlePickUpChange = ()=> {
      dispatch(setAddress({inputField: pickUpRef.current.value, flag:'pickUpAddr'}))
    }
    const handleDestChange = ()=> {
      dispatch(setAddress({inputField: destRef.current.value, flag:'dropAddr'}))
    }
    const generateCenter = () => {
      if(formStep ===1 &&  currentPosition.lat){
        return currentPosition
      }else if(formStep ===2 &&  currentPositionDrop.lat){
        return currentPositionDrop
      }else{
        return center
      }
    }
    
    const onLoad = marker => {
      console.log('marker: ', marker)
    }
    return(
      <div style={{ display:"flex", gap:'2rem'}}>
        <div>
           <h2>Request a ride now </h2>
              <>
                {isLoaded && formStep ==1 && (
                  <>
           
                  <Autocomplete
                    onPlaceChanged={handlePickUpChange}
                    key={1}>
                <input type='text' 
                    ref={pickUpRef}
                   defaultValue={pickUpAddr}
                  placeholder='Pick up address'/>
                  </Autocomplete>
                  <button onClick={()=> setFormStep(2)}>Next</button>
                  </>
                )}


              {isLoaded && formStep== 2 && (
                  <>
                <form>
                  <Autocomplete 
                    onPlaceChanged={handleDestChange}
                  key={1}>
                  <input type='text' 
                    ref={destRef}
                    defaultValue={dropAddr}
                  placeholder='Destination address'/>
                  </Autocomplete>
                  </form>
                  <button onClick={()=>setFormStep(1)}>Previous</button>
                  </>
                )}

                  </>
                <div className='btn'>
                  <Link href='/map' >Proceed</Link>
                </div>
        </div>
                <div>
      {isLoaded ? (
        <>
         
          <GoogleMap
          mapContainerStyle={containerStyle}
          center={generateCenter()}
          zoom={14}
        >
            {formStep===1 && (
              <MarkerF 
              onDragEnd={handleDragEnd}
              draggable ={true}
              onLoad={onLoad}
              position={currentPosition}
              />
            )}
            {formStep === 2 && (
            <MarkerF 
            onDragEnd={handleDragEndDest}
            draggable ={true}
            // icon={"https://web.archive.org/web/20230701011019/https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
            onLoad={onLoad}
            position={currentPositionDrop.lat ? currentPositionDrop: center}
            />
            )}
        
           
          { /* Child components, such as markers, info windows, etc. */ }
          <></>
        </GoogleMap>
        </>
       
      ): "loading"}
        
      
                </div>
              
      </div>
    )
  }

  const DriverCard = ()=>{
    return(
      <div>
            <h2>Get in the driver’s <br/>seat and get paid</h2>
                <div className='btn'>
                  <a href='/driver' >Drive now</a>
                </div>
      </div>
    )
  }

  return (
    <>
      <Header/>
        <section className='hero' style={{backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(122, 189, 31, 0.73)),url(${Heroimg.src})`}}>
          <div className='container'>
            <div className='request--box'>
            <Tabs defaultActiveKey={1} items={items} onChange={onChange} />
             {tabId==1 ? <UserCard/> : <DriverCard/>}
            </div>
          </div>
        </section>
      <Footer/>
     </>
  )
}