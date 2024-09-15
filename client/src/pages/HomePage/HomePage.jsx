import React, { useEffect, useState } from 'react'
import "./HomePage.css"
import HomePagePost from '../../components/HomePagePost/HomePagePost'
import { useBlogContext } from '../../context/ContextContainer'
import Loader from '../../foundation/Loader/Loader'

const HomePage = () => {
  const { api } = useBlogContext()
  const [posts, setPost] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10; // Number of posts per page


  const getAllPost = async (page) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/getAllPosts?page=${page}&limit=${limit}`)
      if (response.data?.success) {
        setPost(response.data?.posts)
        setCurrentPage(response.data?.currentPage);
        setTotalPages(response.data?.totalPages);
      }
      console.log(response.data.posts)

    } catch (error) {
      console.error("Error fetching posts", error);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getAllPost(currentPage)
  }, [currentPage])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };


  return (
    <>
      {
        loading ? <Loader /> : ( posts.map((post) => {
          return (
            <HomePagePost post={post} key={post._id} />
          )
        })
        )
      }

      {/* Pagination Controls */}
      <div className="pagination-controls">
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
      </div>


    </>
  )
}

export default HomePage