"use client";

import { useState, useEffect, useCallback } from "react";
import { PanelLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { useSidebar } from "@/contexts/SidebarContext";
import { useChatContext } from "@/contexts/ChatContext";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { clearAccountData } from "@/lib/account";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  type SettingsState,
} from "@/lib/settings";

export default function SettingsPage() {
  const router = useRouter();
  const { isOpen: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();
  const { clearAllConversations } = useChatContext();
  const { user } = useUser();
  const { signOut } = useAuth();
  const { plan } = useSubscription();

  const [saved, setSaved] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [draft, setDraft] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [exporting, setExporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState<
    null | "confirm" | "email" | "processing" | "done"
  >(null);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const isDirty =
    draft.improveModel !== saved.improveModel ||
    draft.chatHistory !== saved.chatHistory ||
    draft.emailNotifs !== saved.emailNotifs ||
    draft.pushNotifs !== saved.pushNotifs ||
    draft.cookieEssential !== saved.cookieEssential ||
    draft.cookieAnalytics !== saved.cookieAnalytics ||
    draft.cookiePersonalization !== saved.cookiePersonalization;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(loadSettings());
    setDraft(loadSettings());
  }, []);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleSave = useCallback(() => {
    saveSettings(draft);
    setSaved(draft);
  }, [draft]);

  const handleDiscard = useCallback(() => {
    setDraft(saved);
  }, [saved]);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 2000);
  };

  const handleNavigate = useCallback(
    (href: string) => {
      if (
        isDirty &&
        !window.confirm("You have unsaved changes. Leave anyway?")
      ) {
        return;
      }
      router.push(href);
    },
    [isDirty, router],
  );

  const handleDeleteStart = () => setDeleteStep("confirm");
  const handleDeleteCancel = () => {
    setDeleteStep(null);
    setDeleteEmail("");
    setDeleteError("");
  };
  const handleDeleteConfirm = () => setDeleteStep("email");
  const handleDeleteSubmit = () => {
    setDeleteError("");
    const trimmed = deleteEmail.trim().toLowerCase();
    const expected = user.email.trim().toLowerCase();
    if (!trimmed) {
      setDeleteError("Please enter your email address.");
      return;
    }
    if (trimmed !== expected) {
      setDeleteError(
        "The email does not match your account. Please enter the correct email.",
      );
      return;
    }
    setDeleteStep("processing");
    setTimeout(() => setDeleteStep("done"), 2500);
  };

  return (
    <>
      <header className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className={`p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 ${!sidebarOpen ? "flex" : "hidden"}`}
          title="Expand sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-sm font-medium text-stone-700 dark:text-slate-300">
          Settings
        </h1>
        <ThemeToggle />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto py-8 px-4">
          <div className="space-y-8">
            {/* Account */}
            <section>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-3">
                Account
              </h2>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleNavigate("/profile")}
                  className="w-full block p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                    Profile
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                    Manage your name, email, and avatar
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/subscription")}
                  className="w-full block p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                    Subscription
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                    {plan.name} plan · Manage billing and upgrade
                  </p>
                </button>
              </div>
            </section>

            {/* Appearance */}
            <section>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-3">
                Appearance
              </h2>
              <div className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                    Theme
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                    Light or dark mode
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </section>

            {/* Privacy & Cookies */}
            <section>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-3">
                Privacy & Cookies
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mb-3">
                Manage cookie preferences. Essential cookies are required for
                the app to function.
              </p>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                      Essential cookies
                    </p>
                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                      Required for sign-in, preferences, and core features
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.cookieEssential}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        cookieEssential: e.target.checked,
                      }))
                    }
                    className="rounded border-stone-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                      Analytics cookies
                    </p>
                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                      Help us understand how the product is used
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.cookieAnalytics}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        cookieAnalytics: e.target.checked,
                      }))
                    }
                    className="rounded border-stone-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                      Personalization cookies
                    </p>
                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                      Customize your experience and suggestions
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.cookiePersonalization}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        cookiePersonalization: e.target.checked,
                      }))
                    }
                    className="rounded border-stone-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
                  />
                </label>
              </div>
            </section>

            {/* Notifications */}
            <section>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-3">
                Notifications
              </h2>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-sm text-stone-700 dark:text-slate-300">
                    Email notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={draft.emailNotifs}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, emailNotifs: e.target.checked }))
                    }
                    className="rounded border-stone-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-sm text-stone-700 dark:text-slate-300">
                    Push notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={draft.pushNotifs}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, pushNotifs: e.target.checked }))
                    }
                    className="rounded border-stone-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
                  />
                </label>
              </div>
            </section>

            {/* Data Controls */}
            <section>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-3">
                Data Controls
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mb-3">
                Manage how your data is used and stored.
              </p>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                      Improve the model for everyone
                    </p>
                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                      Allow your conversations to be used for model improvement
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.improveModel}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        improveModel: e.target.checked,
                      }))
                    }
                    className="rounded border-stone-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
                  />
                </label>
                <label className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                      Chat history
                    </p>
                    <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                      Save new conversations to your history
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.chatHistory}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, chatHistory: e.target.checked }))
                    }
                    className="rounded border-stone-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
                  />
                </label>
                <div className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-stone-700 dark:text-slate-300 mb-1">
                    Export data
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mb-3">
                    Download your conversation history and account data
                  </p>
                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={exporting}
                    className="px-3 py-1.5 rounded-lg text-sm border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    {exporting ? "Preparing…" : "Export"}
                  </button>
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-stone-700 dark:text-slate-300 mb-1">
                    Clear chat history
                  </p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mb-3">
                    Permanently delete all your conversations. This cannot be
                    undone.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="px-3 py-1.5 rounded-lg text-sm border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                  >
                    Clear history
                  </button>
                </div>
              </div>
            </section>

            {/* Save / Discard */}
            {isDirty && (
              <section className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="px-4 py-2 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 text-sm font-medium hover:bg-stone-100 dark:hover:bg-slate-800"
                >
                  Discard
                </button>
              </section>
            )}

            {/* Danger zone */}
            <section>
              <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">
                Danger zone
              </h2>
              <div className="p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
                <p className="text-sm font-medium text-stone-700 dark:text-slate-300 mb-1">
                  Delete account
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400 mb-3">
                  Permanently delete your account and all data. This cannot be
                  undone.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteStart}
                  className="px-3 py-1.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50"
                >
                  Delete account
                </button>
              </div>
            </section>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => handleNavigate("/chat")}
                className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
              >
                ← Back to chat
              </button>
              <button
                type="button"
                onClick={() => handleNavigate("/help")}
                className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
              >
                Help & Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-1">
              Clear chat history
            </h3>
            <p className="text-sm text-stone-600 dark:text-slate-400 mb-4">
              Are you sure? This will permanently delete all your conversations.
              This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-sm text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllConversations();
                  setShowClearConfirm(false);
                  router.push("/chat/new");
                }}
                className="px-3 py-1.5 rounded-lg text-sm bg-amber-600 hover:bg-amber-700 text-white"
              >
                Clear history
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account flow modal */}
      {deleteStep && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={
            deleteStep === "processing" || deleteStep === "done"
              ? undefined
              : handleDeleteCancel
          }
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {deleteStep === "confirm" && (
              <>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-1">
                  Delete account
                </h3>
                <p className="text-sm text-stone-600 dark:text-slate-400 mb-4">
                  Are you sure? This will permanently delete your account and
                  all conversation data. This cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteCancel}
                    className="px-3 py-1.5 rounded-lg text-sm text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    className="px-3 py-1.5 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {deleteStep === "email" && (
              <>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-1">
                  Confirm your email
                </h3>
                <p className="text-sm text-stone-600 dark:text-slate-400 mb-3">
                  Enter your email address ({user.email}) to confirm account
                  deletion.
                </p>
                <input
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  placeholder={user.email}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 mb-2"
                />
                {deleteError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                    {deleteError}
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteCancel}
                    className="px-3 py-1.5 rounded-lg text-sm text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSubmit}
                    className="px-3 py-1.5 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete account
                  </button>
                </div>
              </>
            )}

            {deleteStep === "processing" && (
              <div className="py-4 text-center">
                <div className="inline-block w-8 h-8 border-2 border-stone-300 dark:border-slate-600 border-t-violet-600 rounded-full animate-spin mb-3" />
                <p className="text-sm text-stone-600 dark:text-slate-400">
                  Deleting your account…
                </p>
              </div>
            )}

            {deleteStep === "done" && (
              <div className="py-4 text-center">
                <p className="text-sm font-medium text-stone-900 dark:text-slate-100 mb-1">
                  Account deleted
                </p>
                <p className="text-sm text-stone-600 dark:text-slate-400 mb-4">
                  Your account has been permanently deleted. You have been
                  signed out.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteCancel();
                    clearAccountData();
                    signOut();
                    router.push("/logged-out");
                  }}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
