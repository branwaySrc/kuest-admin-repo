"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_AUTH } from "@/constants/auth";
import { insertAccountLog } from "@/app/api/systemlogs/systemAdminLogs";

type TerminalLine = {
  text: string;
  type: "system" | "prompt" | "input" | "success" | "error" | "info";
};

type Phase = "boot" | "username" | "password" | "checking" | "success" | "denied";

const BOOT_SEQUENCE: { text: string; type: TerminalLine["type"]; delay: number }[] = [
  { text: "KUEST ADMIN SYSTEM v1.4.01", type: "info", delay: 0 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "info", delay: 100 },
  { text: "", type: "system", delay: 200 },
  { text: "[boot] loading kernel modules...", type: "system", delay: 400 },
  { text: "[boot] mounting secure filesystem... ok", type: "system", delay: 700 },
  { text: "[net]  establishing encrypted tunnel... ok", type: "system", delay: 1100 },
  { text: "[auth] initializing auth gateway... ok", type: "system", delay: 1500 },
  { text: "[sys]  all systems operational", type: "success", delay: 1900 },
  { text: "", type: "system", delay: 2100 },
  { text: "Connection established. Please authenticate.", type: "info", delay: 2300 },
  { text: "", type: "system", delay: 2500 },
];

export default function LoginPage() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [phase, setPhase] = useState<Phase>("boot");
  const [inputValue, setInputValue] = useState("");
  const [savedUsername, setSavedUsername] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence
  useEffect(() => {
    if (phase !== "boot") return;
    const timeouts = BOOT_SEQUENCE.map((item, i) =>
      setTimeout(() => {
        setLines((prev) => [...prev, { text: item.text, type: item.type }]);
        if (i === BOOT_SEQUENCE.length - 1) setTimeout(() => setPhase("username"), 300);
      }, item.delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [phase]);

  // Add prompts
  useEffect(() => {
    if (phase === "username" || phase === "password") {
      setTimeout(() => {
        setLines((prev) => [...prev, { text: phase === "username" ? "login: " : "password: ", type: "prompt" }]);
        inputRef.current?.focus();
      }, 50);
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputValue.trim();
    if (phase === "username") {
      setLines((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: `login: ${value}`, type: "prompt" };
        return updated;
      });
      setSavedUsername(value);
      setInputValue("");
      setPhase("password");
    } else if (phase === "password") {
      setLines((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: `password: ${"•".repeat(value.length)}`, type: "prompt" };
        return updated;
      });
      setInputValue("");
      setPhase("checking");
      
      const isValid = savedUsername === ADMIN_AUTH.ID && value === ADMIN_AUTH.PASSWORD;
      
      setTimeout(() => setLines(p => [...p, { text: "", type: "system" }, { text: "[auth] verifying credentials...", type: "system" }]), 500);
      
      if (isValid) {
        insertAccountLog("ACCESS");
        setTimeout(() => setLines(p => [...p, { text: "[auth] identity confirmed", type: "success" }, { text: "ACCESS GRANTED — redirecting...", type: "success" }]), 1500);
        setTimeout(() => {
          localStorage.setItem("isLoggedIn", "true");
          router.replace("/");
        }, 2200);
      } else {
        insertAccountLog("FAILED");
        setTimeout(() => setLines(p => [...p, { text: "[auth] credential mismatch detected", type: "error" }, { text: "ACCESS DENIED — invalid credentials.", type: "error" }, { text: "", type: "system" }]), 1500);
        setTimeout(() => setPhase("username"), 2200);
      }
    }
  };

  return (
    <div className="flex flex-col h-full" onClick={() => inputRef.current?.focus()}>
      {/* Logs history */}
      <div className="space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className={getLineColor(line.type)}>
            {line.text === "" ? "\u00A0" : line.text}
          </div>
        ))}
      </div>

      {/* Input Line */}
      {(phase === "username" || phase === "password") && (
        <form onSubmit={handleSubmit} className="flex items-center mt-0.5">
          <span className="text-foreground font-semibold mr-2">❯</span>
          <input
            ref={inputRef}
            type={phase === "password" ? "password" : "text"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent text-foreground outline-none border-none caret-transparent font-mono text-sm"
            autoFocus
            spellCheck={false}
          />
          <span className={`text-emerald-400 font-bold ${cursorVisible ? "opacity-100" : "opacity-0"}`}>▎</span>
        </form>
      )}

      {/* Checking animation */}
      {phase === "checking" && (
        <div className="flex gap-1 text-muted-foreground mt-2 animate-pulse">
          <span>·</span><span>·</span><span>·</span>
        </div>
      )}
    </div>
  );
}

const getLineColor = (type: TerminalLine["type"]) => {
  switch (type) {
    case "system": return "text-muted-foreground";
    case "prompt": return "text-foreground";
    case "success": return "text-emerald-400";
    case "error": return "text-destructive";
    case "info": return "text-emerald-400";
    default: return "text-foreground";
  }
};
