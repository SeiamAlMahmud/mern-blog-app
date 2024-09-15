import React from 'react'
import 'ldrs/helix'
import "./Loader.css"

const Loader = () => {

  return (
    <div className='loader'>
      <l-helix
        size="70"
        speed="1.8"
        color="#B60053"
      ></l-helix>

    </div>
  )
}

export default Loader