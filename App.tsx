
import React, { useState } from 'react';
import Scene from './components/Scene';
import Overlay from './components/Overlay';
import { TreeState } from './constants';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);

  return (
    <main className="w-full h-screen bg-[#01160e] relative">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene state={treeState} />
      </div>

      {/* Decorative Border Overlay */}
      <div className="absolute inset-4 border border-[#d4af37]/10 pointer-events-none z-20" />
      <div className="absolute inset-8 border border-[#d4af37]/5 pointer-events-none z-20" />

      {/* UI Controls & Branding */}
      <Overlay state={treeState} setState={setTreeState} />

      {/* Luxury Gradient Vignette (HTML Overlay) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/30 z-5" />
      
      {/* Bottom Logo Detail */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-40 pointer-events-none">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2L24.5 13.5H36L27 21L30.5 32.5L20 26L9.5 32.5L13 21L4 13.5H15.5L20 2Z" fill="#d4af37" />
        </svg>
      </div>
    </main>
  );
};

export default App;
