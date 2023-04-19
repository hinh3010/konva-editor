import { Button, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';
import * as React from 'react';

const steps = ['Select product', 'Design', 'Publish'];


const Header = () => {
    const activeStep = 1

    return (
        <Paper elevation={3}  >
            <div className='flex items-center justify-between' style={{ height: '60px', padding: '2px 10px' }}>
                <Button variant="text" style={{ textTransform: 'initial', fontSize: '14px', padding: '4px 20px', fontWeight: '600' }}>Products</Button>
                <Box sx={{ width: '100%', maxWidth: '600px' }}>
                    <Stepper nonLinear activeStep={activeStep}>
                        {steps.map((label, index) => (
                            <Step key={label} completed={index < activeStep}>
                                <StepButton color="inherit" style={{ pointerEvents: 'none' }}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Button variant="contained" style={{ textTransform: 'initial', fontSize: '14px', padding: '4px 20px', fontWeight: '600' }}>Publish</Button>
            </div>
        </Paper>
    );
}

export default Header;

