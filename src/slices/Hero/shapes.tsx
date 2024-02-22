"use client"

import * as THREE  from 'three';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Shapes(){
    return (
        <div className='row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0'>
            <Canvas className='z-0' shadows gl={{antialias: false}} dpr={[1 ,1.5]} camera={{position: [0, 0, 25], fov: 30, near: 1, far: 40}}>
                <Suspense fallback={null}>
                    <Geometries />
                    <ContactShadows position={[0, -2.5, 0]} opacity={0.75} scale={50} blur={0.75} far={7} />
                    <Environment preset="sunset" />
                </Suspense>
            </Canvas>
        </div>
    )
}

function Geometries(){
    const geometries = [
        {
            position: [-0.25, 0.75, -1],
            r: 0.5,
            geometry: new THREE.TorusGeometry( 2.5, 0.75, 100, 64 )
        },
        {
            position: [1, 2.25, 0.5],
            r: 0.75,
            geometry: new THREE.IcosahedronGeometry(1.5),
        },
        {
            position: [-1.5, 2.25, 0.5],
            r: 0.5,
            geometry: new THREE.CapsuleGeometry( 0.75, 1.25, 32, 32 )
        },
        {
            position: [-2, 0, 1],
            r: 0.5,
            geometry: new THREE.OctahedronGeometry(1.75, 0)
        },
        {
            position: [1.5, 0, 0.5],
            r: 0.75,
            geometry: new THREE.ConeGeometry( 1, 3, 32 )
        },
    ]
    const materials = [
        new THREE.MeshNormalMaterial(),
        new THREE.MeshStandardMaterial({color: 0x00ff00, roughness: 0.25, metalness: 0.75}),
        new THREE.MeshPhysicalMaterial({color: 0x000000, roughness: 0.5, metalness: 0.75}),
        new THREE.MeshStandardMaterial({color: 0xff00ab, roughness: 0.25, metalness: 0.75}),
        new THREE.MeshPhysicalMaterial({color: 0x012d46, roughness: 0.1, metalness: 0.5}),
    ]

    const soundEffects = [
        new Audio("/sounds/sound (1).ogg"),
        new Audio("/sounds/sound (2).ogg"),
        new Audio("/sounds/sound (3).ogg"),
        new Audio("/sounds/sound (4).ogg"),
        new Audio("/sounds/sound (5).ogg"),
        new Audio("/sounds/sound (6).ogg"),
        new Audio("/sounds/sound (7).ogg"),
        new Audio("/sounds/sound (8).ogg"),
        new Audio("/sounds/sound (9).ogg"),
        new Audio("/sounds/sound (10).ogg"),
    ]

    return geometries.map(({position, r, geometry}) => (
        <Geometry key={JSON.stringify(position)} position={position.map((p) => p * 2)} soundEffects={soundEffects} geometry={geometry} materials={materials} r={r}/>
    ))

}


function Geometry({r, position, geometry, materials, soundEffects}: {r: number, position: number[], geometry: THREE.BufferGeometry, materials: THREE.Material[], soundEffects: HTMLAudioElement[]}){
    const meshRef = useRef(null)
    const [visible, setVisible] = useState(false)

    const startingMaterial = getRandomMaterial()

    function getRandomMaterial(){
        return gsap.utils.random(materials)
    }

    function handleClick(e: { object: any; }){
        const mesh = e.object

        gsap.utils.random(soundEffects).play()

        gsap.to(mesh.rotation, {
            x: `+=${gsap.utils.random(0, 2)}`,
            y: `+=${gsap.utils.random(0, 2)}`,
            z: `+=${gsap.utils.random(0, 2)}`,
            duration: 1,
            ease: "elastic.out(1, 0.3)",
            yoyo: true
        })

        mesh.material = getRandomMaterial()
    }

    const handlePointerOver = () => {
        document.body.style.cursor = "pointer"
    }

    const handlePointerOut = () => {
        document.body.style.cursor = "default"
    }

    useEffect(() => {
        let ctx = gsap.context(() => {
            setVisible(true)
            const node = meshRef.current as any
            gsap.from(node.scale, {
                x: 0, y: 0, z: 0, duration: 1, ease: "elastic.out(1, 0.3)", delay: gsap.utils.random(0, 1)
            })
        })

        return () => ctx.revert()
    }, [])

    const positionVector = new THREE.Vector3(position[0], position[1], position[2]);

    return (
        <group position={positionVector} ref={meshRef}>
            <Float speed={7 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
                <mesh geometry={geometry} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} visible={visible} material={startingMaterial} />
            </Float>
        </group>
    )
}