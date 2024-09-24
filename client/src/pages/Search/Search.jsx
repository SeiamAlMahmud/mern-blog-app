import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useBlogContext } from '../../context/ContextContainer';
import HomePagePost from '../../components/HomePagePost/HomePagePost';
import Loader from '../../foundation/Loader/Loader';

function Search() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] =useState(false)


  const query = searchParams.get('keyword') || '';
  const { api } = useBlogContext();

  const fetchPosts = async () => {
    setLoading(true)

    try {
      const now = Date.now()
      const response = await api.get(`/api/search?keyword=${query}&page=${currentPage}&limit=10&now=${now}`);
      setPosts(response.data.posts || []);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts', error);
      setPosts([]);
    }finally {
    setLoading(false)

    }
  };

  useEffect(() => {
    if (query) {
      fetchPosts();
    }
  }, [query, currentPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchParams({ keyword: e.target.value });
    setCurrentPage(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ keyword: search });
    setCurrentPage(1);
    fetchPosts(); // Call fetchPosts to update posts
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <h1>Post Search</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        <h2>Results:</h2>
        {loading ? <Loader /> : 
        <div> {posts.length > 0 ? (
          posts.map((post) => (
            <HomePagePost post={post} key={post._id} />
          ))
        ) : (
          <p style={{fontSize: '2rem', textAlign: 'center', margin: '4rem'}}>No posts found</p>
        )}
        </div>}

        <div className="pagination-controls">
          <p>Page {currentPage} of {totalPages}</p>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              backgroundColor: currentPage === 1 ? '#ccc' : '#B60053',  // Grey background if disabled
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',    // Not allowed cursor if disabled
              color: currentPage === 1 ? '#666' : '#fff',               // Grey text if disabled
            }}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
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
      </div>
    </div>
  );
}

export default Search;
