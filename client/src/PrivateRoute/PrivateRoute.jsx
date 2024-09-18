import React, { useEffect } from 'react'
import { useBlogContext } from '../context/ContextContainer'
import { useLocation, useNavigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
   const {token} = useBlogContext();
   const navigate = useNavigate()
   const location = useLocation()

   useEffect(()=> {
    if (!token) {
        return navigate("/login", {state:{from: location.pathname}})
    }
   },[])

  return children
}

export default PrivateRoute