function CircularProgress({ percent = 75, label }: { percent: number; label: string }) {
    const radius = 21;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="transparent"
                    stroke="#2a2f3e"
                    strokeWidth="3"
                />
                {/* Progress circle */}
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="transparent"
                    stroke="#4fd1c5"
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_#4fd1c5]"
                />
            </svg>
            {/* Label inside */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[7px] font-extrabold text-[#4fd1c5] tracking-[0.15em]">{label}</span>
            </div>
        </div>
    );
}

export function BalancePanel({ activeTab }: { activeTab?: string }) {
    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col items-end space-y-2 font-sans">

            {/* Main Stats Panel */}
            <div className="bg-[#1a1f2e]/90 backdrop-blur-md border border-[#3e4658] rounded-lg p-3 flex items-center space-x-4 shadow-2xl relative overflow-hidden">
                {/* Glow effect at corners */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#d4b483]/10 to-transparent blur-xl pointer-events-none" />

                {/* Left Section: Balance & Claim */}
                <div className="flex flex-col space-y-2.5">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-[#d4b483]/20 flex items-center justify-center border border-[#d4b483]">
                            <span className="text-[#d4b483] font-bold text-[10px]">$</span>
                        </div>
                        <span className="text-sm font-bold text-white tracking-wider">$SECRET: <span className="text-[#d4b483]">15,224</span></span>
                    </div>

                    {activeTab === 'lounge' && (
                        <button className="relative overflow-hidden group px-4 py-1.5 rounded-full border border-[#d4b483]/50 bg-[#d4b483]/10 hover:bg-[#d4b483]/20 transition-all duration-300">
                            <span className="relative z-10 text-[9px] font-bold text-[#d4b483] tracking-widest uppercase">Claim $SECRET</span>
                            <div className="absolute inset-0 bg-[#d4b483]/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    )}
                </div>

                {/* Right Section: Progress Gauge */}
                <div className="border-l border-[#3e4658] pl-4">
                    <CircularProgress percent={65} label="SOLANA" />
                    <div className="mt-1 text-center">
                        <div className="text-[9px] text-gray-400">Next Payout</div>
                    </div>
                </div>
            </div>

            {/* Secondary Tag: Solana Balance */}
            <div className="bg-[#0f1219]/90 backdrop-blur border border-[#2a2f3e] rounded-md px-2 py-1 flex items-center space-x-1.5 shadow-lg">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">SOLANA</span>
                <span className="text-[11px] font-bold text-white tracking-wide">0.98 SOL</span>
            </div>

        </div>
    );
}
