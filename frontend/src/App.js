import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Background from './components/Background';
import Home from './pages/Home';
import About from './pages/About';
import Music from './pages/Music';
import Shows from './pages/Shows';
import Lyrics from './pages/Lyrics';
import Gallery from './pages/Gallery';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Admin from './pages/admin/Admin';
import './App.css';

function PublicSite() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/music" element={<Music />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/lyrics" element={<Lyrics />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Background />
      <div className="App relative z-10 min-h-screen flex flex-col">
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<PublicSite />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
