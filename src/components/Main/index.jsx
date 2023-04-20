import { Paper } from '@mui/material';
import React from 'react';
import MockupBottom from '../MockupBottom';
import MockupDesign from '../MockupDesign';
import MockupTop from '../MockupTop';

const Main = () => {
    return (
        <Paper elevation={3} className='h-full flex-1 flex flex-col items-center'>
            <MockupTop />
            <MockupDesign />
            <MockupBottom />
        </Paper>
    );
}

export default Main;
