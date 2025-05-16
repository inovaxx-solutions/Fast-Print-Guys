import React, { useState } from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import HorizontalMenu from './components/HorizontalMenu/HorizontalMenu';
import BodyContent from './components/BodyContent/BodyContent';

// Define the default selected item - should match the default in HorizontalMenu
const DEFAULT_ACTIVE_OPTION = 'print-book';

function PricingPage() {
// --- State to manage the active menu option ---
 const [activeOption, setActiveOption] = useState(DEFAULT_ACTIVE_OPTION);
 // --- Handler to update the state when a menu item is selected ---
 // This function will be passed down to HorizontalMenu
 const handleMenuItemSelected = (itemId) => {
 console.log('Menu item selected in PricingPage:', itemId);
 setActiveOption(itemId); // Update the state with the selected item's ID
 };
 return (
  <div className="pricing-page-container"> {/* Add a container div for styling */}
  {/* Render the components specific to the Pricing page */}
  <HeroSection />
  {/* Render HorizontalMenu and pass the state updater */}
  <HorizontalMenu onItemSelected={handleMenuItemSelected} />
  {/* Render BodyContent and pass the current active option state */}
  <BodyContent activeOption={activeOption} /> {/* Pass the activeOption state */}
  {/* ... potentially other components specific to this page */}
  </div>
 );
}

export default PricingPage;