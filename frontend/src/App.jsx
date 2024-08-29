import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RequireAuth from "./components/RequireAuth";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Tours from "./pages/Tours";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={ <RequireAuth> <HomePage /> </RequireAuth> }/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/logout" element={<Logout/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tours" element={<Tours />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
