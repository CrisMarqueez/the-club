import { Home, Users, Gem, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const menuItems = [
    { id: 'lounge', label: 'Lounge', icon: Home },
    { id: 'team', label: 'The Team', icon: Users },
    { id: 'market', label: 'Market', icon: ShoppingCart },
    { id: 'upgrades', label: 'Upgrades', icon: Gem },
    { id: 'coming-soon', label: 'Coming Soon', icon: Star },
];

interface BottomNavProps {
    active: string;
    onSelect: (id: string) => void;
}

export function BottomNav({ active, onSelect }: BottomNavProps) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
            <div className="relative bg-[#1a1f2e]/95 backdrop-blur-xl border border-[#3e4658] rounded-2xl px-2 py-3 flex justify-between items-center shadow-2xl">

                {menuItems.map((item) => {
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            onClick={() => onSelect(item.id)}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-full py-2 transition-all duration-300 group",
                                isActive ? "text-[#d4b483]" : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            {/* Active indicator bar */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute -top-3 w-8 h-1 bg-[#d4b483] rounded-full shadow-[0_0_10px_#d4b483]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <item.icon
                                className={cn(
                                    "w-6 h-6 mb-1 transition-transform group-hover:scale-110",
                                    isActive && "drop-shadow-[0_0_5px_rgba(212,180,131,0.5)]"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className="text-[10px] font-medium tracking-wide uppercase opacity-80 group-hover:opacity-100">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
