import React from 'react'
import { Link } from 'react-router-dom'
import "./Headers.css"



const Headers = () => {
    return (

        <header>
            <Link className='link logo'>M Blog</Link>
            <nav>
                <Link className='link' to={"/login"}>Login</Link>
                <Link className='link' to={"/register"}>Register</Link>
            </nav>
        </header>
    )
}

export default Headers