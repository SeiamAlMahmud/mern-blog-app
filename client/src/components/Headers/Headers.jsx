import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import "./Headers.css"
import { useBlogContext } from '../../context/ContextContainer'
import { FaArrowUp } from 'react-icons/fa'; 
import AnchorTemporaryDrawer from '../AnchorTemporaryDrawer/AnchorTemporaryDrawer';
import { IoSearchSharp } from "react-icons/io5";




const Headers = () => {

    const { token,api,setToken } = useBlogContext()
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
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

    const firstCategoryList = [
        {
            name: "Bangladesh"
        },
        {
            name: "Politics"
        },
        {
            name: "International"
        },
        {
            name: "sports"
        },
        {
            name: "Entertainment"
        },
        {
            name: "Health"
        },
        {
            name: "Religion"
        }
    ]
    const secondCategoryList = [
        {
            name: "Health Tips"
        },
        {
            name: "Medical News"
        }
    ]
                
    return (
        <>
        <header>
            <Link className='link logo'>M Blog</Link>
            <nav>
                  { pathname !== '/search' && <p style={{fontSize: '29px', paddingTop: '12px', cursor: 'pointer'}}>
                        <i style={{ cursor: 'pointer'}}
                        onClick={()=> navigate('/search')}
                        ><IoSearchSharp /></i>
                    </p>}
                <div className='nav_lnk_container'>
                {token ? <Link className='link link-sm' to={"/newPost"}>Create new Post</Link> : <Link className='link' to={"/login"}>Login</Link>}
                {
                    token && <Link to={"/myAccount"}>My Account</Link>
                }
                {token ? <p
                    onClick={logout}
                    className='link link-sm' >LogOut</p> : <Link className='link link-sm' to={"/register"}>Register</Link>}
                    </div>
                    <AnchorTemporaryDrawer />
                    </nav>
              {/* Top Icon */}
              <div className='top-icon' onClick={scrollToTop} title="Go to top">
                    <FaArrowUp />  {/* Arrow-up icon */}
                </div>
        </header>
        <ul className='header__ul'>
            {
                firstCategoryList.map((text,idx)=> (

                    <li key={idx} onClick={()=> navigate(`/category/${text?.name}`)}>{text?.name}</li>
                ))
            }
            <li className="dropdown">
            More <span className="arrow">&#9662;</span>
            <ul className="dropdown-menu">
            {
                secondCategoryList.map((text,index) => (
                    <li key={index} onClick={()=> navigate(`/category/${text?.name}`)}>{text?.name}</li>
                ))
            }
            </ul>
        </li>
        </ul>
        </>
    )
}

export default Headers