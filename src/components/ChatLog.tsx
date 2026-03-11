import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatLine {
    id: number;
    tag: string;
    text: string;
    isSystem: boolean;
    color?: string;
}

const CHARACTERS = [
    {
        name: 'The Boss', color: 'text-purple-400', messages: [
            "My crown just detected a jackpot on the roulette!",
            "Upgrade fees have been adjusted. Enjoy.",
            "No one enters the VIP Room without my authorization.",
            "The Club's profit rose 15% in the last hour.",
            "Who left the Lounge lights on?"
        ]
    },
    {
        name: 'The Rocket Man', color: 'text-orange-400', messages: [
            "The burn mechanism is active. Deflation ahead 🔥",
            "X SOL suit is at 100% efficiency.",
            "I designed this club to be eternal.",
            "New thrusters installed in the betting sector.",
            "We are on course for the Moon 🚀"
        ]
    },
    {
        name: 'The Mister Guy', color: 'text-blue-400', messages: [
            "Transaction flow detected. Mint processed successfully.",
            "Saw an epic rarity entering the pipeline...",
            "$SECRET sent to the vault. No traces.",
            "Code optimized. Bugs eliminated.",
            "Monitoring the network... everything is stable."
        ]
    }
];

const USER_MESSAGES = [
    "WIN! The roulette gave me 500 $SECRET!",
    "Does anyone know where the Architect is?",
    "This club layout is amazing.",
    "Feedback: we need more card games!",
    "The Club is the best Web3 economy I've ever seen.",
    "Just doubled my balance in the Lounge!",
    "Anyone else accumulating $SECRET?",
    "Support feedback was super fast.",
    "Let's bet everything on Rocket!",
    "The vibe here is insane today.",
    "Just got a rare item!",
    "How do I get to the VIP?"
];

export function ChatLog() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [lines, setLines] = useState<ChatLine[]>([
        { id: Date.now(), tag: 'System', text: 'Welcome to The Club!', isSystem: true }
    ]);

    useEffect(() => {
        const addMessage = () => {
            const isCharacter = Math.random() > 0.4;
            let newMessage: ChatLine;

            if (isCharacter) {
                const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                newMessage = {
                    id: Date.now(),
                    tag: char.name,
                    text: char.messages[Math.floor(Math.random() * char.messages.length)],
                    isSystem: false,
                    color: char.color
                };
            } else {
                newMessage = {
                    id: Date.now(),
                    tag: 'User',
                    text: USER_MESSAGES[Math.floor(Math.random() * USER_MESSAGES.length)],
                    isSystem: false
                };
            }

            setLines(prev => [...prev.slice(-19), newMessage]);
        };

        const interval = setInterval(addMessage, 3000 + Math.random() * 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="fixed bottom-32 left-4 right-4 md:left-6 md:bottom-60 md:right-auto md:w-[350px] z-[60]"
        >
            <div
                ref={scrollRef}
                className="glass-panel rounded-xl p-3 space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3e4658] scrollbar-track-transparent scroll-smooth"
            >
                <AnimatePresence initial={false}>
                    {lines.map((line) => (
                        <motion.p
                            key={line.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[11px] leading-relaxed"
                        >
                            <span className={cn(
                                'font-bold mr-1',
                                line.isSystem ? 'text-[#4fd1c5]' : (line.color || 'text-[#d4b483]')
                            )}>
                                [{line.tag}]:
                            </span>
                            <span className="text-gray-300">{line.text}</span>
                        </motion.p>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
