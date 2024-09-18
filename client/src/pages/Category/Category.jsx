import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useBlogContext } from '../../context/ContextContainer';
import Loader from '../../foundation/Loader/Loader';
import HomePagePost from '../../components/HomePagePost/HomePagePost';
import "./Category.css"




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
      const timestamp = new Date().getTime(); // Cache busting by adding a unique timestamp
      const response = await api.get(`/api/category/${cateName}?page=${page}&_=${timestamp}`);

      if (response.data.posts && response.data.posts.length > 0) {
        setPosts(response.data?.posts);
      } else {

        setPosts([]);
      }

      setTotalPages(response.data.totalPages);
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
    {posts.length == 0 && !loading ? <div className='not_found_data'>
      <h1>404</h1>
      <p> We have not news for this category</p>
    </div> : (<div>

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
      </div>)}
    </>
  );
};

export default Category;
