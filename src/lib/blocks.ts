export type BlockCategory = "events" | "actions" | "control" | "data";

export interface BlockDef {
  type: string;
  category: BlockCategory;
  label: string;
  emoji: string;
  shape: "hat" | "stack" | "c-block" | "cap";
  params?: ParamDef[];
  color: string;
}

export interface ParamDef {
  name: string;
  label: string;
  type: "text" | "number" | "color" | "select";
  default: string | number;
  options?: string[];
}

export interface PlacedBlock {
  id: string;
  type: string;
  params: Record<string, string | number>;
  children?: PlacedBlock[];
}

export const BLOCK_DEFS: BlockDef[] = [
  {
    type: "onStart",
    category: "events",
    label: "when app starts",
    emoji: "\u25B6",
    shape: "hat",
    color: "from-emerald-500 to-teal-600",
  },
  {
    type: "onClick",
    category: "events",
    label: "when button clicked",
    emoji: "\u{1F446}",
    shape: "hat",
    params: [{ name: "buttonId", label: "Button", type: "text", default: "myBtn" }],
    color: "from-emerald-500 to-teal-600",
  },
  {
    type: "say",
    category: "actions",
    label: "say",
    emoji: "\u{1F4AC}",
    shape: "stack",
    params: [{ name: "text", label: "Text", type: "text", default: "Hello!" }],
    color: "from-sky-500 to-blue-600",
  },
  {
    type: "setText",
    category: "actions",
    label: "set text of",
    emoji: "\u270F\uFE0F",
    shape: "stack",
    params: [
      { name: "elementId", label: "Element ID", type: "text", default: "title" },
      { name: "text", label: "Text", type: "text", default: "New text!" },
    ],
    color: "from-sky-500 to-blue-600",
  },
  {
    type: "changeColor",
    category: "actions",
    label: "change color to",
    emoji: "\u{1F3A8}",
    shape: "stack",
    params: [
      { name: "elementId", label: "Element ID", type: "text", default: "box" },
      { name: "color", label: "Color", type: "color", default: "#ff6b6b" },
    ],
    color: "from-sky-500 to-blue-600",
  },
  {
    type: "show",
    category: "actions",
    label: "show",
    emoji: "\u{1F441}",
    shape: "stack",
    params: [{ name: "elementId", label: "Element ID", type: "text", default: "box" }],
    color: "from-sky-500 to-blue-600",
  },
  {
    type: "hide",
    category: "actions",
    label: "hide",
    emoji: "\u{1F6AB}",
    shape: "stack",
    params: [{ name: "elementId", label: "Element ID", type: "text", default: "box" }],
    color: "from-sky-500 to-blue-600",
  },
  {
    type: "wait",
    category: "actions",
    label: "wait",
    emoji: "\u23F1",
    shape: "stack",
    params: [{ name: "seconds", label: "Seconds", type: "number", default: 1 }],
    color: "from-sky-500 to-blue-600",
  },
  {
    type: "log",
    category: "actions",
    label: "log to console",
    emoji: "\u{1F4DD}",
    shape: "stack",
    params: [{ name: "text", label: "Message", type: "text", default: "Hello console!" }],
    color: "from-sky-500 to-blue-600",
  },
  {
    type: "repeat",
    category: "control",
    label: "repeat",
    emoji: "\u{1F501}",
    shape: "c-block",
    params: [{ name: "times", label: "Times", type: "number", default: 3 }],
    color: "from-amber-500 to-orange-600",
  },
  {
    type: "forever",
    category: "control",
    label: "forever",
    emoji: "\u267E",
    shape: "c-block",
    color: "from-amber-500 to-orange-600",
  },
  {
    type: "if",
    category: "control",
    label: "if",
    emoji: "\u2754",
    shape: "c-block",
    params: [
      { name: "left", label: "Value A", type: "text", default: "1" },
      { name: "op", label: "Compare", type: "select", default: "==", options: ["==", "!=", ">", "<", ">=", "<="] },
      { name: "right", label: "Value B", type: "text", default: "1" },
    ],
    color: "from-amber-500 to-orange-600",
  },
  {
    type: "setVar",
    category: "data",
    label: "set variable",
    emoji: "\u{1F4E6}",
    shape: "stack",
    params: [
      { name: "name", label: "Name", type: "text", default: "score" },
      { name: "value", label: "Value", type: "text", default: "0" },
    ],
    color: "from-violet-500 to-purple-600",
  },
  {
    type: "changeVar",
    category: "data",
    label: "change variable by",
    emoji: "\u{1F4E6}\u2795",
    shape: "stack",
    params: [
      { name: "name", label: "Name", type: "text", default: "score" },
      { name: "amount", label: "Amount", type: "number", default: 1 },
    ],
    color: "from-violet-500 to-purple-600",
  },
];

