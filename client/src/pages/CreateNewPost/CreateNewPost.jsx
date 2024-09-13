import React, { useState } from 'react'
import dlImg from "../../assets/upload_area.png"
import "./CreateNewPost.css"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';




const CreateNewPost = () => {

    const [image, setImage] = useState(false);
    const [content, setContent] = useState("")
   console.log(content)
    return (
        <>
            <form>
                <div className='create__post'>
                    <input type="text" placeholder='Title' />
                    <input type="text" placeholder='Summary..(within 160 characters)' />
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
                    <ReactQuill theme="snow" value={content} onChange={setContent} />
                <button className='form_btn'>Submit</button>
                </div>
            </form>
        </>
    )
}

export default CreateNewPost