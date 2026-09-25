import { StrictMode, lazy, Suspense } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store/index'
//import App from './App'
const App = lazy(()=> import('./App'))
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
    <Suspense>
    <App />
    <Toaster
      toastOptions={{
        position : 'top-right',
        style : {
          background : '#283046',
          color : 'white'
        }
      }} 
    />
    </Suspense>
  </Provider>
  </BrowserRouter>,
)
