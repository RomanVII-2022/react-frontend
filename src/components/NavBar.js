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

const NavBar = () => {

    const dispatch = useDispatch()

    const {user, AuthLogout} = useContext(AuthContext)

    const users = useSelector(getAllUsers)

    const logUser = users.filter(usr => usr.id === user.user_id)

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
                <Navbar.Brand href="#home">Vic<span style={{color: 'greenyellow'}}>Safety</span></Navbar.Brand>
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