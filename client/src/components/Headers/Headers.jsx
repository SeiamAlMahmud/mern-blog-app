import React from 'react'
import { Link } from 'react-router-dom'
import "./Headers.css"
import { useBlogContext } from '../../context/ContextContainer'



const Headers = () => {

    const { token,api,setToken } = useBlogContext()
    const logout = async () => {

        try {
            const response = await api.get("/api/logout")
            // console.log(response.data)
            if (response.data.success) {
                console.log(response.data?.message)
                setToken(false)
            } else {
                setToken(true)
            }

        } catch (error) {
            console.log(error.message, "getToken Error")
        }

    }
    return (

        <header>
            <Link className='link logo'>M Blog</Link>
            <nav>
                {token ? <Link className='link link-sm' to={"/newPost"}>Create new Post</Link> : <Link className='link' to={"/login"}>Login</Link>}
                {token ? <p
                    onClick={logout}
                    className='link link-sm' >LogOut</p> : <Link className='link link-sm' to={"/register"}>Register</Link>}
            </nav>
        </header>
    )
}

export default Headers