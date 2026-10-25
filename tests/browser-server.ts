/** Isolated local database fixture. Never contacts or writes the real database. */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { member, activity, wards } from "./fixtures";

const members = Array.from({ length: 1005 }, (_, index) => member(index));
const activities = [activity(), activity("2000-01-01", 1), activity("2099-01-01", 2)];
let failTable = "";
const server = createServer((req, res) => {
  const url = new URL(req.url!, "http://127.0.0.1:54421");
  res.setHeader("Content-Type", "application/json");
  if (url.pathname === "/__fail") {
    failTable = url.searchParams.get("table") ?? "";
    return res.end("{}");
  }
  const jwt = req.headers.authorization?.split(" ")[1] ?? "";
  let id = "admin";
  try { id = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString()).sub; } catch { /* Public fixture requests. */ }
  if (url.pathname === "/auth/v1/user") return res.end(JSON.stringify({ id, email: "test@example.test", role: "authenticated", aud: "authenticated", app_metadata: {}, user_metadata: {} }));
  const table = url.pathname.split("/").at(-1);
  if (table === failTable) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ code: "TEST_FAILURE", message: "Deliberate fixture failure" }));
  }
  if (table === "profiles") return res.end(JSON.stringify({ id, first_name: "Toets", last_name: "Gebruiker", epos: "test@example.test", rol: id === "reader" ? "ouderling" : "admin", wyk_id: null }));
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end("{}");
  }
  const rows = table === "lede" ? members : table === "wyke" ? wards : table === "bediening_aktiwiteite" ? activities : [];
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const limit = Number(url.searchParams.get("limit") ?? 1000);
  return res.end(JSON.stringify(rows.slice(offset, offset + limit)));
});
server.listen(54421, "127.0.0.1");
const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--port", "3345"], {
  stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54421", NEXT_PUBLIC_SUPABASE_ANON_KEY: "local-test-anon-key", SUPABASE_SERVICE_ROLE_KEY: "", NEXT_TELEMETRY_DISABLED: "1" },
});
function stop() { next.kill("SIGTERM"); server.close(); }
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
next.on("exit", (code) => { server.close(); process.exit(code ?? 0); });
