"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { toast } from "sonner";

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
      if (typeof window !== "undefined" && (window as any).__TAURI__) {
        const { open } = await import("@tauri-apps/plugin-dialog");

        const selected = await open({
          directory: true,
          multiple: false,
          defaultPath: selectedPath || undefined,
        });

        if (selected && typeof selected === "string") {
          setSelectedPath(selected);
          onDirectoryChange(selected);
          toast.success("Download directory updated");
        }
      } else {
        // Fallback for web mode (development)
        toast.info("Directory selection only works in Tauri app");
      }
    } catch (error) {
      console.error("Failed to open directory picker:", error);
      toast.error("Failed to select directory");
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
    <div className="space-y-2">
      <label className="text-sm font-medium">Download Directory</label>
      <div className="flex gap-2">
        <div className="flex-1 px-3 py-2 rounded-md bg-muted border border-border text-sm truncate">
          {getDisplayPath()}
        </div>
        <Button
          variant="outline"
          size="default"
          onClick={handleSelectDirectory}
          className="shrink-0"
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          Choose
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Clips will be saved to this directory
      </p>
    </div>
  );
}
