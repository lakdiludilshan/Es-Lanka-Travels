import React from 'react';

const About = () => {
  return (
    <div className="dark:text-white min-h-screen px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold border-b-2 dark:border-white pb-4">About Us</h1>

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Who We Are</h2>
          <p className="text-lg">
            Welcome to <strong>Es Lanka Travels</strong>! We are dedicated to providing the best travel experiences.
            Add more details about your company’s origin, mission, and passion here.
          </p>
        </section>

        {/* Our Mission */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-lg">
            To connect travelers with the heart of Sri Lanka.
            Add more about your values and commitment to customers here.
          </p>
        </section>

        {/* Our Services */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">What We Offer</h2>
          <ul className="list-disc list-inside text-lg space-y-1">
            <li>Customizable travel packages</li>
            <li>Group and solo tours</li>
            <li>Local guides with deep knowledge of destinations</li>
            <li>Adventure, cultural, and wellness experiences</li>
            <li>Airport transfers and accommodation booking</li>
          </ul>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Why Choose Us</h2>
          <p className="text-lg">
            With years of experience and a love for Sri Lanka, we bring you authentic and unforgettable travel moments.
            Our team is passionate, professional, and focused on your satisfaction.
          </p>
        </section>

        {/* Meet the Team */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Meet Our Team</h2>
          <p className="text-lg">
            Our team is made up of seasoned travel experts, local guides, and friendly planners who work tirelessly
            to ensure your journey is seamless and memorable. Add names, roles, or brief bios here.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
