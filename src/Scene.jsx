import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars, Text, Float } from '@react-three/drei'
import * as THREE from 'three'

// More focused arrangement, almost like a cross or semi-circle of interest
const NODES = [
    { id: 0, position: [0, 0, 0], label: "ABOUT ME", color: "#FFD700", size: 4.5, type: 'sun' },
    { id: 1, position: [-25, 12, -20], label: "PROJECTS", color: "#00F0FF", size: 3.5, type: 'pulsar' },
    { id: 2, position: [25, 10, -30], label: "SKILLS & CONTACT", color: "#8A2BE2", size: 5, type: 'blackhole' },
    { id: 3, position: [0, -25, -40], label: "SHOP / TEMPLATES", color: "#00FF66", size: 3.0, type: 'pulsar' }
]

function Meteorites() {
    const count = 400
    const meshRef = useRef()
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const u = Math.random() * Math.PI * 2
            const v = Math.random() * Math.PI * 2
            const R = 60 + Math.random() * 100
            const r = Math.random() * 15

            const x = (R + r * Math.cos(v)) * Math.cos(u)
            const y = (Math.random() - 0.5) * 8
            const z = (R + r * Math.cos(v)) * Math.sin(u)

            temp.push({
                x, y, z,
                scale: Math.random() * 0.6 + 0.1,
                speed: Math.random() * 0.1 + 0.01,
                axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
                angle: Math.random() * Math.PI * 2
            })
        }
        return temp
    }, [])

    useFrame((state) => {
        particles.forEach((p, i) => {
            const t = state.clock.elapsedTime
            p.angle += p.speed * 0.001
            const dist = Math.sqrt(p.x * p.x + p.z * p.z)
            const currentX = Math.cos(p.angle) * dist
            const currentZ = Math.sin(p.angle) * dist

            dummy.position.set(currentX, p.y + Math.sin(t * p.speed + i), currentZ)
            dummy.quaternion.setFromAxisAngle(p.axis, t * p.speed)
            dummy.scale.setScalar(p.scale)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
                color="#08080C" roughness={0.2} metalness={1.0} transmission={1.0} thickness={2.5} ior={2.5} transparent opacity={0.9}
            />
        </instancedMesh>
    )
}

function Astrolabe3D({ activeNode }) {
    const groupRef = useRef()

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.x += delta * 0.01
            groupRef.current.rotation.y += delta * 0.02
            // Fade out tracking rings when inside a node
            const scaleTarget = activeNode === null ? 1 : 0.001
            groupRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.02)
        }
    })

    return (
        <group ref={groupRef} position={[0, -20, -20]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[80, 0.05, 16, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
            </mesh>
            <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                <torusGeometry args={[115, 0.05, 16, 100]} />
                <meshBasicMaterial color="#00FFFF" transparent opacity={0.05} />
            </mesh>
        </group>
    )
}


function MainTitle({ activeNode }) {
    const groupRef = useRef()

    useFrame(() => {
        if (groupRef.current) {
            const scaleT = activeNode === null ? 1 : 0.01
            groupRef.current.scale.lerp(new THREE.Vector3(scaleT, scaleT, scaleT), 0.04)
        }
    })

    return (
        <group ref={groupRef} position={[0, 20, -10]} visible={activeNode === null}>
            <Text position={[0, 0, 0]} fontSize={5} letterSpacing={0.3} color="#ffffff">
                EZIO.DEV
                <meshStandardMaterial attach="material" color="#ffffff" roughness={0.1} metalness={0.8} />
            </Text>
            <Text position={[0, -3.5, 0]} fontSize={0.6} letterSpacing={0.6} color="#00FFFF">
                SELECT A NODE TO EXPLORE
                <meshBasicMaterial attach="material" color="#00FFFF" transparent opacity={0.7} />
            </Text>
        </group>
    )
}

export default function Scene({ mouseLerp, activeNode, setActiveNode }) {
    const { mouse } = useThree()

    const cameraPosTarget = useRef(new THREE.Vector3(0, 0, 55))
    const cameraLookTarget = useRef(new THREE.Vector3(0, 0, 0))

    useFrame((state) => {
        // Cinematic inertia
        mouseLerp.current.x = THREE.MathUtils.lerp(mouseLerp.current.x, mouse.x, 0.05)
        mouseLerp.current.y = THREE.MathUtils.lerp(mouseLerp.current.y, mouse.y, 0.05)

        const mx = mouseLerp.current.x
        const my = mouseLerp.current.y

        if (activeNode === null) {
            // Very wide cinematic view of the system
            cameraPosTarget.current.set(mx * 15, my * 10, 65)
            cameraLookTarget.current.set(mx * 3, my * 3, 0)
        } else {
            const node = NODES.find(n => n.id === activeNode)
            if (node) {
                // Warp directly to the face of the node's geometry
                const approachDistance = Math.max(35, node.size * 8) // Pull back significantly to see UI
                cameraPosTarget.current.set(node.position[0] + mx * 5, node.position[1] + my * 5, node.position[2] + approachDistance)
                // Look slightly above the center of the node for better UI framing
                cameraLookTarget.current.set(node.position[0], node.position[1] + 2, node.position[2])
            }
        }

        state.camera.position.lerp(cameraPosTarget.current, 0.02)
        const currentLookAt = new THREE.Vector3().setFromMatrixColumn(state.camera.matrixWorld, 2).multiplyScalar(-1).add(state.camera.position)
        currentLookAt.lerp(cameraLookTarget.current, 0.03)
        state.camera.lookAt(currentLookAt)
    })

    return (
        <group>
            <ambientLight intensity={0.1} />
            <spotLight position={[0, 0, 0]} intensity={3} color="#FFE5B4" distance={200} decay={1.5} />

            <Astrolabe3D activeNode={activeNode} />
            <MainTitle activeNode={activeNode} />

            <Stars radius={150} depth={80} count={12000} factor={5} saturation={1} fade speed={1} />
            <Meteorites />

            {NODES.map(node => (
                <PlanetaryNode
                    key={node.id}
                    node={node}
                    isActive={activeNode === node.id}
                    onSelect={() => setActiveNode(node.id)}
                />
            ))}
        </group>
    )
}

function PlanetaryNode({ node, isActive, onSelect }) {
    const pointsRef = useRef()
    const diskRef = useRef()
    const PARTICLES = node.type === 'blackhole' ? 4000 : 2000

    const { spherePos, targetPos, randoms } = useMemo(() => {
        const arrS = new Float32Array(PARTICLES * 3)
        const arrT = new Float32Array(PARTICLES * 3)
        const arrR = new Float32Array(PARTICLES * 3)

        for (let i = 0; i < PARTICLES; i++) {
            const r = node.size * (0.8 + Math.random() * 0.2)
            const u = Math.random() * Math.PI * 2
            const v = Math.acos(Math.random() * 2 - 1)

            arrS[i * 3] = r * Math.sin(v) * Math.cos(u)
            arrS[i * 3 + 1] = r * Math.sin(v) * Math.sin(u)
            arrS[i * 3 + 2] = r * Math.cos(v)

            let tx, ty, tz;
            if (node.type === 'sun') {
                const rad = node.size * 2 + Math.random() * 30
                const flareU = Math.random() * Math.PI * 2
                tx = Math.cos(flareU) * rad
                ty = (Math.random() - 0.5) * 5
                tz = Math.sin(flareU) * rad
            } else if (node.type === 'pulsar') {
                const isTop = Math.random() > 0.5 ? 1 : -1
                const height = Math.random() * 40
                const spread = height * 0.3 * Math.random()
                const th = Math.random() * Math.PI * 2
                tx = Math.cos(th) * spread
                ty = height * isTop
                tz = Math.sin(th) * spread
            } else {
                const rad = node.size * 2 + Math.pow(Math.random(), 2) * 50
                const th = Math.random() * Math.PI * 2
                tx = Math.cos(th) * rad
                ty = (Math.random() - 0.5) * (rad * 0.1)
                tz = Math.sin(th) * rad
            }

            arrT[i * 3] = tx
            arrT[i * 3 + 1] = ty
            arrT[i * 3 + 2] = tz
            arrR[i * 3] = Math.random()
        }
        return { spherePos: arrS, targetPos: arrT, randoms: arrR }
    }, [node])

    const uniforms = useRef({
        uTransition: { value: isActive ? 1 : 0 },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(node.color) }
    })

    const particleMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: uniforms.current,
        vertexShader: `
      uniform float uTransition;
      uniform float uTime;
      attribute vec3 aTarget;
      attribute vec3 aRandom;
      varying float vTransition;
      varying float vHeat;
      void main() {
         float explosionPhase = (1.0 - pow(abs(uTransition - 0.5) * 2.0, 2.0));
         vec3 pos = position;
         float cF = cos(uTime * 0.1); float sF = sin(uTime * 0.1);
         pos.xz = mat2(cF, sF, -sF, cF) * pos.xz;
         vec3 tar = aTarget;
         float dist = length(tar.xz);
         float angle = uTime * (5.0 / (dist + 1.0)); 
         float cT = cos(angle); float sT = sin(angle);
         tar.xz = mat2(cT, sT, -sT, cT) * tar.xz;
         vec3 finalPos = mix(pos, tar, uTransition);
         finalPos += normalize(finalPos + 0.001) * explosionPhase * 25.0 * aRandom.x;
         vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
         float pulse = sin(uTime * 5.0 + aRandom.x * 100.0) * 0.5 + 0.5;
         
         gl_PointSize = mix(1.8, 1.2, uTransition) * (80.0 / -mvPosition.z) * (0.5 + pulse * 0.5);
         gl_Position = projectionMatrix * mvPosition;
         vTransition = uTransition;
         vHeat = aRandom.x * pulse;
      }
    `,
        fragmentShader: `
      uniform vec3 uColor;
      varying float vTransition;
      varying float vHeat;
      void main() {
         vec2 cxy = 2.0 * gl_PointCoord - 1.0;
         if (dot(cxy, cxy) > 1.0) discard;
         vec3 whiteCore = vec3(1.0, 1.0, 1.0);
         vec3 color = mix(uColor, whiteCore, vHeat * 0.8);
         float opacity = mix(0.9, 0.4, vTransition) * (1.0 - length(cxy));
         gl_FragColor = vec4(color, opacity);
      }
    `,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }), [node.color])

    useFrame((state, delta) => {
        uniforms.current.uTime.value = state.clock.elapsedTime
        uniforms.current.uTransition.value = THREE.MathUtils.lerp(uniforms.current.uTransition.value, isActive ? 1.0 : 0.0, 0.03)
        if (diskRef.current) {
            diskRef.current.rotation.z += delta * 0.05
            // Keep disc slightly visible even during warp
            diskRef.current.material.opacity = Math.max(0.1, (1.0 - uniforms.current.uTransition.value) * 0.8)
        }
    })

    const [hovered, setHovered] = useState(false)

    return (
        <group position={node.position}>
            {/* Invisible raycast sphere */}
            <mesh
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
                visible={false}
            >
                <sphereGeometry args={[node.size * 2, 16, 16]} />
                <meshBasicMaterial />
            </mesh>

            {!isActive && (
                <group>
                    {/* Pure Diegetic Node Title pointing to the node */}
                    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
                        <Text position={[0, node.size + 4.5, 0]} fontSize={1.6} letterSpacing={0.2} color={hovered ? "#ffffff" : "#eeeeee"}>
                            {node.label}
                            <meshStandardMaterial attach="material" color={hovered ? "#ffffff" : node.color} emissive={hovered ? node.color : "#000"} emissiveIntensity={hovered ? 2 : 0} roughness={0.2} />
                        </Text>
                        <Text position={[0, node.size + 2.5, 0]} fontSize={0.6} letterSpacing={0.3} color={node.color} opacity={hovered ? 1 : 0.4} transparent>
                            [ INIT SEQUENCE ]
                        </Text>
                    </Float>
                </group>
            )}
            {/* The Particle Field */}
            <points ref={pointsRef} material={particleMaterial} renderOrder={isActive ? -1 : 1}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={PARTICLES} array={spherePos} itemSize={3} />
                    <bufferAttribute attach="attributes-aTarget" count={PARTICLES} array={targetPos} itemSize={3} />
                    <bufferAttribute attach="attributes-aRandom" count={PARTICLES} array={randoms} itemSize={3} />
                </bufferGeometry>
            </points>

            {/* Elegant Glass Accretion Disk */}
            <mesh ref={diskRef} rotation={[Math.PI / 2 + (node.type === 'blackhole' ? 0.3 : 0), 0, 0]}>
                <ringGeometry args={[node.size * 1.2, node.size * 1.8, 64]} />
                <meshPhysicalMaterial color="#000" emissive={node.color} emissiveIntensity={hovered ? 2 : 0.5} transmission={1.0} thickness={2.0} ior={2.5} transparent side={THREE.DoubleSide} />
            </mesh>

            <pointLight intensity={hovered ? 5 : 2} color={node.color} distance={node.size * 8} decay={2} />
        </group>
    )
}
