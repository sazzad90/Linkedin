import React, { useEffect, useState } from 'react'
import { PostProps } from '../home/PostProps'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Post from '../home/Post';
import { Container, Row, Col } from 'react-bootstrap';
import TopNavbar from '../TopNavbar';

const ClickedPost:React.FC=()=> {
    const { postId } = useParams();
    const [post, setPost] = useState<PostProps>();
    useEffect(()=>{
    const fetchClickedPost = async () => {
    try {
        const accessToken = sessionStorage.getItem('accessToken')
        console.log("accessToken : ", accessToken);   
         const response = await axios.post("http://localhost/posts/getClickedPost",{
            postId:postId,
         },{
          headers: {
            'Authorization': `Bearer ${accessToken}`
      }});
        console.log('Response from server useEffect data:', response.data);
        setPost(response.data);
        console.log('final post: ', post);
        
      } catch (error) {
        console.error('Error sending request for useEffect:', error);
      }
    }
      fetchClickedPost();
    
    },[]);

    const headerStyles: React.CSSProperties = {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'blue',
      marginBottom: '20px',
      marginTop: '20px',
      borderBottom: '1px solid #ccc',
      paddingBottom: '10px',
    };

  return (
    <>
      <Container fluid className="homepage-container">
        <TopNavbar />
        <Container>
          <Row>
            <Col md={3}></Col>
            <Col md={6}>
            <h2 style={headerStyles}>Post</h2>    

              <div>
                {post && ( 
                <Post
                  firstName={post.firstName}
                  lastName={post.lastName}
                  email={post.email}
                  content={post.content}
                  imageId={post.imageId}
                />
                )}
              </div> 
            </Col>
          <Col md={3}></Col>
        </Row>
        </Container>
    </Container>
    </>
    )
}

export default ClickedPost