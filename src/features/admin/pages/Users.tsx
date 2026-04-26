
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {  ChevronsLeft, ChevronsRight, Edit, Eye, Search } from 'lucide-react';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { toast } from 'sonner';
import { adminApi } from '@/api';
import { Link } from 'react-router-dom';
import Pagination from '@/components/Pagination';

const Users: React.FC = () => {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'suspended'>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'residence_owner' | 'customer'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');



  //  Fetch users :---------------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await adminApi.getAllUsers();
      setUsers(res);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('فشل في جلب بيانات المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by search query
  const filteredUsers = users
    .filter((u) => {
      const matchSearch =
        u.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === 'all' || u.status === statusFilter;

      const matchUserType =
        userTypeFilter === 'all'
          ? true
          : userTypeFilter === 'customer'
          ? u.user_type === 'customer'
          : ['residence_company', 'owner'].includes(u.user_type);

      return matchSearch && matchStatus && matchUserType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortOrder === 'newest'
        ? dateB - dateA
        : dateA - dateB;
    });


  //  Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, userTypeFilter, searchQuery, sortOrder]);



  const getStatusBadge = (status: string) => {
  const normalized = status?.trim().toLowerCase(); 

  if (normalized === 'approved') {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">نشط</Badge>);
  } else if (normalized === 'pending') {
    return (<Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">قيد المراجعة</Badge>);
  } else if (normalized === 'suspended') {
    return (<Badge className="bg-red-100 text-red-800 hover:bg-red-100">موقوف</Badge>
    );
  } else if ( normalized === 'pending_reactivation' ){
    return (<Badge className="bg-yellow-100 text-yellow-500 hover:bg-red-100">في إنتظار التنشيط</Badge>
    );
  }
  return <Badge variant="secondary">غير معروف</Badge>;
};


  
  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className='mb-6 bg-white rounded-lg p-4 shadow-md'>
        <h1 className="responsive-heading text-foreground sm:text-3xl mb-2">المستخدمين</h1>
        <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">نظرة عامة على المستخدمين</p>
      </div>  

      {/* Main Card */}
      <Card className="bg-card border-none shadow-md ">
        <CardContent className="p-2 sm:p-6">
          <div className="flex sm:justify-between flex-col sm:flex-row border-b border-b-gray-200 pb-4 mb-4 sm:mb-6">
            {/* Search */}
            <div className="flex-1 mb-4 md:mb-0" >
              <div className="relative max-w-md">
                <Input
                  placeholder="بحث عن مستخدم عبر البريد الإلكتروني"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-right"
                  dir="rtl"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
            </div>

            {/* Status Filter */}
            <div className=" flex items-center gap-2 ">
              <Select
                value={statusFilter}
                onValueChange={(value: any) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="فلترة حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  <SelectItem value="approved">نشط</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="suspended">موقوف</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={userTypeFilter}
                onValueChange={(value: any) => {
                  setUserTypeFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="فلترة حسب نوع المستخدم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الأنواع</SelectItem>
                  <SelectItem value="residence_owner">وسيط / مالك</SelectItem>
                  <SelectItem value="customer">شركة</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortOrder}
                onValueChange={(value: any) => {
                  setSortOrder(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="oldest">الأقدم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


          { loading 
           ?(
              <div className="h-screen flex items-center  flex-col gap-4 mt-32">
                <LoadingSpinner/>
                <p>جاري تحميل المستخدمين</p>
              </div>
           )
           :(
              <>
                {/* Table */}
                <div className="rounded-md shadow-md bg-white mt-4">
                  <Table >
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-right font-semibold">#</TableHead>
                        <TableHead className="text-right font-semibold">البريد الإلكتروني</TableHead>
                        <TableHead className="text-right font-semibold">نوع المستخدم</TableHead>
                        <TableHead className="text-right font-semibold">الحالة</TableHead>
                        <TableHead className="text-right font-semibold">بيانات المستخدم</TableHead>
                        <TableHead className="text-right font-semibold">الإجراء</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.length > 0 ? (
                        currentData.map((u, index) => (
                          <TableRow key={u.id || index} className="hover:bg-muted/30">
                            <TableCell className="text-right">{startIndex + index + 1}</TableCell>
                            <TableCell className="text-right text-primary">{u.email}</TableCell>
                            <TableCell className="text-right">{u.user_type || '-'}</TableCell>
                            <TableCell className="text-right">{getStatusBadge(u.status)}</TableCell>
                            <TableCell className="text-right text-primary">
                              <Link 
                                to={
                                  u.user_type === 'customer'
                                    ? `/admin/customer-details/${u.id}`
                                    : `/admin/owner-details/${u.id}`
                                  }
                                >
                                <Eye className='w-6 h-6'/>
                              </Link>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedUser(u)} 
                                >
                                <Edit className="w-5 h-5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                            لا يوجد مستخدمين
                          </TableCell>
                        </TableRow>
                      )}
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



      {/* Change Stutas Popup  */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-lg font-semibold mb-4 text-right">تغيير حالة المستخدم</h2>

              <Select
                value={selectedUser.status}
                onValueChange={(value) =>
                  setSelectedUser({ ...selectedUser, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة الجديدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">نشط</SelectItem>
                  <SelectItem value="suspended">موقوف</SelectItem>
                </SelectContent>
              </Select>

              {/* if suspended show input */}
              {selectedUser.status === 'suspended' && (
                <div className="mt-4">
                  <Input
                    placeholder="سبب الوقف"
                    value={selectedUser.reason || ''}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, reason: e.target.value })
                    }
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  إلغاء
                </Button>

                <Button
                  onClick={async () => {
                    if (selectedUser.status === 'suspended' && !selectedUser.reason) {
                      return alert('الرجاء إدخال سبب الوقف');
                    }

                    try {
                      setUpdating(true);

                      await adminApi.updateUserStatus(
                        selectedUser.id,
                        selectedUser.status,
                        selectedUser.status === 'suspended' ? selectedUser.reason : undefined
                      );

                      toast.success('تم تحديث الحالة');

                      setUsers((prev) =>
                        prev.map((u) =>
                          u.id === selectedUser.id ? { ...u, ...selectedUser } : u
                        )
                      );

                      setSelectedUser(null);
                    } catch (err) {
                      console.error(err);
                      toast.error('حدث خطأ أثناء تحديث الحالة');
                    } finally {
                      setUpdating(false);
                    }
                  }}
                  disabled={updating}
                >
                  {updating ? 'جارٍ التحديث...' : 'تحديث'}
                </Button>
              </div>
            </div>
          </div>
        )}
      {/* Change Stutas Popup */}


    </div>
  );
};

export default Users;
