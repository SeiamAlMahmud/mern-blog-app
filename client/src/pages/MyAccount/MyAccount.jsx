import React, { useEffect, useState } from 'react'
import { useBlogContext } from '../../context/ContextContainer'
import { Link, useLocation, useNavigate } from "react-router-dom"
import Loader from '../../foundation/Loader/Loader'

const MyAccount = () => {

  const [user, setUser] = useState({})
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const { token, api } = useBlogContext()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    if (!token) {
      return navigate("/login", { state: { from: pathname } })
    }
    getUser()
  }, [token, pathname])
  console.log(user)
  const getUser = async () => {
    setLoading(true)
    try {
      const now = Date.now()
      const response = await api.get(`/api/getUser?now=${now}`)
      if (response.data?.success) {
        setUser(response.data?.user)
      }
    } catch (error) {
      console.log("Error fetching user:", error)
    }finally{
      setLoading(false)

    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const formData = new FormData();
      formData.append('image', file);


      try {
        const response = await api.post(`/api/uploadUserImage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data?.success) {
          setUser(response.data?.user)
          console.log("User updated:");
        } else {
          console.error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }

  return (
    <>
     {loading ? <Loader /> : <div>
        <main>
          <div>
            <label htmlFor="image">
              <img
                src={image
                  ? URL.createObjectURL(image)
                  : (user?.image ? user?.image : (user?.gender
                    ? `https://randomimg.almahmud.top/${user?.gender}`
                    : "https://randomimg.almahmud.top/public"))}
                alt="User Profile"
              />
            </label>
            <input
              type="file"
              id='image'
              onChange={handleImageUpload}
              accept="image/*"
              aria-label="Upload featured image"
              hidden
            />
          </div>
        </main>
      </div>}
    </>
  )
}

export default MyAccount