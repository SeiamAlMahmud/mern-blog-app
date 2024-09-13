import React, { createContext, useContext } from 'react'
import axios from "axios"


const blogContext = createContext()
export const useBlogContext = () => {
    return useContext(blogContext)
}
const ContextContainer = ({ children }) => {
    const api = axios.create({
        baseURL: "http://localhost:3000",  // Backend URL
      });
    
    const content = {api}
    return (
        <>
            <blogContext.Provider value={content}>
                {children}
            </blogContext.Provider>
        </>
    )
}

export default ContextContainer