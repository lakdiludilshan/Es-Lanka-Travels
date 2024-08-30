import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";

const Login = () => {

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text(); // Handle non-JSON response
      }

      if (data.success=== false) {
        return setError(data.message);
      }

      setLoading(false);

      if (res.status === 200) {
        navigate("/");
      }

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    };

  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">

        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Es Lanka
            </span>
            Travels
          </Link>
          <p className="text-sm mt-5">
            this is a demo project. you can sign in with your email and password
            or with google.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Enter your email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Enter your password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {loading ? (
                <>
                <Spinner size='sm'/>
                <span className="pl-3">Loading...</span>
                </>
              ) : "Sign In"}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500">
                Sign Up
            </Link>
          </div>
          {
            error && (
              <Alert className="mt-5 " color='failure'>
                {error}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Login;
