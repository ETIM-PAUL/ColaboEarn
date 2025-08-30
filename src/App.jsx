import React, { useContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/landing.jsx'
import DashboardPage from './pages/dashboard.jsx'
import Register from './pages/Register.jsx'
import Collection from './pages/collection.jsx'
import ForYou from './pages/foryou.jsx'
import MyWallet from './pages/my_wallet.jsx'
import Settings from './pages/settings.jsx'
import BlogDetails from './pages/blog_details.jsx'
import PublishPost from './pages/publish_post.jsx'
import { autoConnect } from "thirdweb/wallets";
import { clientThirdweb } from '../client';
import Themes from './pages/themes.jsx'
import CreateTheme from './pages/create_theme.jsx'

function App() {
  

  const connectAutomated = async () => {
    await autoConnect({
      client:clientThirdweb,
      onConnect: (wallet) => {
        console.log("wallet", wallet);
      },
    });
  }

  
  useEffect(() => {
    connectAutomated();
  }, []);

  return (
    <Router>
      <div className=''>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/my-wallet" element={<MyWallet />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/blog_details/:id" element={<BlogDetails />} />
          <Route path="/theme_details/:id" element={<BlogDetails />} />
          <Route path="/publish_post/:id" element={<PublishPost />} />
          <Route path="/create_theme" element={<CreateTheme />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
