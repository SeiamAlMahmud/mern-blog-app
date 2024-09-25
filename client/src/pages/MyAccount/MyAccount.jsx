import React, { useEffect, useState } from 'react'
import { useBlogContext } from '../../context/ContextContainer'
import "./MyAccount.css"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Loader from '../../foundation/Loader/Loader'
import Swal from 'sweetalert2'
import Switch from '@mui/material/Switch';
import { AiTwotoneDelete } from "react-icons/ai";



const MyAccount = () => {

  const [user, setUser] = useState({})
  const [posts, setPosts] = useState([])
  const [totalPost, setTotalPost] = useState(0)
  const [totalPublish, setTotalPublish] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15; 
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const { token, api } = useBlogContext()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  useEffect(()=>{
    getUsersFifthenPost(currentPage)
  },[currentPage])
  useEffect(() => {
    if (!token) {
      return navigate("/login", { state: { from: pathname } })
    }
    getUser()
  }, [token, pathname])
  // console.log(user)

  const handleChange = async (event, postId, deleteStatus) => {
    
    if(deleteStatus) return

    const newStatus = event.target.checked;
    const updatedPosts = posts.map(post =>
      post._id === postId ? { ...post, isPublished: newStatus } : post
    );
    setPosts(updatedPosts); // Optimistically update UI

    try {
      const now = Date.now();
      const response = await api.post(`/api/updatePublishStatus?now=${now}`, {
        postId,
        isPublished: newStatus
      });
      console.log(response.data)
      if (!response.data?.success) {
        // If API fails, revert to old state
        setPosts(posts);
      } else {
        setTotalPost(response.data?.totalPosts)
        setTotalPublish(response.data?.totalPublish)
      }
    } catch (error) {
      console.error("Error updating publish status", error);
      // Revert to previous state if error
      setPosts(posts);
    }
  };

  const deletePost = async (postId) => {
    console.log(postId)
    try {
      const response = await api.post("/api/deletePost", { postId })
      console.log(response)
      if (response.data?.success) {
        const updatedPosts = posts.map(post =>
          post._id === postId ? { ...post, isDelete: true } : post
        );
        setPosts(updatedPosts); // Optimistically update UI
        console.log(updatedPosts)
      }
    } catch (error) {
      console.error("Error delete post", error);

    }
  }

  const getUsersFifthenPost = async (page) => {
    setLoading(true)
    try {
      const now = Date.now()
      const response = await api.get(`/api/getUserMyAccountPost?page=${page}&limit=${limit}&now=${now}`)
      if (response.data?.success) {
        setPosts(response.data?.posts)
        setCurrentPage(response.data?.currentPage);
        setTotalPages(response.data?.totalPages);

      }
    } catch (error) {
      console.log("Error fetching user:", error)
    } finally {
      setLoading(false)

    }
  }


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
      console.log(error)
    }
  }


  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      // window.scrollTo(0,0)
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      // window.scrollTo(0,0)
    }
  };



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
                    {/* Gender */}
                    <div className='my_account_title_child'>
                      <p>Gender:</p>
                      <p style={{ color: "#F4483C" }}>{user?.gender}</p>
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
                  </div>
                </div>
              </div>
              {/* latest 5 post */}

              <div>
                <h3>Your Post</h3>
                <div className='cart'>
                  <div className="cart-items">
                    <div className="cart-items-title">
                      <p>Posts</p>
                      <p>Title</p>
                      <p>pulish</p>
                      <p style={{ color: "#e82121", fontSize: "19px" }}><AiTwotoneDelete /></p>
                    </div>
                    <br />
                    <hr />
                    {
                      posts.map((item, idx) => {
                        return (
                          <div key={idx}>

                            <div className="cart-items-title cart-items-item">
                              <img src={item?.image} className='cartImage'
                                style={{
                                  filter: item?.isDelete ? 'blur(5px)' : 'none',  // Conditional blur
                                  transition: 'filter 0.3s ease'             // Smooth transition
                                }}
                                alt="d" />
                              <p>{item?.isDelete ?
                                <del>{item.title}</del>
                                : <Link to={`/post/${item?._id}`}> {item?.title}</Link>}</p>
                              <Switch
                                size='2'
                                checked={item?.isDelete ? false : item?.isPublished}
                                onChange={(event) => handleChange(event, item?._id, item?.isDelete)}
                                inputProps={{ 'aria-label': 'controlled' }}
                              />
                              <p style={{ color: "#e82121", cursor: "pointer" }} onClick={() => deletePost(item?._id)}><AiTwotoneDelete /></p>
                            </div>
                            <hr />
                          </div>
                        )

                      })
                    }
                  </div>
                </div>
              </div>
              {/* Pagination Systems  */} 
         {  posts && posts.length > 0 &&  <div className="pagination-controls">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            backgroundColor: currentPage === 1 ? '#ccc' : '#B60053',  // Grey background if disabled
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',    // Not allowed cursor if disabled
            color: currentPage === 1 ? '#666' : '#fff',               // Grey text if disabled
          }}
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            backgroundColor: currentPage === totalPages ? '#ccc' : '#B60053',  // Fix here: Check if on last page
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',    // Disable cursor when on last page
            color: currentPage === totalPages ? '#666' : '#fff',               // Grey text when on last page
          }}
        >
          Next
        </button>
      </div>}
            </div>
          </main>
        </div>)}
    </>
  )
}

export default MyAccount