/**
 * MessageList component for displaying list of messages
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Mail,
  Inbox,
  Send,
  Trash2,
  Archive
} from 'lucide-react';
import type { Message } from '@/api/types';

interface MessageListProps {
  messages: Message[];
  selectedMessageId: number | null;
  onMessageSelect: (message: Message) => void;
  onMarkAsRead?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  activeTab?: 'inbox' | 'sent' | 'archived';
  onTabChange?: (tab: 'inbox' | 'sent' | 'archived') => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedMessageId,
  onMessageSelect,
  onMarkAsRead,
  onDelete,
  activeTab = 'inbox',
  onTabChange,
}) => {
  const handleMessageClick = (message: Message) => {
    onMessageSelect(message);
    if (message.unread && onMarkAsRead) {
      onMarkAsRead(message.id);
    }
  };

  const handleDelete = (e: React.MouseEvent, messageId: number) => {
    e.stopPropagation();
    onDelete?.(messageId);
  };

  const unreadCount = messages.filter(msg => msg.unread).length;

  return (
    <div className="w-96 bg-white border border-border rounded-lg flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">
            الرسائل ({messages.length})
          </h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} غير مقروءة
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={activeTab === 'inbox' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange?.('inbox')}
            className="flex-1"
          >
            <Inbox className="w-4 h-4 ml-2" />
            الوارد
          </Button>
          <Button
            variant={activeTab === 'sent' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange?.('sent')}
            className="flex-1"
          >
            <Send className="w-4 h-4 ml-2" />
            المرسل
          </Button>
          <Button
            variant={activeTab === 'archived' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange?.('archived')}
            className="flex-1"
          >
            <Archive className="w-4 h-4 ml-2" />
            الأرشيف
          </Button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                لا توجد رسائل
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedMessageId === message.id 
                    ? 'bg-primary/5 border-r-2 border-primary' 
                    : ''
                } ${message.unread ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Date */}
                  <div className="text-xs text-muted-foreground min-w-[50px] mt-1">
                    {message.date}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {message.unread && (
                          <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0"></div>
                        )}
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {message.sender}
                        </h3>
                      </div>
                      {message.attachment && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FileText className="w-3 h-3" />
                          <span className="truncate max-w-[80px]">
                            {message.attachment}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h4 className="text-sm font-medium text-foreground mb-1 line-clamp-1">
                      {message.subject}
                    </h4>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {message.preview}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(e, message.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;

