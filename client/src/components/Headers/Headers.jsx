import React from 'react'
import { Link } from 'react-router-dom'
import "./Headers.css"
import { useBlogContext } from '../../context/ContextContainer'
import { FaArrowUp } from 'react-icons/fa'; 



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

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Smooth scrolling effect
        });
    };
    return (
        <>
        <header>
            <Link className='link logo'>M Blog</Link>
            <nav>
                {token ? <Link className='link link-sm' to={"/newPost"}>Create new Post</Link> : <Link className='link' to={"/login"}>Login</Link>}
                {token ? <p
                    onClick={logout}
                    className='link link-sm' >LogOut</p> : <Link className='link link-sm' to={"/register"}>Register</Link>}
            </nav>
              {/* Top Icon */}
              <div className='top-icon' onClick={scrollToTop} title="Go to top">
                    <FaArrowUp />  {/* Arrow-up icon */}
                </div>
        </header>
        <ul className='header__ul'>
            <li>Bangladesh</li>
            <li>Politics</li>
            <li>International</li>
            <li>sports</li>
            <li>Entertainment</li>
            <li>Health</li>
            <li>Religion</li>
            <li className="dropdown">
            More <span className="arrow">&#9662;</span>
            <ul className="dropdown-menu">
                <li>Health Tips</li>
                <li>Medical News</li>
            </ul>
        </li>
        </ul>
        </>
    )
}

export default Headers