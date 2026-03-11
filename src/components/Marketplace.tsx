import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import rocketManImg from '@/assets/Characters/TheRocketMan/The RocketMan.png';
import misterGuyImg from '@/assets/Characters/TheMisterGuy/TheMisterGuy.png';
import bossImg from '@/assets/Characters/TheBoss/The Boss.png';
import { CharacterOverlay } from '@/components/CharacterOverlay';
import { useState } from 'react';

/* ── agent data ─────────────────────────────────────────────── */
interface Agent {
    name: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    earning: number;
    image: string;              // placeholder src
    borderColor: string;        // hex for the hexagon glow
    bgGlow: string;             // tailwind bg utility
}

const agents: Agent[] = [
    {
        name: 'The Rocket Man',
        rarity: 'Common',
        earning: 5,
        image: rocketManImg,
        borderColor: '#4fd1c5',
        bgGlow: 'from-[#4fd1c5]/20 to-transparent',
    },
    {
        name: 'The Mister Guy',
        rarity: 'Rare',
        earning: 10,
        image: misterGuyImg,
        borderColor: '#a855f7',
        bgGlow: 'from-[#a855f7]/20 to-transparent',
    },
    {
        name: 'The Boss',
        rarity: 'Epic',
        earning: 20,
        image: bossImg,
        borderColor: '#d4b483',
        bgGlow: 'from-[#d4b483]/20 to-transparent',
    },
];

const rarityColors: Record<string, string> = {
    Common: 'text-[#4fd1c5]',
    Rare: 'text-[#a855f7]',
    Epic: 'text-[#d4b483]',
    Legendary: 'text-[#ef4444]',
};

/* ── hexagon card ───────────────────────────────────────────── */
function HexCard({ agent, index, onClick }: { agent: Agent; index: number; onClick: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12, duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center group cursor-pointer"
            onClick={onClick}
        >
            {/* Hexagon wrapper */}
            <div className="relative flex items-center justify-center transition-all duration-500 w-44 h-48 md:w-52 md:h-56">
                {/* Outer glow */}
                <div
                    className="absolute inset-0 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-full"
                    style={{ background: agent.borderColor }}
                />

                {/* Hexagon SVG clip */}
                <svg viewBox="0 0 200 220" className="absolute inset-0 w-full h-full drop-shadow-lg" preserveAspectRatio="none">
                    <defs>
                        <clipPath id={`hex-clip-${index}`}>
                            <polygon points="100,0 190,55 190,165 100,220 10,165 10,55" />
                        </clipPath>
                    </defs>
                    {/* border stroke */}
                    <polygon
                        points="100,0 190,55 190,165 100,220 10,165 10,55"
                        fill="none"
                        stroke={agent.borderColor}
                        strokeWidth="3"
                        className="transition-all duration-500 group-hover:stroke-[4]"
                        style={{
                            filter: `drop-shadow(0 0 8px ${agent.borderColor})`,
                        }}
                    />
                </svg>

                {/* Inner image area */}
                <div
                    className="absolute inset-[6px]"
                    style={{ clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)' }}
                >
                    <div className={cn(
                        "w-full h-full bg-gradient-to-b flex items-center justify-center",
                        agent.bgGlow,
                        "bg-[#0d1020]"
                    )} />
                </div>

                {/* Character Image (Popped Out) */}
                <img
                    src={agent.image}
                    alt={agent.name}
                    className="absolute z-10 w-[250%] h-[250%] max-w-none md:w-[220%] md:h-[220%] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 pointer-events-none -translate-y-6 md:-translate-y-10"
                    style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))' }}
                />
            </div>

            {/* Label */}
            <div className="mt-3 text-center space-y-1">
                <h3 className="text-base font-bold tracking-wide">
                    {agent.name}{' '}
                    <span className={cn('text-sm font-semibold', rarityColors[agent.rarity])}>
                        ({agent.rarity})
                    </span>
                </h3>
                <p className="text-xs text-gray-400 tracking-widest uppercase">
                    {agent.earning} $SECRET/HOUR
                </p>
            </div>
        </motion.div>
    );
}

/* ── agent profile (top-left) ───────────────────────────────── */
function AgentProfile() {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-6 left-6 z-50"
        >

        </motion.div>
    );
}

/* ── main Marketplace view ──────────────────────────────────── */
export function Marketplace() {
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

    return (
        <motion.div
            key="market"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 flex flex-col items-center justify-center h-full px-4 pb-28 pt-28 overflow-y-auto"
        >
            {/* Decorative lines behind cards */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Cross cyber-lines */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4fd1c5]/20 to-transparent" />
                <div className="absolute top-[35%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#3e4658]/30 to-transparent rotate-[8deg]" />
                <div className="absolute top-[65%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#3e4658]/30 to-transparent -rotate-[8deg]" />
            </div>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-extrabold tracking-[0.2em] uppercase text-center mb-16 md:mb-24 relative -mt-10 md:-mt-16"
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/100">
                    These are your agents
                </span>
                {/* Underline accent */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-[#4fd1c5] to-transparent" />
            </motion.h1>

            {/* Agent Cards Row */}
            <div className="flex flex-wrap justify-center items-end gap-6 md:gap-10 relative z-10">
                {agents.map((agent, index) => (
                    <HexCard key={agent.name} agent={agent} index={index} onClick={() => setSelectedCharacter(agent.name.toLowerCase().replace(/\s+/g, '-'))} />
                ))}
            </div>

            {/* Mint Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative mt-12 px-10 h-[56px] rounded-full border-2 border-[#d4b483] bg-gradient-to-r from-[#d4b483]/20 via-[#d4b483]/10 to-[#d4b483]/20 hover:from-[#d4b483]/30 hover:to-[#d4b483]/30 transition-all duration-300 group overflow-hidden flex items-center justify-center"
            >
                {/* Button glow */}
                <div className="absolute inset-0 bg-[#d4b483]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 text-lg md:text-xl font-extrabold tracking-widest text-[#d4b483] uppercase leading-none mt-[2px]">
                    Mint 3 NFTs – 1 SOL
                </span>
            </motion.button>

            {/* Agent Profile overlay (top-left) */}
            <AgentProfile />

            {/* Character Info Modal */}
            <AnimatePresence>
                {selectedCharacter && (
                    <CharacterOverlay
                        characterId={selectedCharacter}
                        onClose={() => setSelectedCharacter(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
