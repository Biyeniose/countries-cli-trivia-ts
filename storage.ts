// storage.ts
import fs from "fs";

const SCORES_FILE = "./scores.json";

export function saveScores(scores: any[]) {
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
}

export function loadScores() {
  if (fs.existsSync(SCORES_FILE)) {
    const data = fs.readFileSync(SCORES_FILE, "utf-8");
    return JSON.parse(data);
  }
  return [];
}
