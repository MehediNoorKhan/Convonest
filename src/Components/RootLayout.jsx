import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router';
import Footer from './Footer';

const RootLayout = () => {
    return (
        <div className='bg-base-200'>
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;