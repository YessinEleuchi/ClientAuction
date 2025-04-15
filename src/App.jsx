import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
} from '@chakra-ui/react';
import './App.css';
import { Header, Footer, ScrollToTopButton, Notifications } from './components'; // Importez ScrollToTopButton
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import { Home, ActiveListings, SignUp, Login, PasswordResetRequest, PasswordReset, CreateListing, ListingDetails, UserDashboard, AllUserListings, ListingBids, WatchList, VerifyActivationOtp, ProtectedRoute, PublicRoute, NotFound } from './pages';
import { store } from './app/store';
import interceptors from './features/interceptors';
import Explore from './pages/general/Explore';
import HowItWorks from './components/How';

const App = () => {
  document.title = 'BID TUN';
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  if (!isLoaded) {
    setIsLoaded(true);
    interceptors(store, navigate);
  }
  const location = useLocation();
  const noHeaderFooterRoutes = ['/signup', '/login', '/verify-activation-otp', '/password-reset-request', '/password-reset']; // Ajoutez les routes d'authentification
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <ChakraProvider>
      <Box className="app" w="100%">
        {showHeaderFooter && <Header />}
        <div className="main">
          <Routes>
            <Route path="/how" element={<HowItWorks />} />
            <Route exact path="/" element={<Home />} />
            <Route path="/listings" element={<ActiveListings />} />
            <Route path="/listings/categories/:categorySlug" element={<ActiveListings />} />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/listings/:listingSlug" element={<ListingDetails />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/notifications" element={<Notifications/>}/>

            <Route path="/signup" element={<PublicRoute Component={SignUp} />} />
            <Route path="/login" element={<PublicRoute Component={Login} />} />
            <Route path="/verify-activation-otp" element={<PublicRoute Component={VerifyActivationOtp} />} />
            <Route path="/password-reset-request" element={<PublicRoute Component={PasswordResetRequest} />} />
            <Route path="/password-reset" element={<PublicRoute Component={PasswordReset} />} />

            <Route path="/dashboard" element={<ProtectedRoute Component={UserDashboard} />} />
            <Route path="/dashboard/listings" element={<ProtectedRoute Component={AllUserListings} />} />
            <Route path="/dashboard/listings/:listingSlug/bids" element={<ProtectedRoute Component={ListingBids} />} />
            <Route path="/create-listing" element={<ProtectedRoute Component={CreateListing} />} />
            <Route
              path="/dashboard/listings/:listingSlug/update"
              element={<ProtectedRoute Component={CreateListing} type="update" />}
            />

            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {showHeaderFooter && <Footer />}
        {showHeaderFooter && <ScrollToTopButton />} {/* Ajoutez le bouton ici */}
      </Box>
    </ChakraProvider>
  );
};

export default App;