import React, { useContext, useState } from 'react';
import { AppContext } from './App';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContentPages() {
    const { activeNode, setActiveNode } = useContext(AppContext);

    if (activeNode === null) return null;

    const renderContent = () => {
        switch (activeNode) {
            case 0: return <CorePage />;
            case 1: return <ProjectsPage />;
            case 2: return <SkillsPage />;
            case 3: return <ShopPage />;
            default: return null;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed inset-0 z-50 bg-[#0a0a0c] overflow-x-hidden overflow-y-auto text-white"
            >
                {/* Clean Close Header */}
                <div className="sticky top-0 w-full flex justify-end p-4 md:p-8 z-50 pointer-events-none">
                    <button
                        onClick={() => setActiveNode(null)}
                        className="pointer-events-auto bg-white/10 backdrop-blur-md hover:bg-white hover:text-black transition-all p-3 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Content Wrapper */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 pt-4">
                    {renderContent()}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

function CorePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight text-white mb-6">
                About Me.
            </h1>
            <p className="text-xl md:text-2xl text-white/50 font-medium tracking-wide mb-8">
                Roblox Dev • FiveM Scripter • AI Expert
            </p>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-12">
                I build immersive digital experiences, complex scripting systems for FiveM and Roblox, and leverage AI to create next-generation kinetic architectures.
                My goal is to push the boundaries of what is possible within game engines and full-stack web applications.
            </p>
        </div>
    )
}

function ProjectsPage() {
    const [selectedProject, setSelectedProject] = useState(null);

    const projects = [
        { id: 1, title: "FANG PETRO EVENT", subtitle: "Advanced petroleum heist.", cat: "FIVEM", img: "https://i.ibb.co/s95rcyd1/466719216-44af5e7c-a709-4b19-a5bb-9a197f7d923a.png", desc: "A complex script introducing a high-stakes petroleum heist for FiveM servers. It features synced particle effects, custom UI elements for hack minigames, and a highly optimized server-side validation system.", link: null },
        { id: 2, title: "FANG HUD", subtitle: "Modern reactive UI.", cat: "FIVEM", img: "https://i.ibb.co/5XHnYWtQ/466594905-9e6b1af0-f495-45e5-8085-fc2ccf141336.png", desc: "A sleek, highly reactive Heads Up Display for FiveM built using modern web frameworks (React/Tailwind) mapped directly over standard NUI. Ensures zero FPS drop while maintaining complex animations.", link: null },
        { id: 3, title: "TRIVIA PARTY", subtitle: "Multiplayer quiz game.", cat: "ROBLOX", img: "https://tr.rbxcdn.com/180DAY-cd72ad09c37fb4b40fb36ad8d77961bd/256/256/Image/Webp/noFilter", desc: "Fast-paced multiplayer trivia game on the Roblox platform. Integrates advanced datastores, live leaderboards, and seamlessly handles dozens of concurrent players per server.", link: "https://www.roblox.com/games/17395015982/TRIVIA-PARTY" },
        { id: 4, title: "HERMITE INTERPOLATION", subtitle: "Curve smoothing algorithm.", cat: "MATH / ROBLOX", img: "https://i.ibb.co/0pr7gwBQ/Gemini-Generated-Image-jjzl8ojjzl8ojjzl.png", desc: "An open-source implementation of cubic Hermite spline interpolation for smooth camera paths and trajectory estimations inside Roblox. Perfect for cutscenes or custom physics.", link: null }
    ];

    if (selectedProject) {
        return (
            <div className="w-full max-w-4xl mx-auto animate-fade-in relative">
                <button
                    onClick={() => setSelectedProject(null)}
                    className="mb-8 flex items-center text-white/50 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Projects
                </button>

                <div className="w-full aspect-video bg-[#111] rounded-3xl overflow-hidden mb-8 shadow-2xl relative">
                    <img src={selectedProject.img} alt={selectedProject.title} className="w-full h-full object-cover" />
                </div>

                <div className="text-sm font-bold text-[#00F0FF] tracking-widest mb-3 uppercase">{selectedProject.cat}</div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">{selectedProject.title}</h2>
                <p className="text-xl text-white/70 leading-relaxed mb-8">{selectedProject.desc}</p>

                <div className="pt-8 border-t border-white/10">
                    {selectedProject.link ? (
                        <a
                            href={selectedProject.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
                        >
                            Launch Live Project
                        </a>
                    ) : (
                        <button
                            disabled
                            className="inline-flex items-center px-8 py-4 bg-white/5 border border-white/10 text-white/50 font-semibold rounded-xl cursor-not-allowed"
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            Private Code
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full animate-fade-in">
            <div className="mb-16">
                <h2 className="text-4xl font-bold tracking-tight mb-4">Projects</h2>
                <p className="text-white/50 text-xl">Selected works and completed missions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {projects.map((p) => (
                    <div key={p.id} onClick={() => setSelectedProject(p)} className="group cursor-pointer">
                        <div className="w-full aspect-video bg-[#111] rounded-2xl overflow-hidden mb-6 relative shadow-lg">
                            <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

                            {/* Hover "Read More" overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <span className="bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold uppercase tracking-widest text-sm border border-white/20">
                                    View Details
                                </span>
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-[#00F0FF] tracking-wider mb-2 uppercase">{p.cat}</div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">{p.title}</h3>
                        <p className="text-lg text-white/60">{p.subtitle}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SkillsPage() {
    return (
        <div className="w-full max-w-4xl mx-auto py-12">
            <div className="mb-16 text-center">
                <h2 className="text-4xl font-bold tracking-tight mb-4">Arsenal & Skills</h2>
                <p className="text-white/50 text-xl">The tools I use to build the future.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-24">
                {['ROBLOX', 'FIVEM', 'AI / LLM', 'LUA', 'REACT', 'WEBGL', 'NEXT.JS', 'NODE.JS', 'TAILWIND'].map((skill, i) => (
                    <div key={i} className="px-6 py-4 bg-[#111] rounded-xl border border-white/10 text-white font-medium hover:bg-white hover:text-black hover:scale-105 transition-all cursor-default text-lg shadow-lg">
                        {skill}
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-br from-[#8A2BE2]/20 to-transparent p-12 rounded-3xl border border-[#8A2BE2]/30 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8A2BE2]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Ready to start a project?</h3>
                <p className="text-white/60 text-lg mb-8 relative z-10">Reach out to me directly on Discord for work inquiries or collaborations.</p>
                <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 relative z-10">
                    <span className="text-2xl font-bold tracking-wide">e_z_1_o</span>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText('e_z_1_o');
                            alert('Discord tag copied!');
                        }}
                        className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-[#8A2BE2] hover:text-white transition-colors"
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    )
}

function ShopPage() {
    return (
        <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-center animate-fade-in relative overflow-hidden">
            {/* Background elements for depth */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-[500px] h-[500px] bg-[#00FF66] rounded-full blur-[150px] mix-blend-screen" />
            </div>

            <div className="relative z-10 p-12 border border-white/10 bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl max-w-3xl w-full">
                <svg className="w-24 h-24 mx-auto mb-8 text-[#00FF66] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>

                <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tighter text-white mb-6 uppercase">
                    Template <span className="text-[#00FF66]">Market</span>
                </h2>

                <div className="inline-block px-6 py-2 border border-[#00FF66]/50 rounded-full font-mono text-[#00FF66] tracking-widest text-sm mb-8 bg-[#00FF66]/5">
                    STATUS: OFFLINE // UNDER CONSTRUCTION
                </div>

                <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
                    The data exchange protocol is currently being fortified. High-quality FiveM & Roblox asset templates will be available for secure acquisition shortly.
                </p>

                <div className="mt-12 w-full max-w-md mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00FF66] w-1/3 rounded-full animate-pulse blur-[1px]"></div>
                </div>
            </div>
        </div>
    )
}
