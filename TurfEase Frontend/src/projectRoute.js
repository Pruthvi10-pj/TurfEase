import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import About from "./components/About";
import Home from "./components/Home";
import Event from "./components/Event";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Payment from "./components/Payment";
import Booking from "./components/Booking";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./protectedRoute";
import Profile from "./components/Profile";

const projectRoute = (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/event" element={<Event/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/payment" element={<Payment/>}/>
                <Route path="/book" element={<Booking/>} />
                <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/dashboard" element={ <ProtectedRoute><Dashboard/></ProtectedRoute> }/>
        </Routes>
    </BrowserRouter>
);


export default projectRoute;