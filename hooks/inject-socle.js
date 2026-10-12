// Un plugin ne peut pas fournir de CLAUDE.md : on injecte le socle au démarrage de session.
const fs = require("fs");
const path = require("path");

const socle = fs.readFileSync(path.join(__dirname, "..", "socle.md"), "utf8");
const output = {
  hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: socle },
};
process.stdout.write(JSON.stringify(output));
