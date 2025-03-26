"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const UserLoginDisplay = () => {
  const { user, checkUserLogin } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check user login status when component mounts and when user changes
    const loginStatus = checkUserLogin();
    setIsAuthenticated(loginStatus);
  }, [checkUserLogin, user]);

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/profile');
    }
  };

  return (
    <p 
      className="text-md font-semibold cursor-pointer hover:text-blue-600 transition-colors" 
      onClick={handleClick}
    >
      {user?.fullName || "Đăng nhập"}
    </p>
  );
};

export default UserLoginDisplay; 