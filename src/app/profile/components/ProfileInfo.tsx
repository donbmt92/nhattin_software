"use client";
import React, { memo, useState, useRef } from 'react';
import { UserProfile, AffiliateInfo } from '../types';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AffiliateRegistration from './AffiliateRegistration';
import AffiliateStats from './AffiliateStats';

const ProfileInfo = memo(({ user }: { user: UserProfile | null }) => {
    const displayName = 'ProfileInfo';
    ProfileInfo.displayName = displayName;

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [editedUser, setEditedUser] = useState<UserProfile | null>(user);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    // Affiliate states
    const [affiliateInfo, setAffiliateInfo] = useState<AffiliateInfo | null>(null);
    
    // Password change states
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: ''
    });
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Function to handle affiliate registration success
    const handleAffiliateRegistrationSuccess = (affiliate: AffiliateInfo) => {
        setAffiliateInfo(affiliate);
    };

    // Function to handle user logout
    const handleLogout = () => {
        // Clear user data and token from localStorage
        localStorage.removeItem('nhattin_token');
        localStorage.removeItem('nhattin_user');
        
        // Redirect to login page
        router.push('/login');
    };

    // Function to handle API errors, specifically 401 Unauthorized
    const handleApiError = (error: unknown) => {
        // Check if error is an axios error with response property
        if (
            error && 
            typeof error === 'object' && 
            'response' in error && 
            error.response && 
            typeof error.response === 'object' && 
            'status' in error.response && 
            error.response.status === 401
        ) {
            console.log('Token expired or invalid. Logging out...');
            handleLogout();
            return true; // Error was handled
        }
        return false; // Error was not handled
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (editedUser) {
            setEditedUser({
                ...editedUser,
                [name]: value
            });
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước ảnh không được vượt quá 5MB');
            return;
        }

        // Check file type
        if (!file.type.match('image/*')) {
            setError('Vui lòng chọn file ảnh hợp lệ');
            return;
        }

        setImageFile(file);
        
        // Create a preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Function to update profile information
    const handleSubmit = async () => {
        if (!editedUser) return;
        
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const token = localStorage.getItem('nhattin_token');
            
            if (!token) {
                setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
                setIsLoading(false);
                return;
            }
            
            // Create FormData object for the request
            const formData = new FormData();
            formData.append('fullName', editedUser.fullName);
            formData.append('phone', editedUser.phone);
            
            // Add image file if a new one is selected
            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            // Send the update request with the FormData object
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${editedUser._id}`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            // Update local state with new image if provided in response
            if (response.data.user && response.data.user.image) {
                const updatedImage = response.data.user.image;
                setEditedUser({
                    ...editedUser,
                    image: updatedImage
                });
                
                // Also update the user object if needed for the parent component
                if (user) {
                    user.image = updatedImage;
                }
            }
            
            setSuccess('Thông tin đã được cập nhật thành công!');
            setIsEditing(false);
            setIsLoading(false);
            setPreviewImage(null);
            setImageFile(null);
        } catch (error) {
            if (!handleApiError(error)) {
                // If it's not a 401 error, handle it normally
                setError('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.');
                setIsLoading(false);
                console.error('Error updating profile:', error);
            }
        }
    };

    // Function to change password
    const handlePasswordSubmit = async () => {
        if (passwordData.password !== passwordData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (passwordData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('nhattin_token');
            
            if (!token) {
                setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
                setIsLoading(false);
                return;
            }

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/users/changePassword`,
                {
                    oldPassword: passwordData.oldPassword,
                    password: passwordData.password
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess('Mật khẩu đã được thay đổi thành công!');
            setIsChangingPassword(false);
            setPasswordData({
                oldPassword: '',
                password: '',
                confirmPassword: ''
            });
            setIsLoading(false);
        } catch (error) {
            if (!handleApiError(error)) {
                setError('Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng kiểm tra mật khẩu cũ và thử lại.');
                setIsLoading(false);
                console.error('Error changing password:', error);
            }
        }
    };

    // Function to upload image separately
    const handleImageUpload = async () => {
        if (!imageFile || !user) return;

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('nhattin_token');
            
            if (!token) {
                setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/users/upload-image/${user._id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Update local state with new image
            if (response.data.user && response.data.user.image) {
                const updatedImage = response.data.user.image;
                setEditedUser(prev => prev ? { ...prev, image: updatedImage } : null);
                
                if (user) {
                    user.image = updatedImage;
                }
            }

            setSuccess('Ảnh đại diện đã được cập nhật thành công!');
            setPreviewImage(null);
            setImageFile(null);
            setIsLoading(false);
        } catch (error) {
            if (!handleApiError(error)) {
                setError('Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại sau.');
                setIsLoading(false);
                console.error('Error uploading image:', error);
            }
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setIsChangingPassword(false);
        setEditedUser(user);
        setError('');
        setSuccess('');
        setPreviewImage(null);
        setImageFile(null);
        setPasswordData({
            oldPassword: '',
            password: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            {user ? (
                <div className="flex flex-col items-center">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                    
                    <div className="w-32 h-32 relative mb-4 group">
                        {isEditing && (
                            <div 
                                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={triggerFileInput}
                            >
                                <span className="text-white text-sm font-medium">Thay đổi ảnh</span>
                            </div>
                        )}
                        
                        {/* Show preview image when available during editing */}
                        {isEditing && previewImage ? (
                            <Image 
                                src={previewImage} 
                                alt="Preview"
                                className="w-full h-full rounded-full object-cover"
                                width={128}
                                height={128}
                            />
                        ) : user.image ? (
                            <Image 
                                src={user.image} 
                                alt={user.fullName}
                                className="w-full h-full rounded-full object-cover"
                                width={128}
                                height={128}
                            />
                        ) : (
                            <svg width="128" height="128" viewBox="0 0 278 278" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_73_925)">
                                    <path d="M258.429 203.613C267.131 185.922 272.027 166.02 272.027 144.973C272.027 71.5036 212.469 11.9453 139 11.9453C65.5309 11.9453 5.97266 71.5036 5.97266 144.973C5.97266 166.02 10.8686 185.922 19.5713 203.613H258.429Z" fill="#64C0F4" />
                                    {/* SVG content abbreviated for clarity */}
                                </g>
                                <defs>
                                    <clipPath id="clip0_73_925">
                                        <rect width="278" height="278" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        )}
                    </div>
                    
                    {isEditing ? (
                        <input 
                            type="text" 
                            name="fullName" 
                            value={editedUser?.fullName || ''} 
                            onChange={handleInputChange}
                            className="text-xl font-semibold mb-1 border-b border-gray-300 text-center w-full focus:outline-none focus:border-blue-500" 
                        />
                    ) : (
                        <h2 className="text-xl font-semibold mb-1">{user.fullName}</h2>
                    )}

                    <div className="w-full space-y-2">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500">Email</label>
                            <p className="text-gray-800">{user.email}</p>
                        </div>
                        
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500">Phone</label>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    name="phone" 
                                    value={editedUser?.phone || ''} 
                                    onChange={handleInputChange}
                                    className="text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500" 
                                />
                            ) : (
                                <p className="text-gray-800">{user.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Password Change Form */}
                    {isChangingPassword && (
                        <div className="w-full mt-4 space-y-3">
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500">Mật khẩu cũ</label>
                                <input 
                                    type="password" 
                                    name="oldPassword" 
                                    value={passwordData.oldPassword} 
                                    onChange={handlePasswordChange}
                                    className="text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" 
                                    placeholder="Nhập mật khẩu cũ"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500">Mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={passwordData.password} 
                                    onChange={handlePasswordChange}
                                    className="text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" 
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500">Xác nhận mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    value={passwordData.confirmPassword} 
                                    onChange={handlePasswordChange}
                                    className="text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500" 
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                    {success && <p className="text-green-500 mt-2 text-sm">{success}</p>}

                    {/* Action Buttons */}
                    {isEditing ? (
                        <div className="mt-4 flex space-x-2 w-full">
                            <button 
                                onClick={resetForm}
                                className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition-colors"
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleSubmit}
                                className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex justify-center items-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                ) : null}
                                Lưu Thay Đổi
                            </button>
                        </div>
                    ) : isChangingPassword ? (
                        <div className="mt-4 flex space-x-2 w-full">
                            <button 
                                onClick={resetForm}
                                className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition-colors"
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handlePasswordSubmit}
                                className="w-1/2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors flex justify-center items-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                ) : null}
                                Đổi Mật Khẩu
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-2 w-full">
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Chỉnh Sửa Thông Tin
                            </button>
                            <button 
                                onClick={() => setIsChangingPassword(true)}
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                            >
                                Đổi Mật Khẩu
                            </button>
                            {imageFile && (
                                <button 
                                    onClick={handleImageUpload}
                                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                    ) : null}
                                    Cập Nhật Ảnh Đại Diện
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}

            {/* Affiliate Section */}
            {user && (
                <>
                    <AffiliateRegistration 
                        user={user} 
                        onRegistrationSuccess={handleAffiliateRegistrationSuccess}
                    />
                    
                    {affiliateInfo && (
                        <AffiliateStats affiliateInfo={affiliateInfo} />
                    )}
                </>
            )}
        </div>
    );
});

export default ProfileInfo; 