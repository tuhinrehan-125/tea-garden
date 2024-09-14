import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import AdminScreen from './screens/AdminScreen';
import InvoiceScreen from './screens/InvoiceScreen';
import InvoiceCreateScreen from './screens/InvoiceCreateScreen';
import InvoiceEditScreen from './screens/InvoiceEditScreen';

import SackScreen from './screens/SackScreen';
import SackCreateScreen from './screens/SackCreateScreen';
import SackEditScreen from './screens/SackEditScreen';

import PowderScreen from './screens/PowderScreen';
import PowderCreateScreen from './screens/PowderCreateScreen';
import PowderEditScreen from './screens/PowderEditScreen';

import PacketScreen from './screens/PacketScreen';
import PacketCreateScreen from './screens/PacketCreateScreen';
import PacketEditScreen from './screens/PacketEditScreen';


import { useSelector } from 'react-redux';

function App() {
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <Router>
      <Header />
      <Container fluid>
        <div className="row">
          {userInfo && userInfo.data.isAdmin && (
            <div className="col-md-3 col-lg-3 d-md-block sidebar bg-dark text-white">
              <Sidebar />
            </div>
          )}
          <div className={`col-md-${userInfo && userInfo.data.isAdmin ? '9' : '12'} col-lg-${userInfo && userInfo.data.isAdmin ? '9' : '12'} ms-sm-auto px-md-4`}>
            <Routes>
              <Route path='/' element={<HomeScreen />} />
              <Route path='/login' element={<LoginScreen />} />
              <Route path='/admin/dashboard' element={<AdminScreen />} />

              <Route path='/admin/invoices' element={<InvoiceScreen />} />
              <Route path='/admin/invoice/create' element={<InvoiceCreateScreen />} />
              <Route path='/admin/invoice/:id/edit' element={<InvoiceEditScreen />} />

              <Route path='/admin/sacks' element={<SackScreen />} />
              <Route path='/admin/sack/create' element={<SackCreateScreen />} />
              <Route path='/admin/sack/:id/edit' element={<SackEditScreen />} />

              <Route path='/admin/powders' element={<PowderScreen />} />
              <Route path='/admin/powder/create' element={<PowderCreateScreen />} />
              <Route path='/admin/powder/:id/edit' element={<PowderEditScreen />} />

              <Route path='/admin/packets' element={<PacketScreen />} />
              <Route path='/admin/packet/create' element={<PacketCreateScreen />} />
              <Route path='/admin/packet/:id/edit' element={<PacketEditScreen />} />

            </Routes>
          </div>
        </div>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
