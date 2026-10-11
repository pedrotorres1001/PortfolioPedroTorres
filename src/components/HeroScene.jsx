import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Gerador determinístico — a mesma seed dá sempre a mesma montagem. */
function rng(seed = 7) {
  let s = seed % 2147483647 || 7;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const PALETTES = {
  light: { fog: "#e4e5e7", face: "#f4f5f7", edge: "#9a9ca1", cube: "#b4b6bb", shardA: "#eef0f2", shardB: "#c7c9cd", dot: "#8f9196", line: "#a3a5aa", amb: 1.4 },
  dark: { fog: "#111214", face: "#2a2c31", edge: "#6d7077", cube: "#3d4046", shardA: "#33363c", shardB: "#46494f", dot: "#5d6066", line: "#4a4d53", amb: 0.9 },
};

/** Valor 0→1→0 partilhado: 0 = montado, 1 = desmontado. */
function useBurst(loop, onPeak) {
  const s = useRef({ v: 0, dir: 0 });
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    s.current.dir = 1;
  }, [loop]);
  useFrame((_, d) => {
    const b = s.current;
    if (!b.dir) return;
    b.v += b.dir * d * (b.dir > 0 ? 2.6 : 1.5);
    if (b.dir > 0 && b.v >= 1) {
      b.v = 1;
      b.dir = -1;
      onPeak();
    } else if (b.dir < 0 && b.v <= 0) {
      b.v = 0;
      b.dir = 0;
    }
  });
  return s;
}

const ease = (x) => 1 - Math.pow(1 - x, 3);

