import React, { Suspense, useEffect, useRef, useState, createContext } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import Scene from './Scene.jsx'
import Overlay from './Overlay.jsx'
import ContentPages from './ContentPages.jsx'
import { motion, AnimatePresence } from 'framer-motion'

export const AppContext = createContext()

export default function App() {
    const [activeNode, setActiveNode] = useState(null)
    const [cart, setCart] = useState([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const mouseLerp = useRef({ x: 0, y: 0 })

    const addToCart = (product) => {
        setCart(prev => {
            if (prev.find(p => p.id === product.id)) return prev;
            return [...prev, product]
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(p => p.id !== id))
    }

    useEffect(() => {
        const disableRightClick = (e) => e.preventDefault()
        window.addEventListener('contextmenu', disableRightClick)

        return () => {
            window.removeEventListener('contextmenu', disableRightClick)
        }
    }, [])

    return (
        <AppContext.Provider value={{ activeNode, setActiveNode, mouseLerp, cart, addToCart, removeFromCart, isCartOpen, setIsCartOpen }}>

            <Overlay />
            <ContentPages />

            {/* Accueil Button visible only when inside a node */}
            <AnimatePresence>
                {activeNode !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 w-full flex justify-center z-[100] pointer-events-none"
                    >
                        <button
                            onClick={() => setActiveNode(null)}
                            className="pointer-events-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black hover:scale-105 text-white font-bold tracking-widest uppercase transition-all shadow-2xl rounded-xl"
                        >
                            Accueil
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="canvas-container">
                <Canvas
                    frameloop={activeNode === null ? "always" : "demand"}
                    gl={{ antialias: false, powerPreference: "high-performance" }}
                    dpr={[1, 1.5]}
                    camera={{ position: [0, 0, 55], fov: 45 }}
                >
                    <color attach="background" args={["#010103"]} />
                    <fog attach="fog" args={['#010103', 40, 150]} />

                    <Suspense fallback={null}>
                        <Scene mouseLerp={mouseLerp} activeNode={activeNode} setActiveNode={setActiveNode} addToCart={addToCart} />
                        <DynamicPostProcessing />
                        <Environment preset="night" />
                    </Suspense>
                </Canvas>
            </div>

        </AppContext.Provider>
    )
}

function DynamicPostProcessing() {
    return (
        <EffectComposer disableNormalPass multisampling={0}>
            <Bloom
                luminanceThreshold={0.4}
                luminanceSmoothing={0.3}
                mipmapBlur
                intensity={1.2}
                radius={0.4}
                blendFunction={BlendFunction.SCREEN}
            />
            <Vignette offset={0.5} darkness={0.7} blendFunction={BlendFunction.NORMAL} />
            <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
        </EffectComposer>
    )
}
