import React, { useEffect } from 'react'
import Headers from '../components/Headers/Headers'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/Footer/Footer'

const Root = () => {
  const location = useLocation()
  useEffect(()=>{
    window.scrollTo(0,0)
  },[location.pathname])
  return (
    <div>
        <Headers />
      <main>
        <Outlet />
        <Footer />
      </main>
    </div>
  )
}

export default Root