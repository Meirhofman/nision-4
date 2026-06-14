import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { PhoneFrame } from './components/PhoneFrame';
import { LayoutGrid } from 'lucide-react';
import { OnboardingTour } from './components/OnboardingTour';

export const Root = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PhoneFrame>
      <Outlet />
      <OnboardingTour />
    </PhoneFrame>
  );
};
