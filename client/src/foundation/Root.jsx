import React, { useEffect } from 'react'
import Headers from '../components/Headers/Headers'
import { Outlet, useLocation } from 'react-router-dom'

const Root = () => {
  const location = useLocation()
  useEffect(()=>{
    window.scrollTo(0,0)
  },[location.pathname])
  return (
    <div>
      <main>
        <Headers />
        <Outlet />
      </main>
    </div>
  )
}

export default Root