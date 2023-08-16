import React, { useState, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '@/components/Header'
import Heroimg from '../../../public/assets/fewa-banner.jpeg'
import Footer from '@/components/Footer'
import { GoogleMap ,useJsApiLoader ,Autocomplete} from '@react-google-maps/api';
import { Tabs } from 'antd';
import {setAddress} from '../../redux/reducerSlice/rides'
export default function index() {
  const dispatch =useDispatch()
  const { isLoaded, loadError } = useJsApiLoader({ libraries: ['places'], googleMapsApiKey: "AIzaSyDLfjmFgDEt9_G2LXVyP61MZtVHE2M3H-0" })
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
  const UserCard = ()=>{
    const pickUpRef = useRef(null);
    const handlePickUpChange = ()=> {
      dispatch(setAddress({inputField: pickUpRef.current.value, flag:'pickUpAddr'}))
    }
    const handleDestChange = ()=> {
      dispatch(setAddress({inputField: pickUpRef.current.value, flag:'destAddr'}))
    }

    
    
    return(
      <div style={{ display:"flex", gap:'2rem'}}>
        <div>
           <h2>Request a ride now </h2>
              <form>
                {isLoaded && (
                <>
               <Autocomplete 
                onPlaceChanged={handlePickUpChange}
               key={1}>
               <input type='text' 
                ref={pickUpRef}
               onChange={(e)=> dispatch(setAddress({inputField: e.target.value, flag:'pickUpAddr'}))} 
               placeholder='Pick up address'/>
               </Autocomplete>
               <Autocomplete
                   onPlaceChanged={handleDestChange}
                   key={2}>
                <input
                onChange={(e)=> dispatch(setAddress({inputField: e.target.value, flag:'destAddr'}))} 
                type='text' placeholder='Drop off address'/>
                    </Autocomplete>
                  </>
                )}
            
                  </form>
                <div className='btn'>
                  <a href='/passenger' >Request now</a>
                </div>
        </div>
                <div>
      {isLoaded ? (
        <>
         
          <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
     
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