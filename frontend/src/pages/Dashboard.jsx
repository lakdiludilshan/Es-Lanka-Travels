import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashPlaces from '../components/DashPlaces';
import DashFeedbacks from '../components/DashFeedbacks';
import DashHotels from '../components/DashHotels';
import DashReview from '../components/DashReview';
import DashboardComponent from '../components/DashboardComponent';

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
        {/* Content */}
        {tab === 'profile' && <DashProfile />}
        {tab === 'posts' && <DashPosts />}
        {tab === 'users' && <DashUsers />}
        {tab === 'comments' && <DashComments />}
        {tab === 'dash' && <DashboardComponent />}
        {tab === 'places' && <DashPlaces />}
        {tab === 'feedbacks' && <DashFeedbacks />}
        {tab === 'hotels' && <DashHotels />}
        {tab === 'reviews' && <DashReview />}

    </div>
  )
}

export default Dashboard
