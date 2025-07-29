import React from 'react';
import { Container, Card, Image, Button, Form, Row, Col } from 'react-bootstrap';
import '../styles/UserPostBox.css'; // Assuming you have a CSS file for custom styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Data for the post
const postsData = [
    {
        "id": 1,
        author: {
            name: 'Lori Ferguson',
            title: 'Web Developer at Webestica',
            profilePic: '/home/Icons/connection_1.png' // Placeholder for Lori's profile pic
        },
        timestamp: '2hr',
        text: "I'm thrilled to share that I've opened our new factory in Germiston, South Africa to serve in the Africa region as fast as possible.!",
        postImage: '/home/South_Africa.png', // Placeholder for the post image
        interactions: {
            likes: 0, // Placeholder, can be dynamic
            comments: 0,
            shares: 0,
            connects: 0
        },
        comments: [
            {
                id: 1,
                author: 'Frances Guerrero',
                profilePic: '/home/Icons/connection_4.png', // Placeholder for Frances's profile pic
                text: 'Congrats.',
                likes: 3,
                replies: 5,
                nestedComments: [ // Added a nestedComments array for replies
                    {
                        id: 1.1,
                        author: 'Another User',
                        profilePic: '/home/Icons/connection_2.png', // Placeholder for reply author
                        text: 'This is a reply to Frances\' comment. Great insight!',
                        likes: 1,
                    },
                    {
                        id: 1.2,
                        author: 'John Doe',
                        profilePic: '/home/Icons/connection_3.png', // Placeholder for another reply author
                        text: 'Agreed, very well put.',
                        likes: 0,
                    }
                ]
            },
            {
                id: 2,
                author: 'Jane Smith',
                profilePic: '/home/Icons/connection_7.png', // Placeholder for Jane's profile pic
                text: 'Congratulations Lori! That\'s fantastic news.',
                likes: 10,
                replies: 0,
                nestedComments: []
            }
            // Add more comments as needed
        ]
    },
    {
        "id": 2,
        author: {
            name: 'Mark Johnson',
            title: 'Operations Manager at Marvel Moulds',
            profilePic: '/home/Icons/connection_4.png' // Placeholder for Lori's profile pic
        },
        timestamp: '2hr',
        text: "I'm thrilled to share that I've opened our new factory in Germiston, South Africa to serve in the Africa region as fast as possible.!",
        postImage: '/home/South_Africa.png', // Placeholder for the post image
        interactions: {
            likes: 0, // Placeholder, can be dynamic
            comments: 0,
            shares: 0,
            connects: 0
        },
        comments: [
            {
                id: 1,
                author: 'Frances Guerrero',
                profilePic: '/home/Icons/connection_4.png', // Placeholder for Frances's profile pic
                text: 'Congrats.',
                likes: 3,
                replies: 5,
                nestedComments: [ // Added a nestedComments array for replies
                    {
                        id: 1.1,
                        author: 'Another User',
                        profilePic: '/home/Icons/connection_2.png', // Placeholder for reply author
                        text: 'This is a reply to Frances\' comment. Great insight!',
                        likes: 1,
                    },
                    {
                        id: 1.2,
                        author: 'John Doe',
                        profilePic: '/home/Icons/connection_3.png', // Placeholder for another reply author
                        text: 'Agreed, very well put.',
                        likes: 0,
                    }
                ]
            },
            {
                id: 2,
                author: 'Jane Smith',
                profilePic: '/home/Icons/connection_7.png', // Placeholder for Jane's profile pic
                text: 'Congratulations Lori! That\'s fantastic news.',
                likes: 10,
                replies: 0,
                nestedComments: []
            }
            // Add more comments as needed
        ]
    }
]

