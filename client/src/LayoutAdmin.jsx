import Footer from './pages/Footer'
import Header from './pages/Adminheader'
import {Outlet} from "react-router-dom"

export default function Layoutadmin() {
  return (
    <div className='flex flex-col min-h-screen'> 
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}