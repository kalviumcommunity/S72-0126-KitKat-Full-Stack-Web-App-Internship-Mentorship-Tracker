// Login Form with Quick Fill - Client Component
// Combines the login form with demo credentials and quick fill buttons

'use client';

import { LoginForm } from './LoginForm';

export function LoginFormWithQuickFill() {
  return (
    <div className="space-y-6">
      {/* Demo Credentials */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Demo Credentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <p className="font-medium text-blue-800">👤 Student:</p>
            <p className="text-blue-700">user1@gmail.com</p>
            <p className="text-blue-700">user2@gmail.com</p>
            <p className="text-blue-600">Password: User@12345</p>
          </div>
          <div>
            <p className="font-medium text-blue-800">🧑‍🏫 Mentor:</p>
            <p className="text-blue-700">mentor1@gmail.com</p>
            <p className="text-blue-700">mentor2@gmail.com</p>
            <p className="text-blue-600">Password: Mentor@12345</p>
          </div>
          <div>
            <p className="font-medium text-blue-800">🏢 Company:</p>
            <p className="text-blue-700">company1@gmail.com</p>
            <p className="text-blue-700">company2@gmail.com</p>
            <p className="text-blue-600">Password: Company@12345</p>
          </div>
          <div>
            <p className="font-medium text-blue-800">🛡️ Admin:</p>
            <p className="text-blue-700">admin@gmail.com</p>
            <p className="text-blue-600">Password: Admin@12345</p>
          </div>
        </div>
        
        {/* Quick Fill Buttons */}
        <div className="mt-4 pt-3 border-t border-blue-200">
          <p className="text-xs font-medium text-blue-800 mb-2">Quick Fill:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('quickFillCredentials', {
                  detail: { email: 'user1@gmail.com', password: 'User@12345' }
                }));
              }}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('quickFillCredentials', {
                  detail: { email: 'mentor1@gmail.com', password: 'Mentor@12345' }
                }));
              }}
              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              Mentor
            </button>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('quickFillCredentials', {
                  detail: { email: 'company1@gmail.com', password: 'Company@12345' }
                }));
              }}
              className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
            >
              Company
            </button>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('quickFillCredentials', {
                  detail: { email: 'admin@gmail.com', password: 'Admin@12345' }
                }));
              }}
              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <LoginForm />
    </div>
  );
}