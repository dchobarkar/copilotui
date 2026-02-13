"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/layout/PageHeader";
import PageContent from "@/components/layout/PageContent";
import PageFooterLinks from "@/components/layout/PageFooterLinks";
import { CardButton } from "@/components/ui/Card";
import SettingsToggleRow from "@/components/ui/SettingsToggleRow";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useChatContext } from "@/contexts/ChatContext";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { clearAccountData } from "@/lib/account";
import {
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  type SettingsState,
} from "@/lib/settings";

const Page = () => {
  const router = useRouter();
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
      <PageHeader title="Settings" />

      <PageContent maxWidth="xl">
        <div className="space-y-8">
          {/* Account */}
          <section>
            <h2 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-3">
              Account
            </h2>
            <div className="space-y-2">
              <CardButton onClick={() => handleNavigate("/profile")}>
                <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                  Profile
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                  Manage your name, email, and avatar
                </p>
              </CardButton>
              <CardButton onClick={() => handleNavigate("/subscription")}>
                <p className="text-sm font-medium text-stone-700 dark:text-slate-300">
                  Subscription
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                  {plan.name} plan · Manage billing and upgrade
                </p>
              </CardButton>
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
              Manage cookie preferences. Essential cookies are required for the
              app to function.
            </p>
            <div className="space-y-2">
              <SettingsToggleRow
                title="Essential cookies"
                description="Required for sign-in, preferences, and core features"
                checked={draft.cookieEssential}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, cookieEssential: v }))
                }
              />
              <SettingsToggleRow
                title="Analytics cookies"
                description="Help us understand how the product is used"
                checked={draft.cookieAnalytics}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, cookieAnalytics: v }))
                }
              />
              <SettingsToggleRow
                title="Personalization cookies"
                description="Customize your experience and suggestions"
                checked={draft.cookiePersonalization}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, cookiePersonalization: v }))
                }
              />
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-3">
              Notifications
            </h2>
            <div className="space-y-2">
              <SettingsToggleRow
                title="Email notifications"
                checked={draft.emailNotifs}
                onChange={(v) => setDraft((d) => ({ ...d, emailNotifs: v }))}
              />
              <SettingsToggleRow
                title="Push notifications"
                checked={draft.pushNotifs}
                onChange={(v) => setDraft((d) => ({ ...d, pushNotifs: v }))}
              />
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
              <SettingsToggleRow
                title="Improve the model for everyone"
                description="Allow your conversations to be used for model improvement"
                checked={draft.improveModel}
                onChange={(v) => setDraft((d) => ({ ...d, improveModel: v }))}
              />
              <SettingsToggleRow
                title="Chat history"
                description="Save new conversations to your history"
                checked={draft.chatHistory}
                onChange={(v) => setDraft((d) => ({ ...d, chatHistory: v }))}
              />
              <div className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700">
                <p className="text-sm font-medium text-stone-700 dark:text-slate-300 mb-1">
                  Export data
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400 mb-3">
                  Download your conversation history and account data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={exporting}
                >
                  {exporting ? "Preparing…" : "Export"}
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-white dark:bg-slate-800/50 border border-stone-200 dark:border-slate-700">
                <p className="text-sm font-medium text-stone-700 dark:text-slate-300 mb-1">
                  Clear chat history
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400 mb-3">
                  Permanently delete all your conversations. This cannot be
                  undone.
                </p>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => setShowClearConfirm(true)}
                >
                  Clear history
                </Button>
              </div>
            </div>
          </section>

          {/* Save / Discard */}
          {isDirty && (
            <section className="flex gap-2">
              <Button onClick={handleSave}>Save changes</Button>
              <Button variant="secondary" onClick={handleDiscard}>
                Discard
              </Button>
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
              <Button variant="danger" size="sm" onClick={handleDeleteStart}>
                Delete account
              </Button>
            </div>
          </section>

          <PageFooterLinks
            links={[
              { href: "/chat", label: "← Back to chat" },
              { href: "/help", label: "Help & Support" },
            ]}
            className="pt-4"
          />
        </div>
      </PageContent>

      {showClearConfirm && (
        <Modal onClose={() => setShowClearConfirm(false)}>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-1">
            Clear chat history
          </h3>
          <p className="text-sm text-stone-600 dark:text-slate-400 mb-4">
            Are you sure? This will permanently delete all your conversations.
            This cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClearConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => {
                clearAllConversations();
                setShowClearConfirm(false);
                router.push("/chat/new");
              }}
            >
              Clear history
            </Button>
          </div>
        </Modal>
      )}

      {/* Delete account flow modal */}
      {deleteStep && (
        <Modal
          onClose={handleDeleteCancel}
          closeOnOverlayClick={
            deleteStep !== "processing" && deleteStep !== "done"
          }
        >
          {deleteStep === "confirm" && (
            <>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-1">
                Delete account
              </h3>
              <p className="text-sm text-stone-600 dark:text-slate-400 mb-4">
                Are you sure? This will permanently delete your account and all
                conversation data. This cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleDeleteCancel}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteConfirm}
                >
                  Continue
                </Button>
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
                <Button variant="ghost" size="sm" onClick={handleDeleteCancel}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleDeleteSubmit}>
                  Delete account
                </Button>
              </div>
            </>
          )}

          {deleteStep === "processing" && (
            <div className="py-4 text-center">
              <Spinner className="mx-auto mb-3" />
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
                Your account has been permanently deleted. You have been signed
                out.
              </p>
              <Button
                onClick={() => {
                  handleDeleteCancel();
                  clearAccountData();
                  signOut();
                  router.push("/logged-out");
                }}
              >
                Continue
              </Button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default Page;
