type ColorThemeKey = "cosmic" | "sunset" | "forest" | "ocean" | "monochrome";
type PhysicsModeKey = "normal" | "gravity" | "repulsion" | "vortex" | "collision";
type ParticleShapeKey = "circle" | "square" | "triangle" | "star" | "random";

interface ParticlePreset {
  name: string;
  particleCount: number;
  particleSpeed: number;
  particleSize: number;
  randomizeSizes: boolean;
  colorTheme: ColorThemeKey;
  physicsMode: PhysicsModeKey;
  particleShape: ParticleShapeKey;
  showConnections: boolean;
  connectionDistance: number;
  showTrails: boolean;
  trailLength: number;
}

export const ParticlePresets: Record<string, ParticlePreset> = {
  "cosmic-dream": {
    name: "Cosmic Dream",
    particleCount: 200,
    particleSpeed: 1.5,
    particleSize: 2.5,
    randomizeSizes: true,
    colorTheme: "cosmic",
    physicsMode: "vortex",
    particleShape: "star",
    showConnections: true,
    connectionDistance: 120,
    showTrails: true,
    trailLength: 0.3,
  },
  "sunset-drift": {
    name: "Sunset Drift",
    particleCount: 150,
    particleSpeed: 1,
    particleSize: 3,
    randomizeSizes: true,
    colorTheme: "sunset",
    physicsMode: "normal",
    particleShape: "circle",
    showConnections: true,
    connectionDistance: 100,
    showTrails: false,
    trailLength: 0.2,
  },
  "forest-magic": {
    name: "Forest Magic",
    particleCount: 250,
    particleSpeed: 0.8,
    particleSize: 2,
    randomizeSizes: true,
    colorTheme: "forest",
    physicsMode: "gravity",
    particleShape: "triangle",
    showConnections: true,
    connectionDistance: 80,
    showTrails: true,
    trailLength: 0.5,
  },
  "ocean-flow": {
    name: "Ocean Flow",
    particleCount: 180,
    particleSpeed: 2,
    particleSize: 3.5,
    randomizeSizes: false,
    colorTheme: "ocean",
    physicsMode: "repulsion",
    particleShape: "circle",
    showConnections: true,
    connectionDistance: 150,
    showTrails: true,
    trailLength: 0.1,
  },
  "mono-grid": {
    name: "Mono Grid",
    particleCount: 100,
    particleSpeed: 2.5,
    particleSize: 4,
    randomizeSizes: false,
    colorTheme: "monochrome",
    physicsMode: "collision",
    particleShape: "square",
    showConnections: false,
    connectionDistance: 100,
    showTrails: false,
    trailLength: 0.2,
  },
}; 