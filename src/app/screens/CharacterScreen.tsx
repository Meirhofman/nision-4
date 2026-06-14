import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { MobileContainer } from '../components/MobileContainer';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Check, Palette, Sparkles, Shirt } from 'lucide-react';

import { Character } from '../components/Character';

// Import clothing assets
import greenHoodie from '../../assets/clothes/t shirt/character_green_hoodie.png';
import purpleShirt from '../../assets/clothes/t shirt/character_purple_shirt.png';
import redTshirt from '../../assets/clothes/t shirt/character_red_tshirt.png';
import stripedShirt from '../../assets/clothes/t shirt/character_striped_shirt.png';
import chefSet from '../../assets/clothes/set/character_chef_set.png';
import coolLook from '../../assets/clothes/set/character_cool_look.png';
import pirateHat from '../../assets/clothes/set/character_pirate_hat.png';
import royalSet from '../../assets/clothes/set/character_royal_set.png';
import vacationLook from '../../assets/clothes/set/character_vacation_look.png';
import vikingHat from '../../assets/clothes/set/character_viking_hat.png';
import winterSet from '../../assets/clothes/set/character_winter_set.png';
import wizardSet from '../../assets/clothes/set/character_wizard_set.png';

// Import hat assets
import capImg from '../../assets/character/cap.jpeg';
import shadesImg from '../../assets/character/shades.jpeg';


interface Item {
    id: string;
    name: string;
    image: string;
    type: 'hat' | 'shirt' | 'set' | 'accessory' | 'shoes' | 'pants' | 'skin' | 'model';
    price?: number;
}

// Base clothing items structure without translations
export const BASE_CLOTHING_ITEMS: Omit<Item, 'name'>[] = [
    // T-Shirts
    { id: 'none', image: '', type: 'shirt' },
    { id: 'green_hoodie', image: greenHoodie, type: 'shirt' },
    { id: 'purple_shirt', image: purpleShirt, type: 'shirt' },
    { id: 'red_tshirt', image: redTshirt, type: 'shirt' },
    { id: 'striped_shirt', image: stripedShirt, type: 'shirt' },
    { id: 'white_tshirt', image: '../../assets/clothes/t shirt/character_white_tshirt.png', type: 'shirt' },
    { id: 'black_tshirt', image: '../../assets/clothes/t shirt/character_black_tshirt.png', type: 'shirt' },
    
    // Sets
    { id: 'none', image: '', type: 'set' },
    { id: 'chef_set', image: chefSet, type: 'set' },
    { id: 'cool_look', image: coolLook, type: 'set' },
    { id: 'royal_set', image: royalSet, type: 'set' },
    { id: 'vacation_look', image: vacationLook, type: 'set' },
    { id: 'winter_set', image: winterSet, type: 'set' },
    { id: 'wizard_set', image: wizardSet, type: 'set' },
    { id: 'business_set', image: '../../assets/clothes/set/character_business_set.png', type: 'set' },
    { id: 'sporty_set', image: '../../assets/clothes/set/character_sporty_set.png', type: 'set' },
];

// Helper function to get translated clothing items
export const getClothingItems = (t: (key: string) => string): Item[] => {
    return BASE_CLOTHING_ITEMS.map(item => {
        let name = '';
        
        switch (item.id) {
            case 'none':
                name = t('none');
                break;
            case 'green_hoodie':
                name = t('greenHoodie');
                break;
            case 'purple_shirt':
                name = t('purpleShirt');
                break;
            case 'red_tshirt':
                name = t('redTshirt');
                break;
            case 'striped_shirt':
                name = t('stripedShirt');
                break;
            case 'white_tshirt':
                name = t('whiteTshirt');
                break;
            case 'black_tshirt':
                name = t('blackTshirt');
                break;
            case 'chef_set':
                name = t('chefSet');
                break;
            case 'cool_look':
                name = t('coolLook');
                break;
            case 'royal_set':
                name = t('royalSet');
                break;
            case 'vacation_look':
                name = t('vacationLook');
                break;
            case 'winter_set':
                name = t('winterSet');
                break;
            case 'wizard_set':
                name = t('wizardSet');
                break;
            case 'business_set':
                name = t('businessSet');
                break;
            case 'sporty_set':
                name = t('sportySet');
                break;
            default:
                name = item.id;
        }
        
        return { ...item, name };
    });
};

