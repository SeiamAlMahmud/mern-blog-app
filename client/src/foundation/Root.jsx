import React from 'react'
import Headers from '../components/Headers/Headers'
import { Outlet } from 'react-router-dom'

const Root = () => {
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