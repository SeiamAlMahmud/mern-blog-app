import React from 'react'
import "./Footer.css"
import logo from "../../assets/news-report.png"
import google from "../../assets/unnamed.webp"
import apple from "../../assets/55.svg"
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";




const Footer = () => {
    return (
        <>
        <main>
            <div>
                <div className='footer_first_part'>
                    <img src={logo} alt="" />
                    <h2>News24 Media Limited</h2>
                    <p>Stay tuned to News24 for all the latest updates, including politics, business, sports, national and <br /> international breaking news, and in-depth analysis.</p>

                </div>

                <div className='app_download_container'>
                    <div className='
            part_1'>
                        <h2>Download the News24 mobile app.</h2>
                        <div className="app">
                            <img className='google' src={google} alt="" />
                            <img className='apple' src={apple} alt="" />
                        </div>
                    </div>
                    <div className='part_2'>
                        <p>Follow Social News24</p>
                        <div className='social_icon'>
                            <i id='facebook'>
                                <FaFacebook />
                            </i>
                            <i id='youtube'>
                                <FaYoutube />
                            </i>
                            <i id='twitter'>
                                <FaXTwitter />
                            </i>
                        </div>
                    </div>
                </div>
            </div>
            </main>


            <div style={{backgroundColor: "#333333", marginTop: "0"}}>
            <main>
            <div className="last_container">
                <ul>
                    <li>About us</li>
                    <li>Privacy & Policy</li>
                    <li>Contact us</li>
                </ul>
                <div><p>{new Date().getFullYear()} News24 Media Limited | All rights reserved</p></div>
            </div>
            </main>
            </div>
        </>
    )
}

export default Footer