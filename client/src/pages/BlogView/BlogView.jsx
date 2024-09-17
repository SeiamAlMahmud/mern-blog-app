import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBlogContext } from '../../context/ContextContainer'
import "./BlogView.css"
import Loader from '../../foundation/Loader/Loader'
import moment from "moment"
import { IoLink } from "react-icons/io5";
import { GoZoomIn } from "react-icons/go";
import { GoZoomOut } from "react-icons/go";
import toast from "react-hot-toast"
import ActionAreaCard from '../../components/ActionAreaCard/ActionAreaCard'



const BlogView = () => {


  const { api, website } = useBlogContext()
  const { id } = useParams()
  const [post, setpost] = useState({})
  const [fourPosts, setFourPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  document.title = post?.title || "News24"
  const navigate = useNavigate()


  // console.log(post)
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

  const getFourPost = async () => {
    try {
      const response = await api.get("/api/randomPost")
      console.log(response.data)
      if (response.data?.success) {
        setFourPosts(response.data?.posts)
      }
    } catch (error) {
      console.log(error.message)
      console.log(error)
    }
  }
  // Avoid one by one operation, use parrarell operation
  const pararellOperation = async (req, res) => {
    await Promise.all([getData(), getFourPost()])
  }
  useEffect(() => {
    pararellOperation()
  }, [id])
  // console.log(post)


  const copyToClipboard = () => {
    const link = `${website}/post/${post?._id}`;
    // console.log(link)
    window.navigator.clipboard.writeText(link).then(
      () => {
        toast.success("Copied")
      },
      (err) => {
        console.log("Failed to copied", err)
      }
    )

  }
  return (
    <>
      {
        loading ? <Loader /> : (
          <div className='blogView__section'>
            <div className='blog__general_top'>
              <p className='general_line'>Full News Time</p>
              <div className='category_time'>
                <p className='category' onClick={()=> navigate(`/category/${post?.category}`)}>{post?.category}</p>
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
              <p className='thumbnail_description'>{post?.imageTitle}</p>
            </div>
            <div className='name_duration'>
              <div className='part_1'>
                <p>{post?.username}</p>
                <p>{post?.readingTime}{post?.readingTime == 1 ? "minute" : "minutes"} in Read</p>
              </div>
              <div className='part_2'>
                <i onClick={() => setFontSize(fontSize + 1)} title="Zoom In">
                  <GoZoomIn />
                </i>
                <i onClick={() => setFontSize(fontSize - 1)} title="Zoom Out">
                  <GoZoomOut />
                </i>
                <i onClick={copyToClipboard} title="Copy to clipboard">
                  <IoLink />
                </i>
              </div>
            </div>
            <div
              style={{
                fontSize: fontSize
              }}
              dangerouslySetInnerHTML={{ __html: post?.content }}></div>
            <div className='keywords__section'>
              {
                post?.keywords && post?.keywords.map((item, idx) => {
                  return (
                    <p key={idx}>{item}</p>
                  )
                })
              }
            </div>
          </div>
        )
      }

      {!loading && <div className='four_post_section'>
        <div className='four_post_container'>
          {
            fourPosts.map(item => {
              return (
                <div className='four_post_container' onClick={() => navigate(`/post/${item._id}`)}>
                  <ActionAreaCard
                    key={item._id}
                    item={item}
                  />
                </div>
              )
            })
          }
        </div>
      </div>}
    </>
  )
}

export default BlogView