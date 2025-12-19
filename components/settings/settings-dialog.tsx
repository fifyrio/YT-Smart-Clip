"use client";

import { useState } from "react";
import { X, RefreshCw, Mail, Info } from "lucide-react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  if (!isOpen) return null;

  const version = "0.1.0"; // This should match tauri.conf.json
  const supportEmail = "support@ytsmartclip.org";

  const handleUpdate = async () => {
    setIsUpdating(true);
    setUpdateMessage("");

    try {
      // Simulate update check (replace with actual Tauri updater logic later)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUpdateMessage("You're running the latest version!");
    } catch (error) {
      console.error("Update check failed:", error);
      setUpdateMessage("Failed to check for updates");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContactSupport = () => {
    window.open(`mailto:${supportEmail}`, "_blank");
  };

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
      setUpdateMessage("");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-[#332F3A]/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
        <div className="relative w-full max-w-md rounded-[24px] bg-white/90 p-6 shadow-clay-card backdrop-blur-xl">
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isUpdating}
            className="absolute right-4 top-4 rounded-full bg-white/60 p-1.5 shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-button-hover active:scale-90 disabled:opacity-50"
          >
            <X className="h-4 w-4 text-clay-foreground" />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-clay-gradient-start to-clay-gradient-end shadow-clay-button">
              <Info className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-heading text-2xl font-black tracking-tight text-clay-foreground mb-1">
              Settings
            </h2>
            <p className="text-sm text-clay-muted">
              App information and updates
            </p>
          </div>

          {/* Version Info */}
          <div className="mb-4 rounded-[20px] bg-white/60 p-4 shadow-clay-pressed">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-clay-muted mb-0.5">
                  Current Version
                </p>
                <p className="font-heading text-lg font-bold text-clay-foreground">
                  v{version}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] shadow-clay-button">
                <Info className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full mb-3 rounded-clay-button bg-linear-to-br from-clay-gradient-start to-clay-gradient-end px-6 py-3 font-heading text-base font-bold text-white shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-button-hover active:scale-[0.92] active:shadow-clay-pressed disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Checking for updates...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Check for Updates
              </span>
            )}
          </button>

          {/* Update Message */}
          {updateMessage && (
            <div className="mb-3 rounded-[16px] bg-clay-success/10 px-3 py-2 border border-clay-success/20 animate-in fade-in duration-200">
              <p className="text-xs text-center text-clay-success font-medium">
                ✓ {updateMessage}
              </p>
            </div>
          )}

          {/* Contact Support Button */}
          <button
            onClick={handleContactSupport}
            disabled={isUpdating}
            className="w-full rounded-clay-button bg-white border-2 border-clay-accent/20 px-6 py-3 font-heading text-base font-bold text-clay-foreground shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:bg-clay-accent/5 hover:border-clay-accent hover:shadow-clay-button-hover active:scale-[0.92] active:shadow-clay-pressed disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Support
            </span>
          </button>

          {/* Support Email */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-clay-muted">
              Need help?{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="font-semibold text-clay-accent hover:underline"
              >
                {supportEmail}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
