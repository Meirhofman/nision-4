import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Character Assets
import baseV2 from '../../assets/character/base_v2.png';
import characterBlue from '../../assets/colors/character_v3_blue.png';
import characterGreen from '../../assets/colors/character_v3_green.png';
import characterRed from '../../assets/colors/character_v3_red.png';
import characterPurple from '../../assets/colors/character_v3_purple.png';
import characterOrange from '../../assets/colors/character_v3_orange.png';
import characterYellow from '../../assets/colors/character_v3_yellow.png';
import characterPink from '../../assets/colors/character_v3_pink.png';

// Import clothing assets - same as CharacterScreen
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
import capImg from '../../assets/character/cap.jpeg';
import shadesImg from '../../assets/character/shades.jpeg';

interface CharacterProps {
    state: {
        skin: string;
        hat: string;
        shirt: string;
        set: string;
        accessory: string;
        hatPos?: { x: number; y: number };
        shirtPos?: { x: number; y: number };
        setPos?: { x: number; y: number };
        accessoryPos?: { x: number; y: number };
    };
    width?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    animate?: boolean;
    clothingImages?: {
        shirt?: string;
        set?: string;
        hat?: string;
        accessory?: string;
    };
}

const SIZE_PX: Record<string, number> = {
    sm: 128,
    md: 192,
    lg: 256,
    xl: 320,
};

