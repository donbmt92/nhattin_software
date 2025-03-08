import React, { useState } from 'react';
import axios from 'axios';
import { UserProfile } from '../types';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    onUserUpdate: (updatedUser: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onUserUpdate }) => {
    const [formData, setFormData] = useState<UserProfile>(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const data = JSON.parse(userData || '{}');
        const userId = data?._id;

        // Create a new object with only the necessary properties
        const dataToUpdate = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            stats: formData.stats,
        };

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, dataToUpdate, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onUserUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-md w-96">
                <h2 className="text-xl font-semibold mb-4">Chỉnh Sửa Thông Tin</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Họ và Tên</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="border rounded w-full p-2" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="border rounded w-full p-2" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Số Điện Thoại</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="border rounded w-full p-2" required />
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

export default EditProfileModal; 