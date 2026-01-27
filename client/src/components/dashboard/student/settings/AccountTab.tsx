// Account Tab Component
// Email management, password, 2FA, connected accounts, and session management

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function AccountTab() {
  const [accountData, setAccountData] = useState({
    primaryEmail: 'john.doe@student.edu',
    recoveryEmail: 'john.personal@gmail.com',
    twoFactorEnabled: true,
    connectedAccounts: {
      google: true,
      linkedin: true,
      github: false
    }
  });

  const [activeSessions] = useState([
    { id: 1, device: 'MacBook Pro', location: 'San Francisco, CA', lastActive: '2 minutes ago', current: true },
    { id: 2, device: 'iPhone 14', location: 'San Francisco, CA', lastActive: '1 hour ago', current: false },
    { id: 3, device: 'Chrome on Windows', location: 'New York, NY', lastActive: '2 days ago', current: false }
  ]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  return (
    <div className="p-6 space-y-8">
      {/* Email Management */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Management</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Email
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="email"
                value={accountData.primaryEmail}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
              <Button variant="outline" size="sm">Change</Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recovery Email
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="email"
                value={accountData.recoveryEmail}
                onChange={(e) => setAccountData(prev => ({ ...prev, recoveryEmail: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button variant="outline" size="sm">Update</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Password Change */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Password</h2>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Update Password
          </Button>
        </div>
      </section>

      {/* Two-Factor Authentication */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Authenticator App</h3>
            <p className="text-sm text-gray-600">
              Use an authenticator app to generate verification codes
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {accountData.twoFactorEnabled ? (
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">Disabled</Badge>
            )}
            <Button
              variant="outline"
              onClick={() => setAccountData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
            >
              {accountData.twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </section>

      {/* Connected Accounts */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Connected Accounts</h2>
        <div className="space-y-3">
          {[
            { id: 'google', name: 'Google', icon: '🔍', connected: accountData.connectedAccounts.google },
            { id: 'linkedin', name: 'LinkedIn', icon: '💼', connected: accountData.connectedAccounts.linkedin },
            { id: 'github', name: 'GitHub', icon: '🐙', connected: accountData.connectedAccounts.github }
          ].map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{account.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-600">
                    {account.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button
                variant={account.connected ? 'outline' : 'default'}
                onClick={() => {
                  setAccountData(prev => ({
                    ...prev,
                    connectedAccounts: {
                      ...prev.connectedAccounts,
                      [account.id]: !prev.connectedAccounts[account.id as keyof typeof prev.connectedAccounts]
                    }
                  }));
                }}
              >
                {account.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Session Management */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Sessions</h2>
        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  📱
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                    <span>{session.device}</span>
                    {session.current && (
                      <Badge className="bg-green-100 text-green-800" size="sm">Current</Badge>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {session.location} • Last active {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4">
          Sign Out All Other Sessions
        </Button>
      </section>

      {/* Account Deletion */}
      <section>
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
          <p className="text-sm text-red-700 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
            Delete Account
          </Button>
        </div>
      </section>
    </div>
  );
}