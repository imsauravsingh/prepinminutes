import * as THREE from "three";

/**
 * Procedural text texture generator for 3D elements.
 * Generates crisp, lightweight canvas textures for values, indices, and pointers.
 */
export function createTextTexture(
  text: string,
  options?: {
    bgColor?: string;
    textColor?: string;
    subText?: string;
    fontSize?: number;
    subFontSize?: number;
  },
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const bgColor = options?.bgColor || "#ffffff";
  const textColor = options?.textColor || "#1e1c1a";
  const fontSize = options?.fontSize || 88;

  // Background
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 240, 28);
  ctx.fill();

  // Subtle border
  ctx.lineWidth = 10;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
  ctx.stroke();

  // Main text
  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const yOffset = options?.subText ? 105 : 128;
  ctx.fillText(text, 128, yOffset);

  // Subtext (e.g. index or key)
  if (options?.subText) {
    ctx.font = `600 ${options.subFontSize || 40}px sans-serif`;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillText(options.subText, 128, 185);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
