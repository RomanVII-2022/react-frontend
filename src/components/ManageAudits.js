import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React from 'react'
import NavBar from './NavBar'
import Container from 'react-bootstrap/Container';
import AuditCategory from './AuditCategory';

const ManageAudits = () => {

  return (
    <div>
        <NavBar />
        <Container>
            <Tabs
            style={{marginTop: '10px'}}
            defaultActiveKey="category"
            id="justify-tab-example"
            className="mb-3"
            justify
            >
                <Tab eventKey="category" title="Category">
                    <AuditCategory />
                </Tab>
                <Tab eventKey="measure" title="Measure">
                    <h1>2</h1>
                </Tab>
                <Tab eventKey="organization" title="Organization">
                    <h1>3</h1>
                </Tab>
                <Tab eventKey="types" title="Types">
                    <h1>4</h1>
                </Tab>
                <Tab eventKey="status" title="Status">
                    <h1>5</h1>
                </Tab>
            </Tabs>
        </Container>
    </div>
  )
}

export default ManageAudits