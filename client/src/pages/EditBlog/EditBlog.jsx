import React, { useState, useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dlImg from "../../assets/upload_area.png";
import QuillResizeImage from 'quill-resize-image';
import { useBlogContext } from '../../context/ContextContainer';
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import Loader from '../../foundation/Loader/Loader';

Quill.register("modules/resize", QuillResizeImage);

const EditBlog = () => {
  const [image, setImage] = useState(null); // Local uploaded image file
  const [imageUrl, setImageUrl] = useState(""); // Fetched image URL from the server
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [category, setCategory] = useState("");
  const [readingTime, setReadingTime] = useState("1");
  const [imageTitle, setImageTitle] = useState("");
  const reactQuillRef = useRef(null);
  const { api, token } = useBlogContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [loading, setLoading] = useState(false)

  const CategoryList = [
    { name: "Bangladesh" },
    { name: "Politics" },
    { name: "International" },
    { name: "Sports" },
    { name: "Entertainment" },
    { name: "Health" },
    { name: "Religion" },
    { name: "Health Tips" },
    { name: "Medical News" },
  ];

  useEffect(() => {
    // if (!token) {
    //   navigate("/login", { state: { from: location.pathname } });
    // }
    fetchPost();
  }, [id, token, api, navigate, location.pathname]);

  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/api/post/${id}`);
      if (response.data?.success) {
        const { title, summary, content, keywords, category, readingTime, imageTitle, image } = response.data.post;
        setTitle(title);
        setSummary(summary);
        setContent(content);
        setKeywords(keywords || []);
        setCategory(category);
        setReadingTime(readingTime || "1");
        setImageTitle(imageTitle);
        setImageUrl(image);  // Set the image URL fetched from the server
      } else {
        console.log("Failed to load post details.");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }finally{
      setLoading(false)
    }
  };

  const handleKeywordInput = (e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const newKeywords = value
        .split(',')
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword);
      setKeywords((prev) => [...prev, ...newKeywords]);
      setInputValue('');
    } else {
      setInputValue(value);
    }
  };

  const removeKeyword = (indexToRemove) => {
    setKeywords((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && !inputValue && keywords.length) {
      removeKeyword(keywords.length - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('keywords', JSON.stringify(keywords));
    formData.append('category', category);
    formData.append('readingTime', readingTime);
    formData.append('imageTitle', imageTitle);

    // Append the image only if a new one is uploaded
    if (image) {
      formData.append('image', image); // Upload a new image if chosen
    } else {
      formData.append('existingImageUrl', imageUrl); // Send the existing image URL if no new image is chosen
    }

    try {
      const response = await api.put(`/api/updatepost/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data?.success) {
        toast.success(response.data?.message);
        navigate(`/post/${id}`);
      } else {
        toast.error('Failed to update the post.');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to update the post. Please try again.');
    }
  };

  return (
    <>
   {loading ? <Loader /> : <form onSubmit={handleSubmit}>
      <div className='create__post'>
        <input
          type="text"
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder='Summary.. '
          required
        />

        {/* Keywords Input */}
        <div className="keywords__input__container">
          {keywords.map((keyword, index) => (
            <span className="keyword__tag" key={index}>
              {keyword}
              <span className="remove__keyword" onClick={() => removeKeyword(index)} style={{ color: "red", marginLeft: "4px" }}><RxCross2 /></span>
            </span>
          ))}
          <input
            type="text"
            placeholder='Enter keywords and press comma'
            value={inputValue}
            onChange={handleKeywordInput}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select category</option>
          {CategoryList.map((item, idx) => (
            <option key={idx} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        {/* Reading Time Input */}
        <input
          type="number"
          placeholder='Reading Time (in minutes)'
          value={readingTime}
          onChange={(e) => setReadingTime(e.target.value)}
          required
        />

        {/* Image Title Input */}
        <input
          type="text"
          placeholder='Image Title'
          value={imageTitle}
          onChange={(e) => setImageTitle(e.target.value)}
        />

        {/* Image Upload */}
        <div className='new_post_img_upload'>
          <label htmlFor="image">
            <img 
              src={image ? URL.createObjectURL(image) : (imageUrl ? imageUrl : dlImg)} 
              alt="Upload area" 
            />
          </label>
          <input
            type="file"
            id='image'
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            hidden
          />
          <p style={{ color: "red", margin: "3px", visibility: image || imageUrl ? "hidden" : "visible" }}>
            Thumbnail image is required.
          </p>
        </div>

        {/* Content Editor */}
        <ReactQuill
          ref={reactQuillRef}
          theme="snow"
          placeholder="Start writing..."
          modules={{
            toolbar: { /* Toolbar settings */ },
            resize: { locale: {} },
            clipboard: { matchVisual: false },
          }}
          formats={[
            /* Allowed formats */
          ]}
          value={content}
          onChange={setContent}
        />

        <button type="submit" className='form_btn'>Submit</button>
      </div>
    </form>}
    </>
  );
};

export default EditBlog;
