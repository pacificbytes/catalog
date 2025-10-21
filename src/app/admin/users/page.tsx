import { redirect } from "next/navigation";
import { isAdmin, getCurrentUser } from "@/lib/auth";
import { getAllUsers, getAuditLogs } from "@/lib/user-management";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";
import UserManagementClient from "./UserManagementClient";
import UserListClient from "./UserListClient";

export default async function UserManagementPage() {
	// Check if user is admin
	const userIsAdmin = await isAdmin();
	if (!userIsAdmin) {
		redirect("/admin");
	}

	const currentUser = await getCurrentUser();
	
	// Try to get users and audit logs, but don't fail if tables don't exist
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let users: any[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let auditLogs: any[] = [];
	
	try {
		users = await getAllUsers();
	} catch {
		// Users table doesn't exist yet
		users = [];
	}
	
	try {
		auditLogs = await getAuditLogs(20);
	} catch {
		// Audit logs table doesn't exist yet
		auditLogs = [];
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold">👥 User Management</h2>
					<p className="text-gray-600">Manage users and view activity logs</p>
				</div>
				<UserManagementClient />
			</div>

			{/* Current User Info */}
			<ColorfulCard colorScheme="blue" className="p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center">
					<span className="mr-2">👤</span>
					Current User
				</h3>
				{currentUser && (
					<div className="flex items-center justify-between p-4 bg-white rounded-lg border">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
								<span className="text-xl font-semibold text-blue-600">
									{currentUser.name?.charAt(0).toUpperCase()}
								</span>
							</div>
							<div>
								<h4 className="font-medium text-slate-900">{currentUser.name}</h4>
								<p className="text-sm text-slate-600">{currentUser.email}</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<ColorfulBadge 
								variant={currentUser.role === 'admin' ? 'purple' : 'green'} 
								size="md"
							>
								{currentUser.role === 'admin' ? '👑 Admin' : '👨‍💼 Manager'}
							</ColorfulBadge>
							<ColorfulBadge 
								variant={currentUser.is_active ? 'green' : 'red'} 
								size="sm"
							>
								{currentUser.is_active ? 'Active' : 'Inactive'}
							</ColorfulBadge>
						</div>
					</div>
				)}
			</ColorfulCard>

			{/* Database Setup Notice */}
			{users.length === 0 && (
				<ColorfulCard colorScheme="orange" className="p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<span className="mr-2">⚠️</span>
						Database Setup Required
					</h3>
					<div className="space-y-3">
						<p className="text-slate-600">
							To use the full multi-user system, you need to run the updated database schema.
						</p>
						<div className="bg-slate-100 p-4 rounded-lg">
							<h4 className="font-medium text-slate-900 mb-2">Steps to enable multi-user system:</h4>
							<ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
								<li>Go to your Supabase Dashboard</li>
								<li>Run the SQL from <code className="bg-slate-200 px-1 rounded">supabase/schema.sql</code></li>
								<li>This will create the <code className="bg-slate-200 px-1 rounded">users</code> and <code className="bg-slate-200 px-1 rounded">audit_logs</code> tables</li>
								<li>Add your admin user to the <code className="bg-slate-200 px-1 rounded">users</code> table</li>
							</ol>
						</div>
						<p className="text-sm text-slate-500">
							Until then, the system will work with the basic authentication using your environment variables.
						</p>
					</div>
				</ColorfulCard>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Users List */}
				<ColorfulCard colorScheme="purple" className="p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<span className="mr-2">👥</span>
						All Users ({users.length})
					</h3>
					<div className="space-y-3">
						<UserListClient users={users} />
					</div>
				</ColorfulCard>

				{/* Recent Activity */}
				<ColorfulCard colorScheme="green" className="p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<span className="mr-2">📋</span>
						Recent Activity
					</h3>
					<div className="space-y-3">
						{auditLogs.map((log) => (
							<div key={log.id} className="p-3 bg-white rounded-lg border">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center space-x-2">
										<ColorfulBadge 
											variant={
												log.action === 'create' ? 'green' :
												log.action === 'update' ? 'blue' :
												log.action === 'delete' ? 'red' : 'purple'
											}
											size="sm"
										>
											{log.action}
										</ColorfulBadge>
										<span className="text-sm font-medium text-slate-900">
											{log.resource_type}
										</span>
									</div>
									<span className="text-xs text-slate-500">
										{new Date(log.created_at).toLocaleDateString()}
									</span>
								</div>
								<div className="text-sm text-slate-600">
									<span className="font-medium">{log.user_email}</span> {log.action}d{' '}
									<span className="font-medium">{log.resource_name}</span>
								</div>
							</div>
						))}
					</div>
				</ColorfulCard>
			</div>

			{/* Role Permissions */}
			<ColorfulCard colorScheme="gradient" className="p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center">
					<span className="mr-2">🔐</span>
					Role Permissions
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-medium text-slate-900 mb-3 flex items-center">
							<span className="mr-2">👑</span>
							Admin Permissions
						</h4>
						<ul className="text-sm text-slate-600 space-y-1">
							<li>✅ Create, edit, and delete products</li>
							<li>✅ Manage all users (create, edit, delete)</li>
							<li>✅ View all audit logs</li>
							<li>✅ Access all admin settings</li>
							<li>✅ Export data</li>
							<li>✅ Manage categories and tags</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-slate-900 mb-3 flex items-center">
							<span className="mr-2">👨‍💼</span>
							Manager Permissions
						</h4>
						<ul className="text-sm text-slate-600 space-y-1">
							<li>✅ Create, edit, and delete products</li>
							<li>❌ Manage users</li>
							<li>✅ View own audit logs</li>
							<li>✅ Export data</li>
							<li>✅ Manage categories and tags</li>
						</ul>
					</div>
				</div>
			</ColorfulCard>
		</div>
	);
}
