import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import RequireAuth from "./components/RequireAuth";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";

import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Tours from "./pages/Tours";
import Place from "./pages/Place";
import Hotel from "./pages/Hotel";
import Guides from "./pages/Guides";

import PlaceDetails from "./pages/PlaceDetails";
import HotelDetails from "./pages/HotelDetails";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";

import CreatePost from "./pages/CreatePost";
import CreatePlace from "./pages/CreatePlace";
import CreateHotel from "./pages/CreateHotel";

import UpdatePost from "./pages/UpdatePost";
import UpdatePlace from "./pages/UpdatePlace";
import UpdateHotel from "./pages/UpdateHotel";

import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          {/* Protected Home Page */}
          <Route
            index
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />

          {/* General Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/places" element={<Place />} />
          <Route path="/place/:placeId" element={<PlaceDetails />} /> 
          <Route path="/hotels" element={<Hotel />} />
          <Route path="/hotel/:hotelId" element={<HotelDetails />} />
          <Route path="/guides" element={<Guides />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
            <Route path="/create-place" element={<CreatePlace />} />
            <Route path="/update-place/:placeId" element={<UpdatePlace />} />
            <Route path="/create-hotel" element={<CreateHotel />} />
            <Route path="/update-hotel/:hotelId" element={<UpdateHotel />} />

          </Route>

          {/* Blog & Tours */}
          <Route path="/tours" element={<Tours />} />
          <Route path="/post/:postslug" element={<PostPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
