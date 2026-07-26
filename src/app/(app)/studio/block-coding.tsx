"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import {
  BLOCK_DEFS,
  CATEGORY_META,
  getBlockDef,
  generateHTML,
  makeBlock,
  type BlockDef,
  type PlacedBlock,
  type BlockCategory,
} from "@/lib/blocks";

const CATEGORIES: BlockCategory[] = ["events", "actions", "control", "data"];

interface DragData {
  blockType: string;
  fromPalette: boolean;
  sourceId?: string;
}

export function BlockCoding() {
  const { addXP } = useStore();
  const [blocks, setBlocks] = useState<PlacedBlock[]>(() => [makeBlock("onStart")]);
  const [activeCategory, setActiveCategory] = useState<BlockCategory>("events");
  const [running, setRunning] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [consoleMsgs, setConsoleMsgs] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const dragData = useRef<DragData | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "somora-log" && typeof e.data.msg === "string") {
        setConsoleMsgs((prev) => [...prev, e.data.msg]);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const updateBlock = useCallback((id: string, params: Record<string, string | number>) => {
    setBlocks((prev) => updateBlockInTree(prev, id, (b) => ({ ...b, params: { ...b.params, ...params } })));
  }, []);

  const addBlockToWorkspace = useCallback((type: string, parentId?: string) => {
    const newBlock = makeBlock(type);
    if (parentId) {
      setBlocks((prev) => updateBlockInTree(prev, parentId, (b) => ({ ...b, children: [...(b.children ?? []), newBlock] })));
    } else {
      setBlocks((prev) => [...prev, newBlock]);
    }
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => removeFromTree(prev, id));
  }, []);

  const moveBlock = useCallback((id: string, parentId: string) => {
    setBlocks((prev) => {
      const found = findInTree(prev, id);
      if (!found) return prev;
      const removed = removeFromTree(prev, id);
      return updateBlockInTree(removed, parentId, (b) => ({ ...b, children: [...(b.children ?? []), found] }));
    });
  }, []);

  function handlePaletteDragStart(e: React.DragEvent, blockType: string) {
    dragData.current = { blockType, fromPalette: true };
    e.dataTransfer.effectAllowed = "copy";
  }

  function handleBlockDragStart(e: React.DragEvent, block: PlacedBlock) {
    dragData.current = { blockType: block.type, fromPalette: false, sourceId: block.id };
    e.dataTransfer.effectAllowed = "move";
  }

  function handleWorkspaceDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const data = dragData.current;
    dragData.current = null;
    if (!data) return;
    if (data.fromPalette) addBlockToWorkspace(data.blockType);
  }

  function handleChildDrop(e: React.DragEvent, parentId: string) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const data = dragData.current;
    dragData.current = null;
    if (!data) return;
    if (data.fromPalette) addBlockToWorkspace(data.blockType, parentId);
    else if (data.sourceId && data.sourceId !== parentId) moveBlock(data.sourceId, parentId);
  }

  function run() {
    setConsoleMsgs([]);
    setPreviewHTML(generateHTML(blocks));
    setPreviewKey((k) => k + 1);
    setRunning(true);
    addXP(20);
    setTimeout(() => setRunning(false), 500);
  }

  const filteredBlocks = BLOCK_DEFS.filter((b) => b.category === activeCategory);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left: palette + workspace */}
        <div className="space-y-3">
          {/* Palette */}
          <div className="rounded-3xl glass p-3">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-bold transition-all",
                    activeCategory === cat ? "bg-white/15 text-cloud" : "text-cloud-dim hover:bg-white/5 hover:text-cloud-muted",
                  )}
                >
                  {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filteredBlocks.map((def) => (
                <div
                  key={def.type}
                  draggable
                  onDragStart={(e) => handlePaletteDragStart(e, def.type)}
                  onDoubleClick={() => addBlockToWorkspace(def.type)}
                  className={cn(
                    "flex cursor-grab items-center gap-2 rounded-xl bg-gradient-to-r px-3 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.03] active:cursor-grabbing active:scale-95",
                    def.color,
                  )}
                >
                  <span aria-hidden="true">{def.emoji}</span>
                  <span>{def.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Workspace */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleWorkspaceDrop}
            className={cn(
              "min-h-[280px] rounded-3xl p-4 transition-all",
              dragOver ? "glass-strong ring-2 ring-aurora-violet/40" : "glass",
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold text-cloud-muted">Your blocks</p>
              <button
                onClick={run}
                disabled={running}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-5 py-2 text-sm font-bold text-night-950 transition-all hover:shadow-glow active:scale-95 disabled:opacity-50"
              >
                {running ? "Running..." : "\u25B6 Run!"}
              </button>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {blocks.map((block) => (
                  <WorkspaceBlock
                    key={block.id}
                    block={block}
                    depth={0}
                    onUpdate={updateBlock}
                    onRemove={removeBlock}
                    onDragStart={(e) => handleBlockDragStart(e, block)}
                    onChildDrop={handleChildDrop}
                  />
                ))}
              </AnimatePresence>
              {blocks.length === 0 && (
                <div className="flex min-h-[120px] items-center justify-center rounded-2xl border-2 border-dashed border-white/10 text-center text-sm text-cloud-dim">
                  Drag blocks here! {"\u2191"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div className="overflow-hidden rounded-3xl glass-strong">
          <div className="flex items-center gap-2 border-b border-white/10 bg-night-950/50 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-aurora-rose/60" />
              <span className="h-3 w-3 rounded-full bg-aurora-amber/60" />
              <span className="h-3 w-3 rounded-full bg-aurora-teal/60" />
            </div>
            <span className="mx-auto text-sm font-semibold text-cloud-dim">My App</span>
          </div>
          {previewHTML ? (
            <iframe
              key={previewKey}
              srcDoc={previewHTML}
              title="Block app preview"
              className="h-[380px] w-full border-0"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="flex h-[380px] items-center justify-center text-center">
              <div>
                <div className="text-5xl opacity-20">{"\u{1F6E0}\uFE0F"}</div>
                <p className="mt-3 text-base text-cloud-dim">Press Run to play!</p>
              </div>
            </div>
          )}
          {/* Console output */}
          <div className="border-t border-white/10 bg-night-950/60 px-4 py-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cloud-dim">Console</span>
              {consoleMsgs.length > 0 && (
                <button onClick={() => setConsoleMsgs([])} className="text-[10px] text-cloud-dim hover:text-cloud">
                  Clear
                </button>
              )}
            </div>
            <div className="h-[60px] overflow-y-auto font-mono text-xs">
              {consoleMsgs.length === 0 ? (
                <span className="text-cloud-dim/50">Output will appear here...</span>
              ) : (
                consoleMsgs.map((msg, i) => (
                  <div key={i} className={cn("whitespace-pre-wrap", msg.startsWith("\u274C") ? "text-aurora-rose" : "text-aurora-leaf")}>
                    {msg}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceBlock({
  block,
  depth,
  onUpdate,
  onRemove,
  onDragStart,
  onChildDrop,
}: {
  block: PlacedBlock;
  depth: number;
  onUpdate: (id: string, params: Record<string, string | number>) => void;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent) => void;
  onChildDrop: (e: React.DragEvent, parentId: string) => void;
}) {
  const def = getBlockDef(block.type);
  if (!def) return null;
  const isContainer = def.shape === "hat" || def.shape === "c-block";

  return (
    <motion.div layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
      <div
        draggable
        onDragStart={onDragStart}
        className={cn("relative rounded-xl bg-gradient-to-r px-3 py-2.5 text-white shadow-md", def.color)}
        style={{ marginLeft: depth > 0 ? 12 : 0 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span aria-hidden="true" className="text-base">{def.emoji}</span>
          <span className="text-sm font-bold">{def.label}</span>
          {def.params?.map((p) => (
            <BlockParam key={p.name} param={p} value={block.params[p.name]} onChange={(val) => onUpdate(block.id, { [p.name]: val })} />
          ))}
          <button
            onClick={() => onRemove(block.id)}
            className="ml-auto rounded-md px-2 py-0.5 text-xs text-white/60 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Delete block"
          >
            {"\u2715"}
          </button>
        </div>
      </div>

      {isContainer && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onChildDrop(e, block.id)}
          className="mt-1 ml-4 min-h-[36px] space-y-2 rounded-lg border-l-2 border-white/10 pl-3"
        >
          {block.children?.map((child) => (
            <WorkspaceBlock
              key={child.id}
              block={child}
              depth={depth + 1}
              onUpdate={onUpdate}
              onRemove={onRemove}
              onDragStart={(e) => onDragStart(e)}
              onChildDrop={onChildDrop}
            />
          ))}
          {(!block.children || block.children.length === 0) && (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-white/10 py-2 text-xs text-cloud-dim">
              Drop blocks here
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function BlockParam({
  param,
  value,
  onChange,
}: {
  param: NonNullable<BlockDef["params"]>[number];
  value: string | number;
  onChange: (val: string) => void;
}) {
  const baseClass = "rounded-md bg-night-950/40 px-2 py-1 text-xs text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/40";

  if (param.type === "select") {
    return (
      <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={baseClass}>
        {param.options?.map((opt) => (
          <option key={opt} value={opt} className="bg-night-950">{opt}</option>
        ))}
      </select>
    );
  }
  if (param.type === "color") {
    return (
      <input type="color" value={String(value ?? "#ffffff")} onChange={(e) => onChange(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-white/20 bg-transparent" />
    );
  }
  if (param.type === "number") {
    return <input type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={cn(baseClass, "w-16")} />;
  }
  return <input type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={cn(baseClass, "w-24")} placeholder={param.label} />;
}

function updateBlockInTree(blocks: PlacedBlock[], id: string, updater: (b: PlacedBlock) => PlacedBlock): PlacedBlock[] {
  return blocks.map((b) => {
    if (b.id === id) return updater(b);
    if (b.children) return { ...b, children: updateBlockInTree(b.children, id, updater) };
    return b;
  });
}

function removeFromTree(blocks: PlacedBlock[], id: string): PlacedBlock[] {
  return blocks.filter((b) => b.id !== id).map((b) => (b.children ? { ...b, children: removeFromTree(b.children, id) } : b));
}

function findInTree(blocks: PlacedBlock[], id: string): PlacedBlock | null {
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.children) {
      const found = findInTree(b.children, id);
      if (found) return found;
    }
  }
  return null;
}
