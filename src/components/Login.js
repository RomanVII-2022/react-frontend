import React, {useContext} from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import AuthContext from '../context/AuthContext';

const Login = () => {

    const {AuthLogin} = useContext(AuthContext)

    const handleLoginSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        AuthLogin(formData)
    }

  return (
    <div>
        <Container>
            <Row style={{marginTop: '50px'}} className="justify-content-md-center">
                <Col md={6}>
                    <Card>
                        <Card.Header className="text-center"><h4>Welcome</h4></Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleLoginSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label><strong>Email address</strong></Form.Label>
                                    <Form.Control type="email" name="email" placeholder="Enter email" required />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label><strong>Password</strong></Form.Label>
                                    <Form.Control type="password" name="password" placeholder="Password" required />
                                </Form.Group>
                                <Button style={{width: '100%'}} variant="primary" type="submit">
                                    Login
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default Login