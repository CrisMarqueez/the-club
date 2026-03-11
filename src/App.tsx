import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { BalancePanel } from '@/components/BalancePanel';
import { GameMap } from '@/components/GameMap';
import { Marketplace } from '@/components/Marketplace';
import { ItemMarket } from '@/components/ItemMarket';
import { ChatLog } from '@/components/ChatLog';

function App() {
    const [activeTab, setActiveTab] = useState('lounge');

    return (
        <div className="relative w-full h-screen bg-[#0a0b14] overflow-hidden text-white font-sans selection:bg-[#d4b483]/30">

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#4fd1c5]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#d4b483]/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2f3e_1px,transparent_1px),linear-gradient(to_bottom,#2a2f3e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            {/* Page Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'lounge' && (
                    <GameMap key="lounge" />
                )}

                {activeTab === 'team' && (
                    <Marketplace key="team" />
                )}

                {activeTab === 'market' && (
                    <ItemMarket key="market" />
                )}

                {activeTab !== 'lounge' && activeTab !== 'team' && activeTab !== 'market' && (
                    <motion.main
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="relative z-10 flex flex-col items-center justify-center h-full"
                    >
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 tracking-tight">
                                CYBER<span className="text-[#d4b483]">VERSE</span>
                            </h1>
                            <p className="text-gray-400 max-w-md mx-auto capitalize">
                                {activeTab.replace('-', ' ')}
                            </p>
                        </div>
                    </motion.main>
                )}
            </AnimatePresence>

            {/* UI Overlays */}
            <BalancePanel activeTab={activeTab} />
            {activeTab === 'lounge' && <ChatLog />}
            <BottomNav active={activeTab} onSelect={setActiveTab} />
        </div>
    );
}

export default App;
