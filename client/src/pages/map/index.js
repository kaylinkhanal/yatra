import React, { useState, useRef, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/map.module.css'
import { CommentOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import priceMapping from '../../config/priceMapping.json'
import { GoogleMap ,useJsApiLoader ,Autocomplete,MarkerF} from '@react-google-maps/api';
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
      width: '100vw',
      height: '100vh'
    };

const center = {"lat":27.6854872,"lng":85.3447924}
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

  const FloatBtn = () => (
    <>
    
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{
          right: 94,
        }}
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton />
        <FloatButton icon={<CommentOutlined />} />
      </FloatButton.Group>
    </>
  );

  const MapView = ()=>{
    

    const pickUpRef = useRef(null);
    const destRef = useRef(null);
    const [selectedVehicle, setSelectedVehicle] = useState('bike')
    const handlePickUpChange = ()=> {
      dispatch(setAddress({inputField: pickUpRef.current.value, flag:'pickUpAddr'}))
    }
    const distance = 100
    const handleDestChange = ()=> {
      dispatch(setAddress({inputField: destRef.current.value, flag:'dropAddr'}))
    }
    const {pricePerUnitKm,basePrice,nightPricePercentile } =priceMapping[selectedVehicle]
    const generateCenter = () => {
      if(pickUpCords.lat){
        return pickUpCords
      }else{
        return center
      }
    }
    
    const onLoad = marker => {
      console.log('marker: ', marker)
    }
    return(
      <div style={{ display:"flex", gap:'2rem'}}>
    
      {isLoaded ? (
        <>
         
          <GoogleMap
          mapContainerStyle={containerStyle}
          center={generateCenter()}
          zoom={12}
        >
              <MarkerF 
              onDragEnd={handleDragEnd}
              onLoad={onLoad}
              position={pickUpCords}
              />
          <div className={styles.mapDrp}>
            <p>
            distance: {distance}  km 
            </p>
            <p>
            estimated price: {(pricePerUnitKm * distance) + basePrice }  Nrs 
            <button onClick={()=>set}>Edit</button>
            </p>
          </div>
       
            <MarkerF 
            onDragEnd={handleDragEndDest}
            // icon={"https://web.archive.org/web/20230701011019/https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
            onLoad={onLoad}
            position={dropCords}
            />
          <FloatBtn/>
           
          { /* Child components, such as markers, info windows, etc. */ }
          <></>
        </GoogleMap>
        </>
       
      ): "loading"}
        
      
  
              
      </div>
    )
  }



  return (
    <>
          <div>
             <MapView/> 
            </div>
     </>
  )
}