// Export CLOTHING_ITEMS for backward compatibility
export const CLOTHING_ITEMS: Item[] = BASE_CLOTHING_ITEMS.map(item => ({ ...item, name: item.id }));


export const CharacterScreen = () => {
    const { t, characterState, updateCharacterState, isRTL, darkMode } = useApp();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('skin');
    
    // Use the current character state instead of resetting
    const [localState, setLocalState] = useState(() => {
        const initialState = {
            modelType: 'v2',
            hat: 'none',
            shirt: 'none',
            pants: 'none',
            shoes: 'none',
            accessory: 'none',
            hatPos: { x: 0, y: 0 },
            shirtPos: { x: 0, y: 0 },
            accessoryPos: { x: 0, y: 0 },
            ...characterState,
            skin: characterState.skin || 'blue', // Ensure blue default
        };
        
        console.log('=== INITIAL STATE DEBUG ===');
        console.log('characterState:', characterState);
        console.log('initialState:', initialState);
        console.log('========================');
        
        return initialState;
    });

    const tabs = [
        { id: 'skin', icon: Palette, label: t('color') },
        { id: 'shirt', icon: Shirt, label: t('shirts') },
        { id: 'set', icon: Shirt, label: t('sets') },
        { id: 'hat', icon: Shirt, label: t('hats') },
        { id: 'accessory', icon: Shirt, label: t('accessory') },
    ];

    // Define clothing items with translations
    const CLOTHING_ITEMS = getClothingItems(t);

    // Map skin IDs to correct names using translations
    const SKIN_NAMES: Record<string, string> = {
        normal: t('normalSkin'),
        blue: t('blueSkin'),
        green: t('greenSkin'),
        red: t('redSkin'),
        purple: t('purpleSkin'),
        orange: t('orangeSkin'),
        yellow: t('yellowSkin'),
        pink: t('pinkSkin'),
        cyan: t('cyanSkin'),
    };

    const SKIN_COLORS: Item[] = [
        { id: 'normal', name: SKIN_NAMES.normal, image: '', type: 'skin' },
        { id: 'blue', name: SKIN_NAMES.blue, image: '', type: 'skin' },
        { id: 'green', name: SKIN_NAMES.green, image: '', type: 'skin' },
        { id: 'red', name: SKIN_NAMES.red, image: '', type: 'skin' },
        { id: 'purple', name: SKIN_NAMES.purple, image: '', type: 'skin' },
        { id: 'orange', name: SKIN_NAMES.orange, image: '', type: 'skin' },
        { id: 'yellow', name: SKIN_NAMES.yellow, image: '', type: 'skin' },
        { id: 'pink', name: SKIN_NAMES.pink, image: '', type: 'skin' },
    ];


    const handleSelect = (item: Item) => {
        console.log('=== SHIRT SELECTION DEBUG ===');
        console.log('Item selected:', item);
        console.log('Current localState before:', localState);
        console.log('Current skin color:', localState.skin);
        
        if (item.type === 'skin') {
            setLocalState((prev: any) => ({
                ...prev,
                skin: item.id
            }));
        } else if (item.type === 'shirt') {
            // If selecting a shirt, clear any set
            setLocalState((prev: any) => {
                const newState = {
                    ...prev,
                    shirt: item.id,
                    set: 'none'
                };
                console.log('New state after shirt selection:', newState);
                console.log('Skin color preserved:', newState.skin);
                return newState;
            });
        } else if (item.type === 'set') {
            // If selecting a set, clear any shirt
            setLocalState((prev: any) => ({
                ...prev,
                set: item.id,
                shirt: 'none'
            }));
        } else if (item.type === 'hat') {
            setLocalState((prev: any) => ({
                ...prev,
                hat: item.id
            }));
        } else if (item.type === 'accessory') {
            // Accessories coming soon - don't allow selection
            return;
        }
    };

    const handleSave = async () => {
        updateCharacterState(localState);
        
        // Save selected color to Firestore if we have a user
        const { getFirebaseFirestore } = await import('../../lib/firebase');
        const { doc, updateDoc } = await import('firebase/firestore');
        const db = getFirebaseFirestore();
        if (db && characterState.currentUser?.uid) {
            try {
                const userRef = doc(db, 'users', characterState.currentUser.uid);
                await updateDoc(userRef, { characterColor: localState.skin });
            } catch (e) {
                console.error('Failed to save character color', e);
            }
        }
        
        navigate('/main');
    };

    const filteredItems = activeTab === 'skin' ? SKIN_COLORS : CLOTHING_ITEMS.filter(item => item.type === activeTab && item.type !== 'set');

    // Map skin IDs to actual colors for the UI circles
    const SKIN_UI_COLORS: Record<string, string> = {
        normal: 'bg-[#FFDBAC]',
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        yellow: 'bg-yellow-400',
        pink: 'bg-pink-500',
        cyan: 'bg-cyan-500',
    };

    return (
        <MobileContainer className="min-h-screen relative flex flex-col justify-center bg-[#F9F9F9]">

            {/* Header */}
            <div className="flex items-center justify-between p-6 z-20 mt-4">
                <button
                    onClick={() => navigate('/main')}
                    className="p-3 bg-transparent transition-colors"
                >
                    <ChevronLeft className={isRTL ? 'rotate-180 text-gray-500' : 'text-gray-500'} size={24} />
                </button>
                <h1 className="text-xl font-black text-gray-900">מעצב דמות</h1>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#F4F0FF] text-[#534AB7] rounded-[20px] font-bold text-sm flex items-center gap-2 transition-colors"
                >
                    <span>{t('characterSave')}</span>
                </button>
            </div>

            {/* Character Preview */}
            <div className="flex flex-col items-center justify-center relative p-4 py-8">

                <div className="relative z-10 transform scale-[1.2] cursor-ns-resize bg-transparent">
                    <Character 
                        state={localState} 
                        width={260} 
                        clothingImages={{
                            shirt: CLOTHING_ITEMS.find(item => item.id === localState.shirt)?.image,
                            set: CLOTHING_ITEMS.find(item => item.id === localState.set)?.image,
                            hat: CLOTHING_ITEMS.find(item => item.id === localState.hat)?.image,
                            accessory: CLOTHING_ITEMS.find(item => item.id === localState.accessory)?.image,
                        }}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className={`rounded-t-[4rem] p-8 pb-14 min-h-[350px] bg-white mt-0`}>
                <div className="flex justify-between mb-8 overflow-x-auto no-scrollbar gap-3 pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center p-2 transition-all min-w-[80px] ${activeTab === tab.id
                                ? 'text-[#534AB7] border-b-2 border-[#534AB7]'
                                : 'text-gray-400'
                                }`}
                        >
                            <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="pr-1">
                    <AnimatePresence mode="wait">
                        {filteredItems.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`flex flex-col items-center justify-center py-16 rounded-[3rem] border-4 border-dashed ${darkMode ? 'text-gray-400 bg-slate-600 border-slate-500' : 'text-gray-400 bg-gray-50 border-gray-100'}`}
                            >
                                <div className={`p-4 rounded-3xl mb-4 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                    <Sparkles className={darkMode ? "text-slate-300" : "text-pink-300"} size={32} />
                                </div>
                                <p className="text-2xl font-black tracking-tight text-gray-400 uppercase italic">{t('comingSoon')}</p>
                                <p className="text-xs font-bold text-gray-300 mt-2 px-8 text-center leading-relaxed">
                                    {t('designerDescription')}
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-4 gap-[12px]">
                                {filteredItems.map((item) => {
                                    const isEquipped = localState[item.type] === item.id;
                                    return (
                                        <div className="flex flex-col items-center">
                                            <motion.div
                                                key={item.id}
                                                layout
                                                whileTap={{ scale: 0.93 }}
                                                onClick={() => handleSelect(item)}
                                                className={`relative w-[44px] h-[44px] rounded-full flex flex-col items-center justify-center cursor-pointer transition-all ${isEquipped && item.type === 'skin'
                                                    ? 'border-2 border-[#534AB7] shadow-[0_0_0_3px_#F4F0FF]'
                                                    : isEquipped
                                                    ? 'border-2 border-[#534AB7]'
                                                    : 'border-2 border-transparent'
                                                    }`}
                                            >
                                                {item.type === 'skin' ? (
                                                    <div className="w-10 h-10 rounded-full" style={{ background: (item as any).hex || '#F5CBA7' }} />
                                                ) : (
                                                    <div className="w-10 h-10 flex items-center justify-center">
                                                        <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
                                                    </div>
                                                )}
                                            </motion.div>
                                            <p className="text-[11px] font-medium mt-1 text-center leading-tight text-gray-600">{item.name}</p>
                                        </div>

                                    );
                                })}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MobileContainer>
    );
};
