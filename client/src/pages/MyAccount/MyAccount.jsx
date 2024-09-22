import React, { useEffect, useState } from 'react'
import { useBlogContext } from '../../context/ContextContainer'
import "./MyAccount.css"
import { useLocation, useNavigate } from "react-router-dom"
import Loader from '../../foundation/Loader/Loader'
import Swal from 'sweetalert2'

const MyAccount = () => {

  const [user, setUser] = useState({})
  const [totalPost, setTotalPost] = useState(0)
  const [totalPublish, setTotalPublish] = useState(0)
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
        setTotalPost(response.data?.totalPosts)
        setTotalPublish(response.data?.totalPublish)
      }
    } catch (error) {
      console.log("Error fetching user:", error)
    } finally {
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
          setUser({ ...user, ...response.data?.user })

          console.log(response.data)
          console.log("User updated:");
        } else {
          console.error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }
  const updateUserName = async () => {
    try {
      const inputValue = user?.name
      const { value: newName } = await Swal.fire({
        title: "Enter your Name",
        input: "text",
        inputLabel: "Type your name",
        inputValue,
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write your name!";
          }
        }
      });
      if (newName) {
        const response = await api.put("/api/updateNewName", { name: newName })
        if (response.data?.success) {
          setUser(prev => ({ ...prev, name: response.data?.name }))
          Swal.fire(`Your Name is ${newName}`);
        }
      }
    } catch (error) {

    }
  }
  return (
    <>
      {loading ? <Loader /> : (
        Object.keys(user).length !== 0 && <div>
          <main>
            <div>
              <div className='my_account_image'>
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
                <h1>{user?.name || user?.username}</h1>
              </div>
              <div className='my_account_information'>
                <h3>My Infrmation:</h3>
                <div className='my_account_title_section'>

                  <div className='my_account_title'>
                    {/* Name */}
                    <div className='my_account_title_child'>
                      <p>Name:</p>
                      <p style={{ cursor: "pointer" }} onClick={updateUserName}>{user?.name ? <p style={{ color: "#F4483C" }}>{user?.name}</p> : (<p style={{ color: "blue" }}>Set name</p>)}</p>
                    </div>
                    {/* Username  */}
                    <div className='my_account_title_child'>
                      <p>Username:</p>
                      <p>{user?.username}</p>
                    </div>
                    {/* Total Post  */}
                    <div className='my_account_title_child'>
                      <p>Total Post:</p>
                      <p>{totalPost}</p>
                    </div>
                    {/* Published Post  */}
                    <div className='my_account_title_child'>
                      <p>Publish:</p>
                      <p>{totalPublish}</p>
                    </div>
                    {/* Unpublish Post  */}
                    <div className='my_account_title_child'>
                      <p>Unpublish Post:</p>
                      <p>{totalPost - totalPublish}</p>
                    </div>
                    {/* Gender */}
                    <div className='my_account_title_child'>
                      <p>Gender:</p>
                      <p style={{ color: "#F4483C" }}>{user?.gender}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>)}
    </>
  )
}

export default MyAccount