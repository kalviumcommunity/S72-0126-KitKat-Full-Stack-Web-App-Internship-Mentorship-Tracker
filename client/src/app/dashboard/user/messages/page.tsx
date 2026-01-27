// Student Messages Page
// Split view with conversations list and chat window

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { StudentDashboardLayout } from '@/components/dashboard/student/StudentDashboardLayout';
import { ConversationsList } from '@/components/dashboard/student/messages/ConversationsList';
import { ChatWindow } from '@/components/dashboard/student/messages/ChatWindow';
import { QuickActionsSidebar } from '@/components/dashboard/student/messages/QuickActionsSidebar';

export interface Conversation {
  id: string;
  contactName: string;
  contactTitle: string;
  contactCompany: string;
  contactPhoto: string;
  contactType: 'mentor' | 'company' | 'student';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'voice' | 'code';
  isRead: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);

  if (!user || user.role !== UserRole.STUDENT) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <StudentDashboardLayout currentPage="messages">
      <div className="h-[calc(100vh-2rem)] flex">
        {/* Left Panel - Conversations List */}
        <div className="w-80 border-r border-gray-200 bg-white">
          <ConversationsList
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
          />
        </div>

        {/* Right Panel - Chat Window */}
        <div className="flex-1 flex">
          <div className="flex-1">
            <ChatWindow
              conversationId={selectedConversationId}
              onToggleQuickActions={() => setShowQuickActions(!showQuickActions)}
            />
          </div>

          {/* Quick Actions Sidebar */}
          {showQuickActions && selectedConversationId && (
            <div className="w-64 border-l border-gray-200 bg-white">
              <QuickActionsSidebar
                conversationId={selectedConversationId}
                onClose={() => setShowQuickActions(false)}
              />
            </div>
          )}
        </div>
      </div>
    </StudentDashboardLayout>
  );
}