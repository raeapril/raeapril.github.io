import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function RotatingBox() {
    const ref = useRef();
    useFrame((_, delta) => {
        ref.current.rotation.y += delta * 0.8;
    });
    return (
        <mesh ref={ref} castShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#00bcd4" metalness={0.2} roughness={0.6} />
        </mesh>
    );
}

export default RotatingBox;