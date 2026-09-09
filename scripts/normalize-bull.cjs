const fs = require('fs');
const file = fs.readFileSync('src/components/magicui/TracingLightBeam.tsx', 'utf8');
const match = file.match(/const GEOMETRIC_BULL_PATH = "([^"]+)"/);
if (!match) {
  console.log("No match found");
  process.exit(1);
}
const tokens = match[1].split(/[ML\s]+/).filter(Boolean).map(Number);
const xs = [];
const ys = [];
for (let i = 0; i < tokens.length; i += 2) {
  xs.push(tokens[i]);
  ys.push(tokens[i + 1]);
}
const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);
console.log(`X range: [${minX}, ${maxX}], Width: ${maxX - minX}`);
console.log(`Y range: [${minY}, ${maxY}], Height: ${maxY - minY}`);

// Let's normalize coordinates to fit nicely into a standard viewBox, say 0 0 300 250 with a margin of 10
const targetWidth = 300;
const targetHeight = 250;
const padding = 15;
const scale = Math.min((targetWidth - 2 * padding) / (maxX - minX), (targetHeight - 2 * padding) / (maxY - minY));

const normalizedPoints = [];
for (let i = 0; i < tokens.length; i += 2) {
  const nx = Math.round((tokens[i] - minX) * scale + padding);
  const ny = Math.round((tokens[i + 1] - minY) * scale + padding);
  normalizedPoints.push({ x: nx, y: ny });
}

let newPath = `M ${normalizedPoints[0].x} ${normalizedPoints[0].y}`;
for (let i = 1; i < normalizedPoints.length; i++) {
  newPath += ` L ${normalizedPoints[i].x} ${normalizedPoints[i].y}`;
}

console.log("Normalized scale:", scale);
console.log("New path length in chars:", newPath.length);

fs.writeFileSync('scripts/normalized_path.json', JSON.stringify({
  viewBox: `0 0 ${targetWidth} ${targetHeight}`,
  viewBoxW: targetWidth,
  viewBoxH: targetHeight,
  path: newPath
}, null, 2));
