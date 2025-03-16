import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white/80 backdrop-blur-sm py-3">
            <div className="text-center">
                <p className="text-gray-600 text-sm">
                    Made with <span className="text-red-500">❤️</span> by{' '}
                    <span className="text-indigo-600 font-medium">Team Web Dev</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;