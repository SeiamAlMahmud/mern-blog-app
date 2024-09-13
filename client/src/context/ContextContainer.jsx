import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from "axios"


const blogContext = createContext()
export const useBlogContext = () => {
    return useContext(blogContext)
}
const ContextContainer = ({ children }) => {
    const [token, setToken] = useState(false)
    const api = axios.create({
        baseURL: "http://localhost:3000",  // Backend URL
        withCredentials: true
    });
    const getToken = async () => {
    
        try {
        const response = await api.get("/api/cookie")
        // console.log(response.data)
        if (response.data.success) {
            setToken(true)
        }else {
            setToken(false)
        }
            
        } catch (error) {
            console.log(error.message , "getToken Error")
        }
    }
    useEffect(() => {
      
        getToken()
    }, [])
    const content = { api, token, setToken, getToken }
    return (
        <>
            <blogContext.Provider value={content}>
                {children}
            </blogContext.Provider>
        </>
    )
}

export default ContextContainer