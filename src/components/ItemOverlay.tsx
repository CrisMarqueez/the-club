import { motion } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketItem {
    id: string;
    name: string;
    description: string;
    price: number;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    type: 'Booster' | 'Access' | 'Gear';
    imageUrl: string;
}

interface ItemOverlayProps {
    item: MarketItem;
    onClose: () => void;
}

const rarityColors: Record<string, string> = {
    Common: 'text-[#4fd1c5]',
    Rare: 'text-[#a855f7]',
    Epic: 'text-[#d4b483]',
    Legendary: 'text-[#ef4444]',
};

export function ItemOverlay({ item, onClose }: ItemOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0a0b14]/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                className="relative w-full max-w-2xl bg-[#1a1f2e] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20"
                >
                    <X size={20} />
                </button>

                {/* Left Panel: Item Image */}
                <div className="w-full md:w-[45%] aspect-square md:aspect-auto bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center p-12 relative overflow-hidden">
                    <div className={cn(
                        "absolute inset-0 opacity-20 blur-3xl",
                        rarityColors[item.rarity].replace('text-', 'bg-')
                    )} />
                    <div className="w-48 h-48 border-4 border-dashed border-white/10 rounded-full flex items-center justify-center relative z-10">
                        <div className="text-center">
                            <ShoppingCart size={48} className="text-white/20 mx-auto mb-2" />
                            <span className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{item.type}</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Info */}
                <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <span className={cn('text-xs font-bold uppercase tracking-widest', rarityColors[item.rarity])}>
                                {item.rarity}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{item.type}</span>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{item.name}</h2>
                        <p className="text-sm text-white/60 leading-relaxed mb-8">
                            {item.description}
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                <span className="text-white/30">Price</span>
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-5 h-5 rounded-full bg-[#d4b483]/20 flex items-center justify-center border border-[#d4b483]">
                                        <span className="text-[#d4b483] font-black text-[10px]">$</span>
                                    </div>
                                    <span className="text-lg text-[#d4b483]">{item.price.toLocaleString()} $SECRET</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 rounded-xl bg-[#d4b483] text-[#1a1f2e] font-black uppercase tracking-widest hover:bg-[#c4a473] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(212,180,131,0.3)]">
                        Purchase Item
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
