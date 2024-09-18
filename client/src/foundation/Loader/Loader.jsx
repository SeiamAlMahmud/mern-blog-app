import React from 'react'
import 'ldrs/helix'
import "./Loader.css"
import CustomizedProgressBars from './CustomizedProgressBars'

const Loader = () => {

  return (
    <div className='loader'>
    <CustomizedProgressBars size={80}/>
    

    </div>
  )
}

export default Loader