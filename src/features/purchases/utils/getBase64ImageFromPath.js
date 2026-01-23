import fs from "fs";
import path from "path";
export function getBase64ImageFromPath(imagePath) {
  const absolutePath = path.resolve(imagePath);
  const file = fs.readFileSync(absolutePath);
  return `data:image/png;base64,${file.toString('base64')}`;
}
