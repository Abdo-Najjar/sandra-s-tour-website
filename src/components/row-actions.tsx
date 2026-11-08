"use client";

import { useOptimistic, useState, useTransition } from "react";
import { KeyRound, Search, Trash2 } from "lucide-react";
import { deleteUser, toggleUserActive } from "@/lib/actions";
import { formatDate, roleLabel } from "@/lib/format";
import { useT } from "@/components/admin/admin-lang";
import type { UserRow } from "@/lib/queries";

export function DeleteButton({ onDelete, label }: { onDelete: () => Promise<void>; label: string }) {
  const t = useT();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      aria-label={label}
      title={label}
      onClick={() => {
        if (confirm(t("{label}?", { label }))) startTransition(onDelete);
      }}
      className="rounded-lg p-2 text-muted transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
    >
      <Trash2 className="size-4" />
    </button>
  );
}

function UserToggle({ user, disabled }: { user: UserRow; disabled: boolean }) {
  const t = useT();
  const [active, setActive] = useOptimistic(user.active);
  const [, startTransition] = useTransition();
  return (
    <button
      disabled={disabled}
      onClick={() =>
        startTransition(async () => {
          setActive(!active);
          await toggleUserActive(user.id);
        })
      }
      role="switch"
      aria-checked={active}
      aria-label={t("Active: {name}", { name: user.name })}
      className={`relative h-6 w-11 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${active ? "bg-success" : "bg-border"}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
          active ? "start-[22px]" : "start-0.5"
        }`}
      />
    </button>
  );
}

export function UsersTable({ users, meId, canManage }: { users: UserRow[]; meId: number; canManage: boolean }) {
  const t = useT();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const list = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));

  return (
    <>
      <div className="p-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Search by name or email…")}
            className="w-full rounded-lg border border-border bg-surface-2 py-2 ps-9 pe-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="rtable w-full text-sm">
          <thead className="bg-surface-2 text-muted">
            <tr>
              <th className="px-5 py-3 text-start font-medium">{t("Account")}</th>
              <th className="px-5 py-3 text-start font-medium">{t("Role")}</th>
              <th className="px-5 py-3 text-start font-medium">{t("Joined")}</th>
              <th className="px-5 py-3 text-start font-medium">{t("Active")}</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft font-bold text-primary">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted" dir="ltr">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td data-label={t("Role")} className="px-5 py-3">
                  {roleLabel(u.role, t)}
                  {u.id === meId && <span className="ms-2 text-xs text-primary">{t("(you)")}</span>}
                  {u.canLogin && (
                    <span title={t("Can sign in")} className="ms-2 inline-flex align-middle text-muted">
                      <KeyRound className="size-3.5" />
                    </span>
                  )}
                </td>
                <td data-label={t("Joined")} className="px-5 py-3 text-muted"><span dir="ltr">{formatDate(u.createdAt)}</span></td>
                <td data-label={t("Active")} className="px-5 py-3 [&>button]:align-middle">
                  <UserToggle user={u} disabled={!canManage || u.id === meId} />
                </td>
                <td className="rtable-end px-5 py-3 text-end">
                  {canManage && u.id !== meId && (
                    <DeleteButton label={t("Delete {name}", { name: u.name })} onDelete={() => deleteUser(u.id)} />
                  )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">{t("No results")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
