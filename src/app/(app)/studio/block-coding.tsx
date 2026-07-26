"use client";

import { useState, useCallback, useRef } from "react";
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
  sourceList?: PlacedBlock[];
  parentId?: string;
}

export function BlockCoding() {
  const { addXP } = useStore();
  const [blocks, setBlocks] = useState<PlacedBlock[]>(() => [
    makeBlock("onStart"),
  ]);
  const [activeCategory, setActiveCategory] = useState<BlockCategory>("events");
  const [running, setRunning] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dragData = useRef<DragData | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateBlock = useCallback((id: string, params: Record<string, string | number>) => {
    setBlocks((prev) =>
      updateBlockInTree(prev, id, (b) => ({ ...b, params: { ...b.params, ...params } })),
    );
  }, []);

  const addBlockToWorkspace = useCallback((type: string, parentId?: string) => {
    const newBlock = makeBlock(type);
    if (parentId) {
      setBlocks((prev) =>
        updateBlockInTree(prev, parentId, (b) => ({
          ...b,
          children: [...(b.children ?? []), newBlock],
        })),
      );
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
      return updateBlockInTree(removed, parentId, (b) => ({
        ...b,
        children: [...(b.children ?? []), found],
      }));
    });
  }, []);

  function handlePaletteDragStart(e: React.DragEvent, blockType: string) {
    dragData.current = { blockType, fromPalette: true };
    e.dataTransfer.effectAllowed = "copy";
  }

  function handleBlockDragStart(e: React.DragEvent, block: PlacedBlock, parentId?: string) {
    dragData.current = {
      blockType: block.type,
      fromPalette: false,
      sourceId: block.id,
      parentId,
    };
    e.dataTransfer.effectAllowed = "move";
  }

  function handleWorkspaceDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const data = dragData.current;
    dragData.current = null;
    if (!data) return;
    if (data.fromPalette) {
      addBlockToWorkspace(data.blockType);
    }
  }

  function handleChildDrop(e: React.DragEvent, parentId: string) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const data = dragData.current;
    dragData.current = null;
    if (!data) return;
    if (data.fromPalette) {
      addBlockToWorkspace(data.blockType, parentId);
    } else if (data.sourceId && data.sourceId !== parentId) {
      moveBlock(data.sourceId, parentId);
    }
  }

  function run() {
    const html = generateHTML(blocks);
    setPreviewHTML(html);
    setRunning(true);
    addXP(20);
    setTimeout(() => setRunning(false), 500);
  }

  const filteredBlocks = BLOCK_DEFS.filter((b) => b.category === activeCategory);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr_1fr]">
        {/* Block palette */}
        <div className="rounded-3xl glass p-3">
          <div className="mb-3 flex flex-wrap gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                  activeCategory === cat
                    ? "bg-white/10 text-cloud"
                    : "text-cloud-dim hover:bg-white/5 hover:text-cloud-muted",
                )}
              >
                {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filteredBlocks.map((def) => (
              <PaletteBlock
                key={def.type}
                def={def}
                onDragStart={(e) => handlePaletteDragStart(e, def.type)}
                onDoubleClick={() => addBlockToWorkspace(def.type)}
              />
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-white/[0.03] p-3 text-xs text-cloud-dim">
            <p className="font-semibold text-cloud-muted">Tips:</p>
            <ul className="mt-1 space-y-0.5">
              <li>{"\u2022"} Double-click or drag blocks to workspace</li>
              <li>{"\u2022"} Drag into c-blocks to nest</li>
              <li>{"\u2022"} Click {"\u2715"} to delete</li>
            </ul>
          </div>
        </div>

        {/* Workspace */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleWorkspaceDrop}
          className={cn(
            "min-h-[500px] rounded-3xl p-4 transition-all",
            dragOver ? "glass-strong ring-2 ring-aurora-violet/40" : "glass",
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-cloud-dim">Workspace</p>
            <button
              onClick={run}
              disabled={running}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aurora-teal to-aurora-violet px-4 py-1.5 text-xs font-semibold text-night-950 transition-all hover:shadow-glow active:scale-95 disabled:opacity-50"
            >
              {running ? "Running..." : "Run"}
            </button>
          </div>
          <div className="space-y-1.5">
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
              <div className="flex min-h-[200px] items-center justify-center rounded-2xl border-2 border-dashed border-white/10 text-sm text-cloud-dim">
                Drag blocks here to build your app!
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-3xl glass-strong overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/10 bg-night-950/50 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-aurora-rose/60" />
              <span className="h-3 w-3 rounded-full bg-aurora-amber/60" />
              <span className="h-3 w-3 rounded-full bg-aurora-teal/60" />
            </div>
            <span className="mx-auto text-xs text-cloud-dim">Live Preview</span>
            <button
              onClick={() => setShowCode(!showCode)}
              className="rounded-full px-2 py-1 text-[10px] font-semibold text-cloud-dim transition-colors hover:text-cloud"
            >
              {showCode ? "Preview" : "Code"}
            </button>
          </div>
          {previewHTML ? (
            showCode ? (
              <div className="h-[460px] overflow-auto p-3">
                <pre className="whitespace-pre-wrap break-words text-xs text-cloud-muted">{generateHTML(blocks)}</pre>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                srcDoc={previewHTML}
                title="Block app preview"
                className="h-[460px] w-full border-0"
                sandbox="allow-scripts"
              />
            )
          ) : (
            <div className="flex h-[460px] items-center justify-center text-center">
              <div>
                <div className="text-5xl opacity-20">{"\u{1F6E0}\uFE0F"}</div>
                <p className="mt-3 text-sm text-cloud-dim">Press Run to see your app!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaletteBlock({
  def,
  onDragStart,
  onDoubleClick,
}: {
  def: BlockDef;
  onDragStart: (e: React.DragEvent) => void;
  onDoubleClick: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDoubleClick={onDoubleClick}
      className={cn(
        "flex cursor-grab items-center gap-2 rounded-xl bg-gradient-to-r px-3 py-2 text-sm font-medium text-white shadow-lg transition-all hover:scale-[1.02] active:cursor-grabbing active:scale-95",
        def.color,
      )}
    >
      <span aria-hidden="true">{def.emoji}</span>
      <span>{def.label}</span>
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
    >
      <div
        draggable
        onDragStart={onDragStart}
        className={cn(
          "relative rounded-xl bg-gradient-to-r px-3 py-2 text-white shadow-md",
          def.color,
        )}
        style={{ marginLeft: depth > 0 ? 8 : 0 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span aria-hidden="true" className="text-sm">{def.emoji}</span>
          <span className="text-sm font-medium">{def.label}</span>
          {def.params?.map((p) => (
            <BlockParam
              key={p.name}
              param={p}
              value={block.params[p.name]}
              onChange={(val) => onUpdate(block.id, { [p.name]: val })}
            />
          ))}
          <button
            onClick={() => onRemove(block.id)}
            className="ml-auto rounded-md px-1.5 text-xs text-white/60 transition-colors hover:bg-white/20 hover:text-white"
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
          className="mt-1 ml-4 min-h-[32px] space-y-1.5 rounded-lg border-l-2 border-white/10 pl-2"
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
  const baseClass =
    "rounded-md bg-night-950/40 px-2 py-0.5 text-xs text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/40";

  if (param.type === "select") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={baseClass}
      >
        {param.options?.map((opt) => (
          <option key={opt} value={opt} className="bg-night-950">{opt}</option>
        ))}
      </select>
    );
  }

  if (param.type === "color") {
    return (
      <input
        type="color"
        value={String(value ?? "#ffffff")}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-10 cursor-pointer rounded border border-white/20 bg-transparent"
      />
    );
  }

  if (param.type === "number") {
    return (
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={cn(baseClass, "w-16")}
      />
    );
  }

  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className={cn(baseClass, "w-28")}
      placeholder={param.label}
    />
  );
}

function updateBlockInTree(
  blocks: PlacedBlock[],
  id: string,
  updater: (b: PlacedBlock) => PlacedBlock,
): PlacedBlock[] {
  return blocks.map((b) => {
    if (b.id === id) return updater(b);
    if (b.children) return { ...b, children: updateBlockInTree(b.children, id, updater) };
    return b;
  });
}

function removeFromTree(blocks: PlacedBlock[], id: string): PlacedBlock[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) =>
      b.children ? { ...b, children: removeFromTree(b.children, id) } : b,
    );
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