/** Cristal feito de faces independentes, para poder partir-se. */
function Crystal({ seed, burst, pointer, drag, pal }) {
  const group = useRef();
  const faceRefs = useRef([]);
  const faces = useMemo(() => {
    const r = rng(seed * 31 + 3);
    const g = new THREE.IcosahedronGeometry(1.15, 1).toNonIndexed();
    const pos = g.attributes.position;
    const disp = new Map();
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const key = `${v.x.toFixed(3)}|${v.y.toFixed(3)}|${v.z.toFixed(3)}`;
      if (!disp.has(key)) disp.set(key, 0.8 + r() * 0.45);
      v.multiplyScalar(disp.get(key));
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    const out = [];
    for (let i = 0; i < pos.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, i);
      const b = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
      const c = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
      const center = a.clone().add(b).add(c).divideScalar(3);
      const geo = new THREE.BufferGeometry().setFromPoints([a.sub(center), b.sub(center), c.sub(center)]);
      geo.computeVertexNormals();
      out.push({
        geo,
        edges: new THREE.EdgesGeometry(geo),
        center,
        dir: center.clone().normalize(),
        spin: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(6),
        k: 1.6 + r() * 2.2,
      });
    }
    return out;
  }, [seed]);

  useFrame((_, d) => {
    const g = group.current;
    // rotação automática + arrasto + inclinação para o cursor
    drag.current.vx *= Math.pow(0.04, d);
    g.rotation.y += d * 0.12 + drag.current.vx * d;
    const tx = -pointer.current.y * 0.35 + 0.1;
    g.rotation.x += (tx - g.rotation.x) * (1 - Math.exp(-3 * d));
    g.rotation.z += (-pointer.current.x * 0.2 - g.rotation.z) * (1 - Math.exp(-3 * d));

    const e = ease(burst.current.v);
    faces.forEach((f, i) => {
      const m = faceRefs.current[i];
      if (!m) return;
      m.position.copy(f.center).addScaledVector(f.dir, e * f.k);
      m.rotation.set(f.spin.x * e, f.spin.y * e, f.spin.z * e);
      m.scale.setScalar(1 - e * 0.35);
    });
  });

  return (
    <group ref={group}>
      {faces.map((f, i) => (
        <group key={`${seed}-${i}`} ref={(el) => (faceRefs.current[i] = el)} position={f.center}>
          <mesh geometry={f.geo}>
            <meshStandardMaterial color={pal.face} roughness={0.35} metalness={0.05} flatShading transparent opacity={0.92} side={THREE.DoubleSide} />
          </mesh>
          <lineSegments geometry={f.edges}>
            <lineBasicMaterial color={pal.edge} transparent opacity={0.55} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

/** Fragmentos a orbitar. */
function Shards({ seed, burst, pal }) {
  const ref = useRef();
  const items = useMemo(() => {
    const r = rng(seed * 17 + 11);
    return Array.from({ length: 11 }, (_, i) => {
      const a = (i / 11) * Math.PI * 2 + r();
      const rad = 1.7 + r() * 0.9;
      return {
        pos: new THREE.Vector3(Math.cos(a) * rad, (r() - 0.5) * 2.2, Math.sin(a) * rad * 0.6),
        rot: [r() * 3, r() * 3, r() * 3],
        s: 0.14 + r() * 0.28,
        box: i % 3 === 0,
      };
    });
  }, [seed]);
  const meshes = useRef([]);
  useFrame((_, d) => {
    ref.current.rotation.y -= d * 0.05;
    const e = ease(burst.current.v);
    items.forEach((it, i) => {
      const m = meshes.current[i];
      if (m) m.position.copy(it.pos).multiplyScalar(1 + e * 2.2);
    });
  });
  return (
    <group ref={ref}>
      {items.map((it, i) => (
        <mesh key={`${seed}-${i}`} ref={(el) => (meshes.current[i] = el)} position={it.pos} rotation={it.rot} scale={it.s}>
          {it.box ? <boxGeometry /> : <tetrahedronGeometry />}
          <meshStandardMaterial color={it.box ? pal.shardB : pal.shardA} flatShading roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Anel de cubos instanciado: afasta-se do cursor e explode no rebuild. */
function CubeRing({ seed, burst, pointer, pal, count = 64, radius = 3.4, tilt = [1.1, 0.2, 0.3], speed = 0.04, size = 0.16, salt = 5 }) {
  const inst = useRef();
  const spin = useRef();
  const { camera } = useThree();
  const base = useMemo(() => {
    const r = rng(seed * 13 + salt);
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2;
      return {
        a,
        wob: 1 + (r() - 0.5) * 0.06,
        y: (r() - 0.5) * 0.15,
        s: size * (0.75 + r() * 0.5),
        scatter: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).multiplyScalar(3),
        push: 0,
      };
    });
  }, [seed, count, size, salt]);

  const tmp = useMemo(() => ({ o: new THREE.Object3D(), w: new THREE.Vector3() }), []);

  useFrame((_, d) => {
    spin.current.rotation.y += d * speed;
    spin.current.updateMatrixWorld();
    const e = ease(burst.current.v);
    const k = 1 - Math.exp(-8 * d);
    base.forEach((b, i) => {
      const r = radius * b.wob;
      tmp.o.position.set(Math.cos(b.a) * r, b.y, Math.sin(b.a) * r);
      // distância ao cursor no ecrã
      tmp.w.copy(tmp.o.position).applyMatrix4(spin.current.matrixWorld).project(camera);
      const dist = Math.hypot(tmp.w.x - pointer.current.x, tmp.w.y - pointer.current.y);
      const target = Math.max(0, 1 - dist / 0.28);
      b.push += (target - b.push) * k;
      const scale = 1 + b.push * 0.18 + e * 1.1;
      tmp.o.position.set(Math.cos(b.a) * r * scale, b.y + b.push * 0.25, Math.sin(b.a) * r * scale);
      tmp.o.position.addScaledVector(b.scatter, e);
      tmp.o.rotation.set(e * b.scatter.x, -b.a + e * b.scatter.y, e * b.scatter.z);
      tmp.o.scale.setScalar(b.s * (1 + b.push * 0.4));
      tmp.o.updateMatrix();
      inst.current.setMatrixAt(i, tmp.o.matrix);
    });
    inst.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group rotation={tilt}>
      <group ref={spin}>
        <instancedMesh ref={inst} args={[undefined, undefined, count]}>
          <boxGeometry />
          <meshStandardMaterial color={pal.cube} roughness={0.6} />
        </instancedMesh>
      </group>
    </group>
  );
}

function Network({ pal }) {
  const ref = useRef();
  const { points, lines } = useMemo(() => {
    const r = rng(23);
    const pts = Array.from({ length: 70 }, () => new THREE.Vector3((r() - 0.5) * 12, (r() - 0.5) * 7, -2 - r() * 5));
    const seg = [];
    pts.forEach((p, i) => {
      for (let j = i + 1; j < pts.length; j++) if (p.distanceTo(pts[j]) < 1.9) seg.push(p, pts[j]);
    });
    return { points: new THREE.BufferGeometry().setFromPoints(pts), lines: new THREE.BufferGeometry().setFromPoints(seg) };
  }, []);
  useFrame((_, d) => (ref.current.rotation.z += d * 0.01));
  return (
    <group ref={ref}>
      <points geometry={points}>
        <pointsMaterial color={pal.dot} size={0.035} sizeAttenuation />
      </points>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={pal.line} transparent opacity={0.28} />
      </lineSegments>
    </group>
  );
}

function Rig({ pointer }) {
  useFrame((state, d) => {
    const k = 1 - Math.exp(-3 * d);
    state.camera.position.x += (pointer.current.x * 0.5 - state.camera.position.x) * k;
    state.camera.position.y += (pointer.current.y * 0.3 - state.camera.position.y) * k;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

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

function Assembly({ loop, pointer, drag, pal }) {
  const [seed, setSeed] = useState(7);
  const burst = useBurst(loop, () => setSeed((s) => s + 1 + Math.floor(Math.random() * 1000)));
  return (
    <Stage>
      <CubeRing seed={seed} burst={burst} pointer={pointer} pal={pal} />
      <CubeRing seed={seed} burst={burst} pointer={pointer} pal={pal} count={44} radius={2.6} tilt={[-0.5, 0.9, -0.4]} speed={-0.06} size={0.12} salt={9} />
      <Crystal seed={seed} burst={burst} pointer={pointer} drag={drag} pal={pal} />
      <Shards seed={seed} burst={burst} pal={pal} />
    </Stage>
  );
}

export default function HeroScene({ loop, pointer, drag, theme = "light" }) {
  const wrap = useRef();
  const [visible, setVisible] = useState(true);
  const pal = PALETTES[theme] || PALETTES.light;

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
        <fog attach="fog" args={[pal.fog, 6, 14]} />
        <ambientLight intensity={pal.amb} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#dfe3ea" />
        <Network pal={pal} />
        <Assembly loop={loop} pointer={pointer} drag={drag} pal={pal} />
        <Rig pointer={pointer} />
      </Canvas>
    </div>
  );
}
