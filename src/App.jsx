import { Sidebar } from './Components/Sidebar';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotFound } from './pages/NotFound';
import { Navbar } from './Components/Navbar';
import { CodeEditor } from './pages/Editor';
import SandBox from './pages/Sandbox';

import DashboardPage from './pages/Analyze';
import ProductsTable from './pages/Products';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Driver';
import LocationSearch from './pages/LocationSearch';

function App() {
  return (
      <div className='layout'>
        <Router>
        <Sidebar />
        <main>
          <Navbar />
          <section>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage/>} />
                
                <Route path="/packages" element={<ProductsTable/>} />
                <Route path="/vehicles" element={<Vehicles/>} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/shipments" element={<LocationSearch />} />
                <Route path="/sandbox" element={<SandBox/>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
          </section>
        </main>
        </Router>
      </div>
  )
}

export default App
