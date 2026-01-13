// Global loading page - Server Component
// Shows loading state for page transitions

import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LoadingPage() {
  return <PageLoadingSpinner message="Loading..." />;
}