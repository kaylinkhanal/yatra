import React, { useState, useRef, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/map.module.css'
import { CommentOutlined,CarTwoTone , CustomerServiceOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';

import priceMapping from '../../config/priceMapping.json'
import { GoogleMap ,useJsApiLoader ,Autocomplete,MarkerF,Polyline} from '@react-google-maps/api';
import {setAddress,setDropCords, setPickUpCords} from '../../redux/reducerSlice/rides'
import { getDistance } from 'geolib';
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
        <FloatButton onClick={()=> props.setSelectedVehicle('car')} icon={<CarTwoTone/>}/>
        <FloatButton onClick={()=> props.setSelectedVehicle('bike')} icon={<CommentOutlined />} />
      </FloatButton.Group>
    </>
  );

  const MapView = ()=>{
    

    const pickUpRef = useRef(null);
    const destRef = useRef(null);
    const  [isEdit, setIsEdit] = useState(false)
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
    const {pricePerUnitKm,basePrice,nightPricePercentile } =priceMapping[selectedVehicle]
    const generateCenter = () => {
      if(pickUpCords.lat){
        return pickUpCords
      }else{
        return center
      }
    }
    const initialPrice =(pricePerUnitKm * (distance/1000)) + basePrice

    const [estimatedPrice, setEstimatedPrice] = useState(Math.ceil(initialPrice))

    useEffect(() => {
      setEstimatedPrice(Math.ceil(initialPrice))
  }, [selectedVehicle])

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
                 draggable={true}
              onDragEnd={handleDragEnd}
              onLoad={onLoad}
              position={pickUpCords}
              />
          <div className={styles.mapDrp}>
            {selectedVehicle}
            <p>
            Distance: {distance/1000}  km 
            </p>
            <p>
            Estimated Price: Rs {estimatedPrice}
            </p>
            <div className={styles.bargain_price}>
            <p onClick={()=>setIsEdit(true)}>Offer your price
               <button onClick={()=>setEstimatedPrice(estimatedPrice+10)}>+ 10 </button>
               NPR  <span onBlur={(e)=>setEstimatedPrice(parseInt(e.target.textContent))} contentEditable={isEdit}>{estimatedPrice}</span>
               
                <button
                 onClick={()=>{
                  if(estimatedPrice <= Math.ceil(initialPrice) - 50) return
                 setEstimatedPrice(estimatedPrice-10)
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
           
          <FloatBtn setSelectedVehicle={setSelectedVehicle}/>
           
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