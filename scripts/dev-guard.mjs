#!/usr/bin/env node
/**
 * Refuse to start a command if one or more TCP ports are already bound.
 * Usage:
 *   node scripts/dev-guard.mjs --port 3000 -- next dev --turbopack
 *   node scripts/dev-guard.mjs --port 3000 --port 4111 -- next build
 */
import net from "node:net";
import { spawn, execFileSync } from "node:child_process";

const PORT_ROLE = {
  3000: "UI (next)",
  4111: "agent (mastra)",
};

function parseArgs(argv) {
  const dash = argv.indexOf("--");
  if (dash === -1) {
    throw new Error("dev-guard: expected `-- <command>`");
  }
  const flags = argv.slice(0, dash);
  const command = argv.slice(dash + 1);
  const ports = [];
  for (let i = 0; i < flags.length; i++) {
    if (flags[i] === "--port") {
      const port = Number(flags[++i]);
      if (!Number.isInteger(port) || port <= 0) {
        throw new Error("dev-guard: --port <number> is required");
      }
      ports.push(port);
    }
  }
  if (ports.length === 0) {
    throw new Error("dev-guard: at least one --port <number> is required");
  }
  if (command.length === 0) {
    throw new Error("dev-guard: missing command after --");
  }
  return { ports, command };
}

function portInUse(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: "127.0.0.1", port });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

function describeListener(port) {
  try {
    const out = execFileSync("ss", ["-ltnp"], {
      encoding: "utf8",
      timeout: 2000,
    });
    const lines = out.split("\n").filter((line) => {
      return (
        line.includes(`:${port} `) ||
        line.includes(`:${port}\n`) ||
        line.endsWith(`:${port}`) ||
        line.includes(`:${port} `) ||
        /:(\d+)\s/.test(line) && line.includes(`:${port}`)
      );
    });
    const hit = out
      .split("\n")
      .find((line) => new RegExp(`[:.]${port}\\s`).test(line));
    if (!hit) return "unknown process";
    const users = hit.match(/users:\(\("([^"]+)",pid=(\d+)/);
    if (users) return `${users[1]} pid=${users[2]}`;
    return hit.trim();
  } catch {
    return "unknown process (ss unavailable)";
  }
}

const { ports, command } = parseArgs(process.argv.slice(2));

const busy = [];
for (const port of ports) {
  if (await portInUse(port)) {
    busy.push(port);
  }
}

if (busy.length > 0) {
  for (const port of busy) {
    const role = PORT_ROLE[port] ?? "service";
    const who = describeListener(port);
    console.error(
      `dev-guard: port ${port} (${role}) is already listening [${who}].`,
    );
  }
  console.error(
    "Stop that process before running this command. UI is :3000. Agent is :4111.",
  );
  process.exit(1);
}

const child = spawn(command[0], command.slice(1), {
  stdio: "inherit",
  env: process.env,
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.exit(1);
  }
  process.exit(code ?? 1);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => child.kill(sig));
}
