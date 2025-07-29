import { Container, ListGroup, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserStatus } from './Components/UserStatus';
import { LeftSideButtonShortCut } from './Components/LeftSideButtomShortCut';
import { LeftSideFooter } from './Components/LeftSideFooter';
export const LeftSideBar = () => {
    return <>

        <Container fluid className="leftSideBar ms-auto bg-white px-0">
            <img src="/home/Left_side_icon.png" className="leftSideBarBanner" alt="Prince Lal" />
            <img src="/home/profile_icon.png" className='avtarLeftSideBar' alt="Prince Lal"  />
            <h2 className='text userName mb-0'>Prince Lal</h2>
            <h6 className='text-muted designationText mt-1'>Software Engineer at Mould Connect</h6>
            <p className='text'>I would love to change the world, but they won't give me source code.</p>
            {/* Code for the list below profile details. */}
            <ListGroup className='w-75 listSpacingSetting'>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon={['fas', 'bell']}  color="#74C0FC" /> Notification</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="network-wired" color="#74C0FC" /> Connection</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="star" color="#74C0FC" /> Revenue</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="gear" color="#74C0FC" /> Setting</ListGroup.Item>
                <ListGroup.Item className='text-center'>View Profile</ListGroup.Item>
            </ListGroup>
            {/* Status of the user */}
            <UserStatus />

            {/* Shortcut of header */}
            {/* <ListGroup className='w-100 mx-25 listShortCutSetting'>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon={['fas', 'home']}  color="#74C0FC" /> Home</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="user" color="#74C0FC" /> My Connect</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="globe" color="#74C0FC" /> Skill Connect</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="calendar" color="#74C0FC" /> Career Connect</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="fa-solid fa-people-arrows" color="#74C0FC" /> Connect a friend</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="fa-solid fa-bell" style={{color: "#74C0FC"}} /> Event</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="gears" color="#74C0FC" /> Solution</ListGroup.Item>
                <ListGroup.Item > Show More <FontAwesomeIcon fixedWidth icon="angle-down" color="#74C0FC" /> </ListGroup.Item>
            </ListGroup> */}
            <LeftSideButtonShortCut />
            
        </Container>

        <Container fluid className="leftSideBarFooter">
            <LeftSideFooter/>
        </Container>

    </>
}