"use client";

import { useState } from "react";
import { X, Crown, Sparkles, Film, Video, Infinity, Zap } from "lucide-react";
import { LicenseDialog } from "./license-dialog";
import { isTauri } from "@/lib/tauri-utils";
import { open } from "@tauri-apps/plugin-shell";

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateSuccess?: () => void;
}

const proFeatures = [
  {
    icon: Film,
    title: "GIF Exports",
    description: "Convert your clips to high-quality animated GIFs",
    color: "from-[#EC4899] to-[#DB2777]",
  },
  {
    icon: Video,
    title: "Up to 4K Resolution",
    description: "Export in stunning 1080p, 1440p, and 4K quality",
    color: "from-[#8B5CF6] to-[#7C3AED]",
  },
  {
    icon: Infinity,
    title: "Lifetime Updates",
    description: "Get all future features and improvements forever",
    color: "from-[#0EA5E9] to-[#0284C7]",
  },
  {
    icon: Sparkles,
    title: "AI Summary",
    description: "Smart AI-powered video summaries and insights",
    color: "from-[#F59E0B] to-[#D97706]",
  },
];

export function UpgradeDialog({ isOpen, onClose, onActivateSuccess }: UpgradeDialogProps) {
  const [isLicenseDialogOpen, setIsLicenseDialogOpen] = useState(false);
  const checkoutUrl =
    process.env.NEXT_PUBLIC_CHECKOUT_URL ||
    "https://www.ytsmartclip.org/checkout?productId=prod_17qZbU3KZnunyAzraSiqii";

  const handleUpgradeClick = async () => {
    if (isTauri()) {
      await open(checkoutUrl);
      return;
    }
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-[#332F3A]/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
            <div className="relative w-full max-w-lg rounded-[28px] bg-white/90 p-6 shadow-clay-card backdrop-blur-xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-white/60 p-1.5 shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-button-hover active:scale-90"
              >
                <X className="h-4 w-4 text-clay-foreground" />
              </button>

              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] shadow-clay-button animate-clay-breathe">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] mb-1.5">
                  Upgrade to Pro
                </h2>
                <p className="text-base text-[#635F69]">
                  Unlock premium features and take your clips to the next level
                </p>
              </div>

              {/* Features Grid */}
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {proFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="group rounded-[20px] bg-white/60 p-4 shadow-clay-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-clay-card-hover"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-clay-button transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-heading text-base font-bold text-[#332F3A] mb-0.5">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-clay-muted leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Pricing */}
              <div className="mb-5 rounded-clay-button bg-linear-to-br from-[#7C3AED]/10 to-[#DB2777]/10 p-4 border-2 border-[#7C3AED]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-clay-muted mb-0.5">Early Bird Offer</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-heading text-3xl font-black text-clay-foreground">$8</span>
                      <span className="text-sm text-clay-muted line-through">$16</span>
                      <span className="rounded-full bg-linear-to-br from-[#10B981] to-[#059669] px-2 py-0.5 text-xs font-bold text-white shadow-clay-button">
                        50% OFF
                      </span>
                    </div>
                    <p className="text-xs text-clay-muted mt-0.5">Limited time offer</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 shadow-clay-button">
                    <Zap className="h-4 w-4 text-[#F59E0B]" />
                    <span className="font-heading text-xs font-bold text-clay-foreground">
                      Launch Special
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={handleUpgradeClick}
                  className="flex-1 rounded-clay-button bg-linear-to-br from-clay-gradient-start to-clay-gradient-end px-6 py-3 font-heading text-base font-bold text-white shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-button-hover active:scale-[0.92] active:shadow-clay-pressed"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Crown className="h-4 w-4" />
                    Upgrade Now
                  </span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-clay-button bg-white/60 px-6 py-3 font-heading text-base font-bold text-clay-foreground shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:bg-white/80 hover:shadow-clay-button-hover active:scale-95"
                >
                  Maybe Later
                </button>
              </div>

              {/* Trust Badge */}
              <div className="mt-4 text-center">
                <p className="text-[10px] text-clay-muted">
                  ✓ Secure payment • ✓ 30-day money-back guarantee • ✓ Instant access
                </p>
              </div>

              {/* Already have a license */}
              <div className="mt-3 text-center">
                <button
                  onClick={() => {
                    setIsLicenseDialogOpen(true);
                    onClose();
                  }}
                  className="text-xs text-clay-muted hover:text-clay-accent transition-colors duration-200 underline-offset-2 hover:underline"
                >
                  Already have a license? Enter it here
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* License Dialog - rendered outside of isOpen check so it can show independently */}
      <LicenseDialog
        isOpen={isLicenseDialogOpen}
        onClose={() => setIsLicenseDialogOpen(false)}
        onActivateSuccess={onActivateSuccess}
      />
    </>
  );
}
