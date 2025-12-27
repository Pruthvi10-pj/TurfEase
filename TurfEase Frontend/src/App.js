import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

import { Outlet } from 'react-router'

export default function App() {
  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}