// Component to render a single comment, including its nested replies
const CommentItem = ({ comment }) => (
    <>
        <div className="d-flex align-items-start mb-2">
            <Image src={comment.profilePic} roundedCircle style={{ width: '36px', height: '36px', objectFit: 'cover' }} className="me-3" />
            <div className="flex-grow-1 bg-light rounded-3 p-3">
                <h6 className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>{comment.author}</h6>
                <p className="mb-2" style={{ fontSize: '0.85rem' }}>{comment.text}</p>
                <div className="d-flex" style={{ fontSize: '0.75rem' }}>
                    <Button variant="link" className="text-muted p-0 me-3 text-decoration-none">
                        Like ({comment.likes})
                    </Button>
                    <Button variant="link" className="text-muted p-0 me-3 text-decoration-none">
                        Reply
                    </Button>
                    {comment.replies > 0 && (
                        <Button variant="link" className="text-muted p-0 text-decoration-none">
                            View {comment.replies} replies
                        </Button>
                    )}
                </div>
            </div>
        </div>
        {comment.nestedComments && comment.nestedComments.length > 0 && (
            <div className="ms-5 ps-3 border-start border-light"> {/* Indent replies */}
                {comment.nestedComments.map(nestedComment => (
                    <CommentItem key={nestedComment.id} comment={nestedComment} />
                ))}
            </div>
        )}
    </>
);


