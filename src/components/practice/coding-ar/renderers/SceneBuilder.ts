import * as THREE from "three";
import { ExecutionStep, DataStructureState } from "../types";
import { createTextTexture } from "./textTexture";

/**
 * Procedural Three.js 3D Scene Builder.
 * Reconstructs 3D representations of active data structures at each execution step.
 */
export class SceneBuilder {
  private activeMeshes: THREE.Object3D[] = [];

  /**
   * Cleans up and disposes all active meshes, geometries, and materials.
   */
  clear(scene: THREE.Scene) {
    this.activeMeshes.forEach((mesh) => {
      scene.remove(mesh);
      mesh.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          if (m.geometry) m.geometry.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else if (m.material) {
            m.material.dispose();
          }
        }
      });
    });
    this.activeMeshes = [];
  }

  /**
   * Builds the 3D scene from the current execution step's data structures.
   */
  build(scene: THREE.Scene, step: ExecutionStep) {
    this.clear(scene);

    const group = new THREE.Group();
    group.name = `step-${step.stepNumber}`;

    // Process each data structure in the current step
    step.dataStructures.forEach((ds, index) => {
      const yOffset = index * -2.5;

      switch (ds.type) {
        case "array":
          this.buildArray(group, ds, yOffset);
          break;
        case "sliding_window":
          this.buildSlidingWindow(group, ds);
          break;
        case "hash_map":
          this.buildHashMap(group, ds);
          break;
        case "stack":
          this.buildStack(group, ds);
          break;
        case "queue":
          this.buildQueue(group, ds);
          break;
        case "linked_list":
          this.buildLinkedList(group, ds);
          break;
        case "tree":
          this.buildTree(group, ds);
          break;
        case "call_stack":
          this.buildCallStack(group, ds);
          break;
        default:
          break;
      }
    });

    scene.add(group);
    this.activeMeshes.push(group);
  }

  // 1. Array 3D Builder
  private buildArray(
    parent: THREE.Group,
    ds: DataStructureState,
    yOffset: number,
  ) {
    if (!Array.isArray(ds.data)) return;
    const arrayGroup = new THREE.Group();
    const boxSize = 1.2;
    const spacing = 0.35;
    const totalWidth = ds.data.length * (boxSize + spacing) - spacing;
    const startX = -totalWidth / 2 + boxSize / 2;

    ds.data.forEach((val, idx) => {
      const isHighlighted = ds.highlightIndices?.includes(idx);
      const posX = startX + idx * (boxSize + spacing);
      const posY = yOffset;

      const geometry = new THREE.BoxGeometry(boxSize, boxSize, 0.5);
      const texture = createTextTexture(String(val), {
        bgColor: isHighlighted ? "#fff0ec" : "#ffffff",
        textColor: isHighlighted ? "#ff5520" : "#1e1c1a",
        subText: `i=${idx}`,
        fontSize: 90,
      });

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.1,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(posX, posY, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      arrayGroup.add(mesh);

      // Render pointer markers (e.g. L, R, Mid, i)
      if (ds.pointers) {
        Object.entries(ds.pointers).forEach(([pointerName, pointerIdx]) => {
          if (pointerIdx === idx) {
            this.buildPointerBadge(
              arrayGroup,
              pointerName,
              posX,
              posY + boxSize * 0.9,
            );
          }
        });
      }
    });

    parent.add(arrayGroup);
  }

  // 2. Sliding Window 3D Overlay
  private buildSlidingWindow(parent: THREE.Group, ds: DataStructureState) {
    if (!ds.data || typeof ds.data.start !== "number") return;
    const { start, end, sum } = ds.data;
    const boxSize = 1.2;
    const spacing = 0.35;
    const stepDist = boxSize + spacing;
    // Assuming array centered at 6 elements
    const totalWidth = 6 * stepDist - spacing;
    const startArrayX = -totalWidth / 2 + boxSize / 2;

    const leftX = startArrayX + start * stepDist - 0.2;
    const rightX = startArrayX + end * stepDist + 0.2;
    const windowWidth = rightX - leftX + boxSize;
    const centerX = (leftX + rightX) / 2;

    // Translucent glowing bounding bracket
    const bracketGeo = new THREE.BoxGeometry(windowWidth, boxSize + 0.4, 0.7);
    const bracketMat = new THREE.MeshBasicMaterial({
      color: 0xff5520,
      transparent: true,
      opacity: 0.2,
      wireframe: false,
    });
    const bracket = new THREE.Mesh(bracketGeo, bracketMat);
    bracket.position.set(centerX, 0, 0);
    parent.add(bracket);

    // Window Wireframe edges
    const wireGeo = new THREE.EdgesGeometry(bracketGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xff5520,
      linewidth: 2,
    });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    wireframe.position.copy(bracket.position);
    parent.add(wireframe);

    // Floating Sum Badge
    if (sum !== undefined) {
      const sumTexture = createTextTexture(`Σ = ${sum}`, {
        bgColor: "#ff5520",
        textColor: "#ffffff",
        fontSize: 80,
      });
      const sumMat = new THREE.MeshBasicMaterial({
        map: sumTexture,
        transparent: true,
      });
      const sumGeo = new THREE.PlaneGeometry(1.6, 0.6);
      const sumMesh = new THREE.Mesh(sumGeo, sumMat);
      sumMesh.position.set(centerX, 1.4, 0.4);
      parent.add(sumMesh);
    }
  }

  // 3. HashMap 3D Builder
  private buildHashMap(parent: THREE.Group, ds: DataStructureState) {
    if (!ds.data || typeof ds.data !== "object") return;
    const mapGroup = new THREE.Group();
    const entries = Object.entries(ds.data);
    const cardWidth = 1.4;
    const cardHeight = 0.9;
    const spacing = 0.3;

    // Header label
    const headerTexture = createTextTexture(ds.name || "HashMap", {
      bgColor: "#f4efe8",
      textColor: "#6b6661",
      fontSize: 60,
    });
    const headerMat = new THREE.MeshBasicMaterial({ map: headerTexture });
    const headerGeo = new THREE.PlaneGeometry(2.2, 0.6);
    const headerMesh = new THREE.Mesh(headerGeo, headerMat);
    headerMesh.position.set(0, 2.2, 0);
    mapGroup.add(headerMesh);

    if (entries.length === 0) {
      const emptyTexture = createTextTexture("Empty {} ", {
        bgColor: "#ffffff",
        textColor: "#a8a29e",
        fontSize: 60,
      });
      const emptyMat = new THREE.MeshBasicMaterial({ map: emptyTexture });
      const emptyGeo = new THREE.PlaneGeometry(2.0, 0.7);
      const emptyMesh = new THREE.Mesh(emptyGeo, emptyMat);
      emptyMesh.position.set(0, 1.2, 0);
      mapGroup.add(emptyMesh);
    } else {
      const totalWidth = entries.length * (cardWidth + spacing) - spacing;
      const startX = -totalWidth / 2 + cardWidth / 2;

      entries.forEach(([key, val], idx) => {
        const posX = startX + idx * (cardWidth + spacing);
        const isMatched =
          ds.activeKey !== undefined && String(ds.activeKey) === String(key);

        const cardTexture = createTextTexture(`${key} → ${val}`, {
          bgColor: isMatched ? "#10b981" : "#ffffff",
          textColor: isMatched ? "#ffffff" : "#1e1c1a",
          fontSize: 70,
        });

        const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, 0.3);
        const cardMat = new THREE.MeshStandardMaterial({
          map: cardTexture,
          roughness: 0.2,
          metalness: 0.1,
        });
        const cardMesh = new THREE.Mesh(cardGeo, cardMat);
        cardMesh.position.set(posX, 1.2, 0);
        cardMesh.castShadow = true;
        mapGroup.add(cardMesh);
      });
    }

    parent.add(mapGroup);
  }

  // 4. Stack 3D Builder (LIFO)
  private buildStack(parent: THREE.Group, ds: DataStructureState) {
    if (!Array.isArray(ds.data)) return;
    const stackGroup = new THREE.Group();
    const itemWidth = 2.0;
    const itemHeight = 0.7;
    const itemDepth = 0.5;

    // Stack bottom container
    const baseGeo = new THREE.BoxGeometry(
      itemWidth + 0.4,
      0.2,
      itemDepth + 0.2,
    );
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x44403c });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -1.5, 0);
    stackGroup.add(baseMesh);

    // Items stacked vertically
    ds.data.forEach((val, idx) => {
      const posY = -1.1 + idx * (itemHeight + 0.1);
      const isTop = idx === ds.data.length - 1;

      const texture = createTextTexture(String(val), {
        bgColor: isTop ? "#fff0ec" : "#ffffff",
        textColor: isTop ? "#ff5520" : "#1e1c1a",
        subText: isTop ? "TOP" : undefined,
        fontSize: 80,
      });

      const itemGeo = new THREE.BoxGeometry(itemWidth, itemHeight, itemDepth);
      const itemMat = new THREE.MeshStandardMaterial({ map: texture });
      const itemMesh = new THREE.Mesh(itemGeo, itemMat);
      itemMesh.position.set(0, posY, 0);
      stackGroup.add(itemMesh);
    });

    parent.add(stackGroup);
  }

  // 5. Queue 3D Builder (FIFO)
  private buildQueue(parent: THREE.Group, ds: DataStructureState) {
    if (!Array.isArray(ds.data)) return;
    const queueGroup = new THREE.Group();
    const itemSize = 1.0;
    const spacing = 0.3;

    ds.data.forEach((val, idx) => {
      const posX = idx * (itemSize + spacing) - 1.5;
      const isFront = idx === 0;

      const texture = createTextTexture(String(val), {
        bgColor: isFront ? "#10b981" : "#ffffff",
        textColor: isFront ? "#ffffff" : "#1e1c1a",
        subText: isFront ? "FRONT" : undefined,
        fontSize: 80,
      });

      const itemGeo = new THREE.CylinderGeometry(
        itemSize / 2,
        itemSize / 2,
        0.4,
        24,
      );
      itemGeo.rotateX(Math.PI / 2);
      const itemMat = new THREE.MeshStandardMaterial({ map: texture });
      const itemMesh = new THREE.Mesh(itemGeo, itemMat);
      itemMesh.position.set(posX, 0, 0);
      queueGroup.add(itemMesh);
    });

    parent.add(queueGroup);
  }

  // 6. Linked List 3D Builder
  private buildLinkedList(parent: THREE.Group, ds: DataStructureState) {
    if (!Array.isArray(ds.data)) return;
    const listGroup = new THREE.Group();
    const nodeRadius = 0.6;
    const spacing = 1.8;
    const startX = -((ds.data.length - 1) * spacing) / 2;

    ds.data.forEach((node, idx) => {
      const posX = startX + idx * spacing;
      const posY = 0;

      const texture = createTextTexture(String(node.val), {
        bgColor: "#ffffff",
        textColor: "#ff5520",
        fontSize: 90,
      });

      const nodeGeo = new THREE.SphereGeometry(nodeRadius, 32, 32);
      const nodeMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.2,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(posX, posY, 0);
      listGroup.add(nodeMesh);

      // Arrow pointing to next node
      if (idx < ds.data.length - 1) {
        const arrowDir = new THREE.Vector3(1, 0, 0);
        const arrowOrigin = new THREE.Vector3(posX + nodeRadius, posY, 0);
        const arrowLength = spacing - 2 * nodeRadius;
        const arrowHelper = new THREE.ArrowHelper(
          arrowDir,
          arrowOrigin,
          arrowLength,
          0x1e1c1a,
          0.25,
          0.15,
        );
        listGroup.add(arrowHelper);
      }
    });

    parent.add(listGroup);
  }

  // 7. Tree 3D Builder
  private buildTree(parent: THREE.Group, ds: DataStructureState) {
    if (!ds.data || typeof ds.data.val === "undefined") return;
    const treeGroup = new THREE.Group();

    const renderNode = (node: any, x: number, y: number, spread: number) => {
      if (!node) return;

      const isHighlighted = ds.highlightIndices?.includes(node.val);
      const texture = createTextTexture(String(node.val), {
        bgColor: isHighlighted ? "#ff5520" : "#ffffff",
        textColor: isHighlighted ? "#ffffff" : "#1e1c1a",
        fontSize: 90,
      });

      const geo = new THREE.SphereGeometry(0.5, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, 0);
      treeGroup.add(mesh);

      // Left Child
      if (node.left) {
        const childX = x - spread;
        const childY = y - 1.4;
        this.buildBranch(treeGroup, x, y, childX, childY);
        renderNode(node.left, childX, childY, spread * 0.6);
      }

      // Right Child
      if (node.right) {
        const childX = x + spread;
        const childY = y - 1.4;
        this.buildBranch(treeGroup, x, y, childX, childY);
        renderNode(node.right, childX, childY, spread * 0.6);
      }
    };

    renderNode(ds.data, 0, 1.2, 1.8);
    parent.add(treeGroup);
  }

  private buildBranch(
    parent: THREE.Group,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    const points = [
      new THREE.Vector3(x1, y1 - 0.4, 0),
      new THREE.Vector3(x2, y2 + 0.4, 0),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0xa8a29e, linewidth: 2 });
    const line = new THREE.Line(geo, mat);
    parent.add(line);
  }

  // 8. Call Stack 3D Builder
  private buildCallStack(parent: THREE.Group, ds: DataStructureState) {
    if (!Array.isArray(ds.data)) return;
    const callGroup = new THREE.Group();
    const frameWidth = 2.4;
    const frameHeight = 0.6;

    ds.data.forEach((frame, idx) => {
      const posY = -1.0 + idx * (frameHeight + 0.15);
      const isTop = idx === ds.data.length - 1;

      const texture = createTextTexture(String(frame), {
        bgColor: isTop ? "#7c3aed" : "#f5f3ff",
        textColor: isTop ? "#ffffff" : "#4c1d95",
        fontSize: 50,
      });

      const frameGeo = new THREE.BoxGeometry(frameWidth, frameHeight, 0.2);
      const frameMat = new THREE.MeshStandardMaterial({ map: texture });
      const mesh = new THREE.Mesh(frameGeo, frameMat);
      mesh.position.set(0, posY, 0);
      callGroup.add(mesh);
    });

    parent.add(callGroup);
  }

  // Helper: Pointer badge
  private buildPointerBadge(
    parent: THREE.Group,
    name: string,
    x: number,
    y: number,
  ) {
    const texture = createTextTexture(name, {
      bgColor: "#ff5520",
      textColor: "#ffffff",
      fontSize: 90,
    });
    const geo = new THREE.PlaneGeometry(0.7, 0.5);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, 0.3);
    parent.add(mesh);
  }
}
