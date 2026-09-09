const fs = require('fs');
const { PNG } = require('pngjs');

// 1. Read the clean cropped image
const imgBuffer = fs.readFileSync('src/components/magicui/bull-clean.png');
const png = PNG.sync.read(imgBuffer);
const width = png.width;
const height = png.height;

// 2. Convert to binary 2D array (1 = line, 0 = background)
const binary = new Uint8Array(width * height);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    const brightness = (r + g + b) / 3;
    // Dark lines are 1, light background is 0
    binary[y * width + x] = brightness < 150 ? 1 : 0;
  }
}

// 3. Zhang-Suen Thinning Algorithm to extract the exact 1-pixel centerline skeleton
function zhangSuen(grid, w, h) {
  let changed = true;
  const skeleton = new Uint8Array(grid);

  function getNeighbors(x, y) {
    const p2 = y > 0 ? skeleton[(y - 1) * w + x] : 0;
    const p3 = y > 0 && x < w - 1 ? skeleton[(y - 1) * w + (x + 1)] : 0;
    const p4 = x < w - 1 ? skeleton[y * w + (x + 1)] : 0;
    const p5 = y < h - 1 && x < w - 1 ? skeleton[(y + 1) * w + (x + 1)] : 0;
    const p6 = y < h - 1 ? skeleton[(y + 1) * w + x] : 0;
    const p7 = y < h - 1 && x > 0 ? skeleton[(y + 1) * w + (x - 1)] : 0;
    const p8 = x > 0 ? skeleton[y * w + (x - 1)] : 0;
    const p9 = y > 0 && x > 0 ? skeleton[(y - 1) * w + (x - 1)] : 0;
    return [p2, p3, p4, p5, p6, p7, p8, p9];
  }

  while (changed) {
    changed = false;
    const toRemove1 = [];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        if (skeleton[y * w + x] === 0) continue;
        const [p2, p3, p4, p5, p6, p7, p8, p9] = getNeighbors(x, y);
        const B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
        if (B < 2 || B > 6) continue;
        
        let A = 0;
        const n = [p2, p3, p4, p5, p6, p7, p8, p9, p2];
        for (let i = 0; i < 8; i++) {
          if (n[i] === 0 && n[i + 1] === 1) A++;
        }
        if (A !== 1) continue;

        if (p2 * p4 * p6 !== 0) continue;
        if (p4 * p6 * p8 !== 0) continue;

        toRemove1.push(y * w + x);
      }
    }
    if (toRemove1.length > 0) {
      for (const idx of toRemove1) skeleton[idx] = 0;
      changed = true;
    }

    const toRemove2 = [];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        if (skeleton[y * w + x] === 0) continue;
        const [p2, p3, p4, p5, p6, p7, p8, p9] = getNeighbors(x, y);
        const B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
        if (B < 2 || B > 6) continue;
        
        let A = 0;
        const n = [p2, p3, p4, p5, p6, p7, p8, p9, p2];
        for (let i = 0; i < 8; i++) {
          if (n[i] === 0 && n[i + 1] === 1) A++;
        }
        if (A !== 1) continue;

        if (p2 * p4 * p8 !== 0) continue;
        if (p2 * p6 * p8 !== 0) continue;

        toRemove2.push(y * w + x);
      }
    }
    if (toRemove2.length > 0) {
      for (const idx of toRemove2) skeleton[idx] = 0;
      changed = true;
    }
  }

  return skeleton;
}

const skeleton = zhangSuen(binary, width, height);

// 4. Trace a single continuous topological traversal (Eulerian path / Depth-First Search traversal)
const visited = new Uint8Array(width * height);
const points = [];

// Find a good starting endpoint (e.g. top right back line or horn tip)
let startX = 0, startY = 0;
for (let x = width - 1; x >= 0; x--) {
  for (let y = 0; y < height; y++) {
    if (skeleton[y * width + x] === 1) {
      startX = x;
      startY = y;
      break;
    }
  }
  if (startX > 0) break;
}

function dfs(x, y) {
  visited[y * width + x] = 1;
  points.push({ x, y });

  // 8-neighbor directions sorted by proximity
  const dirs = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [1, -1], [-1, 1], [1, 1]
  ];

  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      if (skeleton[ny * width + nx] === 1 && !visited[ny * width + nx]) {
        dfs(nx, ny);
        // Add back-edge point when returning from branch so the laser travels smoothly without breaking!
        points.push({ x, y });
      }
    }
  }
}

dfs(startX, startY);

// Also sweep any remaining disconnected small components
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (skeleton[y * width + x] === 1 && !visited[y * width + x]) {
      dfs(x, y);
    }
  }
}

console.log('Total continuous points:', points.length);

// 5. Simplify and smooth points to construct a clean SVG path
const simplified = [];
const step = 2; // Sample every 2 points for silk-smooth curve
for (let i = 0; i < points.length; i += step) {
  simplified.push(points[i]);
}
if (points.length > 0 && simplified[simplified.length - 1] !== points[points.length - 1]) {
  simplified.push(points[points.length - 1]);
}

let d = `M ${simplified[0].x} ${simplified[0].y}`;
for (let i = 1; i < simplified.length; i++) {
  d += ` L ${simplified[i].x} ${simplified[i].y}`;
}

fs.writeFileSync('src/components/magicui/bull-centerline.json', JSON.stringify({
  width,
  height,
  pathLength: simplified.length,
  d
}));

console.log('Centerline single-stroke path generated successfully! Points:', simplified.length);
