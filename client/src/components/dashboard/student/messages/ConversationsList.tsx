// Conversations List Component
// Left panel with search, filters, and conversation items

'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import type { Conversation } from '@/app/dashboard/user/messages/page';

interface ConversationsListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export function ConversationsList({
  selectedConversationId,
  onSelectConversation
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'mentors' | 'companies' | 'unread'>('all');

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      contactName: 'John Doe',
      contactTitle: 'Senior Engineer',
      contactCompany: 'Google',
      contactPhoto: '👨‍💻',
      contactType: 'mentor',
      lastMessage: 'Thanks for the session today! The system design tips were really helpful.',
      lastMessageTime: '2h ago',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      contactName: 'Sarah Chen',
      contactTitle: 'Product Manager',
      contactCompany: 'Microsoft',
      contactPhoto: '👩‍💼',
      contactType: 'mentor',
      lastMessage: 'I\'ve reviewed your resume. Let\'s discuss the changes in our next session.',
      lastMessageTime: '5h ago',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      contactName: 'TechCorp Recruiting',
      contactTitle: 'HR Team',
      contactCompany: 'TechCorp',
      contactPhoto: '🏢',
      contactType: 'company',
      lastMessage: 'We\'d like to schedule a follow-up interview. Are you available next week?',
      lastMessageTime: '1d ago',
      unreadCount: 1,
      isOnline: true
    },
    {
      id: '4',
      contactName: 'David Rodriguez',
      contactTitle: 'Tech Lead',
      contactCompany: 'Meta',
      contactPhoto: '👨‍🔬',
      contactType: 'mentor',
      lastMessage: 'Great job on the coding challenge! Your solution was very elegant.',
      lastMessageTime: '2d ago',
      unreadCount: 0,
      isOnline: true
    },
    {
      id: '5',
      contactName: 'Netflix Talent',
      contactTitle: 'Recruiting Team',
      contactCompany: 'Netflix',
      contactPhoto: '🎬',
      contactType: 'company',
      lastMessage: 'Thank you for your application. We\'ll be in touch soon.',
      lastMessageTime: '3d ago',
      unreadCount: 0,
      isOnline: false
    }
  ];

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conversation.contactCompany.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'mentors' && conversation.contactType === 'mentor') ||
                         (filter === 'companies' && conversation.contactType === 'company') ||
                         (filter === 'unread' && conversation.unreadCount > 0);
    
    return matchesSearch && matchesFilter;
  });

  const getContactTypeIcon = (type: string) => {
    const icons = {
      'mentor': '🎓',
      'company': '🏢',
      'student': '👤'
    };
    return icons[type as keyof typeof icons] || '👤';
  };

  const formatTime = (timeStr: string) => {
    // In a real app, this would parse actual timestamps
    return timeStr;
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          {totalUnread > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {totalUnread} unread
            </Badge>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'mentors', label: 'Mentors' },
            { id: 'companies', label: 'Companies' },
            { id: 'unread', label: 'Unread' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === filterOption.id
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedConversationId === conversation.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                  {conversation.contactPhoto}
                </div>
                {conversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
                <div className="absolute -top-1 -left-1 text-xs">
                  {getContactTypeIcon(conversation.contactType)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {conversation.contactName}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white" size="sm">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-1">
                  {conversation.contactTitle} @ {conversation.contactCompany}
                </p>
                
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold mb-2">No conversations found</h3>
            <p className="text-sm text-center">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start a conversation with your mentors or companies'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}