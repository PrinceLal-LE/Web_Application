import React from 'react';
import { Container, Card, Image, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



// Inline SVG for Actively Recruiting icon (simple representation of a checkmark in a circle)
const ActivelyRecruitingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.499a.235.235 0 0 0-.02.022L6.147 8.147a.235.235 0 0 0-.02-.022L4.695 6.695a.235.235 0 0 0-.02.022l1.24 1.24a.235.235 0 0 0 .02.022l2.42 2.42a.235.235 0 0 0 .02-.022l3.434-3.434a.235.235 0 0 0-.02-.022z" />
    </svg>
);

// Component for a single job recommendation item
const JobListingItem = ({ logo, jobTitle, company, location, postedTime, status, applicants }) => {
    return (
        <div className="mb-3 pb-3 border-bottom">
            <Row className="align-items-start">
                {/* Logo and Job Details */}
                <Col xs={10} className="d-flex align-items-start">
                    <Image src={logo} roundedCircle style={{ width: '48px', height: '48px', objectFit: 'cover' }} className="me-3 mt-1"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48/cccccc/ffffff?text=Logo'; }}
                    />
                    <div>
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '1rem', color: '#0A66C2' }}>{jobTitle}</h6> {/* LinkedIn blue for job title */}
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{company}</p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{location}</p>
                        <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                            {postedTime}
                            {/* d-inline-flex align-items-center
                                d-inline-flex align-items-center
                                d-inline-flex align-items-center */}
                            {status === 'easyApply' && (
                                <span className="ms-2 "><FontAwesomeIcon icon="fa-brands fa-linkedin" size='xl' className='me-1' /> Easy Apply</span>
                            )}
                            {status === 'activelyRecruiting' && (
                                <span className="ms-2 text-success "><ActivelyRecruitingIcon className="me-1" /> Actively recruiting</span>
                            )}
                            {applicants && (
                                <span className="ms-2 ">{applicants} applicant{applicants !== 1 ? 's' : ''}</span>
                            )}
                        </p>
                    </div>
                </Col>
                {/* Bookmark Icon */}
                <Col xs={2} className="text-end">
                    <Button variant="link" className="p-0 text-muted">
                         <FontAwesomeIcon icon='bookmark'/>
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

// Main component for "More Jobs For You"
const jobListingsData = [
    {
        id: 1,
        logo: 'https://placehold.co/48x48/000000/ffffff?text=CY', // Placeholder for Cyient
        jobTitle: 'Deputy General Manager - Operations',
        company: 'Cyient',
        location: 'Hyderabad, Telangana, India (On-site)',
        postedTime: '1 month ago',
        status: 'activelyRecruiting'
    },
    {
        id: 2,
        logo: 'https://placehold.co/48x48/CCCCCC/000000?text=NA', // Placeholder for NA (Esthetic Insights)
        jobTitle: 'Head of Operations',
        company: 'NA',
        location: 'Hyderabad, Telangana, India (On-site)',
        postedTime: '1 week ago',
        status: 'easyApply'
    },
    {
        id: 3,
        logo: 'https://placehold.co/48x48/FF5733/ffffff?text=UT', // Placeholder for UltraTech Cement (Aditya Birla)
        jobTitle: 'Manager/ Senior Manager/ Asst. General Manager - Mining',
        company: 'UltraTech Cement',
        location: 'Mumbai, Maharashtra, India (Remote)',
        postedTime: '3 weeks ago',
        status: 'activelyRecruiting',
        applicants: 1 // Example: 1 applicant shown
    }
    // Add more job listings as needed
];


export const MoreConnectionCareerConnect = () => {
    return (
        <>
            <Container className="my-4 p-0 bg-white" style={{ maxWidth: '100%', borderRadius: '15px' }}> {/* Adjust max-width as needed */}
                <div className='pt-3 px-3'>

                    <h5 className="mb-1 fw-bold">More Connections </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Based on your profile and search history</p>
                </div>
                <Card className="rounded-3 shadow-sm border-0 p-3">
                    <Card.Body className="p-0">
                        {jobListingsData.map(job => (
                            <JobListingItem
                                key={job.id}
                                logo={job.logo}
                                jobTitle={job.jobTitle}
                                company={job.company}
                                location={job.location}
                                postedTime={job.postedTime}
                                status={job.status}
                                applicants={job.applicants}
                            />
                        ))}
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}

export default MoreConnectionCareerConnect;