import React, { useState, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dlImg from "../../assets/upload_area.png";
import QuillResizeImage from 'quill-resize-image';
import "./CreateNewPost.css";
import { useBlogContext } from '../../context/ContextContainer';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";

// Register the image resize module with Quill
Quill.register("modules/resize", QuillResizeImage);

const CreateNewPost = () => {
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState(""); // For keyword input field
  const [category, setCategory] = useState(""); // New input for category
  const [readingTime, setReadingTime] = useState(""); // New input for reading time
  const [imageTitle, setImageTitle] = useState(""); // New input for image title
  const reactQuillRef = useRef(null);
  const { api } = useBlogContext();
  const navigate = useNavigate();
  // Handle keyword input
  const handleKeywordInput = (e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const newKeywords = value.split(',').map((keyword) => keyword.trim()).filter((keyword) => keyword);
      setKeywords((prev) => [...prev, ...newKeywords]);
      setInputValue('');
    } else {
      setInputValue(value);
    }
  };

  // Remove keyword
  const removeKeyword = (indexToRemove) => {
    setKeywords((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Handle Backspace to remove last keyword
  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && !inputValue && keywords.length) {
      removeKeyword(keywords.length - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (summary.length > 160) {
      toast.error('Summary should be within 160 characters');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('keywords', JSON.stringify(keywords)); // Convert array to JSON string
    formData.append('category', category); // Add category to formData
    formData.append('readingTime', readingTime); // Add readingTime to formData
    formData.append('imageTitle', imageTitle); // Add imageTitle to formData
    if (image) formData.append('image', image);

    try {
      const response = await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success) {
        toast.success(response.data?.message);
        navigate("/");
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };
  const CategoryList = [
    {
      name: "Bangladesh"
    },
    {
      name: "Politics"
    },
    {
      name: "International"
    },
    {
      name: "sports"
    },
    {
      name: "Entertainment"
    },
    {
      name: "Health"
    },
    {
      name: "Religion"
    },
    {
      name: "Health Tips"
    },
    {
      name: "Medical News"
    }
  ]
  return (
    <form onSubmit={handleSubmit}>
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
          {
            CategoryList.map((item,idx)=> {
              return (
                <option key={idx} value={item?.name}>{item?.name}</option>
              )
            })
          }
          <option value="sports">Sports</option>
          <option value="international">International</option>
          <option value="health">Health</option>
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
            <img src={image ? URL.createObjectURL(image) : dlImg} alt="Upload area" />
          </label>
          <input
            type="file"
            id='image'
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            aria-label="Upload featured image"
            required
            hidden
          />
          <p style={{
            color: "red",
            margin: "3px",
            visibility: image ? "hidden" : "visible"
          }}>
            Thumbnail image is required.
          </p>
        </div>

        {/* Content Editor */}
        <ReactQuill
          ref={reactQuillRef}
          theme="snow"
          placeholder="Start writing..."
          modules={{
            toolbar: {
              container: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                ["link", "image", "video"],
                ["code-block"],
                ["clean"],
              ],
            },
            resize: {
              locale: {},
            },
            clipboard: {
              matchVisual: false,
            },
          }}
          formats={[
            "header", "font", "size", "bold", "italic", "underline", "strike",
            "blockquote", "list", "bullet", "indent", "link", "image", "video", "code-block",
          ]}
          value={content}
          onChange={setContent}
        />

        <button type="submit" className='form_btn'>Submit</button>
      </div>
    </form>
  );
};

export default CreateNewPost;
