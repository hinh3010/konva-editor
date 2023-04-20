import React from 'react';
import Header from '../components/Header';
import LeftBar from '../components/LeftBar';
import RightBar from '../components/RightBar';
import Main from '../components/Main';

const DesignMockup = () => {
    return (
        <div className='w-full h-full'>
            <Header />
            <div className='flex items-center' style={{ height: '89%' }}>
                <LeftBar />
                <Main />
                <RightBar />
            </div>
        </div>
    );
}

export default DesignMockup;
