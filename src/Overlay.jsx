import React, { useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppContext } from './App.jsx'

export default function Overlay() {
    const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useContext(AppContext)

    // Calculate total price based on string '€4.99' parsed to float
    const total = cart.reduce((acc, item) => acc + parseFloat(item.price.replace('€', '')), 0).toFixed(2)

    const handleCheckout = () => {
        // Directs to Stripe Payment Link / Checkout
        alert("STRIPE INTEGRATION COMING SOON.\nThe payment gateway is currently in development.");
        // window.location.href = "https://buy.stripe.com/test_xxxxxxxx"
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-50">

            {/* Cartesian / Cart Toggle Button (Top Right) */}
            <div className="absolute top-8 right-8 pointer-events-auto">
                <button
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="group flex items-center gap-3 bg-[#010103]/80 border border-white/20 backdrop-blur-md px-6 py-3 hover:border-[#00FF66] transition-colors"
                >
                    <span className="relative flex h-2 w-2">
                        {cart.length > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75"></span>}
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF66]"></span>
                    </span>
                    <span className="font-sans text-[10px] tracking-[0.3em] font-light text-white uppercase group-hover:text-[#00FF66] transition-colors">
                        Payload [{cart.length}]
                    </span>
                </button>
            </div>

            {/* Diégétique Cart Sidebar (Data Manifest) */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                        />

                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
                            className="absolute top-0 right-0 w-full md:w-[450px] h-full bg-[#010103]/90 border-l border-white/10 backdrop-blur-xl p-8 pointer-events-auto flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-6">
                                <div>
                                    <h2 className="font-display text-4xl text-white font-light tracking-tighter">Data <span className="font-serif italic text-[#00FF66]">Manifest</span></h2>
                                    <p className="font-mono text-[10px] text-white/40 tracking-widest mt-2 uppercase">Secure Cart Protocol</p>
                                </div>
                                <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                                        <div className="w-16 h-16 border border-dashed border-white/30 rounded-full flex items-center justify-center mb-4">
                                            <div className="w-2 h-2 bg-white/30 rounded-full" />
                                        </div>
                                        <p className="font-sans text-[10px] tracking-[0.3em] text-white uppercase">No assets acquired</p>
                                    </div>
                                ) : (
                                    cart.map((item, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                            key={item.id + i}
                                            className="group relative bg-white/[0.02] border border-white/10 p-4 flex justify-between items-center hover:bg-white/[0.05] transition-colors"
                                        >
                                            <div className="absolute left-0 top-0 w-1 h-full bg-[#00FF66] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div>
                                                <h3 className="font-sans text-sm font-light text-white mb-1">{item.title}</h3>
                                                <p className="font-mono text-[11px] text-[#00FF66]">{item.price}</p>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-[#FF3366] text-xs font-mono uppercase tracking-widest transition-colors">
                                                [ Remove ]
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="pt-8 border-t border-white/10 mt-auto">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/50">Total allocation</span>
                                        <span className="font-display text-3xl font-light text-white">€{total}</span>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-[#00FF66] hover:bg-[#00cc55] text-black font-sans font-bold text-xs tracking-[0.3em] uppercase py-5 transition-colors relative overflow-hidden"
                                    >
                                        Checkout (Coming Soon)
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    )
}
