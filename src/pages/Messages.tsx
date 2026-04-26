import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mail,
  FileText,
  LayoutDashboard,
  X,
  ArrowRight,
  Download,
  Reply,
  Forward,
  Trash2,
  Phone,
  Calendar
} from 'lucide-react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { messagesApi } from '@/api/endpoints/messages';
import type { Message, MessageDetailResponse } from '@/api/types';

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetailResponse | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'archived'>('inbox');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Mock data for development (replace with API calls)
  const mockMessages: Message[] = [
    {
      id: 1,
      date: 'AUG 22',
      sender: 'أحمد محمد العلي',
      subject: 'استفسار بخصوص العقار رقم 10 في الرياض',
      preview: 'مرحباً، معكم جيني من جوجل. نحن أكبر منصة إلكترونية تقدم خدمات الإسكان للشركات والمؤسسات. نود أن نتعاون معكم في تقديم خدمات الإسكان لموظفينا في مدينة الرياض...',
      body: 'مرحباً، معكم جيني من جوجل. نحن أكبر منصة إلكترونية تقدم خدمات الإسكان للشركات والمؤسسات. نود أن نتعاون معكم في تقديم خدمات الإسكان لموظفينا في مدينة الرياض.\n\nنحن نبحث عن عقارات مناسبة لموظفينا في المناطق التالية:\n- حي النرجس\n- حي العليا\n- حي الملز\n\nنود أن نعرف المزيد عن العقار رقم 10 في الرياض وما هي الخدمات المتاحة.\n\nشكراً لكم،\nجيني\nمدير الإسكان - جوجل',
      attachment: 'details.pdf',
      unread: true,
      created_at: '2024-08-22T10:00:00Z',
      updated_at: '2024-08-22T10:00:00Z'
    },
    {
      id: 2,
      date: 'AUG 21',
      sender: 'سارة أحمد الخالدي',
      subject: 'طلب حجز عقار في جدة',
      preview: 'السلام عليكم، أود الاستفسار عن إمكانية حجز عقار في جدة لموظفي شركتنا. نحن شركة تقنية ناشئة ونحتاج إلى سكن مناسب...',
      body: 'السلام عليكم ورحمة الله وبركاته،\n\nأود الاستفسار عن إمكانية حجز عقار في جدة لموظفي شركتنا. نحن شركة تقنية ناشئة ونحتاج إلى سكن مناسب لموظفينا.\n\nمتطلباتنا:\n- 3 غرف نوم على الأقل\n- قريب من منطقة الأعمال\n- خدمات إنترنت عالية السرعة\n- مواقف سيارات\n\nنود أن نعرف الأسعار المتاحة والخدمات المقدمة.\n\nشكراً لكم،\nسارة أحمد الخالدي\nمدير الموارد البشرية',
      attachment: 'company_profile.pdf',
      unread: true,
      created_at: '2024-08-21T14:30:00Z',
      updated_at: '2024-08-21T14:30:00Z'
    },
    {
      id: 3,
      date: 'AUG 20',
      sender: 'محمد عبدالله الشمري',
      subject: 'استفسار عن العقار رقم 15 في الدمام',
      preview: 'أهلاً وسهلاً، نحن من شركة أرامكو السعودية ونبحث عن عقارات مناسبة لموظفينا في المنطقة الشرقية...',
      body: 'أهلاً وسهلاً،\n\nنحن من شركة أرامكو السعودية ونبحث عن عقارات مناسبة لموظفينا في المنطقة الشرقية. نود أن نعرف المزيد عن العقار رقم 15 في الدمام.\n\nنحن نبحث عن:\n- عقارات قريبة من مقر العمل\n- خدمات متكاملة\n- أسعار تنافسية\n- مرافق حديثة\n\nنود أن نعرف المزيد من التفاصيل والصور.\n\nمع تحياتي،\nمحمد عبدالله الشمري\nمدير الإسكان - أرامكو السعودية',
      unread: false,
      created_at: '2024-08-20T09:15:00Z',
      updated_at: '2024-08-20T09:15:00Z'
    }
  ];

  // Load messages on component mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        // For now, use mock data. Replace with actual API call when backend is ready
        // const response = await messagesApi.getAllMessages();
        // setMessages(response.messages);
        setMessages(mockMessages);
        setError(null);
      } catch (err) {
        setError('فشل في تحميل الرسائل');
        console.error('Error loading messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  // Handle message selection
  const handleMessageSelect = async (message: Message) => {
    try {
      setSelectedMessageId(message.id);
      // For now, create a detailed message from the basic message
      // Replace with actual API call when backend is ready
      // const detailedMessage = await messagesApi.getMessageById(message.id);
      const detailedMessage: MessageDetailResponse = {
        ...message,
        sender_email: `${message.sender.toLowerCase().replace(/\s+/g, '.')}@company.com`,
        sender_phone: '+966501234567',
        property_id: 10,
        booking_id: null,
      };
      setSelectedMessage(detailedMessage);
      setShowMessageModal(true);
      
      // Mark as read if unread
      if (message.unread) {
        handleMarkAsRead(message.id);
      }
    } catch (err) {
      console.error('Error loading message details:', err);
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (messageId: number) => {
    try {
      // Update local state immediately for better UX
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, unread: false } : msg
      ));
      
      // Update selected message if it's the same
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, unread: false } : null);
      }

      // Call API (when backend is ready)
      // await messagesApi.markAsRead(messageId);
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId: number) => {
    try {
      // Update local state immediately for better UX
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // Clear selected message if it's the deleted one
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null);
        setSelectedMessageId(null);
      }

      // Call API (when backend is ready)
      // await messagesApi.deleteMessage(messageId);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Handle reply
  const handleReply = (message: MessageDetailResponse) => {
    // TODO: Implement reply functionality
    console.log('Reply to message:', message.id);
  };

  // Handle forward
  const handleForward = (message: MessageDetailResponse) => {
    // TODO: Implement forward functionality
    console.log('Forward message:', message.id);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowMessageModal(false);
    setSelectedMessage(null);
    setSelectedMessageId(null);
  };

  if (loading) {
    return (
      <DashboardLayout title="الرسائل">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل الرسائل...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="الرسائل">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="الرسائل">
      {/* Page Header */}
      <div className="border-b border-border bg-card mb-6 -mx-6 px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost">
              <LayoutDashboard className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">الرسائل</span>
            <span className="text-border">/</span>
            <span className="text-muted-foreground">لوحة التحكم</span>
          </div>
        </div>
      </div>

      {/* Messages List - Full Width */}
      <div className="w-full">
        {/* Messages Header */}
        <div className="border-b border-border bg-card mb-6 -mx-6 px-6 pb-4">
          <h2 className="text-xl font-semibold text-foreground">
            الرسائل ({messages.length})
          </h2>
        </div>

        {/* Messages List */}
        <div className="space-y-0">
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
            messages.map((message, index) => (
              <div
                key={message.id}
                onClick={() => handleMessageSelect(message)}
                className={`p-6 border-b border-border hover:bg-muted cursor-pointer transition-colors ${
                  index === 0 ? 'border-t border-border' : ''
                } ${message.unread ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Date */}
                  <div className="text-sm text-muted-foreground min-w-[60px]">
                    {message.date}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {message.unread && (
                          <div className="w-2 h-2 bg-destructive rounded-full"></div>
                        )}
                        {message.attachment && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-primary hover:underline cursor-pointer">
                              {message.attachment}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-foreground">
                        {message.sender}
                      </h3>
                    </div>
                    
                    <h4 className="text-base font-medium text-foreground mb-2 text-right">
                      {message.subject}
                    </h4>
                    
                    <p className="text-sm text-foreground text-right leading-relaxed">
                      {message.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-foreground">
                      {selectedMessage.subject}
                    </h2>
                    {selectedMessage.unread && (
                      <Badge variant="destructive" className="text-xs">
                        غير مقروءة
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{selectedMessage.sender}</span>
                    </div>
                    {selectedMessage.sender_email && (
                      <div className="flex items-center gap-2">
                        <span>{selectedMessage.sender_email}</span>
                      </div>
                    )}
                    {selectedMessage.sender_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{selectedMessage.sender_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedMessage.date}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseModal}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReply(selectedMessage)}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  رد
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleForward(selectedMessage)}
                  className="flex items-center gap-2"
                >
                  <Forward className="w-4 h-4" />
                  إعادة توجيه
                </Button>
                {selectedMessage.attachment && (
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
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </Button>
                {selectedMessage.unread && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
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
                  {selectedMessage.body}
                </div>
              </div>
            </div>

            {/* Message Footer */}
            {selectedMessage.attachment && (
              <div className="border-t border-border p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {selectedMessage.attachment}
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
        </div>
      )}
    </DashboardLayout>
  );
};

export default Messages;