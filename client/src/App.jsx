/* eslint-disable no-unused-vars */
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './Layout'
import LoginPage from './pages/LoginPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import UserAccountPage from './pages/UserAccountPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AddEvent from './pages/AddEvent'
import EventPage from './pages/EventPage'
import CalendarView from './pages/CalendarView'
import OrderSummary from './pages/OrderSummary'
import PaymentSummary from './pages/PaymentSummary'
import TicketPage from './pages/TicketPage'
import VolunteerForm from './pages/Volunteer'
import FeedbackSession from './pages/FeedbackSession';
import CreatEvent from './pages/CreateEvent'
import Boothmap from './pages/Boothmap'
import AdminLoginPage from './pages/Adminsignup'
import AdminDashboard from './pages/AdminIndexPage'
import Layoutadmin from './Layoutadmin'
import EventList from './pages/EditEvent'
import AdminFeedback from './pages/Adminfeedback'
import VolunteerList from './pages/Payvolunteer'
import VolunteerPayment from './pages/Paysalary'

axios.defaults.baseURL = 'http://localhost:4000/';
axios.defaults.withCredentials=true;

function App() {
  return (
    <UserContextProvider> 
    <Routes>
            
      <Route path='/' element={<Layout />}>
        <Route index element = {<IndexPage />} />
        <Route path='/boothmap' element={<Boothmap/>}/>
        <Route path='/useraccount' element = {<UserAccountPage />}/>
        <Route path='/feedback-session' element={<FeedbackSession/>} />
        <Route path='/createEvent' element = {<AddEvent/>} />
        <Route path='/event/:id' element= {<EventPage/>} />
        <Route path="/volunteer" element={<VolunteerForm/>} />
        <Route path='/calendar' element={<CalendarView />} />
        <Route path='/wallet' element={<TicketPage />}/>
        <Route path='/event/:id/ordersummary' element = {<OrderSummary />} />
      </Route>
      <Route path='/admin-dashboard' element={<Layoutadmin/>}>
  <Route index element={<AdminDashboard />} />
  <Route path='event-details' element={<EventList />} /> 
  <Route path='booth-map' element={<Boothmap />} /> 
  <Route path='calendar' element={<CalendarView />} /> 
  <Route path='feedbacks' element={<AdminFeedback />} /> 
  <Route path='volunteer-salary' element={<VolunteerList />} /> 


</Route>
      <Route path='/volunteer/:id/pay' element={<VolunteerPayment />}/>
      <Route path='/register' element={<RegisterPage />}/>
      <Route path='/admin' element={<AdminLoginPage/>}/>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/forgotpassword' element = {<ForgotPassword/>} />
      <Route path='/resetpassword' element = {<ResetPassword/>} />
      <Route path='/event/:id/ordersummary/paymentsummary' element = {<PaymentSummary />} />
      
    
    </Routes>
    </UserContextProvider>  
  )
}

export default App
