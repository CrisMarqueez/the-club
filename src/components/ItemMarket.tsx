import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ItemOverlay } from '@/components/ItemOverlay';

// Mocked item images (using placeholders/icons for now as I don't have item assets yet)
// In a real scenario, these would be imported from @/assets/Items/...
const PLACEHOLDER_IMG = "https://emerald-direct-guanaco-120.mypinata.cloud/ipfs/QmZ8y1J8zXWd8Y8zvXz9z8z8z8z8z8z8z8z8z8z8z8z8";

interface MarketItem {
    id: string;
    name: string;
    description: string;
    price: number;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    type: 'Booster' | 'Access' | 'Gear';
    imageUrl: string;
}

const MARKET_ITEMS: MarketItem[] = [
    {
        id: 'neon-booster',
        name: 'Neon XP Booster',
        description: 'Increases $SECRET generation by 25% for 24 hours. Powered by high-octane cyber-fuel.',
        price: 500,
        rarity: 'Common',
        type: 'Booster',
        imageUrl: PLACEHOLDER_IMG
    },
    {
        id: 'vip-card',
        name: 'VIP Access Card',
        description: 'Grants permanent access to the hidden High Roller Lounge and exclusive betting pools.',
        price: 5000,
        rarity: 'Epic',
        type: 'Access',
        imageUrl: PLACEHOLDER_IMG
    },
    {
        id: 'data-scrubber',
        name: 'Data Scrubber v2',
        description: 'Reduces transaction fees by 10%. Essential for covert operations in the Cyberverse.',
        price: 1200,
        rarity: 'Rare',
        type: 'Gear',
        imageUrl: PLACEHOLDER_IMG
    },
    {
        id: 'quantum-core',
        name: 'Quantum Core',
        description: 'A legendary power source. Reduces upgrade cooldowns by 50%. Extremely rare find.',
        price: 15000,
        rarity: 'Legendary',
        type: 'Gear',
        imageUrl: PLACEHOLDER_IMG
    }
];

const rarityColors: Record<string, string> = {
    Common: 'text-[#4fd1c5]',
    Rare: 'text-[#a855f7]',
    Epic: 'text-[#d4b483]',
    Legendary: 'text-[#ef4444]',
};

export function ItemMarket() {
    const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center h-full px-4 pb-32 pt-28 overflow-y-auto w-full"
        >
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-black tracking-widest uppercase mb-12"
            >
                Market<span className="text-[#d4b483]">place</span>
            </motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
                {MARKET_ITEMS.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedItem(item)}
                        className="group relative cursor-pointer"
                    >
                        <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300">
                            {/* Rarity Flare */}
                            <div className={cn(
                                "absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                                rarityColors[item.rarity].replace('text-', 'border-').replace('[#', '[#').replace(']', ']/30'),
                                rarityColors[item.rarity],
                                "bg-black/40"
                            )}>
                                {item.rarity}
                            </div>

                            {/* Item Image Placeholder */}
                            <div className="aspect-square rounded-xl bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center mb-4 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[#d4b483]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-20 h-20 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center">
                                    <span className="text-white/20 font-bold uppercase tracking-tighter text-xs">{item.type}</span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#d4b483] transition-colors">{item.name}</h3>
                            <p className="text-xs text-white/50 mb-4 line-clamp-2">{item.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 rounded-full bg-[#d4b483]/20 flex items-center justify-center border border-[#d4b483]">
                                        <span className="text-[#d4b483] font-bold text-[8px]">$</span>
                                    </div>
                                    <span className="text-sm font-bold text-[#d4b483]">{item.price.toLocaleString()}</span>
                                </div>
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Buy Now</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedItem && (
                    <ItemOverlay
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
