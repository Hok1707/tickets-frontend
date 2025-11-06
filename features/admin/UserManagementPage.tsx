import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from '../../types';
import { Role, AccountStatus } from '../../types';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';


const StatusBadge: React.FC<{ status: AccountStatus }> = ({ status }) => {
  const statusStyles = {
    [AccountStatus.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [AccountStatus.SUSPENDED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [AccountStatus.BLOCKED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
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

  const [roleModalState, setRoleModalState] = useState<{
    isOpen: boolean;
    userId: string | null;
    newRole: Role | null;
    userName: string | null;
  }>({ isOpen: false, userId: null, newRole: null, userName: null });

  const [statusModalState, setStatusModalState] = useState<{
    isOpen: boolean;
    userId: string | null;
    newStatus: AccountStatus | null;
    userName: string | null;
    action: 'suspend' | 'activate' | null;
  }>({ isOpen: false, userId: null, newStatus: null, userName: null, action: null });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const { paginatedUsers, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const paginatedUsers = users.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    return { paginatedUsers, totalPages };
  }, [users, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };


  const handleRoleChangeRequest = (userId: string, newRole: Role, userName: string) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot change your own role.");
      setUsers([...users]);
      return;
    }
    setRoleModalState({ isOpen: true, userId, newRole, userName });
  };

  const handleConfirmRoleChange = async () => {
    if (!roleModalState.userId || !roleModalState.newRole) return;

    try {
      const updatedData = await userService.updateUserRole(roleModalState.userId, roleModalState.newRole);

      setUsers(prevUsers => prevUsers.map(u =>
        u.id === roleModalState.userId
          ? { ...u, role: updatedData.role }
          : u
      ));
      navigate(0);
      toast.success(`Successfully updated ${roleModalState.userName}'s role to ${roleModalState.newRole}`);
    } catch (error) {
      toast.error('Failed to update user role.');
    }
  };


  const handleCloseRoleModal = () => {
    setRoleModalState({ isOpen: false, userId: null, newRole: null, userName: null });
    setUsers([...users]);
  };

  const handleStatusChangeRequest = (userId: string, newStatus: AccountStatus, userName: string) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot change your own status.");
      return;
    }
    const action = newStatus === AccountStatus.SUSPENDED ? 'suspend' : 'activate';
    setStatusModalState({ isOpen: true, userId, newStatus, userName, action });
  };

  const handleConfirmStatusChange = async () => {
    if (!statusModalState.userId || !statusModalState.newStatus) return;

    try {
      const updatedUser = await userService.updateUserStatus(statusModalState.userId, statusModalState.newStatus);
      setUsers(prevUsers => prevUsers.map(u => u.id === statusModalState.userId ? updatedUser : u));
      toast.success(`Successfully ${statusModalState.action === 'suspend' ? 'suspended' : 'activated'} ${updatedUser.username}'s account.`);
    } catch (error) {
      toast.error('Failed to update user status.');
    }
  };

  const handleCloseStatusModal = () => {
    setStatusModalState({ isOpen: false, userId: null, newStatus: null, userName: null, action: null });
  };

  if (isLoading) {
    return <div className="text-center p-10 text-gray-700 dark:text-gray-300">Loading users...</div>;
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">User Management</h1>
        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded-t-lg">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {paginatedUsers.map(user => (
            <div key={user.id} className="bg-white dark:bg-gray-800 md:grid md:grid-cols-12 md:gap-4 items-center p-4 border dark:border-gray-700 rounded-lg shadow-sm">
              {/* Mobile View */}
              <div className="md:hidden space-y-3">
                <div className="font-medium text-gray-900 dark:text-white">
                  {user.username}
                  {user.id === currentUser?.id && <span className="ml-2 text-xs font-bold text-primary-500">(You)</span>}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{user.email}</div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t dark:border-gray-600">
                  <div>
                    <label
                      htmlFor={`role-select-${user.id}`}
                      className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1 block"
                    >
                      Role
                    </label>
                    <select
                      id={`role-select-${user.id}`}
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChangeRequest(user.id, e.target.value as Role, user.username)
                      }
                      disabled={user.id === currentUser?.id}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                    >
                      {Object.values(Role).map((roleValue) => (
                        <option key={roleValue} value={roleValue}>
                          {roleValue.charAt(0).toUpperCase() + roleValue.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1 block">Status</label>
                    <StatusBadge status={user.status} />
                  </div>
                </div>
                <div className="pt-2 border-t dark:border-gray-600">
                  {user.status !== AccountStatus.SUSPENDED ? (
                    <button onClick={() => handleStatusChangeRequest(user.id, AccountStatus.SUSPENDED, user.username)} disabled={user.id === currentUser?.id} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 disabled:opacity-50">
                      <UserMinusIcon className="h-4 w-4" /> Suspend Account
                    </button>
                  ) : (
                    <button onClick={() => handleStatusChangeRequest(user.id, AccountStatus.ACTIVE, user.username)} disabled={user.id === currentUser?.id} className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 disabled:opacity-50">
                      <UserPlusIcon className="h-4 w-4" /> Activate Account
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden md:contents">
                <div className="col-span-3 font-medium text-gray-900 dark:text-white">
                  {user.username}
                  {user.id === currentUser?.id && <span className="ml-2 text-xs font-bold text-primary-500">(You)</span>}
                </div>
                <div className="col-span-3 text-sm text-gray-600 dark:text-gray-300">{user.email}</div>
                <div className="col-span-2">
                  <select value={user.role} onChange={(e) => handleRoleChangeRequest(user.id, e.target.value as Role, user.username)} disabled={user.id === currentUser?.id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50">
                    {Object.values(Role).map(roleValue => (<option key={roleValue} value={roleValue}>{roleValue}</option>))}
                  </select>
                </div>
                <div className="col-span-2"><StatusBadge status={user.status} /></div>
                <div className="col-span-2 text-right">
                  {user.status !== AccountStatus.SUSPENDED ? (
                    <button onClick={() => handleStatusChangeRequest(user.id, AccountStatus.SUSPENDED, user.username)} disabled={user.id === currentUser?.id} className="text-red-500 hover:text-red-700 disabled:opacity-50" title="Suspend User"><UserMinusIcon className="h-5 w-5" /></button>
                  ) : (
                    <button onClick={() => handleStatusChangeRequest(user.id, AccountStatus.ACTIVE, user.username)} disabled={user.id === currentUser?.id} className="text-green-500 hover:text-green-700 disabled:opacity-50" title="Activate User"><UserPlusIcon className="h-5 w-5" /></button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * ITEMS_PER_PAGE, users.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{users.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
      <ConfirmationModal
        isOpen={roleModalState.isOpen}
        onClose={handleCloseRoleModal}
        onConfirm={handleConfirmRoleChange}
        title="Change User Role"
        message={<span>Are you sure you want to change the role of <strong>{roleModalState.userName}</strong> to <strong>{roleModalState.newRole}</strong>?</span>}
        confirmButtonText="Confirm Change"
        variant="primary"
      />
      <ConfirmationModal
        isOpen={statusModalState.isOpen}
        onClose={handleCloseStatusModal}
        onConfirm={handleConfirmStatusChange}
        title={`${statusModalState.action === 'suspend' ? 'Suspend' : 'Activate'} User`}
        message={<span>Are you sure you want to {statusModalState.action} the account for <strong>{statusModalState.userName}</strong>?</span>}
        confirmButtonText={`Yes, ${statusModalState.action === 'suspend' ? 'Suspend' : 'Activate'}`}
        variant="danger"
      />
    </>
  );
};

export default UserManagementPage;