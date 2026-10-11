import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Gerador determinístico, para a cena ser sempre igual entre visitas. */
function rng(seed = 7) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

/** Cristal low-poly central: icosaedro com vértices deslocados + arestas. */
function Crystal() {
  const group = useRef();
  const { geo, edges } = useMemo(() => {
    const r = rng(3);
    const g = new THREE.IcosahedronGeometry(1.15, 1).toNonIndexed();
    const pos = g.attributes.position;
    const map = new Map();
    for (let i = 0; i < pos.count; i++) {
      const key = `${pos.getX(i).toFixed(3)}|${pos.getY(i).toFixed(3)}|${pos.getZ(i).toFixed(3)}`;
      if (!map.has(key)) map.set(key, 0.82 + r() * 0.4);
      const s = map.get(key);
      pos.setXYZ(i, pos.getX(i) * s, pos.getY(i) * s, pos.getZ(i) * s);
    }
    g.computeVertexNormals();
    return { geo: g, edges: new THREE.EdgesGeometry(g, 1) };
  }, []);

  useFrame((_, d) => {
    group.current.rotation.y += d * 0.12;
    group.current.rotation.x += d * 0.03;
  });

  return (
    <group ref={group}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#f4f5f7" roughness={0.35} metalness={0.05} flatShading transparent opacity={0.9} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#9a9ca1" transparent opacity={0.55} />
      </lineSegments>
    </group>
  );
}

/** Fragmentos (tetraedros e cubos) a orbitar o cristal. */
function Shards() {
  const ref = useRef();
  const items = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: 11 }, (_, i) => {
      const a = (i / 11) * Math.PI * 2 + r();
      const rad = 1.7 + r() * 0.9;
      return {
        pos: [Math.cos(a) * rad, (r() - 0.5) * 2.2, Math.sin(a) * rad * 0.6],
        rot: [r() * 3, r() * 3, r() * 3],
        s: 0.14 + r() * 0.28,
        box: i % 3 === 0,
      };
    });
  }, []);
  useFrame((_, d) => (ref.current.rotation.y -= d * 0.05));
  return (
    <group ref={ref}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} rotation={it.rot} scale={it.s}>
          {it.box ? <boxGeometry /> : <tetrahedronGeometry />}
          <meshStandardMaterial color={it.box ? "#c7c9cd" : "#eef0f2"} flatShading roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Anel de cubos (instanciado) — o "colar" da referência. */
function CubeRing({ count = 64, radius = 3.4, tilt = [1.1, 0.2, 0.3], speed = 0.04, size = 0.16, seed = 5 }) {
  const ref = useRef();
  const group = useRef();
  useEffect(() => {
    const r = rng(seed);
    const m = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const wob = 1 + (r() - 0.5) * 0.06;
      m.position.set(Math.cos(a) * radius * wob, (r() - 0.5) * 0.15, Math.sin(a) * radius * wob);
      m.rotation.set(0, -a, 0);
      const s = size * (0.75 + r() * 0.5);
      m.scale.set(s, s, s);
      m.updateMatrix();
      ref.current.setMatrixAt(i, m.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [count, radius, size, seed]);
  useFrame((_, d) => (group.current.rotation.y += d * speed));
  return (
    <group rotation={tilt}>
      <group ref={group}>
        <instancedMesh ref={ref} args={[undefined, undefined, count]}>
          <boxGeometry />
          <meshStandardMaterial color="#b4b6bb" roughness={0.6} />
        </instancedMesh>
      </group>
    </group>
  );
}

/** Rede de pontos e linhas finas ao fundo. */
function Network() {
  const ref = useRef();
  const { points, lines } = useMemo(() => {
    const r = rng(23);
    const pts = Array.from({ length: 70 }, () =>
      new THREE.Vector3((r() - 0.5) * 12, (r() - 0.5) * 7, -2 - r() * 5)
    );
    const seg = [];
    pts.forEach((p, i) => {
      for (let j = i + 1; j < pts.length; j++) if (p.distanceTo(pts[j]) < 1.9) seg.push(p, pts[j]);
    });
    return {
      points: new THREE.BufferGeometry().setFromPoints(pts),
      lines: new THREE.BufferGeometry().setFromPoints(seg),
    };
  }, []);
  useFrame((_, d) => (ref.current.rotation.z += d * 0.01));
  return (
    <group ref={ref}>
      <points geometry={points}>
        <pointsMaterial color="#8f9196" size={0.035} sizeAttenuation />
      </points>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#a3a5aa" transparent opacity={0.28} />
      </lineSegments>
    </group>
  );
}

/** Parallax suave da câmara a seguir o rato. */
function Rig() {
  useFrame((state, d) => {
    const k = 1 - Math.exp(-3 * d);
    state.camera.position.x += (state.pointer.x * 0.5 - state.camera.position.x) * k;
    state.camera.position.y += (state.pointer.y * 0.3 - state.camera.position.y) * k;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/** Em ecrãs largos, desloca a cena para a direita para libertar o texto. */
function Stage({ children }) {
  const aspect = useThree((s) => s.viewport.aspect);
  const x = aspect > 1.3 ? Math.min(1.6, (aspect - 1.3) * 2.2 + 0.6) : 0;
  const s = aspect < 0.8 ? 0.72 : 1;
  return (
    <group position={[x, aspect < 0.8 ? 0.6 : 0, 0]} scale={s}>
      {children}
    </group>
  );
}

export default function HeroScene() {
  const wrap = useRef();
  const [visible, setVisible] = useState(true);

  // Pausa o render quando o hero sai do ecrã.
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    obs.observe(wrap.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <fog attach="fog" args={["#e4e5e7", 6, 14]} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#dfe3ea" />
        <Network />
        <Stage>
          <CubeRing />
          <CubeRing count={44} radius={2.6} tilt={[-0.5, 0.9, -0.4]} speed={-0.06} size={0.12} seed={9} />
          <Crystal />
          <Shards />
        </Stage>
        <Rig />
      </Canvas>
    </div>
  );
}
