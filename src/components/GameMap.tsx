import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gameMapImg from '@/assets/game-map.png';
import { CharacterOverlay } from '@/components/CharacterOverlay';

const FOREGROUND_OCCLUDERS = [
    // Parede interna esquerda (frente do corredor)
    'polygon(21.5% 42.5%, 33% 49.2%, 39.5% 45.5%, 28.2% 38.9%)',
    // Parede interna direita (frente do corredor)
    'polygon(60.5% 45.6%, 67% 49.3%, 78.5% 42.6%, 72% 38.9%)',
    // Parede frontal central (entrada do salão inferior)
    'polygon(39.5% 45.8%, 60.5% 45.8%, 67% 49.3%, 33% 49.3%)',
    // Molduras de porta centrais para reforçar profundidade
    'polygon(45.8% 39.6%, 47.9% 40.8%, 48.8% 40.2%, 46.7% 39%)',
    'polygon(52.1% 40.8%, 54.2% 39.6%, 53.3% 39%, 51.2% 40.2%)',
];

export function GameMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

    return (
        <motion.div
            key="game-map"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center z-10"
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[70%] h-[60%] bg-[#4fd1c5]/10 blur-[100px] rounded-full" />
                <div className="absolute w-[50%] h-[40%] bg-[#d4b483]/8 blur-[80px] rounded-full" />
            </div>

            {/* Map Container */}
            <div className="relative w-full h-full flex flex-col items-center justify-center px-4 pb-28 gap-2">

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="relative z-20 text-center w-full mb-4"
                >
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        THE <span className="text-[#d4b483]">CLUB</span>
                    </h2>
                    <div className="mt-2 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-[#d4b483]/60 to-transparent" />
                </motion.div>

                {/* Map Image */}
                <motion.div
                    ref={mapRef}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative max-w-3xl w-full"
                >
                    {/* Corner decorations */}
                    <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-[#d4b483]/60 rounded-tl z-10" />
                    <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-[#d4b483]/60 rounded-tr z-10" />
                    <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-[#d4b483]/60 rounded-bl z-10" />
                    <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-[#d4b483]/60 rounded-br z-10" />

                    {/* Outer glow ring */}
                    <div className="absolute inset-0 rounded-xl ring-1 ring-[#d4b483]/20 shadow-[0_0_60px_rgba(79,209,197,0.15),inset_0_0_40px_rgba(0,0,0,0.4)] z-10 pointer-events-none" />

                    <img
                        src={gameMapImg}
                        alt="Game Map - The Club"
                        className="w-full h-auto object-contain rounded-xl"
                        draggable={false}
                    />

                    {/* Foreground occlusion */}
                    {FOREGROUND_OCCLUDERS.map((clipPath, index) => (
                        <img
                            key={`fg-occluder-${index}`}
                            src={gameMapImg}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-contain rounded-xl z-30 pointer-events-none select-none"
                            style={{ clipPath }}
                            draggable={false}
                        />
                    ))}
                </motion.div>

                {/* Controls hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-[10px] text-white/30 tracking-widest uppercase mt-4"
                >
                </motion.p>
            </div>

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
