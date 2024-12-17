import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            className={`font-yeseva fixed top-0 z-10 w-full py-5 font-medium text-2xl transition-all duration-300 ${
                isScrolled
                    ? 'bg-[#56a785d6] text-white'
                    : 'bg-transparent text-[#2d5746]'
            } flex justify-center`}
        >
            Flower Classification
        </div>
    );
};

export default Navbar;
