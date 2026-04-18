import { create } from "zustand";

export type LogLevel = "SUCCESS" | "WARNING" | "FAILED" | "INFO";

export interface SystemLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

interface TerminalStore {
  publicLogs: SystemLog[];
  adminLogs: SystemLog[];
  addPublicLog: (level: LogLevel, message: string) => void;
  addAdminLog: (level: LogLevel, message: string) => void;
  clearLogs: () => void;
}

const createLog = (level: LogLevel, message: string): SystemLog => ({
  id: crypto.randomUUID(),
  timestamp: new Date().toLocaleTimeString("ko-KR", { hour12: false }), // ex: "14:30:45"
  level,
  message,
});

export const useTerminalStore = create<TerminalStore>((set) => ({
  publicLogs: [],
  adminLogs: [],
  addPublicLog: (level, message) =>
    set((state) => ({
      publicLogs: [...state.publicLogs, createLog(level, message)],
    })),
  addAdminLog: (level, message) =>
    set((state) => ({
      adminLogs: [...state.adminLogs, createLog(level, message)],
    })),
  clearLogs: () => set({ publicLogs: [], adminLogs: [] }),
}));
