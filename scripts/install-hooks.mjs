// Points git at the versioned hooks in .githooks/. Runs on `npm install` (prepare).
// Silent outside a git checkout (e.g. Vercel builds), so it never breaks an install.
import { execSync } from "node:child_process";

try {
  execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
  execSync("git config core.hooksPath .githooks", { stdio: "ignore" });
} catch {
  // Not a git checkout: nothing to install.
}
