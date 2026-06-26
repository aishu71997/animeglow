import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeProductCanvasProps {
  threedType: 'bottle' | 'cream_jar' | 'capsule' | 'crystal' | 'figurine' | 'sword' | 'lamp' | 'pendant' | 'scroll' | 'hoodie' | 'mug';
  primaryColor?: string; // e.g. '#FF4FA3'
  secondaryColor?: string; // e.g. '#00E5FF'
  imageUrl?: string; // High-resolution product image url
}

export default function ThreeProductCanvas({
  threedType,
  primaryColor = '#FF4FA3',
  secondaryColor = '#00E5FF',
  imageUrl
}: ThreeProductCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const productImageRef = useRef<HTMLDivElement>(null);
  const glossOverlayRef = useRef<HTMLDivElement>(null);

  // Hover and Drag States for coordinate feedback
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Sync refs to let the continuous requestAnimationFrame loop access states instantly at 60 FPS
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const targetTilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    isHoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    // Soft outer atmosphere fog to isolate the hologram chamber
    scene.fog = new THREE.FogExp2('#060411', 0.02);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.0);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // --- High-Clarity Studio Lighting for Perfect Product Color and details ---
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.8);
    scene.add(ambientLight);

    // Sharp white key light
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    // Neon edge lights (restricted to perimeters, leaving center completely clear for products)
    const rimLightColor = new THREE.Color(secondaryColor);
    const neonRimLight = new THREE.PointLight(rimLightColor, 4.0, 9);
    neonRimLight.position.set(-3.5, 1.8, 1.5);
    scene.add(neonRimLight);

    const glowLightColor = new THREE.Color(primaryColor);
    const neonFillLight = new THREE.PointLight(glowLightColor, 4.0, 9);
    neonFillLight.position.set(3.5, -1.8, 1.5);
    scene.add(neonFillLight);

    // --- 3D Holographic Chamber Enclosure (Subtle grid lines, behind the center product) ---
    const chamberGroup = new THREE.Group();
    scene.add(chamberGroup);

    const chamberGeo = new THREE.CylinderGeometry(2.3, 2.3, 4.4, 16, 4, true);
    const chamberMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(secondaryColor),
      wireframe: true,
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending
    });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamberGroup.add(chamber);

    // Glowing laser scan horizontal rings that move up/down
    const scanRingGeo = new THREE.TorusGeometry(2.28, 0.015, 8, 32);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(secondaryColor),
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const scanRing1 = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing1.rotation.x = Math.PI / 2;
    chamberGroup.add(scanRing1);

    const scanRing2 = scanRing1.clone();
    chamberGroup.add(scanRing2);

    // --- Rotating Holographic Base Platform ---
    const platformGroup = new THREE.Group();
    platformGroup.position.y = -1.8;
    scene.add(platformGroup);

    // Platform Base Disc
    const diskGeo = new THREE.CylinderGeometry(1.5, 1.6, 0.08, 32);
    const diskMat = new THREE.MeshStandardMaterial({
      color: '#080516',
      roughness: 0.25,
      metalness: 0.95
    });
    const baseDisk = new THREE.Mesh(diskGeo, diskMat);
    platformGroup.add(baseDisk);

    // Spinning Neon Tech Grid Ring
    const neonRingGeo = new THREE.TorusGeometry(1.48, 0.02, 6, 48);
    const neonRingMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(secondaryColor),
      transparent: true,
      opacity: 0.8
    });
    const neonRing = new THREE.Mesh(neonRingGeo, neonRingMat);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = 0.05;
    platformGroup.add(neonRing);

    // Inside grid lines
    const ringGridGeo = new THREE.RingGeometry(0.7, 1.3, 32);
    const ringGridMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(secondaryColor),
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ringGrid = new THREE.Mesh(ringGridGeo, ringGridMat);
    ringGrid.rotation.x = Math.PI / 2;
    ringGrid.position.y = 0.06;
    platformGroup.add(ringGrid);

    // --- Volumetric Upward Projection Beam ---
    const beamGeo = new THREE.ConeGeometry(1.1, 3.5, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(secondaryColor),
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const volumetricBeam = new THREE.Mesh(beamGeo, beamMat);
    volumetricBeam.position.y = 1.75;
    platformGroup.add(volumetricBeam);

    // --- 3D Procedural Models Group (For fallback or behind-the-image effects) ---
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Only render the 3D model if no image URL is provided (Dual-mode rendering)
    if (!imageUrl) {
      const crystalMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(primaryColor),
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.75,
        ior: 1.8,
        thickness: 1.2,
        specularIntensity: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
      });

      const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(secondaryColor),
        roughness: 0.15,
        metalness: 0.4,
        clearcoat: 1.0
      });

      const goldAccentMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFD700'),
        roughness: 0.08,
        metalness: 0.95,
      });

      const activeGlowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#00E5FF'),
      });

      switch (threedType) {
        case 'bottle': {
          const bodyGeo = new THREE.CylinderGeometry(0.75, 0.75, 2.2, 32);
          const body = new THREE.Mesh(bodyGeo, crystalMaterial);
          body.position.y = -0.1;
          modelGroup.add(body);

          const liquidGeo = new THREE.CylinderGeometry(0.68, 0.68, 1.7, 32);
          const liquidMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(secondaryColor),
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.5,
            thickness: 0.4,
            clearcoat: 1.0
          });
          const liquid = new THREE.Mesh(liquidGeo, liquidMat);
          liquid.position.y = -0.25;
          modelGroup.add(liquid);

          const capGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.45, 24);
          const cap = new THREE.Mesh(capGeo, goldAccentMaterial);
          cap.position.y = 1.15;
          modelGroup.add(cap);
          break;
        }

        case 'cream_jar': {
          const jarGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.95, 32);
          const jar = new THREE.Mesh(jarGeo, crystalMaterial);
          jar.position.y = -0.15;
          modelGroup.add(jar);

          const creamInnerGeo = new THREE.SphereGeometry(0.95, 24, 24);
          const creamMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(secondaryColor),
            roughness: 0.3,
            metalness: 0.1,
            clearcoat: 1.0
          });
          const cream = new THREE.Mesh(creamInnerGeo, creamMat);
          cream.scale.set(1, 0.52, 1);
          cream.position.y = -0.15;
          modelGroup.add(cream);

          const goldCapGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.25, 32);
          const cap = new THREE.Mesh(goldCapGeo, goldAccentMaterial);
          cap.position.y = 0.42;
          modelGroup.add(cap);
          break;
        }

        case 'capsule': {
          const topCapGeo = new THREE.SphereGeometry(0.68, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
          const topCap = new THREE.Mesh(topCapGeo, crystalMaterial);
          topCap.position.y = 0.4;
          modelGroup.add(topCap);

          const bottomCapGeo = new THREE.SphereGeometry(0.68, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
          const bottomCap = new THREE.Mesh(bottomCapGeo, bodyMaterial);
          bottomCap.position.y = -0.4;
          modelGroup.add(bottomCap);

          const middleGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.8, 32);
          const middle = new THREE.Mesh(middleGeo, goldAccentMaterial);
          modelGroup.add(middle);
          break;
        }

        case 'crystal': {
          const coreGeo = new THREE.OctahedronGeometry(0.9, 0);
          const core = new THREE.Mesh(coreGeo, crystalMaterial);
          core.position.y = 0.1;
          modelGroup.add(core);

          const sideCryst1 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.3, 4), crystalMaterial);
          sideCryst1.position.set(0.55, -0.3, 0.35);
          sideCryst1.rotation.set(0.4, 0, -0.4);
          modelGroup.add(sideCryst1);

          const goldBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.95, 0.25, 8), goldAccentMaterial);
          goldBase.position.y = -0.85;
          modelGroup.add(goldBase);
          break;
        }

        case 'figurine': {
          const headGeo = new THREE.SphereGeometry(0.65, 32, 32);
          const headMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.15, clearcoat: 1.0 });
          const head = new THREE.Mesh(headGeo, headMat);
          head.position.y = 0.55;
          modelGroup.add(head);

          const visorGeo = new THREE.BoxGeometry(0.7, 0.18, 0.18);
          const visor = new THREE.Mesh(visorGeo, activeGlowMaterial);
          visor.position.set(0, 0.55, 0.52);
          modelGroup.add(visor);

          const torsoGeo = new THREE.CylinderGeometry(0.35, 0.28, 0.75, 24);
          const torso = new THREE.Mesh(torsoGeo, bodyMaterial);
          torso.position.y = -0.22;
          modelGroup.add(torso);

          const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.08, 32), goldAccentMaterial);
          standBase.position.y = -0.92;
          modelGroup.add(standBase);
          break;
        }

        case 'sword': {
          const hiltGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.75, 8);
          const hilt = new THREE.Mesh(hiltGeo, goldAccentMaterial);
          hilt.rotation.z = Math.PI / 4;
          hilt.position.set(-0.55, -0.55, 0);
          modelGroup.add(hilt);

          const guardGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 16);
          const guard = new THREE.Mesh(guardGeo, bodyMaterial);
          guard.rotation.z = Math.PI / 4;
          guard.position.set(-0.32, -0.32, 0);
          modelGroup.add(guard);

          const bladeGeo = new THREE.BoxGeometry(0.1, 2.3, 0.03);
          const bladeMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(primaryColor),
            emissive: new THREE.Color(primaryColor),
            emissiveIntensity: 1.2,
            roughness: 0.1,
            metalness: 0.1,
            transparent: true,
            opacity: 0.95
          });
          const blade = new THREE.Mesh(bladeGeo, bladeMat);
          blade.rotation.z = -Math.PI / 4;
          blade.position.set(0.55, 0.55, 0);
          modelGroup.add(blade);
          break;
        }

        case 'lamp': {
          const baseGeo = new THREE.CylinderGeometry(1.1, 1.15, 0.25, 32);
          const baseMat = new THREE.MeshStandardMaterial({ color: '#090715', roughness: 0.3, metalness: 0.9 });
          const base = new THREE.Mesh(baseGeo, baseMat);
          base.position.y = -0.9;
          modelGroup.add(base);

          const slotGeo = new THREE.BoxGeometry(0.9, 0.04, 0.18);
          const slot = new THREE.Mesh(slotGeo, activeGlowMaterial);
          slot.position.set(0, -0.76, 0);
          modelGroup.add(slot);

          const plateGeo = new THREE.BoxGeometry(1.2, 1.6, 0.06);
          const plate = new THREE.Mesh(plateGeo, crystalMaterial);
          plate.position.y = 0.05;
          modelGroup.add(plate);
          break;
        }

        case 'pendant': {
          const loopGeo = new THREE.TorusGeometry(0.95, 0.06, 16, 64);
          const loop = new THREE.Mesh(loopGeo, goldAccentMaterial);
          modelGroup.add(loop);

          const innerCrystalGeo = new THREE.OctahedronGeometry(0.52, 0);
          const crystalMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(secondaryColor),
            transmission: 0.85,
            thickness: 0.4,
            roughness: 0.05,
            metalness: 0.1,
            clearcoat: 1.0
          });
          const innerCrystal = new THREE.Mesh(innerCrystalGeo, crystalMat);
          modelGroup.add(innerCrystal);
          break;
        }

        case 'scroll': {
          const coreGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.0, 32);
          const body = new THREE.Mesh(coreGeo, crystalMaterial);
          body.rotation.z = Math.PI / 2;
          modelGroup.add(body);

          const endL = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.12, 16), goldAccentMaterial);
          endL.rotation.z = Math.PI / 2;
          endL.position.x = -1.06;
          modelGroup.add(endL);

          const endR = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.12, 16), goldAccentMaterial);
          endR.rotation.z = Math.PI / 2;
          endR.position.x = 1.06;
          modelGroup.add(endR);
          break;
        }

        case 'hoodie': {
          const bodyGeo = new THREE.CylinderGeometry(0.65, 0.55, 1.3, 24);
          const body = new THREE.Mesh(bodyGeo, bodyMaterial);
          body.position.y = -0.1;
          modelGroup.add(body);

          const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.9, 16), bodyMaterial);
          sleeveL.rotation.z = 0.45;
          sleeveL.position.set(-0.75, -0.1, 0);
          modelGroup.add(sleeveL);

          const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.9, 16), bodyMaterial);
          sleeveR.rotation.z = -0.45;
          sleeveR.position.set(0.75, -0.1, 0);
          modelGroup.add(sleeveR);
          break;
        }

        case 'mug': {
          const outerCupGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.4, 32);
          const cup = new THREE.Mesh(outerCupGeo, crystalMaterial);
          modelGroup.add(cup);

          const handleGeo = new THREE.TorusGeometry(0.4, 0.09, 8, 24, Math.PI);
          const handle = new THREE.Mesh(handleGeo, crystalMaterial);
          handle.position.set(0.7, 0, 0);
          handle.rotation.z = -Math.PI / 2;
          modelGroup.add(handle);
          break;
        }

        default: {
          const coreGeo = new THREE.SphereGeometry(0.9, 32, 32);
          const fallback = new THREE.Mesh(coreGeo, crystalMaterial);
          modelGroup.add(fallback);
        }
      }
    }

    // --- Ambient Particle Ring (Subtle ambient sparkles around hologram edges) ---
    const particleCount = 45;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.15;
      const radius = 1.4 + Math.random() * 0.6;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.8;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      particleSpeeds.push(0.35 + Math.random() * 0.75);
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: new THREE.Color(secondaryColor),
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const starParticles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(starParticles);

    // --- Interactive Drag Controls (Orbital Rotation Values) ---
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let isPointerDown = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    const onPointerDown = (e: PointerEvent) => {
      // Don't trigger if clicking on HUD controls
      if ((e.target as HTMLElement).closest('.hud-controls')) return;
      isPointerDown = true;
      setIsDragging(true);
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const deltaX = e.clientX - previousPointerX;
      const deltaY = e.clientY - previousPointerY;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;

      targetRotationY += deltaX * 0.007;
      targetRotationX += deltaY * 0.007;
    };

    const onPointerUp = () => {
      isPointerDown = false;
      setIsDragging(false);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(container);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    let currentScale = 1.0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation (perfectly smooth sine wave)
      const floatOffset = Math.sin(elapsedTime * 1.5) * 11; // float offset in pixels
      const webglFloatOffset = Math.sin(elapsedTime * 1.5) * 0.11; // matching float offset for WebGL

      // Animate scan lines
      scanRing1.position.y = Math.sin(elapsedTime * 0.8) * 1.8;
      scanRing2.position.y = Math.sin(elapsedTime * 0.8 + Math.PI) * 1.8;

      // Slow 360° auto rotation that pauses when the user hovers
      if (!isPointerDown) {
        if (isHoveredRef.current) {
          // Pause / slow to barely moving so the user can easily inspect
          targetRotationY += 0.0008;
        } else {
          // Slow continuous rotation
          targetRotationY += 0.0035;
        }
      }

      // Smooth interpolation for rotations and drags
      currentRotationX += (targetRotationX - currentRotationX) * 0.12;
      currentRotationY += (targetRotationY - currentRotationY) * 0.12;

      // Apply coordinates to the WebGL procedural models if active
      if (!imageUrl) {
        modelGroup.position.y = webglFloatOffset;
        modelGroup.rotation.y = currentRotationY;
        modelGroup.rotation.x = currentRotationX;
      }

      // Chamber/Grid slow opposite spin for dynamic complexity
      chamberGroup.rotation.y = elapsedTime * 0.03;
      platformGroup.rotation.y = -elapsedTime * 0.07;

      // --- HIGH-PERFORMANCE DOM MANIPULATION FOR CRISTAL-CLEAR IMAGE (60FPS) ---
      if (imageUrl && productImageRef.current) {
        // Smooth lerp for hover scale
        const hoverScale = isHoveredRef.current ? 1.12 : 1.0;
        currentScale += (hoverScale - currentScale) * 0.15;

        // Smooth lerp for cursor perspective tilt
        currentTiltX += (targetTilt.current.x - currentTiltX) * 0.15;
        currentTiltY += (targetTilt.current.y - currentTiltY) * 0.15;

        // Translate the image (float) and apply rotations and perspective tilts
        // We render with hardware-accelerated 3D CSS transforms!
        productImageRef.current.style.transform = `
          translateY(${floatOffset}px)
          rotateX(${currentRotationX * (180 / Math.PI) + currentTiltX}deg)
          rotateY(${currentRotationY * (180 / Math.PI) + currentTiltY}deg)
          scale(${currentScale})
        `;
      }

      // --- Gloss highlight effect mapping (reflection moves with tilt) ---
      if (imageUrl && glossOverlayRef.current && isHoveredRef.current) {
        const shineX = (currentTiltY / 14) * 45;
        const shineY = (-currentTiltX / 14) * 45;
        glossOverlayRef.current.style.transform = `translate3d(${shineX}px, ${shineY}px, 0)`;
      }

      // Orbit particles around the chamber
      const positionsAttr = starParticles.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const px = positionsAttr.getX(i);
        const pz = positionsAttr.getZ(i);

        const speed = particleSpeeds[i] * 0.004;
        const currentAngle = Math.atan2(pz, px);
        const nextAngle = currentAngle + speed;
        const radius = Math.sqrt(px * px + pz * pz);

        positionsAttr.setX(i, Math.cos(nextAngle) * radius);
        positionsAttr.setZ(i, Math.sin(nextAngle) * radius);

        // Subtle rise
        const currentY = positionsAttr.getY(i);
        if (currentY > 1.8) {
          positionsAttr.setY(i, -1.8);
        } else {
          positionsAttr.setY(i, currentY + 0.003);
        }
      }
      positionsAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      // Deep disposal of ThreeJS objects
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Points)) return;

        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [threedType, primaryColor, secondaryColor, imageUrl]);

  // Track cursor location on container for 3D perspective tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = x / rect.width;
    const percentY = y / rect.height;

    // maximum tilt angles (up to 14 degrees)
    const tiltY = (percentX - 0.5) * 14;
    const tiltX = -(percentY - 0.5) * 14;

    targetTilt.current = { x: tiltX, y: tiltY };
  };

  const handleMouseLeave = () => {
    setHovered(false);
    targetTilt.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-[28px] transition-all duration-500 bg-[#060412]/80"
      style={{
        boxShadow: hovered
          ? `0 0 50px rgba(${secondaryColor === '#00E5FF' ? '0,229,255' : '106,92,255'}, 0.4), inset 0 0 25px rgba(${secondaryColor === '#00E5FF' ? '0,229,255' : '106,92,255'}, 0.15)`
          : 'inset 0 0 15px rgba(255,255,255,0.02)',
        borderColor: hovered ? `${secondaryColor}66` : 'rgba(255,255,255,0.08)',
        borderWidth: '1px',
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease'
      }}
      id={`3d-canvas-container-${threedType}`}
    >
      {/* BACKGROUND LAYER 1: Futuristic ThreeJS Particle & Platform Chamber */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block touch-none z-10"
        id={`3d-canvas-${threedType}`}
      />

      {/* LAYER 2: Crystal Clear HTML Product Image Overlay (Guaranteed 100% Crisp & High-Res) */}
      {imageUrl && (
        <div
          ref={productImageRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 select-none transform-gpu"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          <img
            src={imageUrl}
            alt={`${threedType} product`}
            referrerPolicy="no-referrer"
            className="max-w-[62%] max-h-[62%] object-contain select-none filter brightness-[1.06] contrast-[1.05] saturate-[1.05] drop-shadow-[0_20px_45px_rgba(0,0,0,0.7)]"
            style={{
              imageRendering: 'high-quality',
              backfaceVisibility: 'hidden'
            }}
          />

          {/* Premium moving highlight/gloss overlay (inside the product frame, visible on hover) */}
          {hovered && (
            <div
              ref={glossOverlayRef}
              className="absolute w-[180%] h-[180%] pointer-events-none mix-blend-overlay opacity-50 select-none rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)',
                willChange: 'transform'
              }}
            />
          )}
        </div>
      )}

      {/* LAYER 3: Soft Neon Frame Border Glow (on hover only, does not bleed onto product) */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none transition-opacity duration-500 z-30"
        style={{
          border: hovered ? `1.5px solid ${secondaryColor}` : '1.5px solid transparent',
          opacity: hovered ? 1 : 0,
          boxShadow: `inset 0 0 20px ${secondaryColor}25`
        }}
      />

      {/* LAYER 4: Heads-Up Display Telemetry & Instructions */}
      <div className="hud-controls absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#080517]/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-500/30 text-[9px] font-mono text-cyan-400 pointer-events-auto select-none z-30 shadow-2xl">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-ping"></span>
        <span className="font-extrabold tracking-wider">
          {isDragging ? 'ROTATING COORDINATES' : 'SWIPE / DRAG ORBIT'}
        </span>
      </div>

      <div className="absolute top-4 right-5 flex flex-col gap-0.5 text-right pointer-events-none font-mono z-30">
        <div className="text-[8px] text-pink-400 font-black tracking-widest uppercase">HOLO ENGINE V3</div>
        <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{threedType}</div>
      </div>
    </div>
  );
}
