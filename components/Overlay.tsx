import React from 'react';
import { TreeState } from '../constants';

interface OverlayProps {
  state: TreeState;
  setState: (s: TreeState) => void;
}

const Overlay: React.FC<OverlayProps> = ({ state, setState }) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="animate-fade-in pointer-events-auto">
          {/* Personalized Greeting */}
          <div className="mb-4">
            <p className="text-[#f9e27d]/80 text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium drop-shadow-sm">
              圣诞快乐 to 荣耀鱼
            </p>
          </div>
          
          <h1 className="text-4xl md:text-6xl text-[#d4af37] tracking-widest font-bold">
            ARIX
          </h1>
          <p className="text-[#0a5c36] text-sm md:text-lg uppercase tracking-[0.3em] font-light">
            Signature Interactive
          </p>
        </div>
        
        <div className="text-right pointer-events-auto">
          <p className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold opacity-60">
            Est. 2024
          </p>
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="flex flex-col items-center gap-6">
        <div className="pointer-events-auto flex gap-4 md:gap-8 bg-black/30 backdrop-blur-xl border border-[#d4af37]/20 p-2 rounded-full px-6 py-3">
          <button 
            onClick={() => setState(TreeState.SCATTERED)}
            className={`px-4 py-2 uppercase tracking-widest text-xs md:text-sm transition-all duration-500 rounded-full ${
              state === TreeState.SCATTERED 
              ? 'bg-[#d4af37] text-[#01261a] font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
              : 'text-[#d4af37] hover:text-[#f9e27d]'
            }`}
          >
            Disperse
          </button>
          <button 
            onClick={() => setState(TreeState.TREE_SHAPE)}
            className={`px-4 py-2 uppercase tracking-widest text-xs md:text-sm transition-all duration-500 rounded-full ${
              state === TreeState.TREE_SHAPE 
              ? 'bg-[#d4af37] text-[#01261a] font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
              : 'text-[#d4af37] hover:text-[#f9e27d]'
            }`}
          >
            Assemble
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-[#d4af37] text-xl md:text-2xl luxury-font mb-1">
            {state === TreeState.TREE_SHAPE ? 'Grand Emerald Fir' : 'Stellar Fusion'}
          </h2>
          <p className="text-[#0a5c36] text-[10px] md:text-xs uppercase tracking-[0.5em]">
            A Cinematic Digital Experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
