import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'alertifyjs/build/css/alertify.css';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Incidents from './components/Incidents';
import ManageIncident from './components/ManageIncident';
import Audits from './components/Audits';
import ManageAudits from './components/ManageAudits';
import DriverView from './components/DriverView';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='home' element={<Dashboard />} />
          <Route path='users' element={<Users />} />
          <Route path='incidents' element={<Incidents />} />
          <Route path='/incidents/manage' element={<ManageIncident />} />
          <Route path='audits' element={<Audits />} />
          <Route path='/audits/manage' element={<ManageAudits />} />
          <Route path='drivers' element={<DriverView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
