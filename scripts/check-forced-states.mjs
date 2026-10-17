// Cada regla de src/ui con :hover, :active o :focus-visible debe tener su gemelo forzado
// `:where([data-sds-state="…"]) …` en la misma lista de selectores (ADR 0010). Sin él, la matriz
// de estados de /lab/ui mostraría un estado que no coincide con producción.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..", "src", "ui");
const PSEUDO = { ":hover": "hover", ":active": "pressed", ":focus-visible": "focus" };
const errors = [];

for (const dir of readdirSync(root, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const file of readdirSync(path.join(root, dir.name))) {
    if (!file.endsWith(".css")) continue;
    const css = readFileSync(path.join(root, dir.name, file), "utf8").replace(
      /\/\*[\s\S]*?\*\//g,
      "",
    );
    for (const m of css.matchAll(/([^{};]+)\{/g)) {
      const prelude = m[1].trim();
      if (prelude.startsWith("@")) continue;
      const bare = prelude.replace(/:not\((?:[^()]|\([^()]*\))*\)/g, "");
      for (const [pseudo, state] of Object.entries(PSEUDO)) {
        if (bare.includes(pseudo) && !prelude.includes(`data-sds-state="${state}"`)) {
          errors.push(
            `${dir.name}/${file}: "${prelude.split("\n")[0]}" sin :where([data-sds-state="${state}"])`,
          );
        }
      }
    }
  }
}

if (errors.length) {
  console.error(`Faltan estados forzados (ADR 0010):\n${errors.join("\n")}`);
  process.exit(1);
}
console.log("Estados forzados: OK");
