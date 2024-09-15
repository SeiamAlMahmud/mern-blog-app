import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "./HomePagePost.css";

const HomePagePost = ({post}) => {


    const [isExpanded, setIsExpanded] = useState(false);
    const summary = `বৈষম্যবিরোধী ছাত্র আন্দোলনকারীদের হত্যার উদ্দেশ্যেই গুলি করা হয়েছে-এমন মন্তব্য করে আন্তর্জাতিক অপরাধ ট্রাইব্যুনালের চিফ প্রসিকিউটর মোহাম্মদ তাজুল ইসলাম বলেছেন, নিশ্চিত হয়েছি যে, যারা এখানে চিকিৎসা নিচ্ছেন বা নিয়েছে তারা সবাই গানশটে আহত।`;
    const maxLength = 160;

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded); // Toggle between expanded and collapsed view
    };

    return (
        <div className='post'>
            <div className="post__image">
                <img src={post.image} alt="" />
            </div>
            <div className="post__text">
                <h2>{post.title} </h2>
                <p className='info'>
                    <Link className="author link">Seiam Al Mahmud</Link>
                    <time>2023-01-06</time>
                </p>
                <p className='post__summary'>
                    {isExpanded ? summary : `${summary.substring(0, maxLength)}...`}
                    {/* {isExpanded ? (
                        <span className="read-more-link" onClick={toggleReadMore}>
                            Read Less
                        </span>
                    ) : (
                        <Link  to="/post/1" className="read-more-link "> 
                            Read More
                        </Link>
                    )} */}
                </p>
            </div>
        </div>
    );
};

export default HomePagePost;
