import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Reply, Archive, Trash2 } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const messages = [
    {
      id: 1,
      sender: 'أحمد محمد',
      subject: 'استفسار حول الحجز',
      preview: 'مرحباً، أريد الاستفسار عن توفر العقار في نهاية الأسبوع...',
      time: 'منذ ساعتين',
      unread: true
    },
    {
      id: 2,
      sender: 'فاطمة علي',
      subject: 'تأكيد الحجز',
      preview: 'شكراً لك على تأكيد الحجز، متى يمكنني الحصول على التفاصيل...',
      time: 'منذ 4 ساعات',
      unread: true
    },
    {
      id: 3,
      sender: 'محمد السعد',
      subject: 'طلب إلغاء الحجز',
      preview: 'أعتذر، لكن أحتاج لإلغاء الحجز المقرر لليوم القادم...',
      time: 'منذ يوم',
      unread: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الرسائل</h1>
          <p className="text-gray-600">إدارة رسائلك وطلبات العملاء</p>
        </div>
        <Badge variant="destructive" className="text-sm">
          3 رسائل جديدة
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 right-3" />
              <Input
                placeholder="البحث في الرسائل..."
                className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">الكل</Button>
            <Button variant="outline" size="sm">غير مقروء</Button>
            <Button variant="outline" size="sm">مهم</Button>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">صندوق الوارد</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {messages.map((message) => (
            <div key={message.id} className={`p-6 hover:bg-gray-50 cursor-pointer ${message.unread ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={`font-medium ${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {message.sender}
                    </h4>
                    {message.unread && (
                      <Badge variant="destructive" className="text-xs">
                        جديد
                      </Badge>
                    )}
                  </div>
                  <h5 className={`text-sm font-medium mb-1 ${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {message.subject}
                  </h5>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message.preview}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-xs text-gray-500">{message.time}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="p-2">
                      <Reply className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
