import './App.css'
import './Services/interceptor.jsx'
import './Services/i18n.jsx'
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Games from './Pages/Jeux.jsx'
import Codes from './Pages/Codes.jsx'
import StatsJeux from './Components/StatsJeux/StatsJeux.jsx'
import Navbar from './Components/Navbar/Navbar.jsx'
import Footer from './Components/Footer/Footer.jsx'
import NotFound from './Components/NotFound/NotFound.jsx'
import Login from './Components/Login/Login.jsx'
import Register from './Components/Register/Register.jsx'
import UserCollection from './Components/UserCollection/UserCollection.jsx'
import UserList from './Components/UserList/UserList.jsx';
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Navbar/>
          <div style={{paddingTop: '7rem'}}></div>
          <Routes>
            <Route path="/jeux" element={<Games/>} />
            <Route path="/" element={<StatsJeux/>} />
            <Route path="/codes" element={<Codes/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/userCollection" element={<UserCollection/>} />
            <Route path="/allUsers" element={<UserList/>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer/>
        </BrowserRouter>
      </div>
      <ToastContainer/>
    </>
  )
}

export default App