import { useEffect, useMemo, useState } from "react";
import DataTableModule from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { deleteUserByAdminApi, getAllUsersApi } from "../../api/adminApi";
import { Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

const DataTable = DataTableModule?.default || DataTableModule;

export default function AdminUsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getAllUsersApi();
      const usersList = data.users || [];
      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      setFilteredUsers(users);
      return;
    }

    const next = users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
      );
    });

    setFilteredUsers(next);
  }, [searchText, users]);

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      setActionLoadingId(userId);
      setError("");
      setSuccessMessage("");

      await deleteUserByAdminApi(userId);

      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
      setSuccessMessage("User deleted successfully");
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getRoleClasses = (role) => {
    if (role === "admin") {
      return "bg-rose-50 text-rose-700 ring-rose-200";
    }

    if (role === "seller") {
      return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    return "bg-teal-50 text-teal-700 ring-teal-200";
  };

  const columns = useMemo(
    () => [
      {
        name: "User",
        sortable: true,
        grow: 2,
        cell: (row) => (
          <div className="py-3">
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        ),
      },
      {
        name: "Phone",
        selector: (row) => row.phone || "-",
        sortable: true,
        cell: (row) => (
          <span className="text-sm text-slate-700">{row.phone || "-"}</span>
        ),
      },
      {
        name: "Role",
        sortable: true,
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${getRoleClasses(
              row.role
            )}`}
          >
            {row.role}
          </span>
        ),
      },
      {
        name: "Created",
        selector: (row) => row.createdAt,
        sortable: true,
        cell: (row) => (
          <span className="text-sm text-slate-700">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        name: "Actions",
        right: true,
        width: "150px",
        cell: (row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/admin/users/${row._id}`)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              title="Edit user"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() => handleDeleteUser(row._id)}
              disabled={actionLoadingId === row._id}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
              title="Delete user"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [actionLoadingId, navigate, users]
  );

  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },
    headRow: {
      style: {
        minHeight: "56px",
        borderBottomWidth: "1px",
        borderBottomColor: "#e2e8f0",
        backgroundColor: "#f8fafc",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
      },
    },
    headCells: {
      style: {
        fontSize: "13px",
        fontWeight: 700,
        color: "#475569",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        minHeight: "72px",
        borderBottomWidth: "1px",
        borderBottomColor: "#f1f5f9",
        backgroundColor: "#ffffff",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f8fafc",
        transition: "background-color 0.15s ease-in-out",
        cursor: "pointer",
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    pagination: {
      style: {
        borderTopWidth: "1px",
        borderTopColor: "#e2e8f0",
        minHeight: "64px",
        backgroundColor: "#ffffff",
        borderBottomLeftRadius: "16px",
        borderBottomRightRadius: "16px",
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Manage Users</h2>
            <p className="mt-1 text-sm text-slate-500">
              View, search, edit, and remove user accounts.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={fetchUsers}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              onClick={() => navigate("/admin/users/new")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              <Plus size={16} />
              Add User
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by name, email, phone, or role..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div className="text-sm text-slate-500">
            Total users: <span className="font-semibold text-slate-900">{filteredUsers.length}</span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <DataTable
            columns={columns}
            data={filteredUsers}
            progressPending={isLoading}
            pagination
            highlightOnHover
            responsive
            persistTableHead
            customStyles={customStyles}
            progressComponent={
              <div className="p-6 text-sm text-slate-600">Loading users...</div>
            }
            noDataComponent={
              <div className="p-6 text-sm text-slate-500">No users found.</div>
            }
          />
        </div>
      </div>
    </div>
  );
}