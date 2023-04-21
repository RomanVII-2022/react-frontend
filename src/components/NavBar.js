import React, { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { MdManageAccounts } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import AuthContext from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers, fetchUsers } from '../features/users/userSlice';
import { Link } from 'react-router-dom';

const NavBar = () => {

    const dispatch = useDispatch()

    const {user, AuthLogout} = useContext(AuthContext)

    const users = useSelector(getAllUsers)

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])


  return (
    <div>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to='/home'><span style={{color: '#2a71d0'}}>Vic</span><span style={{color: '#f3ba2f'}}>Safety</span></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={NavLink} to="/home">Dashboard</Nav.Link>
                    <Nav.Link as={NavLink} to="/users">Users</Nav.Link>
                    <Nav.Link as={NavLink} to="/incidents">Incidents</Nav.Link>
                    <Nav.Link as={NavLink} to='/audits'>Audit</Nav.Link>
                    <Nav.Link as={NavLink} to='/drivers'>Drivers</Nav.Link>
                </Nav>
                <Nav>
                    <Button variant="outline-secondary" onClick={handleShow}><MdManageAccounts /></Button>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Account Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {users.filter(usr => usr.id === user.user_id).map(usr => (
                    <div>
                        <p><strong>Name: </strong>{usr.name}</p>
                        <p><strong>Job Title: </strong>{usr.jobTitle}</p>
                        <p><strong>Phone Number: </strong>{usr.phone}</p>
                        <p><strong>Email: </strong>{usr.email}</p>
                        <p><strong>Status: </strong>{usr.status === 1 ? 'Active' : 'Inactive'}</p>
                        <p><strong>Role: </strong>{usr.role === 1 ? 'Admin' : 'User'}</p>
                        <p><strong>Joined: </strong>{new Date(usr.created_on).toDateString()}</p>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={() => AuthLogout()}>
                Logout
            </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default NavBar