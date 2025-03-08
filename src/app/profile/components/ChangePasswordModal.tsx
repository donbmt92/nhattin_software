import React, { useState } from 'react';
import axios from 'axios';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPasswordChange: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onPasswordChange }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/changePassword`, { password: newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onPasswordChange();
            onClose();
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-md w-96">
                <h2 className="text-xl font-semibold mb-4">Đổi Mật Khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Mật Khẩu Mới</label>
                        <input type="password" value={newPassword} onChange={handlePasswordChange} className="border rounded w-full p-2" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Xác Nhận Mật Khẩu</label>
                        <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} className="border rounded w-full p-2" required />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded">Hủy</button>
                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal; 