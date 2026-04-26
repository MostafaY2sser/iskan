import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Mail, Plus, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { useUserBookings } from '@/hooks/useUserBookings';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Bookings: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const navigate = useNavigate();
  
  // Fetch real booking data from API
  const { bookings, loading, error, refetch } = useUserBookings();

  // Map API status to Arabic display
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending_bc_approval': 'قيد المراجعة',
      'agent_assigned': 'نشط',
      'approved': 'نشط',
      'rejected': 'مرفوض',
    };
    return statusMap[status] || status;
  };

  const getStatusBadge = (status: string) => {
    const displayStatus = getStatusText(status);
    if (displayStatus === 'نشط') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{displayStatus}</Badge>;
    } else if (displayStatus === 'قيد المراجعة') {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{displayStatus}</Badge>;
    } else if (displayStatus === 'مرفوض') {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{displayStatus}</Badge>;
    }
    return <Badge variant="secondary">{displayStatus}</Badge>;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ر.س`;
  };

  // Filter bookings based on search query
  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.id.toString().includes(searchLower) ||
      booking.bed_count.toString().includes(searchLower) ||
      booking.status.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredBookings.slice(startIndex, endIndex);

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout 
        title="الحجوزات" 
        subtitle="إدارة الحجوزات وعرض التفاصيل"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground mt-4">جاري تحميل الحجوزات...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout 
        title="الحجوزات" 
        subtitle="إدارة الحجوزات وعرض التفاصيل"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">خطأ في تحميل الحجوزات</p>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="الحجوزات" 
      subtitle="إدارة الحجوزات وعرض التفاصيل"
    >
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <span>لوحة التحكم</span> / <span>إدارة قائمة العقارات</span> / <span className="text-foreground">الحجوزات</span>
      </div>

      {/* Main Content Card */}
      <Card className="bg-card">
        <CardContent className="p-6">
          {/* Search Bar and Create Booking Button */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative max-w-md">
              <Input
                placeholder="البحث"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right"
                dir="rtl"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
            
            <Button 
              onClick={() => navigate('/create-booking')}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 ml-2" />
              حجز عقار جديد
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-right font-semibold">#</TableHead>
                  <TableHead className="text-right font-semibold">العقار</TableHead>
                  <TableHead className="text-right font-semibold">عدد العمال</TableHead>
                  <TableHead className="text-right font-semibold">تاريخ البدء</TableHead>
                  <TableHead className="text-right font-semibold">تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right font-semibold">المبلغ الشهري</TableHead>
                  <TableHead className="text-right font-semibold">الحالة</TableHead>
                  <TableHead className="text-right font-semibold">تاريخ التسكين</TableHead>
                  <TableHead className="text-right font-semibold">التواصل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      لا توجد حجوزات متاحة
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-muted/30">
                      <TableCell className="text-right">{booking.id}</TableCell>
                      <TableCell className="text-right text-primary">
                        عقار #{booking.residence_id}
                      </TableCell>
                      <TableCell className="text-right">{booking.bed_count}</TableCell>
                      <TableCell className="text-right">{formatDate(booking.start_date)}</TableCell>
                      <TableCell className="text-right">{formatDate(booking.end_date)}</TableCell>
                      <TableCell className="text-right">{formatPrice(booking.total_price_with_commission)}</TableCell>
                      <TableCell className="text-right">{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right">{formatDate(booking.created_at)}</TableCell>
                      <TableCell className="text-right">
                        {booking.agent ? (
                          <Button variant="ghost" size="sm" className="p-1">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Bookings;