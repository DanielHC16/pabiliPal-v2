// Packages
import {Routes, Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from "./components/Navbar";

// Store
import { useThemeStore } from './store/useThemeStore.js';

// Pages
import HomePage from "./pages/HomePage"
import ProductPage from './pages/ProductPage';

// TODO: Edgecasing, Cart System, Authentication, POS System

function App() {
  
  const {theme} = useThemeStore();


  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      
      <Navbar/>

      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/product/:id" element={<ProductPage />}/>
      </Routes>

      <Toaster></Toaster>
    </div>
  )
}

export default App
