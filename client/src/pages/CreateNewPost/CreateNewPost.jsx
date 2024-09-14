import React, { useState } from 'react'
import dlImg from "../../assets/upload_area.png"
import "./CreateNewPost.css"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


// Quill modules configuration
const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
};

const formats = ['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video']

const CreateNewPost = () => {

    const [image, setImage] = useState(false);
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")


    console.log(content)
    // console.log(summary, title)


    return (
        <>
            <form>
                <div className='create__post'>
                    <input
                     type="text"
                      placeholder='Title'
                      value={title}
                      onChange={(e)=> setTitle(e.target.value)}
                      />
                    <input
                     type="text"
                     value={summary}
                     onChange={(e)=> setSummary(e.target.value)}
                      placeholder='Summary..(within 160 characters)'
                       />
                    <div className='new_post_img_upload'>
                        <label htmlFor="image">
                            <img src={image ? URL.createObjectURL(image) : dlImg} alt="" />
                        </label>

                        <input
                            type="file"
                            id='image'
                            onChange={(e) => setImage(e.target.files[0])}
                            required
                            hidden />
                    </div>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        placeholder="Write something amazing..."
                    />
                    <button className='form_btn'>Submit</button>
                </div>
            </form>
        </>
    )
}

export default CreateNewPost