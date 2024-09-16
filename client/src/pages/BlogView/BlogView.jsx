import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useBlogContext } from '../../context/ContextContainer'

const BlogView = () => {
  const { api } = useBlogContext()
  const { id } = useParams()
  const [post, setpost] = useState({})
  const [loading, setLoading] = useState(false)

  const getData = async () => {
    setLoading(true)
    try {
      const response =await api.get(`/api/post/${id}`)
      console.log(response.data?.post)
    } catch (error) {

    }
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <div>

    </div>
  )
}

export default BlogView