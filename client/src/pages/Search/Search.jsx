import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useBlogContext } from '../../context/ContextContainer';

function Search() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const query = searchParams.get('keyword') || '';
  const { api } = useBlogContext();

  const fetchPosts = async () => {
    try {
      const now = Date.now()
      const response = await api.get(`/api/search?keyword=${query}&page=${currentPage}&limit=10&now=${now}`);
      setPosts(response.data.posts || []);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts', error);
      setPosts([]);
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
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p>No posts found</p>
        )}

        <div>
          <p>Page {currentPage} of {totalPages}</p>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Search;
