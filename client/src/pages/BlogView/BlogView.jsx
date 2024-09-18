import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlogContext } from '../../context/ContextContainer';
import "./BlogView.css";
import Loader from '../../foundation/Loader/Loader';
import moment from "moment";
import { IoLink } from "react-icons/io5";
import { GoZoomIn, GoZoomOut } from "react-icons/go";
import toast from "react-hot-toast";
import ActionAreaCard from '../../components/ActionAreaCard/ActionAreaCard';

const BlogView = () => {
  const { api, website } = useBlogContext();
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [fourPosts, setFourPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');
  const [speechInstance, setSpeechInstance] = useState(null);

  document.title = post?.title || "News24";
  const navigate = useNavigate();

  // Fetch post data
  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/post/${id}`);
      if (response.data?.success) {
        setPost(response.data?.post);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch four related posts
  const getFourPost = async () => {
    try {
      const response = await api.get("/api/randomPost");
      if (response.data?.success) {
        setFourPosts(response.data?.posts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Execute parallel operations
  const pararellOperation = async () => {
    await Promise.all([getData(), getFourPost()]);
  };

  useEffect(() => {
    pararellOperation();
  }, [id]);

  // Copy URL to clipboard
  const copyToClipboard = () => {
    const link = `${website}/post/${post?._id}`;
    window.navigator.clipboard.writeText(link).then(
      () => {
        toast.success("Copied");
      },
      (err) => {
        console.log("Failed to copy", err);
      }
    );
  };

  // Initialize SpeechSynthesis
  useEffect(() => {
    const synth = window.speechSynthesis;
    setSpeechInstance(synth);
  }, []);

  // Function to strip HTML tags and convert to plain text
  const stripHtmlTags = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Add slight pauses for line breaks
  const prepareTextForSpeech = (text) => {
    return text.replace(/\n/g, '. ').replace(/  +/g, ' '); // Replace newlines with a pause and clean up extra spaces
  };

  // Play text-to-speech
  const playSpeech = () => {
    if (speechInstance && post.content) {
      const plainText = stripHtmlTags(post.content); // Convert HTML content to plain text
      const preparedText = prepareTextForSpeech(plainText); // Handle line breaks and prepare text for speech

      const utterance = new SpeechSynthesisUtterance(preparedText);
      utterance.lang = post.language || 'en'; // Adjust based on content language
      utterance.onstart = () => {
        setIsPlaying(true);
      };
      utterance.onend = () => {
        setIsPlaying(false);
      };
      speechInstance.speak(utterance);
    }
  };

  // Stop text-to-speech
  const stopSpeech = () => {
    if (speechInstance) {
      speechInstance.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <>
      {loading ? <Loader /> : (
        <div className='blogView__section'>
          <div className='blog__general_top'>
            <p className='general_line'>Full News Time</p>
            <div className='category_time'>
              <p className='category' onClick={() => navigate(`/category/${post?.category}`)}>{post?.category}</p>
              <time>{moment(post?.createdAt).format('MMMM Do YYYY, hh:mm:ss a')}</time>
            </div>
          </div>

          <div className='blogviewTitle'>
            <h1>{post?.title}</h1>
            <h3>{post?.summary}</h3>
          </div>
          <div className='blogviw_Thumbnail'>
            <img src={post.image} alt="" />
            <p className='thumbnail_description'>{post?.imageTitle}</p>
          </div>
          <div className='name_duration'>
            <div className='part_1'>
              <p>{post?.username}</p>
              <p>{post?.readingTime} {post?.readingTime === 1 ? "minute" : "minutes"} in Read</p>
            </div>
            <div className='part_2'>
              <i onClick={() => setFontSize(fontSize + 1)} title="Zoom In">
                <GoZoomIn />
              </i>
              <i onClick={() => setFontSize(fontSize - 1)} title="Zoom Out">
                <GoZoomOut />
              </i>
              <i onClick={copyToClipboard} title="Copy to clipboard">
                <IoLink />
              </i>
            </div>
          </div>
          <button className='play-speech-button' onClick={isPlaying ? stopSpeech : playSpeech}>
            {isPlaying ? 'Stop' : 'Play'} Speech
          </button>
          <div className='post-content'
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: post?.content || '' }}>
          </div>
      
          <div className='keywords__section'>
            {post?.keywords && post?.keywords.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </div>
        </div>
      )}

      {!loading && <div className='four_post_section'>
        <div className='four_post_container'>
          {fourPosts.map(item => (
            <div key={item?._id} className='four_post_container' onClick={() => navigate(`/post/${item._id}`)}>
              <ActionAreaCard key={item._id} item={item} />
            </div>
          ))}
        </div>
      </div>}
    </>
  );
};

export default BlogView;
