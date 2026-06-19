import { Save, ShieldCheck } from "lucide-react";
import { useState } from "react";

import Button from "../components/Button.jsx";
import DataTable from "../components/DataTable.jsx";
import FormField from "../components/FormField.jsx";
import InlineAlert from "../components/InlineAlert.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SectionPanel from "../components/SectionPanel.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useResourceList } from "../hooks/useResourceList.js";
import { createUser, getUsers } from "../services/userService.js";
import { ROLES } from "../utils/roles.js";

const initialUser = {
  name: "",
  role: ROLES.VETERINARY_STAFF,
  email: "",
  password: "",
};

const roleVariants = {
  [ROLES.ADMINISTRATOR]: "info",
  [ROLES.VETERINARY_STAFF]: "success",
  [ROLES.FIELD_PERSONNEL]: "neutral",
};

export default function UsersPage() {
  const { records: users, status: listStatus, error: listError, refresh } = useResourceList(getUsers);
  const [form, setForm] = useState(initialUser);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    setError("");
    try {
      await createUser(form);
      setForm(initialUser);
      await refresh();
      setMessage("Account created.");
    } catch (error) {
      setError(error.message);
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="grid gap-6">
      <PageHeader title="Users" />

      <SectionPanel title="Create Account">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <InlineAlert variant="success">{message}</InlineAlert>
          <InlineAlert variant="danger">{error}</InlineAlert>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              id="user-name"
              label="Name"
              onChange={(event) => updateField("name", event.target.value)}
              required
              value={form.name}
            />
            <FormField
              as="select"
              id="user-role"
              label="Role"
              onChange={(event) => updateField("role", event.target.value)}
              required
              value={form.role}
            >
              <option value={ROLES.ADMINISTRATOR}>Administrator</option>
              <option value={ROLES.VETERINARY_STAFF}>Veterinary Staff</option>
              <option value={ROLES.FIELD_PERSONNEL}>Field Personnel</option>
            </FormField>
            <FormField
              autoComplete="email"
              id="user-email"
              label="Email"
              onChange={(event) => updateField("email", event.target.value)}
              required
              type="email"
              value={form.email}
            />
            <FormField
              autoComplete="new-password"
              hint="Min. 8 characters"
              id="user-password"
              label="Password"
              minLength={8}
              onChange={(event) => updateField("password", event.target.value)}
              required
              type="password"
              value={form.password}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300">{message || "Ready."}</p>
            <Button disabled={status === "saving"} icon={Save} type="submit">
              {status === "saving" ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </SectionPanel>

      <SectionPanel title="Accounts">
        <InlineAlert variant="danger">{listError}</InlineAlert>
        {listStatus === "loading" ? <LoadingState label="Loading accounts" /> : null}
        {listStatus !== "loading" ? (
          <DataTable
            ariaLabel="System user accounts"
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              {
                key: "role",
                label: "Role",
                render: (row) => (
                  <StatusBadge variant={roleVariants[row.role] ?? "neutral"}>
                    {row.role}
                  </StatusBadge>
                ),
              },
              {
                key: "user_id",
                label: "Access",
                render: () => <ShieldCheck className="h-4 w-4 text-emerald-200" aria-hidden="true" />,
              },
            ]}
            emptyDescription="Created accounts will appear here."
            emptyLabel="No user accounts found."
            rowKey={(row) => row.user_id}
            rows={users}
          />
        ) : null}
      </SectionPanel>
    </div>
  );
}
