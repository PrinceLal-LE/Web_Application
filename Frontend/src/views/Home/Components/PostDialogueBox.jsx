// Frontend/src/views/Home/Components/PostDialogueBox.jsx
import { Container, Image } from 'react-bootstrap';
import React, { useState } from 'react';
import avatar from '/home/avtar.png';
import galleryIcon from '/home/Icons/gallery.png';
import videoIcon from '/home/Icons/video_camera.png';
import dataIcon from '/home/Icons/data.png';
import postIcon from '/home/Icons/post.png';
import tripleDotIcon from '/home/Icons/triple_dot.png';
import '../styles/PostDialogueBox.css';
import { Row, Col } from 'react-bootstrap';
import DataOptionsDialog from './DataOptionsDialog'; // Make sure this import is correct
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const PostDialogueBox = () => {
    const [showDataDialog, setShowDataDialog] = useState(false);
    const [fetchedData, setFetchedData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [dataError, setDataError] = useState(null);

    const handleDataIconClick = async () => {
        setShowDataDialog(true);
        setLoadingData(true);
        setDataError(null);

        try {
            // Change the endpoint to your new checkbox options API
            const response = await fetch(`${API_BASE_URL}/api/checkbox-options`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFetchedData(data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            setDataError("Failed to load data. Please try again.");
            setFetchedData([]);
        } finally {
            setLoadingData(false);
        }
    };

    const handleCloseDataDialog = () => {
        setShowDataDialog(false);
        setFetchedData([]);
        setDataError(null);
    };

    return (
        <>
            <Container fluid className='bg-white px-4 py-4 mb-2 postDialogueBox'>
                <Row>
                    <Col className='d-flex justify-content-center align-items-top gap-3' md={1}>
                        <div>
                            <img src={avatar} alt="" style={{ width: '50px', borderRadius: '10rem', paddingTop: '1.5rem' }} />
                        </div>
                    </Col>
                    <Col md={11} className=''>
                        <div className='postDialogueBox__input'>
                            <textarea placeholder='Share Business / Project / Post' className='w-100 mt-3' style={{ resize: 'none' }} rows={5} />
                        </div>
                    </Col>
                </Row>

                <Row className='postDialogueBoxIconsRow'>
                    <Col md={2} className='postDialogueBoxIcons'>
                        <div>
                            <img src={galleryIcon} alt="Image Upload" /> Photo
                        </div>
                    </Col>
                    <Col md={2} className='postDialogueBoxIcons'>
                        <div>
                            <img src={videoIcon} alt="Video Icon" /> Video
                        </div>
                    </Col>
                    <Col md={2} className='postDialogueBoxIcons'>
                        <div onClick={handleDataIconClick} style={{ cursor: 'pointer' }}>
                            <img src={dataIcon} alt="Data choose" /> Data
                        </div>
                    </Col>
                    {showDataDialog && (
                        <DataOptionsDialog
                            show={showDataDialog}
                            onHide={handleCloseDataDialog}
                            data={fetchedData}
                            loading={loadingData}
                            error={dataError}
                        />
                    )}
                    <Col md={2} className='postDialogueBoxIcons'>
                        <div>
                            <img src={postIcon} alt="Post" /> Post
                        </div>
                    </Col>
                    <Col xs="auto" className='postDialogueBoxIconsRightSide ms-auto'>
                        <div>
                            <img src={tripleDotIcon} alt="Post" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};