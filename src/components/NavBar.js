import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { MdManageAccounts } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
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
                    <Button variant="outline-secondary"><MdManageAccounts /></Button>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
  )
}

export default NavBar