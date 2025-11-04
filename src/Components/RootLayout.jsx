import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router';
import Footer from './Footer';

const RootLayout = () => {
    return (
        <div className="bg-[#f1f1f1] dark:bg-[#f1f1f1]"> {/* same in both modes */}
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default RootLayout;
