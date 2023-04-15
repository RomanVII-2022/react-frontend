import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React from 'react'
import NavBar from './NavBar'
import Container from 'react-bootstrap/Container';
import AuditCategory from './AuditCategory';
import AuditMeasure from './AuditMeasure';
import Organizations from './Organizations';
import AuditTypes from './AuditTypes';
import AuditStatus from './AuditStatus';

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
                    <AuditMeasure />
                </Tab>
                <Tab eventKey="organization" title="Organization">
                    <Organizations />
                </Tab>
                <Tab eventKey="types" title="Types">
                    <AuditTypes />
                </Tab>
                <Tab eventKey="status" title="Status">
                    <AuditStatus />
                </Tab>
            </Tabs>
        </Container>
    </div>
  )
}

export default ManageAudits