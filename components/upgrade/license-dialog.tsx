"use client";

import { useState } from "react";
import { X, Key, CheckCircle2 } from "lucide-react";

interface LicenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LicenseDialog({ isOpen, onClose }: LicenseDialogProps) {
  const [licenseKey, setLicenseKey] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      setError("Please enter a license key");
      return;
    }

    setIsActivating(true);
    setError("");

    // Simulate activation process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Replace with actual license validation logic
    if (licenseKey.trim().length > 10) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setLicenseKey("");
      }, 2000);
    } else {
      setError("Invalid license key. Please try again.");
    }

    setIsActivating(false);
  };

  const handleClose = () => {
    if (!isActivating) {
      onClose();
      setLicenseKey("");
      setError("");
      setSuccess(false);
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
            disabled={isActivating}
            className="absolute right-4 top-4 rounded-full bg-white/60 p-1.5 shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-button-hover active:scale-90 disabled:opacity-50"
          >
            <X className="h-4 w-4 text-clay-foreground" />
          </button>

          {/* Header */}
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-clay-gradient-start to-clay-gradient-end shadow-clay-button">
              <Key className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-heading text-2xl font-black tracking-tight text-clay-foreground mb-1">
              Activate License
            </h2>
            <p className="text-sm text-clay-muted">
              Enter your license key to unlock Pro features
            </p>
          </div>

          {/* License Input */}
          <div className="mb-4">
            <label className="mb-2 block text-xs font-medium text-clay-foreground">
              🔑 Enter your license key
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => {
                setLicenseKey(e.target.value);
                setError("");
              }}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              disabled={isActivating || success}
              className="w-full rounded-clay-button border-2 border-clay-accent/20 bg-white/60 px-4 py-3 text-sm font-mono text-clay-foreground shadow-clay-pressed transition-all duration-200 placeholder:text-clay-muted/50 focus:border-clay-accent/40 focus:outline-none focus:ring-2 focus:ring-clay-accent/20 disabled:opacity-50"
            />
            {error && (
              <p className="mt-2 text-xs text-red-600 animate-in fade-in duration-200">
                ⚠️ {error}
              </p>
            )}
            {success && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-clay-success animate-in fade-in duration-200">
                <CheckCircle2 className="h-4 w-4" />
                License activated successfully!
              </p>
            )}
          </div>

          {/* Activate Button */}
          <button
            onClick={handleActivate}
            disabled={isActivating || success}
            className="w-full rounded-clay-button bg-linear-to-br from-clay-gradient-start to-clay-gradient-end px-6 py-3 font-heading text-base font-bold text-white shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-button-hover active:scale-[0.92] active:shadow-clay-pressed disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isActivating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Activating...
              </span>
            ) : success ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Activated!
              </span>
            ) : (
              "Activate License"
            )}
          </button>

          {/* Help Text */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-clay-muted">
              Don't have a license?{" "}
              <button
                onClick={handleClose}
                className="font-semibold text-clay-accent hover:underline"
              >
                Purchase one now
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