export const Character = ({
    state,
    size = 'md',
    width,
    className = '',
    animate = false,
    clothingImages = {},
}: CharacterProps) => {
    const px = width ?? SIZE_PX[size] ?? 192;
    const spring = { type: 'spring', damping: 20, stiffness: 300 } as const;

    // Helper function to get clothing image URL with color matching
    const getClothingImageUrl = (type: string, id: string, skinColor: string): string | undefined => {
        if (!id || id === 'none') return undefined;
        
        // Create color-mapped clothing paths
        const colorMapping: Record<string, string> = {
            'blue': 'blue',
            'green': 'green', 
            'red': 'red',
            'purple': 'purple',
            'orange': 'orange',
            'yellow': 'yellow',
            'pink': 'pink',
            'cyan': 'blue', // Use blue for cyan
            'normal': 'normal'
        };
        
        const colorPrefix = colorMapping[skinColor] || 'blue';
        
        const imageMap: Record<string, Record<string, string>> = {
            shirt: {
                'green_hoodie': greenHoodie,
                'purple_shirt': purpleShirt,
                'red_tshirt': redTshirt,
                'striped_shirt': stripedShirt,
                'white_tshirt': '../../assets/clothes/t shirt/character_white_tshirt.png',
                'black_tshirt': '../../assets/clothes/t shirt/character_black_tshirt.png',
            },
            accessory: {
                'sunglasses': '../../assets/clothes/accessories/character_sunglasses.png',
                'watch': '../../assets/clothes/accessories/character_watch.png',
                'necklace': '../../assets/clothes/accessories/character_necklace.png',
            },
            set: {
                'chef_set': chefSet,
                'cool_look': coolLook,
                'royal_set': royalSet,
                'vacation_look': vacationLook,
                'winter_set': winterSet,
                'wizard_set': wizardSet,
                'business_set': '../../assets/clothes/set/character_business_set.png',
                'sporty_set': '../../assets/clothes/set/character_sporty_set.png',
            },
            hat: {
                'pirate_hat': pirateHat,
                'viking_hat': vikingHat,
                'cap': capImg,
                'beanie': shadesImg, // Using existing image as placeholder
            }
        };
        
        const baseImage = imageMap[type]?.[id];
        if (!baseImage) return undefined;
        
        console.log(`=== CLOTHING COLOR DEBUG ===`);
        console.log(`Type: ${type}, ID: ${id}, Skin: ${skinColor}`);
        console.log(`Color prefix: ${colorPrefix}`);
        console.log(`Base image: ${baseImage}`);
        console.log(`==========================`);
        
        // For now, return the base image (we'll implement colored versions next)
        return baseImage;
    };

    // Get character image based on skin color
    const getCharacterImage = (skin: string) => {
        console.log('=== CHARACTER IMAGE DEBUG ===');
        console.log('Requested skin:', skin);
        
        let image;
        switch (skin) {
            case 'normal': 
                image = baseV2; 
                console.log('Using baseV2 image:', baseV2);
                break;
            case 'blue': 
                image = characterBlue; 
                console.log('Using characterBlue image:', characterBlue);
                break;
            case 'green': 
                image = characterGreen; 
                console.log('Using characterGreen image:', characterGreen);
                break;
            case 'red': 
                image = characterRed; 
                console.log('Using characterRed image:', characterRed);
                break;
            case 'purple': 
                image = characterPurple; 
                console.log('Using characterPurple image:', characterPurple);
                break;
            case 'orange': 
                image = characterOrange; 
                console.log('Using characterOrange image:', characterOrange);
                break;
            case 'yellow': 
                image = characterYellow; 
                console.log('Using characterYellow image:', characterYellow);
                break;
            case 'pink': 
                image = characterPink; 
                console.log('Using characterPink image:', characterPink);
                break;
            case 'cyan': 
                image = characterBlue; 
                console.log('Using characterBlue for cyan:', characterBlue);
                break; // Use blue for cyan as fallback
            default: 
                image = characterBlue; 
                console.log('Using default characterBlue:', characterBlue);
                break; // Default to blue
        }
        
        console.log('Final selected image:', image);
        console.log('========================');
        return image;
    };

    // Debug logging for shirt selection
    console.log('=== CHARACTER SHIRT DEBUG ===');
    console.log('State received:', state);
    console.log('Skin color:', state.skin);
    console.log('Character image:', getCharacterImage(state.skin || 'blue'));
    console.log('Shirt selected:', state.shirt);
    console.log('Set selected:', state.set);
    console.log('=============================');

    const idleVariants = {
        animate: {
            y: [0, -4, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <motion.div
            className={`relative inline-block ${className}`}
            style={{ width: px }}
        >
            {/* ── Base Character (Body Only) ─────────────────────── */}
            <motion.div
                className="relative w-full z-0"
                variants={animate ? idleVariants : undefined}
                animate={animate ? "animate" : undefined}
            >
                <img
                    src={getCharacterImage(state.skin || 'blue')}
                    alt="Character Body"
                    className="block w-full h-auto transition-all duration-500"
                    style={{ 
                        mixBlendMode: 'normal'
                    }}
                    draggable={false}
                />
            </motion.div>

            {/* ── Sets (Clothing Layer) ──────────────────────────── */}
            <AnimatePresence>
                {state.set !== 'none' && (clothingImages.set || getClothingImageUrl('set', state.set, state.skin)) && (
                    <motion.div
                        key="set"
                        className="absolute top-0 left-0 w-full h-auto z-10"
                        style={{ isolation: 'isolate' }} // Isolate from body color
                    >
                        <img
                            src={clothingImages.set || getClothingImageUrl('set', state.set, state.skin)}
                            alt=""
                            className="block w-full h-auto"
                            style={{
                                width: '100%',
                                height: 'auto',
                                mixBlendMode: 'normal',
                                filter: 'none',
                                opacity: 1,
                                transform: `translate(${state.setPos?.x || 0}px, ${state.setPos?.y || 0}px)`
                            }}
                            draggable={false}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Jersey / Shirt (Clothing Layer) ─────────────────── */}
            <AnimatePresence>
                {(() => {
                    const shirtImage = clothingImages.shirt || getClothingImageUrl('shirt', state.shirt, state.skin);
                    console.log('=== SHIRT IMAGE DEBUG ===');
                    console.log('Shirt ID:', state.shirt);
                    console.log('Skin color:', state.skin);
                    console.log('ClothingImages.shirt:', clothingImages.shirt);
                    console.log('getClothingImageUrl result:', getClothingImageUrl('shirt', state.shirt, state.skin));
                    console.log('Final shirt image:', shirtImage);
                    console.log('========================');
                    
                    return state.shirt !== 'none' && shirtImage && (
                        <motion.div
                            key="shirt"
                            className="absolute top-0 left-0 w-full h-auto z-10"
                            style={{ isolation: 'isolate' }} // Isolate from body color
                        >
                            <img
                                src={shirtImage}
                                alt=""
                                className="block w-full h-auto"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    mixBlendMode: 'normal',
                                    filter: 'none',
                                    opacity: 1,
                                    transform: `translate(${state.shirtPos?.x || 0}px, ${state.shirtPos?.y || 0}px)`
                                }}
                                draggable={false}
                            />
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            {/* ── Hat (Accessory Layer) ───────────────────────────── */}
            <AnimatePresence>
                {state.hat && state.hat !== 'none' && (clothingImages.hat || getClothingImageUrl('hat', state.hat, state.skin)) && (
                    <motion.div
                        key="hat"
                        className="absolute top-0 left-0 w-full h-auto z-10"
                        style={{ isolation: 'isolate' }} // Isolate from body color
                    >
                        <img
                            src={clothingImages.hat || getClothingImageUrl('hat', state.hat, state.skin)}
                            alt=""
                            className="block w-full h-auto"
                            style={{
                                width: '100%',
                                height: 'auto',
                                mixBlendMode: 'normal',
                                filter: 'none',
                                opacity: 1,
                                transform: `translate(${state.hatPos?.x || 0}px, ${state.hatPos?.y || 0}px)`
                            }}
                            draggable={false}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Shades / Accessory (Accessory Layer) ────────────── */}
            <AnimatePresence>
                {state.accessory && state.accessory !== 'none' && (clothingImages.accessory || getClothingImageUrl('accessory', state.accessory, state.skin)) && (
                    <motion.div
                        key="accessory"
                        className="absolute top-0 left-0 w-full h-auto z-10"
                        style={{ isolation: 'isolate' }} // Isolate from body color
                    >
                        <img
                            src={clothingImages.accessory || getClothingImageUrl('accessory', state.accessory, state.skin)}
                            alt=""
                            className="block w-full h-auto"
                            style={{
                                width: '100%',
                                height: 'auto',
                                mixBlendMode: 'normal',
                                filter: 'none',
                                opacity: 1,
                                transform: `translate(${state.accessoryPos?.x || 0}px, ${state.accessoryPos?.y || 0}px)`
                            }}
                            draggable={false}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
