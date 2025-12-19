"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { isTauri } from "@/lib/tauri-utils";

interface DirectorySelectorProps {
  onDirectoryChange: (path: string) => void;
}

export function DirectorySelector({ onDirectoryChange }: DirectorySelectorProps) {
  const [selectedPath, setSelectedPath] = useState<string>("");

  useEffect(() => {
    // Set default to Downloads directory
    const defaultPath = `${process.env.HOME || "~"}/Downloads`;
    setSelectedPath(defaultPath);
    onDirectoryChange(defaultPath);
  }, [onDirectoryChange]);

  const handleSelectDirectory = async () => {
    try {
      // Check if Tauri API is available
      if (!isTauri()) {
        toast.info("Directory selection only works in Tauri app");
        return;
      }

      const dialogModule = await import("@tauri-apps/plugin-dialog");

      const selected = await dialogModule.open({
        directory: true,
        multiple: false,
        defaultPath: selectedPath || undefined,
      });

      if (selected && typeof selected === "string") {
        setSelectedPath(selected);
        onDirectoryChange(selected);
        toast.success("Download directory updated");
      }
    } catch (error) {
      console.error("Failed to open directory picker:", error);
      toast.error(`Failed to select directory: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const getDisplayPath = () => {
    if (!selectedPath) return "Not selected";

    // Shorten path for display
    const homePath = process.env.HOME || "~";
    if (selectedPath.startsWith(homePath)) {
      return `~${selectedPath.substring(homePath.length)}`;
    }

    // Show last 2 segments if path is too long
    const segments = selectedPath.split("/");
    if (segments.length > 3) {
      return `.../${segments.slice(-2).join("/")}`;
    }

    return selectedPath;
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-clay-gradient-start to-clay-gradient-end shadow-clay-button">
          <FolderOpen className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-bold text-clay-foreground">Save Destination</h3>
          <p className="text-[10px] text-clay-muted">Choose save location</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 px-3 py-2 rounded-clay-button bg-white/60 shadow-clay-pressed text-xs text-clay-foreground truncate font-mono">
          {getDisplayPath()}
        </div>
        <button
          onClick={handleSelectDirectory}
          className="shrink-0 rounded-clay-button bg-white/60 px-3 py-2 font-heading text-xs font-bold text-clay-foreground shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:bg-white/80 hover:shadow-clay-button-hover active:scale-95"
        >
          Choose
        </button>
      </div>
    </div>
  );
}
