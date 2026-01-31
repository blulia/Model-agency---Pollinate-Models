import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Models from './pages/Models';
import BecomeModel from './pages/BecomeModel';
import ContactUs from './pages/ContactUs';
import Girls from './pages/Girls';
import GirlProfile from './pages/GirlProfile';
import Boys from './pages/Boys';
import BoyProfile from './pages/BoyProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import ModelCabinet from './pages/ModelCabinet';
import ModelCabinetProfile from './pages/ModelCabinetProfile';
import PhotographerCabinet from './pages/PhotographerCabinet';
import ModelProfile from './pages/ModelProfile';
import AdminCabinet from './pages/AdminCabinet';
import ViewModelForm from './pages/ViewModelForm';
import ChatPage from './components/Chat/ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/models" element={<Models />} />
        <Route path="/models/girls" element={<Girls />} />
        <Route path="/models/girls/:id" element={<GirlProfile />} />
        <Route path="/models/boys" element={<Boys />} />
        <Route path="/models/boys/:id" element={<BoyProfile />} />
        <Route path="/become-model" element={<BecomeModel />} />
        <Route path="/signinsignup" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/model-cabinet" element={<ModelCabinet />} />
        <Route path="/model-cabinet/:id" element={<ModelCabinetProfile />} />
        <Route path="/photographer-cabinet" element={<PhotographerCabinet />} />
        <Route path="/model-profile/:id" element={<ModelProfile />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
        <Route path="/admin-cabinet" element={<AdminCabinet />} />
        <Route path="/admin-cabinet/view/:id" element={<ViewModelForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;
