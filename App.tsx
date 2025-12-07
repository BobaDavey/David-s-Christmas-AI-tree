import React, { useState } from 'react';
import Scene from './components/Scene';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);

  const toggleState = () => {
    setTreeState((prev) => 
      prev === TreeState.TREE_SHAPE ? TreeState.SCATTERED : TreeState.TREE_SHAPE
    );
  };

  return (
    <div className="relative w-full h-screen">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Scene state={treeState} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-12">
        {/* Header */}
        <header className="text-center md:text-left">
          <h1 className="luxurious-text text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FBF5B7] to-[#BF953F] drop-shadow-lg">
            Merry Christmas
          </h1>
          <h2 className="luxurious-text text-xl md:text-2xl text-emerald-100 tracking-widest mt-2 uppercase opacity-80">
            David's Digital Tree
          </h2>
        </header>

        {/* Footer / Controls */}
        <div className="flex flex-col items-center justify-end pb-8">
           {/* Magic Button */}
           <button 
            onClick={toggleState}
            className="pointer-events-auto group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-emerald-900 rounded-full hover:bg-emerald-800 focus:outline-none focus:ring ring-offset-2 ring-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(4,57,39,0.6)]"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center gap-2 uppercase tracking-widest text-sm">
              {treeState === TreeState.TREE_SHAPE ? 'Scatter Magic' : 'Assemble Tree'}
              <svg 
                className={`w-4 h-4 transition-transform duration-500 ${treeState === TreeState.TREE_SHAPE ? 'rotate-180' : 'rotate-0'}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </span>
          </button>
          
          <p className="mt-4 text-xs text-emerald-400/50 uppercase tracking-widest">
            Interactive 3D Experience
          </p>
        </div>
      </div>
      
      {/* Decorative Border Frame (Optional luxurious touch) */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-[#FFD700] opacity-10 m-4 rounded-xl"></div>
    </div>
  );
};

export default App;
