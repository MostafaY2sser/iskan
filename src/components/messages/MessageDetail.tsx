/**
 * MessageDetail component for displaying full message content
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Download, 
  Reply, 
  Forward, 
  Trash2,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import type { MessageDetailResponse } from '@/api/types';

interface MessageDetailProps {
  message: MessageDetailResponse | null;
  onReply?: (message: MessageDetailResponse) => void;
  onForward?: (message: MessageDetailResponse) => void;
  onDelete?: (messageId: number) => void;
  onMarkAsRead?: (messageId: number) => void;
}

const MessageDetail: React.FC<MessageDetailProps> = ({
  message,
  onReply,
  onForward,
  onDelete,
  onMarkAsRead,
}) => {
  if (!message) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg">
        <div className="text-center">
          <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            اختر رسالة لعرضها
          </h3>
          <p className="text-sm text-muted-foreground">
            اضغط على أي رسالة من القائمة لعرض محتواها هنا
          </p>
        </div>
      </div>
    );
  }

  const handleReply = () => {
    onReply?.(message);
  };

  const handleForward = () => {
    onForward?.(message);
  };

  const handleDelete = () => {
    onDelete?.(message.id);
  };

  const handleMarkAsRead = () => {
    if (message.unread) {
      onMarkAsRead?.(message.id);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border border-border rounded-lg">
      {/* Message Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-foreground">
                {message.subject}
              </h2>
              {message.unread && (
                <Badge variant="destructive" className="text-xs">
                  غير مقروءة
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{message.sender}</span>
              </div>
              {message.sender_email && (
                <div className="flex items-center gap-2">
                  <span>{message.sender_email}</span>
                </div>
              )}
              {message.sender_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{message.sender_phone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{message.date}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReply}
            className="flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            رد
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleForward}
            className="flex items-center gap-2"
          >
            <Forward className="w-4 h-4" />
            إعادة توجيه
          </Button>
          {message.attachment && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تحميل المرفق
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            حذف
          </Button>
          {message.unread && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAsRead}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              تمييز كمقروءة
            </Button>
          )}
        </div>
      </div>

      {/* Message Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {message.body}
          </div>
        </div>
      </div>

      {/* Message Footer */}
      {message.attachment && (
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {message.attachment}
              </p>
              <p className="text-xs text-muted-foreground">
                مرفق بالرسالة
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mr-auto"
            >
              تحميل
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDetail;
