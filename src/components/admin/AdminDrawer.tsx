import React, { useEffect, useState } from "react";
import {
  X,
  Shield,
  User,
  Mail,
  Trash2,
  Plus,
  Crown,
  Loader2,
} from "lucide-react";
import {toast} from "sonner"

type AdminRole = "owner" | "admin";

interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  status?: string;
}

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;

  currentAdmin: {
    email: string;
    role: AdminRole;
  };

  admins: AdminUser[];

  onInvite: (email: string, role: AdminRole) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  currentAdmin,
  admins,
  onInvite,
  onDelete,
}) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] =
    useState<AdminRole>("admin");

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const isOwner = currentAdmin.role === "owner";

  // ✅ Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ✅ Invite Admin
  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter admin email");
    return;
    }

    // ✅ Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(inviteEmail)) {
      toast.error("Please enter valid email");
      return;
    }

    try {
      setLoading(true);

      await onInvite(
        inviteEmail.trim().toLowerCase(),
        inviteRole
      );

      // ✅ Reset form
      setInviteEmail("");
      setInviteRole("admin");
    } catch (error) {
      console.error(error);
      toast.error("Failed to invite admin");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Admin
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await onDelete(id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete admin");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-full sm:w-[420px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Shield size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Admin Management
              </h2>

              <p className="text-xs text-blue-100">
                Manage website admins
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scroll Area */}
        <div className="flex-1 overflow-y-auto">

          {/* Current Admin */}
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">
              YOUR ACCOUNT
            </h3>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white p-3 rounded-xl">
                  <User size={20} />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-800 break-all">
                    {currentAdmin.email}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium">
                    {currentAdmin.role === "owner" && (
                      <Crown size={14} />
                    )}

                    {currentAdmin.role}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin List */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500">
                ADMINS
              </h3>

              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {admins.length} Total
              </span>
            </div>

            <div className="space-y-3">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="border border-gray-200 rounded-2xl p-4 hover:border-blue-300 transition"
                >
                  <div className="flex items-start justify-between gap-3">

                    {/* Admin Info */}
                    <div className="flex gap-3 flex-1">
                      <div className="bg-blue-100 text-blue-700 p-2 rounded-xl">
                        <Mail size={18} />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-gray-800 break-all">
                          {admin.email}
                        </p>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">

                          {/* Role */}
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              admin.role === "owner"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {admin.role}
                          </span>

                          {/* Status */}
                          {admin.status && (
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                admin.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {admin.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    {isOwner &&
                      admin.role !== "owner" && (
                        <button
                          onClick={() =>
                            handleDelete(admin.id)
                          }
                          disabled={
                            deletingId === admin.id
                          }
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                        >
                          {deletingId === admin.id ? (
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Section */}
          {isOwner && (
            <div className="p-5">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">
                INVITE NEW ADMIN
              </h3>

              <div className="space-y-4">

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Admin Email
                  </label>

                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={inviteEmail}
                    onChange={(e) =>
                      setInviteEmail(
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-xl px-4 py-3 text-sm"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Role
                  </label>

                  <select
                    value={inviteRole}
                    onChange={(e) =>
                      setInviteRole(
                        e.target
                          .value as AdminRole
                      )
                    }
                    className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none rounded-xl px-4 py-3 text-sm bg-white"
                  >
                    <option value="admin">
                      Admin
                    </option>

                    <option value="owner">
                      Owner
                    </option>
                  </select>
                </div>

                {/* Invite Button */}
                <button
                  onClick={handleInvite}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-xl py-3 flex items-center justify-center gap-2 transition"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Sending Invite...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Invite Admin
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDrawer;