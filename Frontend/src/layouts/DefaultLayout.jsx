// src/layouts/DefaultLayout.jsx
import React from 'react';
// Outlet renders the content of the nested route that matches
import { Outlet } from 'react-router-dom';
// Import your shared components
import Navbar from '../components/Navbar/Navbar'; // Adjust path if needed
import Footer from '../components/Footer/Footer'; // Adjust path if needed

function DefaultLayout() {
  return (
    // This div represents the container for pages with the default layout
    <div className="default-layout">
      {/* Render the components that are part of this layout */}
      <Navbar />

      {/*
        The <Outlet> component renders the matched child route's element.
        For example, if the route is /pricing, and /pricing is nested
        under the DefaultLayout route, the PricingPage component will
        be rendered here.
      */}
      <main> {/* Keep your main container */}
        <Outlet />
      </main>


      <Footer />
    </div>
  );
}

export default DefaultLayout;