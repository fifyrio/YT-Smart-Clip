/**
 * License Activation API Client
 * Based on: https://ytsmartclip.org/docs/LICENSE_ACTIVATION_API.md
 */

import { invoke } from "@tauri-apps/api/core";
import { isTauri } from "./tauri-utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_LICENSE_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/license/activate"
    : "https://ytsmartclip.org/api/license/activate");

interface ActivateLicenseRequest {
  licenseKey: string;
  deviceHash: string;
  deviceName?: string;
}

interface ActivateLicenseResponse {
  activationToken: string;
  plan: string;
  expiresAt: string;
}

interface VerifyTokenResponse {
  valid: boolean;
  licenseId?: string;
  plan?: string;
  expiresAt?: string;
  error?: string;
}

interface LicenseError {
  error: string;
  code?: string;
  details?: string;
}

/**
 * Activate a license key on the current device
 * @param request License activation request
 * @returns Activation token and license details
 * @throws Error if activation fails
 */
export async function activateLicense(
  request: ActivateLicenseRequest
): Promise<ActivateLicenseResponse> {
  try {
    if (isTauri()) {
      return await invoke<ActivateLicenseResponse>("activate_license", { request });
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as LicenseError;
      console.log(errorData)
      throw new Error(errorData.error || "Failed to activate license");
    }

    const data = (await response.json()) as ActivateLicenseResponse;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    if (typeof error === "string" && error.trim()) {
      throw new Error(error);
    }
    throw new Error("Network error: Failed to connect to license server");
  }
}

/**
 * Verify an activation token
 * @param token Activation token (JWT)
 * @returns Token validation result
 */
export async function verifyActivationToken(
  token: string
): Promise<VerifyTokenResponse> {
  try {
    if (isTauri()) {
      return await invoke<VerifyTokenResponse>("verify_activation_token", { token });
    }

    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as VerifyTokenResponse;
    return data;
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      valid: false,
      error: "Failed to verify token",
    };
  }
}

/**
 * Store activation token securely
 * Uses localStorage for now, should use Tauri's secure storage in production
 * @param token Activation token
 */
export function storeActivationToken(token: string): void {
  try {
    localStorage.setItem("yt_activation_token", token);
  } catch (error) {
    console.error("Failed to store activation token:", error);
  }
}

/**
 * Retrieve stored activation token
 * @returns Activation token or null
 */
export function getStoredActivationToken(): string | null {
  try {
    return localStorage.getItem("yt_activation_token");
  } catch (error) {
    console.error("Failed to retrieve activation token:", error);
    return null;
  }
}

/**
 * Clear stored activation token (for deactivation/logout)
 */
export function clearActivationToken(): void {
  try {
    localStorage.removeItem("yt_activation_token");
    localStorage.removeItem("isPro");
  } catch (error) {
    console.error("Failed to clear activation token:", error);
  }
}

/**
 * Parse error message from API response
 * @param error Error from activation API
 * @returns User-friendly error message
 */
export function parseActivationError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;

    // Map common errors to user-friendly messages
    if (message.includes("Invalid license key")) {
      return "Invalid license key. Please check your license key and try again.";
    }
    if (message.includes("revoked")) {
      return "This license has been revoked. Please contact support.";
    }
    if (message.includes("activation limit")) {
      return "License activation limit reached. Please deactivate a device first.";
    }
    if (message.includes("Network error")) {
      return "Cannot connect to license server. Please check your internet connection.";
    }

    return message;
  }

  return "An unexpected error occurred. Please try again.";
}
