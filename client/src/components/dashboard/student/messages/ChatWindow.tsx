// Chat Window Component
// Right panel with chat header, messages, and input area

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Message, Conversation } from '@/app/dashboard/user/messages/page';

interface ChatWindowProps {
  conversationId: string | null;
  onToggleQuickActions: () => void;
}

export function ChatWindow({ conversationId, onToggleQuickActions }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock conversation data
  const conversation: Conversation | null = conversationId ? {
    id: conversationId,
    contactName: 'John Doe',
    contactTitle: 'Senior Engineer',
    contactCompany: 'Google',
    contactPhoto: '👨‍💻',
    contactType: 'mentor',
    lastMessage: 'Thanks for the session today!',
    lastMessageTime: '2h ago',
    unreadCount: 0,
    isOnline: true
  } : null;

  // Mock messages data
  const messages: Message[] = conversationId ? [
    {
      id: '1',
      conversationId,
      senderId: 'mentor-1',
      senderName: 'John Doe',
      content: 'Hi! How did your interview with TechCorp go?',
      timestamp: '2024-01-27T10:00:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: '2',
      conversationId,
      senderId: 'student-1',
      senderName: 'You',
      content: 'It went really well! I was able to answer most of the technical questions, and the system design portion felt much more comfortable after our practice sessions.',
      timestamp: '2024-01-27T10:05:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: '3',
      conversationId,
      senderId: 'mentor-1',
      senderName: 'John Doe',
      content: 'That\'s fantastic! I\'m glad our system design practice paid off. Did they give you any timeline for next steps?',
      timestamp: '2024-01-27T10:10:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: '4',
      conversationId,
      senderId: 'student-1',
      senderName: 'You',
      content: 'They said they\'ll get back to me within a week. I\'m feeling optimistic!',
      timestamp: '2024-01-27T10:15:00Z',
      type: 'text',
      isRead: true
    },
    {
      id: '5',
      conversationId,
      senderId: 'mentor-1',
      senderName: 'John Doe',
      content: 'Excellent! While we wait, let\'s work on your other applications. I have some feedback on your resume that we discussed.',
      timestamp: '2024-01-27T10:20:00Z',
      type: 'text',
      isRead: true,
      attachments: [{
        name: 'Resume_Feedback_v3.2.pdf',
        url: '#',
        type: 'application/pdf',
        size: 245000
      }]
    },
    {
      id: '6',
      conversationId,
      senderId: 'student-1',
      senderName: 'You',
      content: 'Thanks for the detailed feedback! I\'ll implement these changes and send you the updated version.',
      timestamp: '2024-01-27T14:30:00Z',
      type: 'text',
      isRead: false
    }
  ] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversationId) return;
    
    // In a real app, this would send the message via API
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Select a conversation
          </h3>
          <p className="text-gray-600">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-lg">
                {conversation?.contactPhoto}
              </div>
              {conversation?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">
                {conversation?.contactName}
              </h3>
              <p className="text-sm text-gray-600">
                {conversation?.contactTitle} @ {conversation?.contactCompany}
              </p>
              <div className="flex items-center space-x-2">
                <Badge className={conversation?.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} size="sm">
                  {conversation?.isOnline ? 'Online' : 'Offline'}
                </Badge>
                {isTyping && (
                  <span className="text-xs text-gray-500">typing...</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <span className="mr-2">📹</span>
              Video Call
            </Button>
            <Button variant="outline" size="sm">
              <span className="mr-2">📞</span>
              Phone
            </Button>
            <Button variant="outline" size="sm" onClick={onToggleQuickActions}>
              ⋮ More
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderName === 'You';
          
          return (
            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                {!isOwn && (
                  <div className="text-xs text-gray-500 mb-1">
                    {message.senderName}
                  </div>
                )}
                
                <div className={`rounded-lg px-4 py-2 ${
                  isOwn 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className={`flex items-center space-x-2 p-2 rounded border ${
                          isOwn ? 'border-blue-400 bg-blue-500' : 'border-gray-300 bg-white'
                        }`}>
                          <div className="text-lg">📄</div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${
                              isOwn ? 'text-blue-100' : 'text-gray-900'
                            }`}>
                              {attachment.name}
                            </p>
                            <p className={`text-xs ${
                              isOwn ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {formatFileSize(attachment.size)}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className={
                            isOwn ? 'text-blue-100 hover:text-white' : 'text-gray-600'
                          }>
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                  {formatTimestamp(message.timestamp)}
                  {isOwn && (
                    <span className="ml-2">
                      {message.isRead ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleFileUpload}>
              📎
            </Button>
            <Button variant="outline" size="sm">
              😊
            </Button>
            <Button variant="outline" size="sm">
              🎤
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              Send
            </Button>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            // Handle file upload
            console.log('File selected:', e.target.files?.[0]);
          }}
        />
      </div>
    </div>
  );
}