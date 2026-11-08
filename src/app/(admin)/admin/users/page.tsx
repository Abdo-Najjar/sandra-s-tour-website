import { Suspense } from "react";
import { Card, ContentSkeleton, PageHeader } from "@/components/ui";
import { NewUserButton } from "@/components/forms";
import { UsersTable } from "@/components/row-actions";
import { requireUser } from "@/lib/auth";
import { getUsers } from "@/lib/queries";
import { getT } from "@/lib/admin/lang";

export default function UsersPage() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <UsersContent />
    </Suspense>
  );
}

async function UsersContent() {
  const [me, users, t] = await Promise.all([requireUser(), getUsers(), getT()]);
  const isAdmin = me.role === "admin";
  const active = users.filter((u) => u.active).length;

  return (
    <>
      <PageHeader
        title={t("Users")}
        subtitle={t("{active} active of {total}", { active, total: users.length })}
        action={isAdmin ? <NewUserButton /> : undefined}
      />
      {!isAdmin && (
        <p className="mb-3 rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning">
          {t("You can only view users. Only an admin can change them.")}
        </p>
      )}
      <Card className="overflow-hidden p-0">
        <UsersTable users={users} meId={me.id} canManage={isAdmin} />
      </Card>
    </>
  );
}
