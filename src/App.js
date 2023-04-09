import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'alertifyjs/build/css/alertify.css';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='home' element={<Dashboard />} />
          <Route path='users' element={<Users />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
