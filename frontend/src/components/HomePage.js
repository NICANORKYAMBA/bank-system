import React from 'react';
import HomeIcon from './HomeIcon';
import WelcomeMessage from './WelcomeMessage';
//import LoginButton from './LoginButton';
//import RegisterButton from './RegisterButton';
import AuthButtonsContainer from './AuthButtonsContainer';
import FeaturesSection from './FeaturesSection';
import NewsAndUpdatesSection from './NewsAndUpdatesSection';
import PromotionsAndOffersSection from './PromotionsAndOffersSection';
import DarkModeToggle from './DarkModeToggle';

function HomePage () {
  return (
    <div>
      <HomeIcon />
      <WelcomeMessage />
      <DarkModeToggle />
      <AuthButtonsContainer />
      <FeaturesSection />
      <NewsAndUpdatesSection />
      <PromotionsAndOffersSection />
    </div>
  );
}

export default HomePage;
