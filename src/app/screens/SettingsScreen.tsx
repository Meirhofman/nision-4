import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/UserAvatar';
import {
    ArrowLeft, Moon, Sun, Phone, Database, Globe, Bell, Star, Mail, Lock, LogOut, Trash2, ChevronRight, X,
    Shield, ShieldAlert, MonitorPlay, Key, AlertTriangle
} from 'lucide-react';
import { Drawer } from 'vaul';
import { Switch } from '../components/ui/switch';
import { changeUserPassword } from '../../lib/auth';
import { clearStoredData } from '../../lib/storage';



export const SettingsScreen = () => {
    const navigate = useNavigate();
    const { t, language, setLanguage, userData, updateUserData, logout, darkMode, setDarkMode, currentUser, resetToDefaults, points, showMainTutorial } = useApp();
    // Load notification preference from localStorage
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('notifications');
        return saved !== null ? saved === 'true' : true;
    });
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    
    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    // Edit data state
    const [isEditingData, setIsEditingData] = useState(false);
    const [editData, setEditData] = useState({
        displayName: userData?.displayName || '',
        weight: userData?.weight || 60,
        height: userData?.height || 170,
        age: userData?.age || 24,
        gender: userData?.gender || 'male',
        phoneNumber: userData?.phoneNumber || '',
        medicalConditions: [...(userData?.medicalConditions || [])],
        allergies: userData?.allergies || '',
        newMedicalCondition: '',
        newAllergy: ''
    });

    const handlePasswordChange = async () => {
        // Reset states
        setPasswordError('');
        setPasswordSuccess('');
        
        // Validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setPasswordError(t('allFieldsRequired') || 'All fields are required');
            return;
        }
        
        if (newPassword.length < 6) {
            setPasswordError(t('newPasswordTooWeak'));
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            setPasswordError(t('passwordsDoNotMatch'));
            return;
        }
        
        setIsChangingPassword(true);
        
        try {
            const result = await changeUserPassword(currentPassword, newPassword);
            
            if (result.success) {
                setPasswordSuccess(t('passwordChangedSuccessfully'));
                // Clear form
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                setPasswordError(result.error || t('changePasswordError'));
            }
        } catch (error: any) {
            setPasswordError(t('changePasswordError'));
        } finally {
            setIsChangingPassword(false);
        }
    };
    
    const handleEditData = () => {
        setIsEditingData(true);
        setEditData({
            displayName: userData?.displayName || '',
            weight: userData?.weight || 60,
            height: userData?.height || 170,
            age: userData?.age || 24,
            gender: userData?.gender || 'male',
            phoneNumber: userData?.phoneNumber || '',
            medicalConditions: [...(userData?.medicalConditions || [])],
            allergies: userData?.allergies || '',
            newMedicalCondition: '',
            newAllergy: ''
        });
    };
    
    const handleSaveData = () => {
        console.log('=== SAVING USER DATA ===');
        console.log('Current userData:', userData);
        console.log('Edit data to save:', editData);
        
        updateUserData({
            displayName: editData.displayName,
            weight: editData.weight,
            height: editData.height,
            age: editData.age,
            gender: editData.gender,
            phoneNumber: editData.phoneNumber,
            medicalConditions: editData.medicalConditions,
            allergies: editData.allergies
        });
        
        console.log('Data updated, setting editing to false');
        setIsEditingData(false);
        
        // Add success feedback
        setTimeout(() => {
            console.log('Final userData after update:', userData);
        }, 100);
    };
    
    const handleAddMedicalCondition = () => {
        if (editData.newMedicalCondition.trim()) {
            setEditData(prev => ({
                ...prev,
                medicalConditions: [...prev.medicalConditions, prev.newMedicalCondition.trim()],
                newMedicalCondition: ''
            }));
        }
    };
    
    const handleRemoveMedicalCondition = (index: number) => {
        setEditData(prev => ({
            ...prev,
            medicalConditions: prev.medicalConditions.filter((_, i) => i !== index)
        }));
    };

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        
        try {
            // Clear all stored data
            clearStoredData();
            
            // Reset to defaults
            resetToDefaults();
            
            // Navigate to login
            navigate('/login');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(t('error') || 'Error deleting account');
        } finally {
            setIsDeletingAccount(false);
        }
    };

    const handleLogout = async () => {
        try {
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <MobileContainer className={`min-h-screen relative flex flex-col overflow-y-auto ${darkMode ? 'bg-background text-foreground' : 'bg-[#F9F9F9] text-slate-900'}`}>

            {/* Header */}
            <div className="p-6 pt-12 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
                <button onClick={() => navigate('/main')} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${darkMode ? 'bg-card text-card-foreground' : 'bg-white text-gray-600'}`}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-foreground' : 'text-gray-900'}`}>{t('settings')}</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6 [&::-webkit-scrollbar]:hidden">

                {/* Dark Mode Toggle */}
                <div className={`p-4 rounded-[16px] flex items-center justify-between border-[0.5px] border-[#F0F0F0] bg-white`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-500'}`}>
                            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <span className="font-medium">{t('darkMode')}</span>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-[#534AB7]" />
                </div>

                {/* Profile Section */}
                <div className={`p-4 rounded-[16px] flex items-center gap-4 border-[0.5px] border-[#F0F0F0] bg-white`}>
                    <UserAvatar
                        photoURL={currentUser?.photoURL}
                        displayName={userData?.displayName || currentUser?.displayName}
                        size={56}
                    />
                    <div className="flex-1">
                        <h2 className={`text-[16px] font-medium ${darkMode ? 'text-foreground' : 'text-gray-900'}`}>{userData?.displayName || currentUser?.displayName || t('userName')}</h2>
                        <p className={`text-[13px] ${darkMode ? 'text-muted-foreground' : 'text-[#999999]'}`}>{currentUser?.email || t('startJourney')}</p>
                    </div>
                </div>

                {/* General Settings Group */}
                <div className={`rounded-[16px] border-[0.5px] border-[#F0F0F0] bg-white overflow-hidden`}>

                    {/* Phone */}
                    <button 
                        onClick={() => document.querySelector('[data-drawer-trigger="data"]')?.click()}
                        className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors border-b-[0.5px] border-[#F0F0F0]"
                    >
                        <div className="flex items-center gap-3">
                            <Phone size={20} className="text-green-500" />
                            <span className="font-medium">{t('phoneNumber')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="text-sm">{userData?.phoneNumber || '+1 234 567 890'}</span>
                            <ChevronRight size={16} />
                        </div>
                    </button>

                    {/* Data Bottom Sheet */}
                    <Drawer.Root>
                        <Drawer.Trigger asChild>
                            <button data-drawer-trigger="data" className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors border-b-[0.5px] border-[#F0F0F0]">
                                <div className="flex items-center gap-3">
                                    <Database size={20} className="text-blue-500" />
                                    <span className="font-medium">{t('data')}</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                            <Drawer.Content className={`flex flex-col rounded-t-[32px] mt-24 fixed bottom-0 left-0 right-0 z-50 h-[85vh] ${darkMode ? 'bg-card' : 'bg-white'}`}>
                                <div className={`p-4 rounded-t-[32px] flex-1 overflow-y-auto ${darkMode ? 'bg-card' : 'bg-white'}`}>
                                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                                    <div className="max-w-md mx-auto space-y-6 pb-12">
                                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-foreground' : 'text-gray-900'}`}>{t('yourData')}</h2>
                                        <div className="space-y-4">
                                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-muted' : 'bg-gray-50'}`}>
                                                <label className={`block mb-2 ${darkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>{t('userName')}</label>
                                                <input
                                                    type="text"
                                                    value={isEditingData ? editData.displayName || userData?.displayName || '' : (userData?.displayName || '')}
                                                    onChange={(e) => isEditingData && setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                                                    disabled={!isEditingData}
                                                    placeholder={currentUser?.displayName || t('userName')}
                                                    className={`w-full border rounded-lg px-3 py-2 font-bold ${darkMode ? 'bg-input border-input text-foreground placeholder:text-muted-foreground' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} ${!isEditingData ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}`}
                                                />
                                            </div>
                                            
                                            {/* Phone Number */}
                                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-muted' : 'bg-gray-50'}`}>
                                                <label className={`block mb-2 ${darkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>{t('phoneNumber') || 'Phone Number'}</label>
                                                <input
                                                    type="tel"
                                                    value={isEditingData ? editData.phoneNumber : (userData?.phoneNumber || '')}
                                                    onChange={(e) => isEditingData && setEditData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                                    disabled={!isEditingData}
                                                    className={`w-full border rounded-lg px-3 py-2 font-bold ${darkMode ? 'bg-input border-input text-foreground placeholder:text-muted-foreground' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} ${!isEditingData ? 'opacity-60' : ''}`}
                                                />
                                            </div>
                                            
                                            {/* Weight */}
                                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-muted' : 'bg-gray-50'}`}>
                                                <label className={`block mb-2 ${darkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>{t('weight')}</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={isEditingData ? editData.weight : (userData?.weight || 60)}
                                                        onChange={(e) => isEditingData && setEditData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                                                        disabled={!isEditingData}
                                                        className={`flex-1 border rounded-lg px-3 py-2 font-bold ${darkMode ? 'bg-input border-input text-foreground' : 'bg-white border-gray-200 text-gray-900'} ${!isEditingData ? 'opacity-60' : ''}`}
                                                    />
                                                    <span className={`font-bold ${darkMode ? 'text-foreground' : 'text-gray-900'}`}>{t('kg')}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Height */}
                                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-muted' : 'bg-gray-50'}`}>
                                                <label className={`block mb-2 ${darkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>{t('height')}</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={isEditingData ? editData.height : (userData?.height || 170)}
                                                        onChange={(e) => isEditingData && setEditData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                                                        disabled={!isEditingData}
                                                        className={`flex-1 border rounded-lg px-3 py-2 font-bold ${darkMode ? 'bg-input border-input text-foreground' : 'bg-white border-gray-200 text-gray-900'} ${!isEditingData ? 'opacity-60' : ''}`}
                                                    />
                                                    <span className={`font-bold ${darkMode ? 'text-foreground' : 'text-gray-900'}`}>{t('cm')}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Age */}
                                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-muted' : 'bg-gray-50'}`}>
                                                <label className={`block mb-2 ${darkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>{t('age')}</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={isEditingData ? editData.age : (userData?.age || 24)}
                                                        onChange={(e) => isEditingData && setEditData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                                                        disabled={!isEditingData}
                                                        className={`flex-1 border rounded-lg px-3 py-2 font-bold ${darkMode ? 'bg-input border-input text-foreground' : 'bg-white border-gray-200 text-gray-900'} ${!isEditingData ? 'opacity-60' : ''}`}
                                                    />
                                                    <span className={`font-bold ${darkMode ? 'text-foreground' : 'text-gray-900'}`}>{t('yearsOld')}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Gender */}
                                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-muted' : 'bg-gray-50'}`}>
                                                <label className={`block mb-2 ${darkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>{t('gender')}</label>
                                                <div className="flex gap-4">
                                                    <label className={`flex items-center gap-2 cursor-pointer ${!isEditingData ? 'opacity-60' : ''}`}>
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="male"
                                                            checked={isEditingData ? editData.gender === 'male' : (userData?.gender === 'male')}
                                                            onChange={(e) => isEditingData && setEditData(prev => ({ ...prev, gender: 'male' }))}
                                                            disabled={!isEditingData}
                                                            className={`w-4 h-4 ${darkMode ? 'text-primary' : 'text-blue-600'}`}
                                                        />
                                                        <span className={`font-medium ${darkMode ? 'text-foreground' : 'text-gray-900'}`}>{t('male')}</span>
                                                    </label>
                                                    <label className={`flex items-center gap-2 cursor-pointer ${!isEditingData ? 'opacity-60' : ''}`}>
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value="female"
                                                            checked={isEditingData ? editData.gender === 'female' : (userData?.gender === 'female')}
                                                            onChange={(e) => isEditingData && setEditData(prev => ({ ...prev, gender: 'female' }))}
                                                            disabled={!isEditingData}
                                                            className={`w-4 h-4 ${darkMode ? 'text-primary' : 'text-blue-600'}`}
                                                        />
                                                        <span className={`font-medium ${darkMode ? 'text-foreground' : 'text-gray-900'}`}>{t('female')}</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-800/50 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                                                        </svg>
                                                    </div>
                                                    <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{t('medicalConditions')}</span>
                                                </div>
                                                <div className={`text-sm ${darkMode ? 'text-muted-foreground' : 'text-gray-700'}`}>
                                                    {isEditingData ? (
                                                        <div className="space-y-3">
                                                            <div className="flex flex-wrap gap-2">
                                                                {editData.medicalConditions.map((condition: string, index: number) => (
                                                                    <span key={index} className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${darkMode ? 'bg-muted text-muted-foreground' : 'bg-gray-100 text-gray-700'}`}>
                                                                        {condition}
                                                                        <button
                                                                            onClick={() => handleRemoveMedicalCondition(index)}
                                                                            className="ml-1 hover:text-red-500"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={editData.newMedicalCondition}
                                                                    onChange={(e) => setEditData(prev => ({ ...prev, newMedicalCondition: e.target.value }))}
                                                                    placeholder={t('addMedicalCondition') || 'Add medical condition'}
                                                                    className={`flex-1 border rounded-lg px-3 py-2 text-sm ${darkMode ? 'bg-input border-input text-foreground placeholder:text-muted-foreground' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                                                                />
                                                                <button
                                                                    onClick={handleAddMedicalCondition}
                                                                    className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        userData?.medicalConditions?.length > 0 
                                                            ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(userData.medicalConditions as string[]).map((condition: string, index: number) => (
                                                                        <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-blue-800/40 text-blue-300 border border-blue-700/40' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                                                            {condition}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )
                                                            : (
                                                                <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <circle cx="12" cy="12" r="10"/>
                                                                        <path d="M8 12h8"/>
                                                                    </svg>
                                                                    <span>{t('noMedicalConditions')}</span>
                                                                </div>
                                                            )
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border border-orange-800/30' : 'bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200'}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-orange-800/50 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                                                        </svg>
                                                    </div>
                                                    <span className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>{t('allergies')}</span>
                                                </div>
                                                <div className={`text-sm ${darkMode ? 'text-muted-foreground' : 'text-gray-700'}`}>
                                                    {isEditingData ? (
                                                        <textarea
                                                            value={editData.allergies}
                                                            onChange={(e) => setEditData(prev => ({ ...prev, allergies: e.target.value }))}
                                                            placeholder={t('allergiesPlaceholder') || 'Enter allergies (separate with commas)'}
                                                            className={`w-full border rounded-lg px-3 py-2 text-sm min-h-[80px] ${darkMode ? 'bg-input border-input text-foreground placeholder:text-muted-foreground' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                                                        />
                                                    ) : (
                                                        userData?.allergies 
                                                            ? (
                                                                <div className={`p-3 rounded-lg ${darkMode ? 'bg-orange-800/20 border border-orange-700/30' : 'bg-orange-100/50 border border-orange-200'}`}>
                                                                    <p className="leading-relaxed">{userData.allergies}</p>
                                                                </div>
                                                            )
                                                            : (
                                                                <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <circle cx="12" cy="12" r="10"/>
                                                                        <path d="M8 12h8"/>
                                                                    </svg>
                                                                    <span>{t('noAllergies')}</span>
                                                                </div>
                                                            )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            {!isEditingData ? (
                                                <button 
                                                    onClick={handleEditData}
                                                    className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold"
                                                >
                                                    {t('edit')}
                                                </button>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => setIsEditingData(false)}
                                                        className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-700"
                                                    >
                                                        {t('cancel') || 'Cancel'}
                                                    </button>
                                                    <button 
                                                        onClick={handleSaveData}
                                                        className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold"
                                                    >
                                                        {t('save')}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex gap-4 pt-2">
                                            <button 
                                                onClick={() => navigate('/questionnaire/health')}
                                                className="flex-1 py-3 bg-purple-100 text-purple-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                                                </svg>
                                                {t('updateMedicalInfo')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root>

                    {/* Language */}
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                        className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors border-b-[0.5px] border-[#F0F0F0]"
                    >
                        <div className="flex items-center gap-3">
                            <Globe size={20} className="text-orange-500" />
                            <span className="font-medium">{t('languageLabel')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <span className="text-sm">{language === 'en' ? t('english') : t('hebrew')}</span>
                            <ChevronRight size={16} />
                        </div>
                    </button>

                    {/* Notifications */}
                    <div className="w-full p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell size={20} className="text-yellow-500" />
                            <span className="font-medium">{t('notifications')}</span>
                        </div>
                        <Switch 
                            checked={notifications} 
                            onCheckedChange={(checked) => {
                                console.log('Notifications toggle changed to:', checked);
                                setNotifications(checked);
                                // Save notification preference to localStorage
                                localStorage.setItem('notifications', checked.toString());
                                // You can add actual notification logic here
                                if (checked) {
                                    // Request notification permission if needed
                                    if ('Notification' in window && Notification.permission === 'default') {
                                        Notification.requestPermission();
                                    }
                                }
                            }} 
                            className="data-[state=checked]:bg-[#22C55E]"
                        />
                    </div>
                </div>

                {/* Support Group */}
                <div className={`rounded-[16px] border-[0.5px] border-[#F0F0F0] bg-white overflow-hidden`}>
                    <button
                        onClick={() => {
                            showMainTutorial();
                            alert(t('tutorialRestarted'));
                        }}

                        className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors border-b-[0.5px] border-[#F0F0F0]"
                    >
                        <div className="flex items-center gap-3">
                            <Star size={20} className="text-yellow-500" />
                            <span className="font-medium">{t('viewTutorial')}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </button>
                    <button className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors border-b border-gray-100/10">
                        <div className="flex items-center gap-3">
                            <Star size={20} className="text-pink-500" />
                            <span className="font-medium">{t('rateUs')}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </button>
                    <button className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <Mail size={20} className="text-teal-500" />
                            <span className="font-medium">{t('contactUs')}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </button>
                    <button
                        onClick={() => {
                            navigate('/main');
                            updateUserData({ hasSeenTour: false });
                        }}
                        className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <MonitorPlay size={20} className="text-purple-500" />
                            <span className="font-medium">צפה במדריך האפליקציה</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </button>
                </div>

                {/* Parental Controls */}
                <div className={`rounded-[16px] border-[0.5px] border-[#F0F0F0] bg-white overflow-hidden mb-8`}>
                    <Drawer.Root>
                        <Drawer.Trigger asChild>
                            <button className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors border-b-[0.5px] border-[#F0F0F0]">
                                <div className="flex items-center gap-3">
                                    <Shield size={20} className="text-blue-500" />
                                    <span className="font-medium">{t('parentalControls')}</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
                            <Drawer.Content className={`flex flex-col rounded-t-[32px] mt-24 fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] ${darkMode ? 'bg-card' : 'bg-white'}`}>
                                <div className={`p-8 rounded-t-[32px] flex-1 overflow-y-auto ${darkMode ? 'bg-card text-foreground' : 'bg-white text-gray-800'}`}>
                                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                                    
                                    <div className="flex items-center justify-center mb-6">
                                        <div className="bg-blue-100 p-4 rounded-full">
                                           <ShieldAlert size={32} className="text-blue-600" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black mb-2 text-center">{t('parentalControlsTitle')}</h2>
                                    <p className={`text-sm mb-4 text-center ${darkMode ? 'text-muted-foreground' : 'text-gray-500'}`}>{t('parentalControlsDesc')}</p>
                                    <p className={`text-xs mb-8 text-center ${darkMode ? 'text-muted-foreground' : 'text-gray-400'}`}>{t('parentAppOption')}</p>
                                    
                                    <div className={`flex flex-col gap-4 mb-8`}>
                                       <div className={`flex items-center justify-between p-5 rounded-2xl border ${darkMode ? 'bg-muted border-border' : 'bg-gray-50 border-gray-100'}`}>
                                          <div className="flex items-center gap-3">
                                             <MonitorPlay size={20} className={darkMode ? 'text-muted-foreground' : 'text-gray-500'} />
                                             <span className="font-bold">{t('screenTimeLimit')}</span>
                                          </div>
                                          <input type="number" defaultValue={2} className={`w-16 border rounded-xl p-2 text-center font-bold ${darkMode ? 'bg-input border-input text-foreground' : 'bg-white border-gray-200'}`} />
                                       </div>
                                       
                                       <div className={`flex items-center justify-between p-5 rounded-2xl border ${darkMode ? 'bg-muted border-border' : 'bg-gray-50 border-gray-100'}`}>
                                          <div className="flex items-center gap-3">
                                             <Lock size={20} className={darkMode ? 'text-muted-foreground' : 'text-gray-500'} />
                                             <span className="font-bold">{t('blockPurchases')}</span>
                                          </div>
                                          <Switch defaultChecked />
                                       </div>
                                       
                                       <div className={`flex items-center justify-between p-5 rounded-2xl border ${darkMode ? 'bg-muted border-border' : 'bg-gray-50 border-gray-100'}`}>
                                          <div className="flex items-center gap-3">
                                             <Key size={20} className={darkMode ? 'text-muted-foreground' : 'text-gray-500'} />
                                             <span className="font-bold">{t('pinCode')}</span>
                                          </div>
                                          <button className="text-blue-500 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">{t('setPin')}</button>
                                       </div>
                                    </div>
                                    
                                    <Drawer.Close asChild>
                                        <button className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black shadow-lg shadow-blue-200/50 hover:bg-blue-600 transition-colors active:scale-95">{t('saveParentalSettings')}</button>
                                    </Drawer.Close>
                                </div>
                            </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root>
                </div>

                {/* Account Actions */}
                <div className={`rounded-[16px] border-[0.5px] border-[#F0F0F0] bg-white overflow-hidden`}>
                    <Drawer.Root>
                        <Drawer.Trigger asChild>
                            <button className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors border-b-[0.5px] border-[#F0F0F0]">
                                <div className="flex items-center gap-3">
                                    <Lock size={20} className="text-gray-500" />
                                    <span className="font-medium">{t('changePassword')}</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                            <Drawer.Content className={`flex flex-col rounded-t-[32px] mt-24 fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] ${darkMode ? 'bg-card' : 'bg-white'}`}>
                                <Drawer.Close asChild>
                                    <button className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-muted text-foreground' : 'bg-gray-100 text-gray-600'}`}>
                                        <X size={16} />
                                    </button>
                                </Drawer.Close>
                                <div className={`p-6 rounded-t-[32px] flex-1 overflow-y-auto ${darkMode ? 'bg-card' : 'bg-white'}`}>
                                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                                    <div className="max-w-md mx-auto space-y-6 pb-12">
                                        <div className="text-center mb-6">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-500'}`}>
                                                <Lock size={32} />
                                            </div>
                                            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{t('changePassword')}</h2>
                                            <p className={`text-sm ${darkMode ? 'text-muted-foreground' : 'text-gray-700'}`}>Enter your current password and choose a new one</p>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                                    {t('currentPassword')}
                                                </label>
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder={t('currentPasswordPlaceholder')}
                                                    className={`w-full border rounded-lg px-4 py-3 ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                                    {t('newPassword')}
                                                </label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder={t('newPasswordPlaceholder')}
                                                    className={`w-full border rounded-lg px-4 py-3 ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                                    {t('confirmNewPassword')}
                                                </label>
                                                <input
                                                    type="password"
                                                    value={confirmNewPassword}
                                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                    placeholder={t('confirmNewPasswordPlaceholder')}
                                                    className={`w-full border rounded-lg px-4 py-3 ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'}`}
                                                />
                                            </div>
                                        </div>
                                        
                                        {passwordError && (
                                            <div className={`p-3 rounded-lg text-sm ${darkMode ? 'bg-red-900/20 text-red-400 border border-red-800/30' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                                {passwordError}
                                            </div>
                                        )}
                                        
                                        {passwordSuccess && (
                                            <div className={`p-3 rounded-lg text-sm ${darkMode ? 'bg-green-900/20 text-green-400 border border-green-800/30' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                                                {passwordSuccess}
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-3 pt-4">
                                            <Drawer.Close asChild>
                                                <button className={`flex-1 py-3 rounded-xl font-bold transition-colors ${darkMode ? 'bg-muted text-muted-foreground' : 'bg-gray-100 text-gray-700'}`}>
                                                    {t('cancel')}
                                                </button>
                                            </Drawer.Close>
                                            <button
                                                onClick={handlePasswordChange}
                                                disabled={isChangingPassword}
                                                className={`flex-1 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-800' : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300'}`}
                                            >
                                                {isChangingPassword ? t('updating') || 'Updating...' : t('updatePassword')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root>

                    <Drawer.Root>
                        <Drawer.Trigger asChild>
                            <button className="w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors text-red-500">
                                <div className="flex items-center gap-3">
                                    <LogOut size={20} />
                                    <span className="font-medium">{t('logOut')}</span>
                                </div>
                            </button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                            <Drawer.Content className={`flex flex-col rounded-t-[32px] mt-24 fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] ${darkMode ? 'bg-card' : 'bg-white'}`}>
                                <div className={`p-6 rounded-t-[32px] flex-1 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                                    <div className="max-w-md mx-auto space-y-6 pb-12 text-center">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-500'}`}>
                                            <LogOut size={32} />
                                        </div>
                                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-foreground' : 'text-gray-900'}`}>{t('logOut')}</h2>
                                        <p className={darkMode ? 'text-slate-400' : 'text-gray-500'}>{t('logoutConfirm')}</p>
                                        <div className="flex flex-col gap-3 pt-4">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200"
                                            >
                                                {t('logOut')}
                                            </button>
                                            <Drawer.Close asChild>
                                                <button className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold">{t('cancel')}</button>
                                            </Drawer.Close>
                                        </div>
                                    </div>
                                </div>
                            </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root>
                </div>

                {/* Delete Account */}
                <div className="pt-4 pb-8 flex flex-col items-center gap-4">
                    <Drawer.Root>
                        <Drawer.Trigger asChild>
                            <button className="text-red-500 text-sm flex items-center gap-2 hover:text-red-600 transition-colors font-medium">
                                <Trash2 size={14} />
                                {t('deleteAccount')}
                            </button>
                        </Drawer.Trigger>
                        <Drawer.Portal>
                            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
                            <Drawer.Content className={`flex flex-col rounded-t-[32px] mt-24 fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] ${darkMode ? 'bg-card' : 'bg-white'}`}>
                                <div className={`p-6 rounded-t-[32px] flex-1 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
                                    <div className="max-w-md mx-auto space-y-6 pb-12 text-center">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-500'}`}>
                                            <AlertTriangle size={32} />
                                        </div>
                                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-foreground' : 'text-gray-900'}`}>{t('deleteAccount')}</h2>
                                        <p className={darkMode ? 'text-slate-400' : 'text-gray-500'}>
                                            {language === 'he' 
                                                ? 'האם אתה בטוח שברצונך למחוק את חשבונך? פעולה זו בלתי הפיכה ותמחק את כל הנתונים שלך.'
                                                : 'Are you sure you want to delete your account? This action cannot be undone and will delete all your data.'}
                                        </p>
                                        <div className="flex flex-col gap-3 pt-4">
                                            <button
                                                onClick={handleDeleteAccount}
                                                disabled={isDeletingAccount}
                                                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                {isDeletingAccount 
                                                    ? (language === 'he' ? 'מוחק...' : 'Deleting...')
                                                    : (language === 'he' ? 'מחק חשבון' : 'Delete Account')
                                                }
                                            </button>
                                            <Drawer.Close asChild>
                                                <button className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold">
                                                    {t('cancel')}
                                                </button>
                                            </Drawer.Close>
                                        </div>
                                    </div>
                                </div>
                            </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root>
                    <span className="text-xs text-gray-300">Version 1.0.2</span>
                </div>

            </div>
        </MobileContainer>
    );
};
