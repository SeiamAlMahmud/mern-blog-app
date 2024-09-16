import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBlogContext } from '../../context/ContextContainer'
import "./BlogView.css"
import Loader from '../../foundation/Loader/Loader'
import moment from "moment"
import { GoPlusCircle } from "react-icons/go";
import { FiMinusCircle } from "react-icons/fi";
import { IoLink } from "react-icons/io5";
import { GoZoomIn } from "react-icons/go";
import { GoZoomOut } from "react-icons/go";



const BlogView = () => {
  const { api } = useBlogContext()
  const { id } = useParams()
  const [post, setpost] = useState({})
  const [loading, setLoading] = useState(false)
  const [fontSize, setFontSize] = useState(16)

  const getData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/api/post/${id}`)

      if (response.data?.success) {
        setpost(response.data?.post)
      }
    } catch (error) {
      console.log(error.message)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getData()
  }, [])
  console.log(post)
  document.title = post?.title || "News24"
  return (
    <>
      {
        loading ? <Loader /> : (
          <div className='blogView__section'>
            <div className='blog__general_top'>
              <p className='general_line'>Full News Time</p>
              <div className='category_time'>
                <p className='category'>{post?.category || "Bangladesh"}</p>
                <time>{moment(post?.createdAt).format('MMMM Do YYYY, hh:mm:ss a')}</time>
              </div>
            </div>

            <div className='blogviewTitle'>
              <h1>
                {post?.title}
              </h1>
              <h3>{post?.summary}</h3>
            </div>
            <div className='blogviw_Thumbnail'>
              <img src={post.image} alt="" />
              <p className='thumbnail_description'>{post?.imgTitle || "যাত্রাবিরতির দাবিতে ঢাকা-ময়মনসিংহ রেলপথে কমিউটার ট্রেন আটকে স্থানীয়দের বিক্ষোভ। ছবি: সময় সংবাদ "}</p>
            </div>
            <div className='name_duration'>
              <div className='part_1'>
                <p>{post?.username}</p>
                <p>{post?.duration || "Read in 1 minute"}</p>
              </div>
              <div className='part_2'>
                <i onClick={()=> setFontSize(fontSize + 1)}>
                  <GoZoomIn />
                </i>
                <i onClick={() => setFontSize(fontSize - 1)}>
                <GoZoomOut />
              </i>
                <i>
                <IoLink />
                </i>
              </div>
            </div>
            <div
            style={{
              fontSize: fontSize
            }} 
            dangerouslySetInnerHTML={{ __html: post?.content }}></div>
          </div>
        )
      }
    </>
  )
}

export default BlogView