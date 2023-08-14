import '@/styles/globals.css'
import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react';
import store from '../redux/store/index'

// import { persistor, store } from '../redux/store/index';
export default function App({ Component, pageProps }) {
  return(
    <Provider store={store}>
      <Component {...pageProps} />
       {/* <PersistGate loading={null} persistor={persistor}>
       <Component {...pageProps} />
       </PersistGate> */}
    </Provider>
    )
}