export const UserPostBox = () => {
    return (
        <Container className="my-4 p-0 " style={{ maxWidth: '100%', borderRadius: '15px' }}>
            {postsData.map(postData => (

                <Card key={postData.id} className="userPostBox ">
                    {/* Post Header */}
                    <Card.Header className="bg-white p-4 d-flex align-items-center border-bottom-0">
                        <Image src={postData.author.profilePic} roundedCircle style={{ width: '48px', height: '48px', objectFit: 'cover' }} className="me-3" />
                        <div className="flex-grow-1">
                            <h6 className="mb-0 fw-bold">{postData.author.name}</h6>
                            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                {postData.author.title} • {postData.timestamp}
                            </p>
                        </div>
                        <Button variant="link" className="p-0 text-muted">
                            <FontAwesomeIcon fixedWidth icon="ellipsis" size='xl' > </FontAwesomeIcon>
                        </Button>
                    </Card.Header>

                    {/* Post Body - Text Content */}
                    <Card.Body className="pt-0 px-4 pb-2">
                        <Card.Text className="mb-3">
                            {postData.text}
                        </Card.Text>
                        {/* Post Body - Image */}
                        {postData.postImage && (
                            <Image src={postData.postImage} fluid rounded style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Load+Error'; }}
                            />
                        )}
                    </Card.Body>

                    {/* Interaction Buttons */}
                    {/* <div className="d-flex justify-content-around align-items-center border-top py-2 px-4">
                        <Button variant="link" className="text-muted d-flex align-items-center text-decoration-none">
                            <FontAwesomeIcon fixedWidth icon="heart" size='xl' > </FontAwesomeIcon> <span className="ms-2">Like</span>
                        </Button>
                        <Button variant="link" className="text-muted d-flex align-items-center text-decoration-none">
                            <FontAwesomeIcon fixedWidth icon="comment" size='xl' ></FontAwesomeIcon>  <span className="ms-2">Comment</span>
                        </Button>
                        <Button variant="link" className="text-muted d-flex align-items-center text-decoration-none">
                            <FontAwesomeIcon fixedWidth icon="share" size='xl' ></FontAwesomeIcon> <span className="ms-2">Share</span>
                        </Button>
                        <Button variant="link" className="text-muted d-flex align-items-center text-decoration-none">
                            <FontAwesomeIcon fixedWidth icon="link" size='xl' ></FontAwesomeIcon> <span className="ms-2">Connect</span>
                        </Button>
                    </div> */}
                    <div className="d-flex justify-content-around align-items-center border-top py-2 px-4">
                        <Row className="w-100 gx-0">
                            {/* Each button column */}
                            <Col xs={3} className="text-center d-flex justify-content-center"> {/* xs=3 for 4 columns on mobile */}
                                <Button variant="link" className="text-muted d-flex flex-column flex-md-row align-items-center justify-content-center text-decoration-none py-2">
                                    <FontAwesomeIcon fixedWidth icon="heart" size='xl' > </FontAwesomeIcon>

                                    {/* Label visible only on desktop (md and up), hidden on mobile (xs, sm) */}
                                    <span className="mt-1 d-none d-md-inline ms-md-2 label-text">Like</span>
                                </Button>
                            </Col>
                            <Col xs={3} className="text-center d-flex justify-content-center">
                                <Button variant="link" className="text-muted d-flex flex-column flex-md-row align-items-center justify-content-center text-decoration-none py-2">
                                    <FontAwesomeIcon fixedWidth icon="comment" size='xl' ></FontAwesomeIcon>

                                    <span className="mt-1 d-none d-md-inline ms-md-2 label-text">Comment</span>
                                </Button>
                            </Col>
                            <Col xs={3} className="text-center d-flex justify-content-center">
                                <Button variant="link" className="text-muted d-flex flex-column flex-md-row align-items-center justify-content-center text-decoration-none py-2">
                                    <FontAwesomeIcon fixedWidth icon="share" size='xl' ></FontAwesomeIcon>
                                    <span className="mt-1 d-none d-md-inline ms-md-2 label-text">Share</span>
                                </Button>
                            </Col>
                            <Col xs={3} className="text-center d-flex justify-content-center">
                                <Button variant="link" className="text-muted d-flex flex-column flex-md-row align-items-center justify-content-center text-decoration-none py-2">
                                    <FontAwesomeIcon fixedWidth icon="link" size='xl' ></FontAwesomeIcon> 

                                    <span className="mt-1 d-none d-md-inline ms-md-2 label-text">Connect</span>
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* Add Comment Section */}
                    <div className="p-3 bg-light d-flex align-items-center border-top">
                        <Image src={postData.author.profilePic} roundedCircle style={{ width: '30px', height: '30px', objectFit: 'cover' }} className="me-2" />
                        <Form.Control type="text" placeholder="Add a comment..." className="rounded-pill bg-white border-0 py-2 px-3" />
                    </div>

                    {/* Comments Section
                <div className="p-3">
                    {postData.comments.map(comment => (
                        <div key={comment.id} className="d-flex align-items-start mb-3">
                            <Image src={comment.profilePic} roundedCircle style={{ width: '36px', height: '36px', objectFit: 'cover' }} className="me-3" />
                            <div className="flex-grow-1 bg-light rounded-3 px-1">
                                <h6 className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>{comment.author}</h6>
                                <p className="mb-2" style={{ fontSize: '0.85rem' }}>{comment.text}</p>
                                <div className="d-flex" style={{ fontSize: '0.75rem' }}>
                                    <Button variant="link" className="text-muted p-0 me-3 text-decoration-none">
                                        Like ({comment.likes})
                                    </Button>
                                    <Button variant="link" className="text-muted p-0 me-3 text-decoration-none">
                                        Reply
                                    </Button>
                                    <Button variant="link" className="text-muted p-0 text-decoration-none">
                                        View {comment.replies} replies
                                    </Button>
                                </div>
                                <div key={comment.id} className="d-flex align-items-start mb-3 mt-2 me-1 align-text-justify">
                                    <Image src={comment.profilePic} roundedCircle style={{ width: '36px', height: '36px', objectFit: 'cover' }} className="me-3" />
                                    <div className="flex-grow-1 bg-light rounded-3 px-1">
                                        <h6 className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>{comment.author}</h6>
                                        <p className="mb-2" style={{ fontSize: '0.85rem' }}>{comment.text}</p>
                                        <div className="d-flex" style={{ fontSize: '0.75rem' }}>
                                            <Button variant="link" className="text-muted p-0 me-3 text-decoration-none">
                                                Like ({comment.likes})
                                            </Button>
                                            <Button variant="link" className="text-muted p-0 me-3 text-decoration-none">
                                                Reply
                                            </Button>
                                            <Button variant="link" className="text-muted p-0 text-decoration-none">
                                                View {comment.replies} replies
                                            </Button>
                                        </div>


                                    </div>
                                </div>


                            </div>
                        </div>
                    ))}
                </div> */}
                    {/* Comments Section */}
                    <div className="p-3">
                        {postData.comments.map(comment => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                </Card>
            ))}

        </Container>
    );
};


