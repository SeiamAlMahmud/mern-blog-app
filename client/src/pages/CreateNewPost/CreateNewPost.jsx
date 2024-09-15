import React, { useState, useCallback, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import dlImg from "../../assets/upload_area.png";
import QuillResizeImage from 'quill-resize-image';
import "./CreateNewPost.css";
import { useBlogContext } from '../../context/ContextContainer';
import toast from "react-hot-toast"





// Register the image resize module with Quill
Quill.register("modules/resize", QuillResizeImage);
const CreateNewPost = () => {

  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState([]);
  const reactQuillRef = useRef(null);
  const { api } = useBlogContext()
  

  console.log(content)
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("first")
    if (summary.length > 160) {
      toast.error('Summary should be within 160 characters')
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const response = await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data?.success) {
        toast.success(response.data?.message)
      }
      console.log('Post saved:', response.data);
      // Reset form or redirect user
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

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
          maxLength={160}
          placeholder='Summary.. (within 160 characters)'
          required
        />
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
          <p style={{color: "red", margin:"3px"}}>Thumnail is required</p>
        </div>
       
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
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
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
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "video",
            "code-block",
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






// use this for base 64 upload
{/*
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
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["code-block"],
      ["clean"],
    ],
  },
  clipboard: {
    matchVisual: false,
  },
}}
formats={[
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "code-block",
]}
value={content}
onChange={setContent}
/>
 */}