// Inline Error Component
// Small error display for forms and inline contexts

interface InlineErrorProps {
  message: string;
  icon?: string;
}

export function InlineError({ message, icon = '⚠️' }: InlineErrorProps) {
  return (
    <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
      <span className="text-lg flex-shrink-0">{icon}</span>
      <p className="text-sm text-red-800">{message}</p>
    </div>
  );
}

export function InlineWarning({ message, icon = '⚠️' }: InlineErrorProps) {
  return (
    <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <span className="text-lg flex-shrink-0">{icon}</span>
      <p className="text-sm text-yellow-800">{message}</p>
    </div>
  );
}

export function InlineInfo({ message, icon = 'ℹ️' }: InlineErrorProps) {
  return (
    <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <span className="text-lg flex-shrink-0">{icon}</span>
      <p className="text-sm text-blue-800">{message}</p>
    </div>
  );
}

export function InlineSuccess({ message, icon = '✅' }: InlineErrorProps) {
  return (
    <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
      <span className="text-lg flex-shrink-0">{icon}</span>
      <p className="text-sm text-green-800">{message}</p>
    </div>
  );
}