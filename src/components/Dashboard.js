import React, {useState} from 'react'
import NavBar from './NavBar'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Dashboard = () => {

  const [userData, setUserData] = useState({
    labels: [2019, 2020, 2021, 2022, 2023],
    datasets: [{
      label: 'Users',
      data: [200, 100, 389, 50, 80],
      backgroundColor: [
        '#2a71d0',
        '#f3ba2f'
      ],
      borderColor: 'black',
      borderWidht: 2,
    }]
  })

  return (
    <div>
      <NavBar />
      <Container>
        <Row style={{marginTop: '10px'}}>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Today</Card.Title>
                <Row>
                  <Col>
                    Incidents:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Audits:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Last 7 Days</Card.Title>
                <Row>
                  <Col>
                    Incidents:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Audits:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row style={{marginTop: '10px'}}>
          <Col>
          <Card>
              <Card.Body>
                <Card.Title>Last 30 Days</Card.Title>
                <Row>
                  <Col>
                    Incidents:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Audits:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row style={{marginTop: '10px'}}>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>
                  <Row>
                    <Col>
                      Total Incidents
                    </Col>
                    <Col>
                      <div style={{float: 'right'}}>
                        <strong>0</strong>
                      </div>
                    </Col>
                  </Row>
                </Card.Title>
                <Row>
                  <Col>
                    Incidents:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Audits:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>
                  <Row>
                    <Col>
                      Total Audits
                    </Col>
                    <Col>
                      <div style={{float: 'right'}}>
                        <strong>0</strong>
                      </div>
                    </Col>
                  </Row>
                </Card.Title>
                <Row>
                  <Col>
                    Incidents:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Audits:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row style={{marginTop: '10px'}}>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>
                  <Row>
                    <Col>
                      Total Audits
                    </Col>
                    <Col>
                      <div style={{float: 'right'}}>
                        <strong>0</strong>
                      </div>
                    </Col>
                  </Row>
                </Card.Title>
                <Row>
                  <Col>
                    Incidents:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Audits:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row style={{marginTop: '10px'}}>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title className='text-center'>
                  Incidents
                </Card.Title>
                <Row>
                  <Col>
                    Incidents:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Audits:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>0</strong>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title className='text-center'>
                  Audits
                </Card.Title>

                <Bar data={userData} />


              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Dashboard