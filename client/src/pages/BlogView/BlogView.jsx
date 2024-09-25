import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useBlogContext } from '../../context/ContextContainer';
import "./BlogView.css";
import Loader from '../../foundation/Loader/Loader';
import moment from "moment";
import { IoLink } from "react-icons/io5";
import { GoZoomIn, GoZoomOut } from "react-icons/go";
import toast from "react-hot-toast";
import ActionAreaCard from '../../components/ActionAreaCard/ActionAreaCard';
import InfinityPost from '../../components/InfinityPost/InfinityPost';

const BlogView = () => {
  const { api, website, token } = useBlogContext();
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [fourPosts, setFourPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechInstance, setSpeechInstance] = useState(null);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const navigate = useNavigate();

  // for infinity news purpose

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // console.log(data)
  const dataContainerRef = useRef(null);

  // fetch data for infinity 
  const fetchData = async () => {
   
    if (data.length >= 5) {
      setHasMore(false); 
      return;
    }

    setIsLoading(true); // লোডিং শুরু
    try {
      const response = await api.post(`/api/infinityPost?skip=${skip}`, { currentPostId: id });
      if (response.data?.success) {
        const newPosts = response.data.infinityPost;

        // যদি নতুন পোস্ট সংখ্যা ৫ বা তার বেশি হয়, নতুন ফেচ বন্ধ করতে হবে
        const totalPosts = data.length + newPosts.length;

        if (totalPosts >= 5) {
          // নতুন ডাটা থেকে শুধুমাত্র প্রয়োজনীয় পোস্টগুলো নেওয়া
          const remainingPosts = newPosts.slice(0, 5 - data.length);
          setData((prevData) => [...prevData, ...remainingPosts]);
          setHasMore(false); // নতুন ডাটা আসা বন্ধ করা
        } else {
          // ডাটা লোড করে আগের ডাটার সাথে যুক্ত করা
          setData((prevData) => [...prevData, ...newPosts]);
          setSkip((prevSkip) => prevSkip + newPosts.length); // পরবর্তী স্কিপ অ্যাড করা
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // লোডিং শেষ
    }
  };

  // Intersection Observer Logic
  useEffect(() => {
    if (isLoading || !hasMore) return; // যদি লোডিং চলছে বা hasMore false হয়, ফেচ বন্ধ থাকবে

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          fetchData(); // ডিভ intersect হলে ফেচ কল করবে
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0, // ৫০% দেখা গেলে ডাটা লোড হবে
      }
    );

    if (dataContainerRef.current) {
      observer.observe(dataContainerRef.current); // `loading-container` div কে observe করা
    }

    return () => {
      if (dataContainerRef.current) {
        observer.unobserve(dataContainerRef.current); // unmount হলে observer বন্ধ
      }
    };
  }, [isLoading, hasMore, data.length]); // data.length এর ওপর ভিত্তি করে কাজ করবে






  // Fetch post data
  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/post/${id}`);
      if (response.data?.success && response.data?.post?.isPublished == true) {
        setPost(response.data?.post);
        setOwner(response.data?.owner)
        // console.log(response.data)
        
      }
    } catch (error) {
      console.log(error.message);
      if (error) {
        console.log(error)
        navigate("/")
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch four related posts
  const getFourPost = async () => {
    try {
      const excludePostId = post._id || null;
      const url = excludePostId ? `/api/randomPost/${excludePostId}` : `/api/randomPost`
      const response = await api.get(url);
      if (response.data?.success) {
        setFourPosts(response.data?.posts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  useEffect(() => {
    getData();
  }, [id]);
  useEffect(() => {
    getFourPost();
  }, [post._id]);

  // Initialize SpeechSynthesis and handle page changes
  useEffect(() => {
    const synth = window.speechSynthesis;
    setSpeechInstance(synth);

    // Stop speech if the page changes
    return () => {
      if (synth) {
        synth.cancel();
        setIsPlaying(false);
        setCurrentUtterance(null);
      }
    };
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

  // Function to strip HTML tags and convert to plain text
  const stripHtmlTags = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Prepare text for speech by adding slight pauses for line breaks
  const prepareTextForSpeech = (text) => {
    return text.replace(/\n/g, '. ').replace(/  +/g, ' '); // Replace newlines with a pause and clean up extra spaces
  };

  // Play text-to-speech from the beginning
  const playSpeech = () => {
    if (speechInstance && post.content) {
      const plainText = stripHtmlTags(post.content); // Convert HTML content to plain text
      const preparedText = prepareTextForSpeech(plainText); // Handle line breaks and prepare text for speech

      // Stop the current speech if it is playing
      if (currentUtterance) {
        speechInstance.cancel();
        setIsPlaying(false);
      }

      const utterance = new SpeechSynthesisUtterance(preparedText);
      utterance.lang = post.language || 'en'; // Adjust based on content language
      setCurrentUtterance(utterance);

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentUtterance(null);
      };

      utterance.onpause = () => {
        setIsPlaying(false);
      };

      utterance.onresume = () => {
        setIsPlaying(true);
      };

      speechInstance.speak(utterance);
    }
  };

  // Stop text-to-speech
  const stopSpeech = () => {
    if (speechInstance) {
      speechInstance.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  };

  return (
    <>
      <div
        ref={dataContainerRef}
      >

        {loading ? <Loader /> : (
          <div className='blogView__section'>
            <div className='blog__general_top'>
              <p className='general_line'>Full News Time</p>
              <div className='category_time'>
                <p className='category' onClick={() => navigate(`/category/${post?.category}`)}>{post?.category}</p>
                <time>{moment(post?.createdAt).format('MMMM Do YYYY, hh:mm:ss a')}</time>
              </div>
            </div>
            {owner && token && <div
              style={{ margin: "15px", display: "flex", justifyContent: "end" }}>
              <button
                style={{ backgroundColor: "teal", border: "none", padding: "5px 18px", color: "#fff", fontSize: "1.3rem", borderRadius: "5px" }}
                onClick={() => navigate(`/edit/${post?._id}`)}
              >Edit</button>
            </div>}
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
              {isPlaying ? 'Stop Speech' : 'Play Speech'}
            </button>

            <div className='post-content'
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: post?.content || '' }}>
            </div>

            <div className='keywords__section'>
              {post?.keywords && post?.keywords.map((item, idx) => (
                <p 
                key={idx}><Link
                style={{color: '#FFF'}}
                to={`/search?keyword=${item.replace(/\s+/g, '+')}`}>{item}</Link> </p>
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
        {data.length !== 0 && data.map((item) => {
          return (

            <InfinityPost post={item} key={item._id} />
          )
        })
        }
      </div>
    </>
  );
};

export default BlogView;
