import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface CharacterOverlayProps {
    characterId: string | null;
    onClose: () => void;
}

import bossImg from '@/assets/Characters/TheBoss/The Boss.png';
import misterGuyImg from '@/assets/Characters/TheMisterGuy/TheMisterGuy.png';
import rocketManImg from '@/assets/Characters/TheRocketMan/The RocketMan.png';
import novaImg from '@/assets/character-sprite.png'; // Using sprite as placeholder for Nova

// Mocked character database
const CHARACTERS_DB: Record<string, any> = {
    'boss': {
        id: 'boss', name: 'The Boss', influence: 68881, generationInfluence: 0,
        rarity: 'EPIC', secretRate: 20.0, roles: ['tactical', 'support', 'intel'],
        imageUrl: bossImg,
        origin: 'Former ruler of a decentralized community that survived countless cyber attacks.',
        roleDescription: 'Governance and High Leadership.',
        lore: 'While the Architect builds the walls and Spectrum watches the shadows, the Empress dictates the rules. She holds the governance tablet that decides the fate of upgrade fees and access to VIP Rooms. Her data crown is not an ornament, but a terminal for direct access to "The House", allowing her to see every bet made on the internal roulette.'
    },
    'the-boss': {
        id: 'the-boss', name: 'The Boss', influence: 68881, generationInfluence: 0,
        rarity: 'EPIC', secretRate: 20.0, roles: ['tactical', 'support', 'intel'],
        imageUrl: bossImg,
        origin: 'Former ruler of a decentralized community that survived countless cyber attacks.',
        roleDescription: 'Governance and High Leadership.',
        lore: 'While the Architect builds the walls and Spectrum watches the shadows, the Empress dictates the rules. She holds the governance tablet that decides the fate of upgrade fees and access to VIP Rooms. Her data crown is not an ornament, but a terminal for direct access to "The House", allowing her to see every bet made on the internal roulette.'
    },
    'the-rocket-man': {
        id: 'the-rocket-man', name: 'The Rocket Man', influence: 12500, generationInfluence: 5,
        rarity: 'COMMON', secretRate: 5.0, roles: ['tactical'],
        imageUrl: rocketManImg,
        origin: 'A systems engineer obsessed with the colonization of new economic systems, rising from the ashes of Web2.',
        roleDescription: 'Strategist and Economic Engineer.',
        lore: 'Modeled under the philosophy of extreme efficiency, the Architect designed "The Club" to be a self-sustaining machine. He believes that real freedom only exists in a system where inflation is fought with fire (burn mechanisms). His "X SOL" tactical suit is not just fashion, it is a war uniform against traditional financial systems.'
    },
    'the-mister-guy': {
        id: 'the-mister-guy', name: 'The Mister Guy', influence: 42000, generationInfluence: 12,
        rarity: 'RARE', secretRate: 10.0, roles: ['intel', 'support'],
        imageUrl: misterGuyImg,
        origin: 'Former signals intelligence specialist for a megacorporation that collapsed in the "Great Dump" of 2024.',
        roleDescription: 'Infiltration and Data Collection.',
        lore: 'Spectrum does not see the physical world; his technical visor processes the blockchain transaction flow in real time. He is responsible for ensuring that passively generated $SECRET reaches the correct addresses without leaving traces.'
    },
    'agent-nova': {
        id: 'agent-nova', name: 'Agent Nova', influence: 35000, generationInfluence: 20,
        rarity: 'HIGH RARITY', secretRate: 12.5, roles: ['tactical', 'intel'],
        imageUrl: novaImg,
        origin: 'Unknown. Surfaced after a critical error on the Solana network.',
        roleDescription: 'Protocol Guarantee and Digital Defense.',
        lore: 'Nova is a digital entity that took physical form. She processes data at superhuman speeds, anticipating threats before they are even executed in code.'
    },
};

export function CharacterOverlay({ characterId, onClose }: CharacterOverlayProps) {
    // Note: The parent should wrap this component in <AnimatePresence>

    // Choose character data
    const data = CHARACTERS_DB[characterId || 'boss'] || CHARACTERS_DB['boss'];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto"
        >
            {/* Backdrop Blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Container with Perimeter Highlight Glow */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40, filter: 'blur(10px)' }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="relative w-full max-w-[720px] aspect-[16/9] flex p-[1.5px] rounded-2xl bg-gradient-to-br from-[#4fd1c5]/40 via-[#d4b483]/10 to-[#4fd1c5]/40 shadow-[0_0_40px_rgba(79,209,197,0.15)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex w-full h-full rounded-[calc(1rem-1.5px)] bg-gradient-to-br from-[#10131d]/98 to-[#0a0c10]/98 relative overflow-hidden">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20"
                    >
                        <X size={20} />
                    </button>

                    {/* Left Panel: Character Portrait & Progress Bars */}
                    <div className="w-[35%] h-full relative border-r border-white/5 flex flex-col justify-between p-10">
                        {/* Background glow for character */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4fd1c5]/10 blur-[80px] rounded-full pointer-events-none" />

                        {/* Large Character Render */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[300%] pointer-events-none drop-shadow-2xl flex justify-center">
                            <img
                                src={data.imageUrl}
                                alt={data.name}
                                className="w-full h-auto object-cover object-top"
                                style={{
                                    imageRendering: 'pixelated'
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Panel: Stats Card & Actions */}
                    <div className="w-[75%] h-full p-6 flex flex-col relative">

                        {/* The Glassmorphic Modal Inner Card */}
                        <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-inner relative overflow-hidden flex flex-col p-6 z-10">
                            {/* Inner ambient glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4fd1c5]/5 to-transparent pointer-events-none" />

                            {/* Corner brackets */}
                            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#4fd1c5] rounded-tl opacity-80" />
                            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#4fd1c5] rounded-tr opacity-80" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#4fd1c5] rounded-bl opacity-80" />
                            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#4fd1c5] rounded-br opacity-80" />

                            <h3 className="text-lg font-bold text-white tracking-widest uppercase mb-4">
                                {data.name} - {data.rarity}
                            </h3>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase tracking-widest text-[#4fd1c5]/70 font-bold">Origin</span>
                                        <p className="text-xs text-white/80 leading-relaxed font-medium">{data.origin}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase tracking-widest text-[#4fd1c5]/70 font-bold">Role</span>
                                        <p className="text-xs text-white/80 leading-relaxed font-semibold">{data.roleDescription}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase tracking-widest text-[#4fd1c5]/70 font-bold">Lore</span>
                                        <p className="text-[11px] text-white/60 leading-relaxed italic line-clamp-4 hover:line-clamp-none transition-all duration-300">"{data.lore}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
