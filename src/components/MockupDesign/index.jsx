import { Paper } from '@mui/material';
import React from 'react';
import { useRef } from 'react';
import MockupStage from '../KonvaCpn/MockupStage';

const stageSidesData = []
const stageDrag = true
const activeSide = 'font'

const MockupDesign = () => {
    const editorWrapper = useRef(null)

    return (
        <div className='w-full flex-1 p-3'>
            <Paper elevation={3} sx={{ width: '100%', height: '100%' }}>
                <div
                    id="MockupEditor"
                    ref={editorWrapper}
                    style={{
                        cursor: stageDrag ? 'grab' : 'default',
                    }}
                >
                    {stageSidesData?.length &&
                        stageSidesData.map((stage, index) => (
                            <MockupStage
                                key={index}
                                stage={stage}
                                activeSide={activeSide}
                                isActive={activeSide === stage.side}
                            />
                        ))}
                </div>
            </Paper>
        </div>
    );
}

export default MockupDesign;
