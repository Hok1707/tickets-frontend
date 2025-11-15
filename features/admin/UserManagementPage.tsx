import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { User } from '@/types/auth';
import { AccountStatus, Role } from '@/types/common';

const StatusBadge: React.FC<{ status: AccountStatus }> = ({ status }) => {
  const statusStyles = {
    [AccountStatus.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [AccountStatus.SUSPENDED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [AccountStatus.BLOCKED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<Role | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<AccountStatus | 'ALL'>('ALL');

  const [roleModalState, setRoleModalState] = useState({
    isOpen: false,
    userId: null as string | null,
    newRole: null as Role | null,
    userName: null as string | null,
  });

  const [statusModalState, setStatusModalState] = useState({
    isOpen: false,
    userId: null as string | null,
    newStatus: null as AccountStatus | null,
    userName: null as string | null,
    action: null as 'suspend' | 'activate' | null,
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch {
      toast.error('Failed to fetch users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Search and filter
  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      (u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (filterRole === 'ALL' || u.role === filterRole) &&
      (filterStatus === 'ALL' || u.status === filterStatus)
    );
  }, [users, search, filterRole, filterStatus]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages || 1); }, [totalPages, currentPage]);

  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleRoleChangeRequest = (userId: string, newRole: Role, userName: string) => {
    if (userId === currentUser?.id) return toast.error("You cannot change your own role.");
    setRoleModalState({ isOpen: true, userId, newRole, userName });
  };

  const handleConfirmRoleChange = async () => {
    if (!roleModalState.userId || !roleModalState.newRole) return;
    try {
      const updatedData = await userService.updateUserRole(roleModalState.userId, roleModalState.newRole);
      setUsers(prev => prev.map(u => u.id === roleModalState.userId ? { ...u, role: updatedData.role } : u));
      toast.success(`Updated ${roleModalState.userName}'s role to ${roleModalState.newRole}`);
    } catch {
      toast.error('Failed to update role.');
    } finally {
      setRoleModalState({ isOpen: false, userId: null, newRole: null, userName: null });
    }
  };

  const handleStatusChangeRequest = (userId: string, newStatus: AccountStatus, userName: string) => {
    if (userId === currentUser?.id) return toast.error("You cannot change your own status.");
    const action = newStatus === AccountStatus.SUSPENDED ? 'suspend' : 'activate';
    setStatusModalState({ isOpen: true, userId, newStatus, userName, action });
  };

  const handleConfirmStatusChange = async () => {
    if (!statusModalState.userId || !statusModalState.newStatus) return;
    try {
      const updatedUser = await userService.updateUserStatus(statusModalState.userId, statusModalState.newStatus);
      setUsers(prev => prev.map(u => u.id === statusModalState.userId ? updatedUser : u));
      toast.success(`${statusModalState.action === 'suspend' ? 'Suspended' : 'Activated'} ${updatedUser.username}`);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setStatusModalState({ isOpen: false, userId: null, newStatus: null, userName: null, action: null });
    }
  };

  if (isLoading) return <div className="text-center p-10 text-gray-700 dark:text-gray-300">Loading users...</div>;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 transition-colors duration-300">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">User Management</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 transition-colors duration-300">
          <input
            type="text"
            placeholder="Search by username or email"
            className="px-3 py-2 border rounded-md w-full sm:w-64 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={filterRole} onChange={e => setFilterRole(e.target.value as Role | 'ALL')} className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300">
            <option value="ALL">All Roles</option>
            {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as AccountStatus | 'ALL')} className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300">
            <option value="ALL">All Statuses</option>
            {Object.values(AccountStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg shadow-sm transition-colors duration-300">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 transition-colors duration-300">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300">
                  <td className="p-3 font-medium text-gray-900 dark:text-white">{user.username}{user.id === currentUser?.id && <span className="ml-2 text-xs font-bold text-primary-500">(You)</span>}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{user.email}</td>
                  <td className="p-3">
                    <select value={user.role} onChange={e => handleRoleChangeRequest(user.id, e.target.value as Role, user.username)} disabled={user.id === currentUser?.id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 transition-colors duration-300">
                      {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="p-3"><StatusBadge status={user.status} /></td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    {user.status !== AccountStatus.SUSPENDED ? (
                      <button onClick={() => handleStatusChangeRequest(user.id, AccountStatus.SUSPENDED, user.username)} disabled={user.id === currentUser?.id} className="text-red-500 hover:text-red-700 disabled:opacity-50" title="Suspend User"><UserMinusIcon className="h-5 w-5" /></button>
                    ) : (
                      <button onClick={() => handleStatusChangeRequest(user.id, AccountStatus.ACTIVE, user.username)} disabled={user.id === currentUser?.id} className="text-green-500 hover:text-green-700 disabled:opacity-50" title="Activate User"><UserPlusIcon className="h-5 w-5" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} results
          </p>
          <div className="flex items-center gap-2">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-2 text-sm border rounded disabled:opacity-40 transition-colors duration-300">Previous</button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx} onClick={() => setCurrentPage(idx+1)} className={clsx("px-3 py-2 border rounded text-sm transition-colors duration-300", currentPage===idx+1 && "bg-blue-600 text-white")}>{idx+1}</button>
            ))}
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-3 py-2 text-sm border rounded disabled:opacity-40 transition-colors duration-300">Next</button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={roleModalState.isOpen}
        onClose={() => setRoleModalState({...roleModalState, isOpen:false})}
        onConfirm={handleConfirmRoleChange}
        title="Change User Role"
        message={<span>Are you sure you want to change the role of <strong>{roleModalState.userName}</strong> to <strong>{roleModalState.newRole}</strong>?</span>}
        confirmButtonText="Confirm Change"
        variant="primary"
      />

      <ConfirmationModal
        isOpen={statusModalState.isOpen}
        onClose={() => setStatusModalState({...statusModalState, isOpen:false})}
        onConfirm={handleConfirmStatusChange}
        title={`${statusModalState.action==='suspend'?'Suspend':'Activate'} User`}
        message={<span>Are you sure you want to {statusModalState.action} the account for <strong>{statusModalState.userName}</strong>?</span>}
        confirmButtonText={`Yes, ${statusModalState.action==='suspend'?'Suspend':'Activate'}`}
        variant="danger"
      />
    </>
  );
};

export default UserManagementPage;