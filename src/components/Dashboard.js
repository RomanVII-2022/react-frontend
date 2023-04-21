import React, {useState, useEffect} from 'react'
import NavBar from './NavBar'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useSelector, useDispatch } from 'react-redux';
import { getAllIncidents, fetchIncidents } from '../features/incidents/incidentSlice';
import { getAllAudits, fetchAudits } from '../features/audits/auditSlice';
import dayjs from 'dayjs';

const Dashboard = () => {

  const dispatch = useDispatch()

  const incidents = useSelector(getAllIncidents)

  const iDay = incidents.filter(incident => new Date(incident.incidentDate).getDay() === new Date().getDay())

  const iWeek = incidents.filter(incident  => new Date(incident.incidentDate).getDay() - new Date().getDay() < 8)

  const iMonth = incidents.filter(incident => new Date(incident.incidentDate).getMonth() === new Date().getMonth())

  const audits = useSelector(getAllAudits)

  const day = audits.filter(audit => new Date(audit.dateRaised).getDay() === new Date().getDay())

  const week = audits.filter(audit => new Date(audit.dateRaised).getDay() - new Date().getDay() < 8)

  const month = audits.filter(audit => new Date(audit.dateRaised).getMonth() === new Date().getMonth())

  const [userData, setUserData] = useState({
    labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Incidents',
      data: [2, 1, 3, 5, 8, 2, 1, 3, 5, 8, 5, 8],
      backgroundColor: [
        '#2a71d0'
      ],
      borderWidth: 2,
      borderColor: 'black',
    },
    {
      label: 'Audits',
      data: [4, 8, 1, 1, 2, 4, 8, 1, 1, 2, 5, 0],
      backgroundColor: [
        '#f3ba2f'
      ],
      borderWidth: 2,
      borderColor: 'black',
    },
  ]
  })


  const [incidentData, setIncidentData] = useState({
    labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Incidents',
      data: [200, 100, 389, 50, 80, 200, 100, 389, 50, 80, 50, 80],
      backgroundColor: [
        '#2a71d0'
      ],
      borderWidth: 2,
      borderColor: 'black',
    },
    {
      label: 'Audits',
      data: [40, 80, 10, 150, 120, 40, 80, 10, 150, 120, 150, 120],
      backgroundColor: [
        '#f3ba2f'
      ],
      borderWidth: 2,
      borderColor: 'black',
    },
  ]
  })

  let count = 0;

  useEffect(() => {
    dispatch(fetchIncidents())
    dispatch(fetchAudits())
  }, [dispatch])

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
                      <strong>{iDay.length}</strong>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Audits:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>{day.length}</strong>
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
                      <strong>{iWeek.length}</strong>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Audits:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>{week.length}</strong>
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
                      <strong>{iMonth.length}</strong>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Audits:
                  </Col>
                  <Col>
                    <div style={{float: 'right'}}>
                      <strong>{month.length}</strong>
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
                  Total Incidents
                </Card.Title>
                
                <Doughnut data={incidentData} />
                
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title className='text-center'>
                  Audits
                </Card.Title>

                <Line data={userData} />


              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Dashboard