"use client";
import React from 'react';
import { useCart } from '@/context/CartContext';

/**
 * Component demo để test tính năng realtime update của user data
 * Có thể sử dụng trong development để kiểm tra
 */
export default function UserStatusDemo() {
  const { user, checkUserLogin } = useCart();

  if (process.env.NODE_ENV !== 'development') {
    return null; // Chỉ hiển thị trong development
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-50 text-xs">
      <div className="font-semibold mb-2">User Status (Dev Only)</div>
      <div>Logged in: {checkUserLogin() ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.fullName || user.email : 'None'}</div>
      <div>Role: {(user as any)?.role || 'None'}</div>
      <div className="text-gray-500 mt-1">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
