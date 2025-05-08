import React from 'react';
import { FaUsers, FaGlobeAsia, FaSuitcaseRolling, FaHandsHelping, FaStar } from 'react-icons/fa';

const About = () => {
  return (
    <div className="dark:text-white min-h-screen px-5 py-12 bg-gradient-to-b from-white to-amber-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto space-y-16">
        <h1 className="text-4xl font-extrabold border-b-4 border-amber-500 dark:border-white pb-4 text-center">
          About <span className="text-teal-400">Es Lanka Travels</span>
        </h1>

        {/* Who We Are */}
        <section className="bg-white dark:bg-slate-700 shadow-lg rounded-xl p-8 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaUsers className="text-teal-400" /> Who We Are
          </h2>
          <p className="text-lg">
            <strong>Es Lanka Travels</strong> is more than a travel agency — we're storytellers of Sri Lanka. With roots in the island's culture and passion for adventure, we specialize in crafting memorable journeys for explorers worldwide.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-white dark:bg-slate-700 shadow-lg rounded-xl p-8 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaGlobeAsia className="text-teal-400" /> Our Mission
          </h2>
          <p className="text-lg">
            We aim to connect travelers with Sri Lanka’s vibrant soul — from lush jungles to golden beaches, ancient temples to warm village smiles. Our mission is to ensure every moment you spend here becomes a lifelong memory.
          </p>
        </section>

        {/* What We Offer */}
        <section className="bg-white dark:bg-slate-700 shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <FaSuitcaseRolling className="text-teal-400" /> What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg list-inside">
            <div>🎯 Customizable travel packages</div>
            <div>👨‍👩‍👧‍👦 Group and solo tours</div>
            <div>🧭 Local guides with deep knowledge</div>
            <div>🌿 Adventure, culture & wellness trips</div>
            <div>🚕 Airport transfers & hotel bookings</div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white dark:bg-slate-700 shadow-lg rounded-xl p-8 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaStar className="text-teal-400" /> Why Choose Us
          </h2>
          <p className="text-lg">
            With years of experience and local roots, we bring you handpicked experiences that are genuine and impactful.
            From the first message to the last goodbye, we ensure every step of your journey is stress-free and spectacular.
          </p>
        </section>

        {/* Meet the Team */}
        <section className="bg-white dark:bg-slate-700 shadow-lg rounded-xl p-8 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaHandsHelping className="text-teal-400" /> Meet Our Team
          </h2>
          <p className="text-lg">
            Our team includes passionate locals, certified guides, and travel planners who live and breathe Sri Lanka.
            Get to know our people — the heart of Es Lanka — who make your dream trip possible.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
