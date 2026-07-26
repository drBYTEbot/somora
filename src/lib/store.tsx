"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  ts: number;
}

export interface CreatedProject {
  id: string;
  title: string;
  emoji: string;
  description: string;
  type: string;
  prompt: string;
  createdAt: number;
  tags: string[];
  html: string;
}

export interface GameRecord {
  plays: number;
  highScore: number;
  lastPlayed: string;
}

export interface StoreState {
  user: { name: string; avatar: string };
  xp: number;
  coins: number;
  gems: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  completedQuests: string[];
  unlockedAchievements: string[];
  unlockedWorlds: string[];
  unlockedSkills: string[];
  games: Record<string, GameRecord>;
  projects: CreatedProject[];
  chatHistory: ChatMessage[];
  lessonNotes: Record<string, string>;
}

const STORAGE_KEY = "somora-progress-v1";
const TODAY = new Date().toISOString().slice(0, 10);

function getInitialState(): StoreState {
  const defaultState: StoreState = {
    user: { name: "Explorer", avatar: "\u{1F9E0}" },
    xp: 0,
    coins: 100,
    gems: 0,
    streak: 0,
    lastActiveDate: "",
    completedLessons: [],
    completedQuests: [],
    unlockedAchievements: [],
    unlockedWorlds: ["curious-grove", "robot-valley", "data-forest"],
    unlockedSkills: ["ai-basics"],
    games: {},
    projects: [],
    chatHistory: [],
    lessonNotes: {},
  };

  if (typeof window === "undefined") return defaultState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    }
  } catch {
    // ignore parse errors
  }
  return defaultState;
}

const XP_PER_LEVEL = 500;

