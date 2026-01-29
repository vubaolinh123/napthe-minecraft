'use client';

interface DashboardHeaderProps {
    title?: string;
    subtitle?: string;
}

export default function DashboardHeader({
    title = "Minecraft Server",
    subtitle = "Dashboard Thống Kê Nạp Tiền"
}: DashboardHeaderProps) {
    return (
        <header className="glass-card mb-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Logo & Title */}
                <div className="flex items-center gap-4">
                    {/* Minecraft-style cube icon */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 minecraft-block">
                        <span className="text-2xl sm:text-3xl">⛏️</span>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                            {title}
                        </h1>
                        <p className="text-sm text-gray-400">{subtitle}</p>
                    </div>
                </div>

                {/* Server Status Badge */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-emerald-400 font-medium">Server Online</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