export const CATEGORY_META: Record<
  BlockCategory,
  { label: string; emoji: string; color: string }
> = {
  events: { label: "Events", emoji: "\u26A1", color: "text-emerald-400" },
  actions: { label: "Actions", emoji: "\u{1F4AA}", color: "text-sky-400" },
  control: { label: "Control", emoji: "\u{1F501}", color: "text-amber-400" },
  data: { label: "Data", emoji: "\u{1F4E6}", color: "text-violet-400" },
};

export function getBlockDef(type: string): BlockDef | undefined {
  return BLOCK_DEFS.find((b) => b.type === type);
}

function esc(s: string): string {
  return String(s).replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

function paramVal(block: PlacedBlock, name: string): string {
  return esc(String(block.params[name] ?? ""));
}

function genBlock(block: PlacedBlock, indent: number): string {
  const pad = "  ".repeat(indent);
  switch (block.type) {
    case "onStart":
      return `${pad}// when app starts`;
    case "onClick": {
      const btn = paramVal(block, "buttonId");
      return `${pad}// when ${btn} is clicked\n${pad}document.getElementById('${btn}')?.addEventListener('click', async () => {`;
    }
    case "say": {
      const text = paramVal(block, "text");
      return `${pad}showMessage('${text}');`;
    }
    case "setText": {
      const id = paramVal(block, "elementId");
      const text = paramVal(block, "text");
      return `${pad}const el_${id} = document.getElementById('${id}'); if (el_${id}) el_${id}.textContent = '${text}';`;
    }
    case "changeColor": {
      const id = paramVal(block, "elementId");
      const color = paramVal(block, "color");
      return `${pad}const el_c_${id} = document.getElementById('${id}'); if (el_c_${id}) el_c_${id}.style.backgroundColor = '${color}';`;
    }
    case "show": {
      const id = paramVal(block, "elementId");
      return `${pad}const el_s_${id} = document.getElementById('${id}'); if (el_s_${id}) el_s_${id}.style.display = 'block';`;
    }
    case "hide": {
      const id = paramVal(block, "elementId");
      return `${pad}const el_h_${id} = document.getElementById('${id}'); if (el_h_${id}) el_h_${id}.style.display = 'none';`;
    }
    case "wait": {
      const secs = paramVal(block, "seconds");
      return `${pad}await new Promise(r => setTimeout(r, ${parseFloat(secs) || 1} * 1000));`;
    }
    case "log": {
      const text = paramVal(block, "text");
      return `${pad}console.log('${text}'); addToLog('${text}');`;
    }
    case "repeat": {
      const times = paramVal(block, "times");
      return `${pad}for (let i = 0; i < ${parseInt(String(times), 10) || 0}; i++) {`;
    }
    case "forever":
      return `${pad}// forever loop (runs every 100ms)`;
    case "if": {
      const left = paramVal(block, "left");
      const op = paramVal(block, "op");
      const right = paramVal(block, "right");
      return `${pad}if (${left} ${op} ${right}) {`;
    }
    case "setVar": {
      const name = paramVal(block, "name");
      const val = paramVal(block, "value");
      return `${pad}vars['${name}'] = ${val};`;
    }
    case "changeVar": {
      const name = paramVal(block, "name");
      const amt = paramVal(block, "amount");
      return `${pad}vars['${name}'] = (vars['${name}'] || 0) + ${parseFloat(String(amt)) || 0};`;
    }
    default:
      return `${pad}// unknown block: ${block.type}`;
  }
}

function needsAsync(blocks: PlacedBlock[]): boolean {
  return blocks.some(
    (b) =>
      b.type === "wait" ||
      b.type === "forever" ||
      (b.children?.some((c) => needsAsync([c])) ?? false),
  );
}

function genBlocks(blocks: PlacedBlock[], indent: number): string {
  let code = "";
  for (const block of blocks) {
    code += genBlock(block, indent) + "\n";
    if (block.type === "onClick") {
      code += genBlocks(block.children ?? [], indent + 1);
      code += "  ".repeat(indent) + "});\n";
    } else if (block.type === "repeat" || block.type === "if") {
      code += genBlocks(block.children ?? [], indent + 1);
      code += "  ".repeat(indent) + "}\n";
    } else if (block.type === "forever") {
      code += "  ".repeat(indent) + "setInterval(() => {\n";
      code += genBlocks(block.children ?? [], indent + 1);
      code += "  ".repeat(indent) + "}, 100);\n";
    }
  }
  return code;
}

export function generateCode(blocks: PlacedBlock[]): string {
  const isAsync = needsAsync(blocks);
  const body = genBlocks(blocks, 1);
  return `async function run() {
  const vars = {};
  const log = document.getElementById('somora-log');
  function addToLog(msg) {
    if (log) { log.innerHTML += '<div>' + msg + '</div>'; log.scrollTop = log.scrollHeight; }
  }
  function showMessage(msg) {
    const bubble = document.getElementById('somora-say');
    if (bubble) { bubble.textContent = msg; bubble.style.display = 'block'; setTimeout(() => bubble.style.display='none', 3000); }
    addToLog('\u{1F4AC} ' + msg);
  }
${body}
}
${isAsync ? "run();" : "try { run(); } catch(e) { console.error(e); }"}`;
}

export function generateHTML(blocks: PlacedBlock[]): string {
  const code = generateCode(blocks);
  return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 20px; }
  h1 { font-size: 28px; }
  button { padding: 12px 24px; font-size: 18px; border-radius: 12px; border: none; cursor: pointer; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-weight: bold; }
  button:hover { transform: scale(1.05); }
  #box { width: 120px; height: 120px; background: #4ecdc4; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 48px; }
  #somora-say { display: none; position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 12px 24px; border-radius: 12px; font-size: 18px; z-index: 100; }
  #somora-log { position: fixed; top: 10px; right: 10px; width: 250px; max-height: 200px; overflow-y: auto; background: rgba(0,0,0,0.7); border-radius: 8px; padding: 8px; font-size: 12px; font-family: monospace; }
  #title { font-size: 24px; font-weight: bold; }
</style>
</head>
<body>
  <h1 id="title">\u{1F680} My App</h1>
  <button id="myBtn">Click me!</button>
  <div id="box">\u{1F916}</div>
  <div id="somora-say"></div>
  <div id="somora-log"></div>
  <script>
    ${code}
  </script>
</body>
</html>`;
}

let blockIdCounter = 0;
export function makeBlock(type: string, params?: Record<string, string | number>): PlacedBlock {
  const def = getBlockDef(type);
  const defaultParams: Record<string, string | number> = {};
  def?.params?.forEach((p) => {
    defaultParams[p.name] = p.default;
  });
  return {
    id: `block-${++blockIdCounter}-${Date.now()}`,
    type,
    params: { ...defaultParams, ...params },
    children: def?.shape === "c-block" || def?.shape === "hat" ? [] : undefined,
  };
}
