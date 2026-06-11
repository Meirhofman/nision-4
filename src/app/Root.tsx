import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { PhoneFrame } from './components/PhoneFrame';
import { LayoutGrid } from 'lucide-react';

export const Root = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PhoneFrame>
      <Outlet />
    </PhoneFrame>
  );
};
