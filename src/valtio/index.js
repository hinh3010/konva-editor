import { proxy } from 'valtio';

const valtio = proxy({
    intro: true,
    color: '#EFBD48',
    isLogoTexture: true,
    isFullTexture: false,
    logoDecal: './threejs.png',
    fullDecal: './threejs.png',
});

export default valtio;

// const snap = useSnapshot(valtio);