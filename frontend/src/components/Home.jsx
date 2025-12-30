import React, { useEffect, useState } from 'react';
import logo from "../../public/shivam.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaBars, FaTimes } from "react-icons/fa";
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { backendUrl } from '../utils/utils';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${backendUrl}/courses/course`, { withCredentials: true });
        setCourses(res.data.data);
      } catch {
        toast.error("Failed to load courses");
      }
    };
    fetch();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/logout`, { withCredentials: true });
      toast.success(res.data.message);
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      setShowSidebar(false);
    } catch {
      toast.error("Logout failed");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 1000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white relative">

      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center z-50">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="ml-2 text-2xl text-orange-500 font-bold">Coursify</span>
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-orange-500 rounded hover:bg-white hover:text-black transition">
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="absolute top-16 right-4 bg-gray-900 border border-gray-600 rounded-lg shadow-lg p-4 z-50">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="block px-4 py-2 w-full text-left hover:bg-white hover:text-black transition">
                Logout
              </button>
            ) : (
              <>
                <Link onClick={() => setShowSidebar(false)} to="/login" className="block px-4 py-2 hover:bg-white hover:text-black transition">
                  Login
                </Link>
                <Link onClick={() => setShowSidebar(false)} to="/signup" className="block px-4 py-2 hover:bg-white hover:text-black transition">
                  Join Now
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      <main className="pt-10 pb-12 px-4">
        
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-orange-500 mb-4">Coursify</h1>
          <p className="text-gray-400 mb-6">Sharpen your skills with courses crafted by experts</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/courses" className="px-6 py-3 bg-green-500 rounded font-semibold hover:bg-white hover:text-black transition">Explore Courses</Link>
            <Link to="/admin/signup" className="px-6 py-3 bg-blue-600 rounded font-semibold hover:bg-white hover:text-black transition">Become Instructor</Link>
            <a href="/courseVideos" className="px-6 py-3 bg-white text-black rounded font-semibold hover:bg-green-500 hover:text-white transition">Course Videos</a>
          </div>
        </section>

        {/* Courses Slider */}
        <section className="max-w-7xl mx-auto my-8">
          {courses.length > 0 && (
            <Slider {...settings}>
              {courses.map(c => (
                <div key={c._id} className="p-2">
                  <div className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition">
                    <img src={c.image.url} alt={c.title} className="h-32 w-full object-cover" />
                    <div className="text-center py-4">
                      <h3 className="whitespace-nowrap text-xl font-bold">{c.title}</h3>
                      <Link className="mt-3 inline-block bg-orange-500 text-white py-1 px-2 rounded-full hover:bg-blue-500 transition" to={`/buy/${c._id}`}>
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </section>

        <hr className="border-gray-600 my-8 max-w-7xl mx-auto" />

        {/* Footer */}
        <footer className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-gray-400 py-8">

          <div className="text-center sm:text-left">
            <div className="flex justify-center sm:justify-start items-center mb-2">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
              <span className="ml-2 text-2xl text-orange-500 font-bold">Coursify</span>
            </div>
            <p className="mb-2">Follow us</p>
            <div className="flex justify-center sm:justify-start gap-4">
              <FaFacebook className="hover:text-blue-400" />
              <FaInstagram className="hover:text-pink-600" />
              <FaTwitter className="hover:text-blue-600" />
            </div>
          </div>

          {/* ✅ UPDATED CONNECT SECTION */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold mb-2">Connects</h4>
            <ul className="space-y-1">
              <li className="hover:text-white cursor-pointer">github - shivam916582</li> 
              <li className="hover:text-white cursor-pointer">linkedin -shivam-singh-4131b5251</li> 
              <li className="hover:text-white cursor-pointer">instagram - shi_vam_2_3</li> 
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-semibold mb-2">Policies © 2024</h4>
            <ul className="space-y-1">
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Refund & Cancellation</li>
            </ul>
          </div>

        </footer>

      </main>
    </div>
  );
}

export default Home;
