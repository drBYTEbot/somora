"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL?: string }) => Promise<PyodideInstance>;
    pyodide?: PyodideInstance;
  }
}

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (str: string) => void }) => void;
  setStderr: (opts: { batched: (str: string) => void }) => void;
  loadPackagesFromImports: (code: string) => Promise<void>;
}

const STARTER_CODE = `# Hi! I'm Python! \U0001F40D
# Write code below and press Run!

name = "Explorer"
print(f"Hello, {name}!")

# Try some math:
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
print(f"My numbers: {numbers}")
print(f"Biggest one: {max(numbers)}")
print(f"All added up: {sum(numbers)}")
`;

const SCRIPT_SRC = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";

const EXAMPLES: Record<string, string> = {
  classifier: `# Teach the computer to sort! \U0001F9E0

fruits = [
    {"name": "apple", "weight": 150},
    {"name": "banana", "weight": 120},
    {"name": "cherry", "weight": 5},
    {"name": "grape", "weight": 5},
    {"name": "orange", "weight": 130},
]

# The computer learns the average
avg = sum(f["weight"] for f in fruits) / len(fruits)
print(f"Average weight: {avg:.0f}g")
print()

for fruit in fruits:
    if fruit["weight"] > avg:
        print(f"  {fruit['name']} = HEAVY")
    else:
        print(f"  {fruit['name']} = light")

print()
print("The computer learned from data! That's AI!")
`,
  data: `# Be a data scientist! \U0001F4CA

scores = [85, 92, 78, 96, 88, 73, 91, 84]

print("=== TEST SCORES ===")
print(f"  Students: {len(scores)}")
print(f"  Average:  {sum(scores)/len(scores):.1f}")
print(f"  Best:     {max(scores)}")
print(f"  Worst:    {min(scores)}")
print("==================")
print()

for s in scores:
    if s >= 90:
        grade = "A"
    elif s >= 80:
        grade = "B"
    else:
        grade = "C"
    bar = "\u25A0" * (s // 5)
    print(f"  {grade} {bar} {s}")
`,
  fun: `# Fun with patterns! \U0001F3A8

# Make a pyramid
print("Look at this!")
for i in range(1, 8):
    spaces = " " * (7 - i)
    stars = "\u2605" * (2 * i - 1)
    print(f"{spaces}{stars}")

print()

# Count to 10
for i in range(1, 11):
    print(f"  {i}!")

print()

# Fibonacci
print("Magic numbers:")
a, b = 0, 1
for _ in range(10):
    print(f"  {a}")
    a, b = b, a + b
`,
};

export function PythonLab() {
  const { addXP } = useStore();
  const [code, setCode] = useState(STARTER_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<PyodideInstance | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (window.pyodide) {
        pyodideRef.current = window.pyodide;
        setReady(true);
        setOutput(["\u2705 Python is ready! Write code and press Run!"]);
        return;
      }
      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("fail"));
          document.head.appendChild(script);
        });
      }
      if (!window.loadPyodide) {
        setError("Could not load Python. Check your internet and refresh!");
        return;
      }
      try {
        setLoading(true);
        const py = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/" });
        py.setStdout({ batched: (str: string) => { if (!cancelled) setOutput((p) => [...p, str]); } });
        py.setStderr({ batched: (str: string) => { if (!cancelled) setOutput((p) => [...p, `\u274C ${str}`]); } });
        pyodideRef.current = py;
        window.pyodide = py;
        if (!cancelled) {
          setReady(true);
          setOutput(["\u2705 Python is ready! Write code and press Run!"]);
        }
      } catch {
        if (!cancelled) setError("Could not start Python. Try refreshing!");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const run = useCallback(async () => {
    if (!pyodideRef.current || running) return;
    setRunning(true);
    setOutput([]);
    try {
      await pyodideRef.current.loadPackagesFromImports(code);
      await pyodideRef.current.runPythonAsync(code);
      addXP(25);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setOutput((p) => [...p, `\u274C ${msg}`]);
    } finally {
      setRunning(false);
    }
  }, [code, running, addXP]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Code editor */}
        <div className="overflow-hidden rounded-3xl glass-strong">
          <div className="flex items-center justify-between border-b border-white/10 bg-night-950/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-base">{"\u{1F40D}"}</span>
              <span className="text-sm font-bold text-cloud-dim">My Code</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => { if (e.target.value) { setCode(EXAMPLES[e.target.value] ?? STARTER_CODE); setOutput([]); } }}
                defaultValue=""
                className="rounded-lg bg-night-950/50 px-2 py-1.5 text-xs text-cloud-dim focus:outline-none"
              >
                <option value="">Examples...</option>
                <option value="classifier">{"\u{1F9E0}"} Sort Fruit</option>
                <option value="data">{"\u{1F4CA}"} Test Scores</option>
                <option value="fun">{"\u{1F3A8}"} Fun Patterns</option>
              </select>
              <button
                onClick={run}
                disabled={!ready || running || loading}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-5 py-2 text-sm font-bold text-night-950 transition-all hover:shadow-glow active:scale-95 disabled:opacity-50"
              >
                {loading ? "Loading..." : running ? "Running..." : "\u25B6 Run!"}
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const start = e.currentTarget.selectionStart;
                const end = e.currentTarget.selectionEnd;
                setCode(code.substring(0, start) + "    " + code.substring(end));
                requestAnimationFrame(() => {
                  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                });
              }
            }}
            spellCheck={false}
            className="h-[440px] w-full resize-none bg-transparent p-4 font-mono text-sm text-cloud placeholder:text-cloud-dim focus:outline-none"
            style={{ tabSize: 4 }}
          />
        </div>

        {/* Console */}
        <div className="overflow-hidden rounded-3xl glass-strong">
          <div className="flex items-center justify-between border-b border-white/10 bg-night-950/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-base">{"\u{1F4AC}"}</span>
              <span className="text-sm font-bold text-cloud-dim">Output</span>
              {ready && (
                <span className="flex items-center gap-1 text-[10px] text-aurora-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-aurora-teal" /> Ready
                </span>
              )}
            </div>
            <button onClick={() => setOutput([])} className="rounded-full px-3 py-1.5 text-xs font-bold text-cloud-dim transition-colors hover:text-cloud">
              Clear
            </button>
          </div>
          <div className="h-[440px] overflow-y-auto bg-night-950/40 p-4">
            {error ? (
              <div className="text-sm text-aurora-rose">{error}</div>
            ) : loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin-slow rounded-full border-2 border-aurora-violet/30 border-t-aurora-violet" />
                  <p className="mt-3 text-sm text-cloud-dim">Loading Python...</p>
                  <p className="mt-1 text-xs text-cloud-dim">First time takes ~10 seconds</p>
                </div>
              </div>
            ) : output.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <div className="text-4xl opacity-20">{"\u{1F40D}"}</div>
                  <p className="mt-2 text-sm text-cloud-dim">Press Run to see output!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-0.5 font-mono text-sm text-aurora-leaf">
                {output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "whitespace-pre-wrap break-words",
                      line.startsWith("\u274C") && "text-aurora-rose",
                      line.startsWith("\u2705") && "text-aurora-teal",
                    )}
                  >
                    {line || "\u00A0"}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-aurora-teal/10 p-3 text-center text-sm text-aurora-teal">
        {"\u{1F31F}"} Real Python runs right in your browser! No install needed. Try the Examples for ideas!
      </div>
    </div>
  );
}
