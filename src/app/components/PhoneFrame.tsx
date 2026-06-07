import React from 'react';

interface PhoneFrameProps {
    children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
    return (
        <div className="flex items-center justify-center min-h-screen min-h-[100dvh] sm:bg-gray-200 bg-white sm:p-4 font-sans overflow-x-hidden">
            {/* Device Frame */}
            <div className="relative mx-auto sm:border-gray-800 sm:dark:border-gray-800 sm:bg-gray-800 sm:border-[14px] sm:rounded-[2.5rem] sm:h-[844px] sm:w-[390px] w-full min-h-screen min-h-[100dvh] sm:min-h-0 sm:shadow-2xl transition-all duration-300 sm:hover:shadow-[0_0_50px_rgba(0,0,0,0.2)] flex flex-col">
                {/* Notch/Dynamic Island - Hidden on mobile */}
                <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-800 rounded-b-2xl z-20"></div>

                {/* Top Speaker/Sensors (Inside Notch) - Hidden on mobile */}
                <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 gap-2 z-30">
                    <div className="h-1.5 w-10 bg-gray-700 rounded-full"></div>
                    <div className="h-1.5 w-1.5 bg-gray-700 rounded-full"></div>
                </div>

                {/* Side Buttons - Hidden on mobile */}
                <div className="hidden sm:block absolute -left-[17px] top-32 w-[3px] h-8 bg-gray-800 rounded-l-lg"></div>
                <div className="hidden sm:block absolute -left-[17px] top-48 w-[3px] h-16 bg-gray-800 rounded-l-lg"></div>
                <div className="hidden sm:block absolute -left-[17px] top-68 w-[3px] h-16 bg-gray-800 rounded-l-lg"></div>
                <div className="hidden sm:block absolute -right-[17px] top-40 w-[3px] h-24 bg-gray-800 rounded-r-lg"></div>

                {/* Screen Content */}
                <div className="sm:rounded-[2rem] sm:overflow-hidden w-full sm:flex-1 bg-white relative flex flex-col min-h-0 overflow-hidden">
                    <div className="min-h-full w-full flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide sm:pt-[40px] pt-0" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                        {children}
                    </div>
                </div>

                {/* Bottom Indicator - Hidden on mobile */}
                <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gray-900/10 rounded-full z-10"></div>
            </div>

            {/* Visual background elements - Hidden on mobile to avoid background overlap */}
            <div className="hidden sm:block fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-pink-50 to-green-50"></div>
        </div>
    );
};
