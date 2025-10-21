// components/GlobalSilk.tsx
"use client";

import Silk from './Silk';

export default function GlobalSilk() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      <Silk
        speed={5}
        scale={1}
        color="#FFFFFeee"
        noiseIntensity={1.5}
        rotation={90}
      />
          {/* <Silk
  speed={5}
  scale={1}
  color="#FFFFFeee"
  noiseIntensity={1.5}
  rotation={90}
/> */}
    </div>
  );
}
