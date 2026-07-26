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
  globals: {
    get: (name: string) => unknown;
    set: (name: string, val: unknown) => void;
  };
}

const STARTER_CODE = `# Welcome to Python Lab! \U0001F40D
# Real Python runs in your browser - no install needed!

# Try this:
name = "Explorer"
print(f"Hello, {name}!")

# Do some math:
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
print(f"Numbers: {numbers}")
print(f"Sorted:  {sorted(numbers)}")
print(f"Sum:     {sum(numbers)}")
print(f"Max:     {max(numbers)}")

# Make a simple AI-style classifier:
def is_even(n):
    return n % 2 == 0

for n in numbers:
    label = "even" if is_even(n) else "odd"
    print(f"  {n} is {label}")
`;

const SCRIPT_SRC = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";

export function PythonLab() {
  const { addXP } = useStore();
  const [code, setCode] = useState(STARTER_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedPackages, setLoadedPackages] = useState<string[]>([]);
  const pyodideRef = useRef<PyodideInstance | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPyodide() {
      if (window.pyodide) {
        pyodideRef.current = window.pyodide;
        setPyodideReady(true);
        return;
      }

      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Pyodide"));
          document.head.appendChild(script);
        });
      }

      if (!window.loadPyodide) {
        setLoadError("Python engine failed to load. Check your connection.");
        return;
      }

      try {
        setLoading(true);
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
        });

        py.setStdout({
          batched: (str: string) => {
            if (!cancelled) setOutput((prev) => [...prev, str]);
          },
        });
        py.setStderr({
          batched: (str: string) => {
            if (!cancelled) setOutput((prev) => [...prev, `\u274C ${str}`]);
          },
        });

        pyodideRef.current = py;
        window.pyodide = py;
        if (!cancelled) {
          setPyodideReady(true);
          setOutput(["\u2705 Python is ready! Type some code and press Run."]);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Could not start Python. Try refreshing the page.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPyodide();
    return () => { cancelled = true; };
  }, []);

  const run = useCallback(async () => {
    if (!pyodideRef.current || running) return;
    setRunning(true);
    setOutput([]);

    try {
      await pyodideRef.current.loadPackagesFromImports(code);
      const newPackages = detectPackages(code).filter(
        (p) => !loadedPackages.includes(p),
      );
      if (newPackages.length > 0) {
        setLoadedPackages((prev) => [...prev, ...newPackages]);
        setOutput((prev) => [`\u{1F4E6} Loading packages: ${newPackages.join(", ")}...`]);
      }
      await pyodideRef.current.runPythonAsync(code);
      addXP(25);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setOutput((prev) => [...prev, `\u274C ${msg}`]);
    } finally {
      setRunning(false);
    }
  }, [code, running, addXP, loadedPackages]);

  function clearOutput() {
    setOutput([]);
  }

  function loadExample(name: string) {
    const examples: Record<string, string> = {
      classifier: `# Train a simple classifier! \U0001F9E0
# This sorts fruits by weight using a rule the computer learns

fruits = [
    {"name": "apple", "weight": 150, "color": "red"},
    {"name": "banana", "weight": 120, "color": "yellow"},
    {"name": "cherry", "weight": 5, "color": "red"},
    {"name": "grape", "weight": 5, "color": "purple"},
    {"name": "orange", "weight": 130, "color": "orange"},
]

# Simple "AI": learn the average weight
avg_weight = sum(f["weight"] for f in fruits) / len(fruits)
print(f"Average fruit weight: {avg_weight:.0f}g")
print()

# Classify: heavy or light?
for fruit in fruits:
    category = "heavy" if fruit["weight"] > avg_weight else "light"
    print(f"  {fruit['name']:10} -> {category}")

print()
print("The computer learned the pattern from data!")
`,
      data: `# Data analysis with Python! \U0001F4CA
# Analyze test scores like a data scientist

scores = [85, 92, 78, 96, 88, 73, 91, 84, 79, 95, 87, 82]

# Calculate statistics
average = sum(scores) / len(scores)
minimum = min(scores)
maximum = max(scores)
range_val = maximum - minimum

# Sort and find median
sorted_scores = sorted(scores)
mid = len(sorted_scores) // 2
median = sorted_scores[mid]

print("=" * 30)
print("  TEST SCORE ANALYSIS")
print("=" * 30)
print(f"  Students:    {len(scores)}")
print(f"  Average:    {average:.1f}")
print(f"  Median:     {median}")
print(f"  Highest:    {maximum}")
print(f"  Lowest:     {minimum}")
print(f"  Range:      {range_val}")
print("=" * 30)

# Grade distribution
grades = {"A": 0, "B": 0, "C": 0, "D": 0}
for s in scores:
    if s >= 90: grades["A"] += 1
    elif s >= 80: grades["B"] += 1
    elif s >= 70: grades["C"] += 1
    else: grades["D"] += 1

print("\\nGrade distribution:")
for grade, count in grades.items():
    bar = "\u25A0" * count
    print(f"  {grade}: {bar} ({count})")
`,
      loop: `# Fun with loops and patterns! \U0001F3A8

# Make a pyramid
print("Pyramid:")
for i in range(1, 8):
    spaces = " " * (7 - i)
    stars = "\u2605" * (2 * i - 1)
    print(f"{spaces}{stars}")

print()

# Multiplication table
print("Times table (5x5):")
for i in range(1, 6):
    row = ""
    for j in range(1, 6):
        row += f"{i * j:4}"
    print(row)

print()

# Fibonacci sequence
print("Fibonacci:")
a, b = 0, 1
fib = []
for _ in range(10):
    fib.append(a)
    a, b = b, a + b
print(f"  {fib}")
print(f"  Golden ratio: {fib[-1] / fib[-2]:.6f}")
`,
    };
    setCode(examples[name] ?? STARTER_CODE);
    setOutput([]);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Code editor */}
        <div className="overflow-hidden rounded-3xl glass-strong">
          <div className="flex items-center justify-between border-b border-white/10 bg-night-950/50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">{"\u{1F40D}"}</span>
              <span className="text-xs font-semibold text-cloud-dim">main.py</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => e.target.value && loadExample(e.target.value)}
                defaultValue=""
                className="rounded-lg bg-night-950/50 px-2 py-1 text-[10px] text-cloud-dim focus:outline-none"
              >
                <option value="">Examples...</option>
                <option value="classifier">{"\u{1F9E0}"} AI Classifier</option>
                <option value="data">{"\u{1F4CA}"} Data Analysis</option>
                <option value="loop">{"\u{1F3A8}"} Patterns & Loops</option>
              </select>
              <button
                onClick={run}
                disabled={!pyodideReady || running || loading}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-4 py-1.5 text-xs font-semibold text-night-950 transition-all hover:shadow-glow active:scale-95 disabled:opacity-50"
              >
                {loading ? "Loading..." : running ? "Running..." : "Run"}
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
                const newCode = code.substring(0, start) + "    " + code.substring(end);
                setCode(newCode);
                requestAnimationFrame(() => {
                  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                });
              }
            }}
            spellCheck={false}
            className="h-[460px] w-full resize-none bg-transparent p-4 font-mono text-sm text-cloud placeholder:text-cloud-dim focus:outline-none"
            style={{ tabSize: 4 }}
          />
        </div>

        {/* Console output */}
        <div className="overflow-hidden rounded-3xl glass-strong">
          <div className="flex items-center justify-between border-b border-white/10 bg-night-950/50 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">{"\u{1F4BB}"}</span>
              <span className="text-xs font-semibold text-cloud-dim">Console</span>
              {pyodideReady && (
                <span className="flex items-center gap-1 text-[10px] text-aurora-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-aurora-teal" />
                  Python ready
                </span>
              )}
            </div>
            <button
              onClick={clearOutput}
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-cloud-dim transition-colors hover:text-cloud"
            >
              Clear
            </button>
          </div>
          <div className="h-[460px] overflow-y-auto bg-night-950/40 p-4">
            {loadError ? (
              <div className="text-sm text-aurora-rose">{loadError}</div>
            ) : loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin-slow rounded-full border-2 border-aurora-violet/30 border-t-aurora-violet" />
                  <p className="mt-3 text-xs text-cloud-dim">
                    Loading Python engine...
                    <br />
                    <span className="text-[10px]">First load takes ~10 seconds</span>
                  </p>
                </div>
              </div>
            ) : output.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <div className="text-4xl opacity-20">{"\u{1F40D}"}</div>
                  <p className="mt-2 text-xs text-cloud-dim">
                    Output will appear here
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0.5 font-mono text-xs text-aurora-leaf">
                {output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "whitespace-pre-wrap break-words",
                      line.startsWith("\u274C") && "text-aurora-rose",
                      line.startsWith("\u2705") && "text-aurora-teal",
                      line.startsWith("\u{1F4E6}") && "text-aurora-amber",
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

      <div className="mt-3 rounded-2xl bg-aurora-amber/10 p-3 text-xs text-aurora-amber">
        <span className="font-semibold">How it works:</span> Real Python runs in your browser using WebAssembly. No install, no setup! You can use math, loops, functions, and even train simple AI classifiers. Packages like numpy and pandas auto-load when imported.
      </div>
    </div>
  );
}

function detectPackages(code: string): string[] {
  const packages: string[] = [];
  const known = ["numpy", "pandas", "matplotlib", "scikit-learn", "scipy"];
  for (const pkg of known) {
    const regex = new RegExp(`^(import|from)\\s+${pkg}`, "m");
    if (regex.test(code)) packages.push(pkg);
  }
  return packages;
}
