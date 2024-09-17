import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBlogContext } from '../../context/ContextContainer';
import Loader from '../../foundation/Loader/Loader';
import HomePagePost from '../../components/HomePagePost/HomePagePost';

const Category = () => {
  const { cateName } = useParams();
  const { api } = useBlogContext();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Manage the current page number
  const [totalPages, setTotalPages] = useState(1);   
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCategoryPosts(currentPage);
  }, [cateName, currentPage]); // Fetch posts when category or page changes

  const getCategoryPosts = async (page) => {
    setLoading(true)
    try {
      const response = await api.get(`/api/category/${cateName}?page=${page}`);
      console.log(response.data);
      setPosts(response.data.posts);             // Store the retrieved posts
      setTotalPages(response.data.totalPages);   // Update the total number of pages
    } catch (error) {
      console.error('Error fetching category posts:', error);
    }finally{
        setLoading(false)
    }
  };

  // Function to handle pagination (next page)
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Function to handle pagination (previous page)
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
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
};

export default Category;
