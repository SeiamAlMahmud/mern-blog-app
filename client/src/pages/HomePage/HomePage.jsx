import React, { useEffect, useState } from 'react'
import HomePagePost from '../../components/HomePagePost/HomePagePost'
import { useBlogContext } from '../../context/ContextContainer'

const HomePage = () => {
  const { api } = useBlogContext()
  const [posts, setPost] = useState([])
  const getAllPost = async () => {
    const response = await api.get("/api/getAllPosts")
    if (response.data?.success) {
      setPost(response.data?.updatedPosts)
    }
    console.log(response.data.updatedPosts)
}
useEffect(() => {

    getAllPost()
}, [])
  return (
   <>
   {
    posts.map((post)=> {
      return (
        <HomePagePost post={post} key={post._id} />
      )
    })
   }
  
   </>
  )
}

export default HomePage