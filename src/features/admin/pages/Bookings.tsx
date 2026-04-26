
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search,  Eye, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { adminApi } from '@/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '@/components/ui/dialog';
import UserDetails from './UserDetails';
import { Link } from 'react-router-dom';
import Pagination from '@/components/Pagination';



const Bookings = () => {
  const [activeTab, setActiveTab] = useState<'approved' | 'pending' | 'rejected'>('approved');
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [assignAgent, setAssignAgent] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [confirmPayment, setConfirmPayment] = useState<null | number>(null); 
  const [confirmBooking, setConfirmBooking] = useState<null | number>(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [isAssigningAgent, setIsAssigningAgent] = useState(false);
  const [isConfirmingBooking, setIsConfirmingBooking] = useState(false);
  const [isConfirmPayment, setIsConfirmPayment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDate, setSortDate] = useState<'newest' | 'oldest'>('newest');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [agentFilter, setAgentFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [isRejectingBooking, setIsRejectingBooking] = useState(false);
  const [rejectBooking, setRejectBooking] = useState<null | number>(null);

  

  // Get -> Approved bookings && Pending bookings && Agents
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [approvedRes, pendingRes, agentsRes] = await Promise.all([
          adminApi.getAllApprovedBookings(),
          adminApi.getAllPendingBookings(),
          adminApi.getAllAgents()
        ]);

        setBookings(approvedRes);
        setPendingBookings(pendingRes);
        setAgents(agentsRes);

      } catch (err) {
        console.error(err);
        setError('فشل في جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);


  // handle Assign Agent :------
  const handleAssignAgent = async () => {
    if (!selectedAgent) return toast.error('الرجاء اختيار وكيل أولاً');

    try {
      setIsAssigningAgent(true);
      await adminApi.assignAgent(assignAgent.id, Number(selectedAgent)); 

      toast.success('تم تعيين الوكيل بنجاح');
      setAssignAgent(null);
      setSelectedAgent('');

      // Refresh bookings
      const updatedBookings = await adminApi.getAllApprovedBookings();
      setBookings(updatedBookings);
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء تحديث الوكيل');
    } finally {
      setIsAssigningAgent(false); 
    }
  };


  // Confirm Payment Action :------
  const confirmPaymentAction = async () => {
    if (!confirmPayment) return;

    try {
      setIsConfirmPayment(true);
      await adminApi.markBookingPaid(confirmPayment);
      toast.success('تم تنشيط الدفع بنجاح');
      setBookings((prev) =>
        prev.map((item) =>
          item.id === confirmPayment ? { ...item, is_paid: true } : item
        )
      );
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء تنشيط الدفع');
    } finally {
      setConfirmPayment(null);
      setIsConfirmPayment(false);
    }
  };


  // Handle View User :------
  const handleViewUser = async (id: string) => {
    try {
      setUserLoading(true);
      const res = await adminApi.getCustomerById(id);
      setSelectedUser(res);
      setUserDetailsOpen(true);
    } catch (err) {
      console.error(err);
      toast.error('فشل في جلب بيانات المستخدم');
    } finally {
      setUserLoading(false);
    }
  };



  // Confirm Booking (Admin Approve) :------
  const confirmBookingAction = async () => {
    if (!confirmBooking) return;

    try {
      setIsConfirmingBooking(true);

      await adminApi.adminUpdateBookingStatus(confirmBooking, "approved");

      toast.success("تمت الموافقة من الإدارة");

      setBookings(prev =>
        prev.map(b =>
          b.id === confirmBooking
            ? { ...b, admin_status: "approved" }
            : b
        )
      );
    } catch (err) {
      toast.error("حدث خطأ أثناء الموافقة");
    } finally {
      setConfirmBooking(null);
      setIsConfirmingBooking(false);
    }
  };
  // Confirm Booking (Admin Approve) :------


  // Reject Booking (Admin Reject) :------
  const rejectBookingAction = async () => {
    if (!rejectBooking) return;

    try {
      setIsRejectingBooking(true);

      await adminApi.adminUpdateBookingStatus(rejectBooking, "rejected");

      toast.success("تم رفض الحجز");

      setBookings(prev =>
        prev.map(b =>
          b.id === rejectBooking
            ? { ...b, admin_status: "rejected" }
            : b
        )
      );
    } catch (err) {
      toast.error("حدث خطأ أثناء الرفض");
    } finally {
      setRejectBooking(null);
      setIsRejectingBooking(false);
    }
  };
  // Reject Booking (Admin Reject) :------




  // Badge :------
  const getStatusBadge = (status) => {
    if (status === 'approved') return <Badge className="bg-green-100 text-green-800">نعم</Badge>;
    if (status === 'pending') return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>;
    if (status === 'suspended') return <Badge className="bg-red-100 text-red-800">موقوف</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  // Filtered , Search , Sort Data :------
  const filteredData = bookings
    .filter(b => {
      if (activeTab === 'approved') return b.admin_status === 'approved';
      if (activeTab === 'pending') return b.admin_status === 'pending';
      if (activeTab === 'rejected') return b.admin_status === 'rejected';
      return true;
    })
    .filter(b => {
      const searchValue = searchQuery.toLowerCase();
      const matchSearch = !searchValue || b.id.toString().includes(searchValue);

      const matchPayment =
        paymentFilter === 'all' ||
        (paymentFilter === 'paid' && b.is_paid) ||
        (paymentFilter === 'unpaid' && !b.is_paid);

      const matchAgent =
        agentFilter === 'all' ||
        (agentFilter === 'assigned' && !!b.agent) ||
        (agentFilter === 'unassigned' && !b.agent);

      return matchSearch && matchPayment && matchAgent;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDate === 'newest' ? dateB - dateA : dateA - dateB;
    });
  // Filtered , Search , Sort Data :------




  // handle total Pages :-------
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1); 
    }
  }, [filteredData, currentPage, itemsPerPage]);



  // handle error :----- 
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;



  return (
    <div className="min-h-screen bg-muted">

      <div className='bg-white p-4 rounded-md shadow-md mb-6'>
        <h1 className="responsive-heading text-foreground sm:text-3xl mb-2">الحجوزات</h1>
        <p className="text-muted-foreground ">
           جميع حجوزات العملاء الموافق عليها من المالك 
        </p>
      </div>
      
      <Card className="bg-card border-none shadow-md">
        <CardContent className="p-2 sm:p-6">

          {/* Header :- */}
          <div className="mb-2 flex flex-col border-b border-b-gray-300 ">
            {/* Tabs :- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2 sm:mb-4 ">
              <Button
                variant={activeTab === 'approved' ? 'default' : 'outline'}
                onClick={() => setActiveTab('approved')}
                className='w-full'
              >
                الحجوزات المعتمدة
              </Button>

              <Button
                variant={activeTab === 'pending' ? 'default' : 'outline'}
                onClick={() => setActiveTab('pending')}
                className='w-full'
              >
                الحجوزات المعلقة
              </Button>

              <Button
                variant={activeTab === 'rejected' ? 'default' : 'outline'}
                onClick={() => setActiveTab('rejected')}
                className='w-full'
              >
                الحجوزات المرفوضة
              </Button>
            </div>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Search */}
                <div className="relative w-fuul sm:flex-1">
                  <Input
                    placeholder="ابحث عن طريق رقم الحجز"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pr-10 text-right"
                    dir="rtl"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>

                {/* Sort Date */}
                <Select
                  value={sortDate}
                  onValueChange={(value: 'newest' | 'oldest') => {
                    setSortDate(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="الترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">الأحدث أولاً</SelectItem>
                    <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                  </SelectContent>
                </Select>

                {/* Payment Filter */}
                <Select
                  value={paymentFilter}
                  onValueChange={(value: 'all' | 'paid' | 'unpaid') => {
                    setPaymentFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="حالة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع حالات الدفع</SelectItem>
                    <SelectItem value="paid">مدفوع</SelectItem>
                    <SelectItem value="unpaid">غير مدفوع</SelectItem>
                  </SelectContent>
                </Select>

                {/* Agent Filter */}
                  <Select
                    value={agentFilter}
                    onValueChange={(value: 'all' | 'assigned' | 'unassigned') => {
                      setAgentFilter(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="حالة الوكيل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع حالات الوكيل</SelectItem>
                      <SelectItem value="assigned">تم تعيين وكيل</SelectItem>
                      <SelectItem value="unassigned">لم يتم تعيين وكيل</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
          </div>
          {/* Header :- */}

          { loading 
            ?(
              <div className="h-screen flex items-center flex-col gap-4 mt-32">
                <LoadingSpinner />
                <p>جاري تحميل البيانات...</p>
              </div>
            )
            :(
              <>
                <div className="rounded-md shadow-md mt-4 sm:mt-8 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-right font-semibold">ID#</TableHead>
                        <TableHead className="text-right font-semibold min-w-[105px]">تفاصيل الحجز</TableHead>
                        <TableHead className="text-right font-semibold">تاريخ البدء</TableHead>
                        <TableHead className="text-right font-semibold">تاريخ الانتهاء</TableHead>
                        <TableHead className="text-right font-semibold">المبلغ الإجمالي</TableHead>
                        {activeTab === 'pending' && (
                          <TableHead className="text-right font-semibold">مراجعة الحجز</TableHead>
                        )}                        
                        {activeTab === 'approved' && (
                          <TableHead className="text-center font-semibold">الدفع</TableHead>
                        )}
                        {activeTab === 'approved' && (
                          <TableHead className="text-center font-semibold">الوكيل</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {currentData.map((b, index) => (
                        <TableRow key={b.id} className="hover:bg-muted/30">
                          <TableCell className="text-right">{`${b.id}`}</TableCell>
                          <TableCell className="text-center">
                            <Link to={`/admin/bookings/${b.id}`}>
                              <Eye className="w-5 h-5" />
                            </Link>
                          </TableCell>
                          <TableCell className="text-right min-w-[111px]">{b.start_date}</TableCell>
                          <TableCell className="text-right min-w-[111px]">{b.end_date}</TableCell>
                          <TableCell className="text-right ">
                            {b.total_price_with_commission !== null && b.total_price_with_commission !== undefined
                              ? parseFloat(Number(b.total_price_with_commission).toFixed(1))
                              : '-'} ر.س
                          </TableCell>

                          {/* Paid * :----- */}
                          {activeTab === 'approved' && ( 
                            <TableCell className="text-center">
                              {b.is_paid ? (
                                'مدفوع'
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setConfirmPayment(b.id)}
                                >
                                  تغيير حالة الدفع
                                </Button>
                              )}
                            </TableCell>
                          )}    
                          {/* Paid :-----/} */}

                          {/* Approve or Rejected Admin  Pending Booking :------ */}
                          {activeTab === 'pending' && (
                            <TableCell className="text-right flex gap-2">
                              {/* Approve Button  */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setConfirmBooking(b.id)}
                              >
                                موافقة
                              </Button>

                              {/* Rejected Button  */}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setRejectBooking(b.id)}
                              >
                                رفض
                              </Button>
                            </TableCell>
                          )}
                          {/* Approve or Rejected Admin  Pending Booking :------ */}

                          {/* Assign Agent :-----*/}
                          {activeTab === 'approved' && (
                            <TableCell className="text-center">
                              {b.agent?.name ? (
                                b.agent.name
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setAssignAgent(b);
                                    setSelectedAgent('');
                                  }}
                                >
                                  تعيين وكيل
                                </Button>
                              )}
                            </TableCell>
                          )}
                          {/* Assign Agent :-----*/}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination :----------- */}
                {totalPages > 1 && (
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    />
                )}
                {/* Pagination :----------- */}
              </>
            )
          }
        </CardContent>
      </Card>




      {/* Assign Agent Popup */}
      {assignAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4 text-right">
              تعيين وكيل للحجز رقم {assignAgent.id}
            </h2>

            <Select
              value={selectedAgent ? selectedAgent.toString() : undefined}
              onValueChange={(value) => setSelectedAgent(value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    selectedAgent
                      ? agents.find((a) => a.id === Number(selectedAgent))?.name
                      : assignAgent?.agent?.name
                      ? assignAgent.agent.name
                      : 'اختر الوكيل'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAssignAgent(null)}>
                إلغاء
              </Button>
              <Button onClick={handleAssignAgent} disabled={isAssigningAgent}>
                {isAssigningAgent ? 'جاري التعيين...' : 'تعيين الوكيل'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Assign Agent Popup */}


      {/* Dialog Confirm Payment  */}
      <Dialog open={!!confirmPayment} onOpenChange={() => setConfirmPayment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد تغيير حالة الدفع</DialogTitle>
          </DialogHeader>
          <p className="text-right">هل أنت متأكد أنك تريد تغيير حالة الدفع لهذا الحجز؟</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmPayment(null)}>
              إلغاء
            </Button>
            <Button onClick={confirmPaymentAction} disabled={isConfirmPayment}>
              {isConfirmPayment ? 'جاري التأكيد...' : 'تأكيد'}
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog Confirm Payment  */}


      {/* Dialog Confirm Booking  */}
      <Dialog open={!!confirmBooking} onOpenChange={() => setConfirmBooking(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">
              تأكيد الموافقة على الحجز
            </DialogTitle>
          </DialogHeader>

          <p className="text-right">
            هل أنت متأكد أنك تريد الموافقة على هذا الحجز؟
          </p>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmBooking(null)}>
              إلغاء
            </Button>

            <Button
              onClick={confirmBookingAction}
              disabled={isConfirmingBooking}
            >
              {isConfirmingBooking ? 'جاري الموافقة...' : 'موافقة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog Confirm Booking  */}


      {/* Dialog Reject Booking  */}
      <Dialog open={!!rejectBooking} onOpenChange={() => setRejectBooking(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right text-red-600">
              تأكيد رفض الحجز
            </DialogTitle>
          </DialogHeader>

          <p className="text-right">
            هل أنت متأكد أنك تريد رفض هذا الحجز؟
          </p>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejectBooking(null)}>
              إلغاء
            </Button>

            <Button
              variant="destructive"
              onClick={rejectBookingAction}
              disabled={isRejectingBooking}
            >
              {isRejectingBooking ? 'جاري الرفض...' : 'رفض'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog Reject Booking  */}



      {/* Dialog User Details */}
      <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-right">بيانات العميل</DialogTitle>
          </DialogHeader>
          {userLoading ? (
            <div className="h-40 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <UserDetails  user={selectedUser} />
          )}
        </DialogContent>
      </Dialog>
      {/* Dialog User Details */}


    </div>
  );
};

export default Bookings;






























