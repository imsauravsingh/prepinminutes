"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ExecutionStep } from "./types";
import { SceneBuilder } from "./renderers/SceneBuilder";
import {
  Eye,
  RotateCcw,
  Sparkles,
  ZoomIn,
  ZoomOut,
  AlertCircle,
} from "lucide-react";

interface ARSceneCanvasProps {
  step: ExecutionStep;
  theme?: "dark" | "light";
  isARMode?: boolean;
  onToggleARMode?: (enabled: boolean) => void;
  className?: string;
}

export function ARSceneCanvas({
  step,
  theme = "dark",
  isARMode = false,
  onToggleARMode,
  className = "",
}: ARSceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const sceneBuilderRef = useRef<SceneBuilder | null>(null);

  const [isWebXRSupported, setIsWebXRSupported] = useState<boolean>(false);
  const [xrSessionActive, setXrSessionActive] = useState<boolean>(false);
  const [rendererReady, setRendererReady] = useState<boolean>(false);
  const [xrError, setXrError] = useState<string | null>(null);

  // Check WebXR support
  useEffect(() => {
    if (typeof window !== "undefined" && "xr" in navigator) {
      const xr = (
        navigator as unknown as {
          xr?: { isSessionSupported: (mode: string) => Promise<boolean> };
        }
      ).xr;
      if (xr && typeof xr.isSessionSupported === "function") {
        xr.isSessionSupported("immersive-ar")
          .then((supported: boolean) => setIsWebXRSupported(supported))
          .catch(() => setIsWebXRSupported(false));
      }
    }
  }, []);

  // Initialize Three.js Scene, Camera, Renderer, OrbitControls
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 0. SceneBuilder
    sceneBuilderRef.current = new SceneBuilder();

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === "dark" ? 0x0f0e0d : 0xfcfaf6);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5.5, 9.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // don't go too far below ground
    controls.minDistance = 3;
    controls.maxDistance = 22;
    controls.target.set(0, 0.5, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      theme === "dark" ? 0.75 : 0.9,
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(8, 14, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xff6c47, 0.4);
    fillLight.position.set(-8, 6, -6);
    scene.add(fillLight);

    // 6. Subtle Floor Grid
    const gridColor = theme === "dark" ? 0x272421 : 0xe4ddd3;
    const gridCenter = theme === "dark" ? 0x3d3732 : 0xcbc1b4;
    const grid = new THREE.GridHelper(20, 20, gridCenter, gridColor);
    grid.position.y = -0.01;
    scene.add(grid);

    // 7. Render Loop
    let running = true;
    const animate = () => {
      if (!running) return;
      controls.update();
      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };
    animate();
    setRendererReady(true);

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight, false);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      running = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      controls.dispose();
      if (sceneBuilderRef.current) {
        sceneBuilderRef.current.clear(scene);
      }
      renderer.dispose();
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      setRendererReady(false);
    };
  }, [theme]);

  // Update 3D elements whenever `step` changes
  useEffect(() => {
    if (!rendererReady || !sceneRef.current || !sceneBuilderRef.current) return;
    sceneBuilderRef.current.build(sceneRef.current, step);
  }, [step, rendererReady]);

  // Reset Camera View Handler
  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 5.5, 9.5);
    cameraRef.current.lookAt(0, 0, 0);
    controlsRef.current.target.set(0, 0.5, 0);
    controlsRef.current.update();
  };

  // Zoom handlers
  const handleZoom = (delta: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const dir = new THREE.Vector3();
    cam.getWorldDirection(dir);
    cam.position.addScaledVector(dir, delta);
    controlsRef.current.update();
  };

  // WebXR AR Session trigger
  const handleRequestWebXR = async () => {
    if (!isWebXRSupported) {
      setXrError(
        "WebXR AR is not supported by your current browser/device. Enjoying 3D Interactive Mode!",
      );
      setTimeout(() => setXrError(null), 4000);
      return;
    }

    try {
      const xr = (
        navigator as unknown as {
          xr?: { requestSession: (mode: string) => Promise<any> };
        }
      ).xr;
      if (xr) {
        const session = await xr.requestSession("immersive-ar");
        setXrSessionActive(true);
        if (onToggleARMode) onToggleARMode(true);

        session.addEventListener("end", () => {
          setXrSessionActive(false);
          if (onToggleARMode) onToggleARMode(false);
        });
      }
    } catch (err: unknown) {
      setXrError(
        err instanceof Error ? err.message : "Failed to start AR session",
      );
      setTimeout(() => setXrError(null), 4000);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[250px] sm:min-h-[380px] overflow-hidden select-none ${
        theme === "dark" ? "bg-[#0f0e0d]" : "bg-[#fcfaf6]"
      } ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Floating 3D Navigation Controls Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 bg-[#1e1c1a]/85 backdrop-blur-md border border-[#38332f] rounded-xl p-1 shadow-lg">
        <button
          type="button"
          onClick={() => handleZoom(1.2)}
          title="Zoom In"
          className="flex size-7 items-center justify-center rounded-lg text-[#d4cdbf] hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(-1.2)}
          title="Zoom Out"
          className="flex size-7 items-center justify-center rounded-lg text-[#d4cdbf] hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut className="size-3.5" />
        </button>
        <div className="w-[1px] h-4 bg-[#38332f]" />
        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Camera View"
          className="flex size-7 items-center justify-center rounded-lg text-[#d4cdbf] hover:text-white hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>

      {/* AR / 3D Mode Badge & XR Button */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <div className="flex items-center gap-1.5 rounded-full bg-[#1e1c1a]/90 backdrop-blur-md border border-[#38332f] px-3 py-1 text-[11px] font-medium text-[#d4cdbf] shadow-md">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive 3D Viewport</span>
        </div>

        <button
          type="button"
          onClick={handleRequestWebXR}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shadow-md transition-all ${
            isWebXRSupported || xrSessionActive
              ? "bg-brand text-white hover:bg-[#eb4a19] shadow-[0_2px_10px_rgba(255,108,71,0.35)]"
              : "bg-[#25221f]/90 text-[#b5ad9e] border border-[#38332f] hover:text-white"
          }`}
          title={
            isWebXRSupported
              ? "Launch WebXR AR"
              : "WebXR requires mobile / AR device"
          }
        >
          <Sparkles className="size-3" />
          <span>
            {xrSessionActive
              ? "AR Active"
              : isWebXRSupported
                ? "Enter AR"
                : "AR Simulation"}
          </span>
        </button>
      </div>

      {/* Interactive Helper Overlay hint at bottom */}
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 z-10 text-[11px] text-[#9c9384] bg-[#141311]/75 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5">
        <Eye className="size-3 text-brand" />
        <span className="hidden sm:inline">
          Drag to rotate • Scroll to zoom • Right-click to pan
        </span>
        <span className="sm:hidden">Drag to rotate • Pinch to zoom</span>
      </div>

      {/* Notification Toast for WebXR info / fallback */}
      {xrError && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-xl bg-[#2a1c17] border border-[#ff6c47]/50 px-4 py-2 text-xs text-[#ffcfbe] shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <AlertCircle className="size-4 shrink-0 text-brand" />
          <span>{xrError}</span>
        </div>
      )}
    </div>
  );
}
