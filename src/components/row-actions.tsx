"use client";

import { useOptimistic, useState, useTransition } from "react";
import { KeyRound, Search, Trash2 } from "lucide-react";
import {
  deleteProduct,
  deleteUser,
  setOrderStatus,
  toggleUserActive,
  updateStock,
} from "@/lib/actions";
import { formatDate, roleLabels, statusLabels } from "@/lib/format";
import type { OrderStatus } from "@/db/schema";
import type { UserRow } from "@/lib/queries";

const statusStyle: Record<OrderStatus, string> = {
  completed: "bg-success-soft text-success",
  processing: "bg-warning-soft text-warning",
  cancelled: "bg-danger-soft text-danger",
};

export function OrderStatusSelect({ id, status }: { id: number; status: OrderStatus }) {
  const [optimistic, setOptimistic] = useOptimistic(status);
  const [, startTransition] = useTransition();

  return (
    <select
      aria-label="حالة الطلب"
      value={optimistic}
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        startTransition(async () => {
          setOptimistic(next);
          await setOrderStatus(id, next);
        });
      }}
      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${statusStyle[optimistic]}`}
    >
      {Object.entries(statusLabels).map(([value, label]) => (
        <option key={value} value={value} className="bg-surface text-foreground">
          {label}
        </option>
      ))}
    </select>
  );
}

export function DeleteButton({ onDelete, label }: { onDelete: () => Promise<void>; label: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      aria-label={label}
      title={label}
      onClick={() => {
        if (confirm(`${label}؟`)) startTransition(onDelete);
      }}
      className="rounded-lg p-2 text-muted transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
    >
      <Trash2 className="size-4" />
    </button>
  );
}

export function DeleteProductButton({ id }: { id: number }) {
  return <DeleteButton label="حذف المنتج وطلباته" onDelete={() => deleteProduct(id)} />;
}

export function StockEditor({ id, stock }: { id: number; stock: number }) {
  const [value, setValue] = useState(String(stock));
  const [, startTransition] = useTransition();

  const commit = () => {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0) return setValue(String(stock));
    if (n !== stock) startTransition(() => updateStock(id, n));
  };

  return (
    <input
      aria-label="المخزون"
      type="number"
      min="0"
      dir="ltr"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      className="w-16 rounded-md border border-transparent bg-transparent text-center font-bold outline-none hover:border-border focus:border-primary"
    />
  );
}

function UserToggle({ user, disabled }: { user: UserRow; disabled: boolean }) {
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
      aria-label={`تفعيل ${user.name}`}
      className={`relative h-6 w-11 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${active ? "bg-success" : "bg-border"}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
          active ? "left-0.5" : "left-[22px]"
        }`}
      />
    </button>
  );
}

export function UsersTable({ users, meId, canManage }: { users: UserRow[]; meId: number; canManage: boolean }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const list = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));

  return (
    <>
      <div className="p-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالاسم أو البريد..."
            className="w-full rounded-lg border border-border bg-surface-2 py-2 pr-9 pl-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-muted">
            <tr>
              <th className="px-5 py-3 text-right font-medium">المستخدم</th>
              <th className="px-5 py-3 text-right font-medium">الدور</th>
              <th className="px-5 py-3 text-right font-medium">تاريخ الانضمام</th>
              <th className="px-5 py-3 text-right font-medium">الحالة</th>
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
                <td className="px-5 py-3">
                  {roleLabels[u.role]}
                  {u.id === meId && <span className="mr-2 text-xs text-primary">(أنت)</span>}
                  {u.canLogin && (
                    <span title="يمكنه تسجيل الدخول" className="mr-2 inline-flex align-middle text-muted">
                      <KeyRound className="size-3.5" />
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-muted" dir="ltr">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-3">
                  <UserToggle user={u} disabled={!canManage || u.id === meId} />
                </td>
                <td className="px-5 py-3 text-left">
                  {canManage && u.id !== meId && (
                    <DeleteButton label={`حذف ${u.name}`} onDelete={() => deleteUser(u.id)} />
                  )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">لا توجد نتائج</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
