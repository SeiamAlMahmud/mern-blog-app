import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useBlogContext } from '../../context/ContextContainer';
import Loader from '../../foundation/Loader/Loader';
import HomePagePost from '../../components/HomePagePost/HomePagePost';

const Category = () => {
  const { cateName } = useParams();
  const { api } = useBlogContext();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Manage the current page number
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    getCategoryPosts(currentPage);
  }, [cateName, currentPage, pathname]);

  const getCategoryPosts = async (page) => {
    setLoading(true);
    try {
      // Fetch posts from API for the category and page number
      const response = await api.get(`/api/category/${cateName}?page=${page}`);
      console.log(response.data);

      // Only update posts if there is data; otherwise, keep the previous posts
      if (response.data.posts && response.data.posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);  // Append new posts to the existing ones
      }

      setTotalPages(response.data.totalPages);  // Update total pages regardless of posts
    } catch (error) {
      console.error('Error fetching category posts:', error);
    } finally {
      setLoading(false);
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
      {loading ? (
        <Loader />
      ) : (
        posts.map((post) => {
          return <HomePagePost post={post} key={post._id} />;
        })
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            backgroundColor: currentPage === 1 ? '#ccc' : '#B60053',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            color: currentPage === 1 ? '#666' : '#fff',
          }}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            backgroundColor: currentPage === totalPages ? '#ccc' : '#B60053',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            color: currentPage === totalPages ? '#666' : '#fff',
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Category;