export function levelFromXP(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpInLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

interface StoreContextValue {
  state: StoreState;
  level: number;
  xpInCurrentLevel: number;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  completeLesson: (lessonId: string, xp?: number) => boolean;
  isLessonComplete: (lessonId: string) => boolean;
  completeQuest: (questId: string, xp: number) => boolean;
  isQuestComplete: (questId: string) => boolean;
  recordGamePlay: (gameId: string, score: number) => void;
  getGameRecord: (gameId: string) => GameRecord | null;
  unlockAchievement: (id: string) => void;
  isAchievementUnlocked: (id: string) => boolean;
  unlockWorld: (id: string) => void;
  isWorldUnlocked: (id: string) => boolean;
  unlockSkill: (id: string) => void;
  isSkillUnlocked: (id: string) => boolean;
  createProject: (project: Omit<CreatedProject, "id" | "createdAt">) => string;
  addChatMessage: (msg: Omit<ChatMessage, "id" | "ts">) => void;
  clearChat: () => void;
  saveLessonNote: (lessonId: string, note: string) => void;
  setUserName: (name: string) => void;
  resetProgress: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(getInitialState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update streak on mount
  useEffect(() => {
    setState((prev) => {
      if (prev.lastActiveDate === TODAY) return prev;
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .slice(0, 10);
      const newStreak =
        prev.lastActiveDate === yesterday ? prev.streak + 1 : 1;
      return { ...prev, streak: newStreak, lastActiveDate: TODAY };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // storage full or unavailable
      }
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state]);

  const addXP = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const addCoins = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, coins: Math.max(0, prev.coins + amount) }));
  }, []);

  const addGems = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, gems: Math.max(0, prev.gems + amount) }));
  }, []);

  const completeLesson = useCallback(
    (lessonId: string, xp = 80) => {
      let wasNew = false;
      setState((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        wasNew = true;
        return {
          ...prev,
          completedLessons: [...prev.completedLessons, lessonId],
          xp: prev.xp + xp,
          coins: prev.coins + 20,
        };
      });
      return wasNew;
    },
    [],
  );

  const isLessonComplete = useCallback(
    (lessonId: string) => state.completedLessons.includes(lessonId),
    [state.completedLessons],
  );

  const completeQuest = useCallback(
    (questId: string, xp: number) => {
      let wasNew = false;
      setState((prev) => {
        if (prev.completedQuests.includes(questId)) return prev;
        wasNew = true;
        return {
          ...prev,
          completedQuests: [...prev.completedQuests, questId],
          xp: prev.xp + xp,
        };
      });
      return wasNew;
    },
    [],
  );

  const isQuestComplete = useCallback(
    (questId: string) => state.completedQuests.includes(questId),
    [state.completedQuests],
  );

  const recordGamePlay = useCallback(
    (gameId: string, score: number) => {
      setState((prev) => {
        const existing = prev.games[gameId];
        const newRecord: GameRecord = {
          plays: (existing?.plays ?? 0) + 1,
          highScore: Math.max(existing?.highScore ?? 0, score),
          lastPlayed: new Date().toISOString(),
        };
        const earnedXP = 30;
        return {
          ...prev,
          games: { ...prev.games, [gameId]: newRecord },
          xp: prev.xp + earnedXP,
          coins: prev.coins + 10,
        };
      });
    },
    [],
  );

  const getGameRecord = useCallback(
    (gameId: string): GameRecord | null => state.games[gameId] ?? null,
    [state.games],
  );

  const unlockAchievement = useCallback((id: string) => {
    setState((prev) => {
      if (prev.unlockedAchievements.includes(id)) return prev;
      return {
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, id],
        gems: prev.gems + 1,
      };
    });
  }, []);

  const isAchievementUnlocked = useCallback(
    (id: string) => state.unlockedAchievements.includes(id),
    [state.unlockedAchievements],
  );

  const unlockWorld = useCallback((id: string) => {
    setState((prev) => {
      if (prev.unlockedWorlds.includes(id)) return prev;
      return {
        ...prev,
        unlockedWorlds: [...prev.unlockedWorlds, id],
        gems: prev.gems + 2,
      };
    });
  }, []);

  const isWorldUnlocked = useCallback(
    (id: string) => state.unlockedWorlds.includes(id),
    [state.unlockedWorlds],
  );

  const unlockSkill = useCallback((id: string) => {
    setState((prev) => {
      if (prev.unlockedSkills.includes(id)) return prev;
      return {
        ...prev,
        unlockedSkills: [...prev.unlockedSkills, id],
        xp: prev.xp + 100,
      };
    });
  }, []);

  const isSkillUnlocked = useCallback(
    (id: string) => state.unlockedSkills.includes(id),
    [state.unlockedSkills],
  );

  const createProject = useCallback(
    (project: Omit<CreatedProject, "id" | "createdAt">) => {
      const id = `proj-${Date.now()}`;
      const fullProject: CreatedProject = {
        ...project,
        id,
        createdAt: Date.now(),
      };
      setState((prev) => ({
        ...prev,
        projects: [fullProject, ...prev.projects],
        xp: prev.xp + 150,
        coins: prev.coins + 50,
      }));
      return id;
    },
    [],
  );

  const addChatMessage = useCallback(
    (msg: Omit<ChatMessage, "id" | "ts">) => {
      const fullMsg: ChatMessage = {
        ...msg,
        id: `msg-${Date.now()}`,
        ts: Date.now(),
      };
      setState((prev) => ({
        ...prev,
        chatHistory: [...prev.chatHistory.slice(-49), fullMsg],
      }));
    },
    [],
  );

  const clearChat = useCallback(() => {
    setState((prev) => ({ ...prev, chatHistory: [] }));
  }, []);

  const saveLessonNote = useCallback((lessonId: string, note: string) => {
    setState((prev) => ({
      ...prev,
      lessonNotes: { ...prev.lessonNotes, [lessonId]: note },
    }));
  }, []);

  const setUserName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, name },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = getInitialState();
    fresh.streak = 1;
    fresh.lastActiveDate = TODAY;
    setState(fresh);
  }, []);

  const level = levelFromXP(state.xp);
  const xpInCurrentLevel = xpInLevel(state.xp);

  const value: StoreContextValue = {
    state,
    level,
    xpInCurrentLevel,
    addXP,
    addCoins,
    addGems,
    completeLesson,
    isLessonComplete,
    completeQuest,
    isQuestComplete,
    recordGamePlay,
    getGameRecord,
    unlockAchievement,
    isAchievementUnlocked,
    unlockWorld,
    isWorldUnlocked,
    unlockSkill,
    isSkillUnlocked,
    createProject,
    addChatMessage,
    clearChat,
    saveLessonNote,
    setUserName,
    resetProgress,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return ctx;
}
