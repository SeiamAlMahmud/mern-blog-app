import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import moment from 'moment'; 
import "./HomePagePost.css";

const HomePagePost = ({post}) => {


    const [isExpanded, setIsExpanded] = useState(false);
    const summary = post.summary
    const maxLength = 140;
    const navigate = useNavigate()

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded); // Toggle between expanded and collapsed view
    };

    return (
        <div className='post'>
            <div className="post__image">
                <img onClick={()=> navigate(`/post/${post._id}`)} src={post.image} alt="" />
            </div>
            <div className="post__text">
                <Link to={`/post/${post._id}`}><h2 style={{color: "black"}}>{post.title}</h2></Link>
                {/* <h2 onClick={()=> navigate(`/post/${post._id}`)}>{post.title} </h2> */}
                <p className='info'>
                    <Link className="author link">{post.username}</Link>
                    <time>{moment(post.createdAt).format('MM-D-YY, h:mm:ss a')}</time>
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


// {moment(post.createdAt).format('MMMM Do YYYY, h:mm:ss a')}