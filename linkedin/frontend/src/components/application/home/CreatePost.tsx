import React, { useEffect, useState } from 'react';
import { Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';import axios from 'axios';
import { PostProps } from './PostProps';
import Post from './Post';

const CreatePost:React.FC= ()=> {
  const [imageDetails, setImageDetails] = useState('');
  const [posts, setPosts] = useState<PostProps[]>([]);
  useEffect(() => {
    
    const fetchPosts = async () => {
    try {
      console.log('useEffect');

      const accessToken = sessionStorage.getItem('accessToken')
      console.log("accessToken : ", accessToken);   
       const response = await axios.get("http://localhost:5050/posts/getPosts", {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }});
      setPosts(response.data);
      console.log('Response from server useEffect data:', response.data);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  }
  
  fetchPosts();
  },[]);

    const [showModal, setShowModal] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postType, setPostType] = useState('');

    const handleImageChange = (e) => {
      setImageDetails(e.target.files[0]);
    }
  
    const handlePostClick = () => {
      setShowModal(true);
    };
    const handleOptionClick = (type) => {
        setShowModal(true);
        setPostType(type);
      };
    const handleModalClose = () => {
      setShowModal(false);
      setPostContent('');
    };
  
    const handlePostSubmit = async() => {
      console.log('Post content:', postContent);
      const accessToken = sessionStorage.getItem('accessToken')
      console.log("accessToken : ", accessToken);
      setPostContent(postContent);
      console.log('content: ', postContent);
      

      try {
        console.log('Create post')
        const accessToken = sessionStorage.getItem('accessToken')

        const formData = new FormData(); // Create a new FormData object


        formData.append('content', postContent); // Append the content field
        formData.append('image', imageDetails); 

        const response = await axios.post("http://localhost:5050/posts/createPost",formData,{
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            "Content-Type" : 'multipart/form-data'
          }
        });
        console.log('Response from server:', response.data);
      } catch (error) {
        console.error('Error sending request:', error);
      }

      handleModalClose();
    };
  return (
    <>

           <div className="start-post-area bg-light rounded-4" style={{marginTop:'20px'}}>
            <Form className='d-flex justify-content-center' onClick={handlePostClick} >
                <Form.Group controlId="postContent" >
                    <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder="Start a post..."
                        style={{height:'40px', 
                                width:'500px',
                                border:'rounded',
                                borderRadius:'50px',
                                marginTop:'30px'                           
                            }}
                        // onChange={handleContentChange}
                    />
                </Form.Group>
             
            
            </Form> 
            
            {/* <div className="post-options mt-4 d-flex justify-content-between">

                <Button variant="default"  onClick={() => handleOptionClick('photo')} className="flex-fill hover-dark">
                <i className="fa-regular fa-image"></i>
                <span className="badge rounded-pill badge-notification" style={{ position: 'relative', color:'blue' }}>Photo</span>
                </Button>

                <Button variant="default " style={{marginLeft:'10px', marginRight:'5px'}} onClick={() => handleOptionClick('video')} className="flex-fill">
                <i className="fa-sharp fa-solid fa-circle-play"></i>
                <span className="badge rounded-pill badge-notification" style={{ position: 'relative', color:'blue' }}>Video</span>
                </Button>

                <Button variant="default" style={{marginLeft:'5px', marginRight:'5px'}}onClick={() => handleOptionClick('event')} className="flex-fill">
                <i className="fa-solid fa-calendar-days"></i>
                <span className="badge rounded-pill badge-notification" style={{ position: 'relative', color:'blue' }}>Event</span>
                </Button>

                <Button variant="default" style={{marginLeft:'5px', marginRight:'5px'}}onClick={() => handleOptionClick('article')} className="flex-fill">
                 <i className="fa-duotone fa-newspaper"></i>
                <span className="badge rounded-pill badge-notification" style={{ position: 'relative', color:'blue' }}>Write Article</span>
                </Button>

            </div> */}
  

        </div>

        <Modal show={showModal} onHide={handleModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create a Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="postContent">
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Write your post here..."
                />
              </Form.Group>
              <Form.Group controlId="image" >
                    <Form.Control
                    type = "file"                        
                    name = "image"
                    onChange={handleImageChange}
                    accept='image/*'            
                 />
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePostSubmit}>
              Post
            </Button>
          </Modal.Footer>
        </Modal>

        <div>
        {posts.map((post, index) => (
        <Post
          key={index} 
          firstName={post.firstName}
          lastName={post.lastName}
          email={post.email}
          content={post.content}
          imageId={post.imageId}
        />
      ))}
        </div>

      </>
 )
}

export default CreatePost