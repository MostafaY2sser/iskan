
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Eye, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/api';
import Pagination from '@/components/Pagination';

interface Residence {
  id: number;
  name: string;
  location: string;
  bed_count: number;
  price_per_bed: string;
  status: string;
  residence_type: string;
  created_at: string;
  updated_at: string;
}

const PropertiesTable: React.FC = () => {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all'); 
  const [filterPrice, setFilterPrice] = useState<{ min?: number; max?: number }>({});
  const [filterDate, setFilterDate] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchResidences = async (status: string = filterStatus) => {
    try {
      setLoading(true);
      
      if( status === "pending" ) {
        const res = await adminApi.getAllPendingResidences();
        setResidences(res);
      } else{
        const res = await adminApi.getAllResidences(status);
        setResidences(res);
      }

    } catch (err: any) {
      console.error(err);
      setError('فشل في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidences(filterStatus); 
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>;
    if (status === 'approved') return <Badge className="bg-green-100 text-green-800">موافقة</Badge>;
    if (status === 'changes_requested') return <Badge className="bg-blue-100 text-blue-800">بحاجة الي تعديل</Badge>;
    if (status === 'rejected') return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  
  const filteredResidences = residences
    .filter((res) => {
     
      const matchPrice =
        (!filterPrice.min || parseFloat(res.price_per_bed) >= filterPrice.min) &&
        (!filterPrice.max || parseFloat(res.price_per_bed) <= filterPrice.max);

      const matchSearch =
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLocation =
        filterLocation === 'all' || res.location === filterLocation;

      return matchPrice && matchSearch && matchLocation;
    })
    .sort((a, b) => {
      return filterDate === 'asc'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });


  const totalPages = Math.ceil(filteredResidences.length / rowsPerPage);
  const currentResidences = filteredResidences.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  const locations = Array.from(
    new Set(residences.map((r) => r.location).filter(Boolean))
  );


  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-muted">
      <div className='mb-6 bg-[#ffffff] p-4 rounded-md shadow-md'>
        <h1 className="responsive-heading text-foreground sm:text-3xl mb-2">العقارات المعلقة</h1>
        <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">نظرة عامة على العقارات المعلقة</p>
      </div>

      <div className="bg-white md:p-6 rounded-lg shadow-lg">
        <div className="flex flex-wrap sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0 border-b border-b-gray-200 pb-4 ">

            {/* Search */}
            <input
              type="text"
              placeholder="بحث بالاسم أو الموقع"
              className="border p-2 rounded-md w-full md:w-[35%]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />

            {/* Status Filter */}
            <select
              className="border p-2 rounded-md w-[100%] md:w-[20%]"
              value={filterStatus}
              onChange={(e) => {
                const value = e.target.value;
                setFilterStatus(value);
                setCurrentPage(1);

                // fetch from server based on selected status
                fetchResidences(value);
              }}
            >
              <option value="all">الكل</option>
              <option value="pending">قيد المراجعة</option>
              <option value="changes_requested">مطلوب تغييرات</option>
              <option value="rejected">مرفوض</option>
              <option value="approved">موافقة</option>
            </select>

            {/* Location Filter */}
            <select
              className="border p-2 rounded-md w-[48%] md:w-[20%]"
              value={filterLocation}
              onChange={(e) => {
                setFilterLocation(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">كل المواقع</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Date */}
            <select 
              className="border p-2 rounded-md w-[48%] md:w-[20%]"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value as 'asc' | 'desc')}
            >
              <option value="desc">الأحدث أولاً</option>
              <option value="asc">الأقدم أولاً</option>
            </select>

        </div>


        { loading 
          ?(
            <div className='h-screen flex items-center flex-col gap-4 mt-32'>
              <LoadingSpinner/>
              <p>جاري تحميل العقارات</p>
            </div>
          )
          :(
            <>
              <div className="bg-white rounded-md shadow-md">
                <Table >
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-right font-semibold">#</TableHead>
                      <TableHead className="text-right font-semibold">الاسم</TableHead>
                      <TableHead className="text-right font-semibold">الموقع</TableHead>
                      <TableHead className="text-right font-semibold">عدد الأسرة</TableHead>
                      <TableHead className="text-right font-semibold">سعر السرير</TableHead>
                      <TableHead className="text-right font-semibold">نوع العقار</TableHead>
                      <TableHead className="text-right font-semibold">حالة الطلب</TableHead>
                      <TableHead className="text-right font-semibold">الحالة</TableHead>
                      <TableHead className="text-right font-semibold">تاريخ الإنشاء</TableHead>
                      <TableHead className="text-right font-semibold">عرض التفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentResidences.length > 0 ? (
                      currentResidences.map((res, index) => (
                        <TableRow key={res.id} className="hover:bg-muted/30">
                          {/* <TableCell className="text-right">{(currentPage - 1) * rowsPerPage + index + 1}</TableCell> */}
                          <TableCell className="text-right">{res.id}</TableCell>
                          <TableCell className="text-right min-w-[125px]">{res.name}</TableCell>
                          <TableCell className="text-right min-w-[100px]">{res.location}</TableCell>
                          <TableCell className="text-right">{res.bed_count}</TableCell>
                          <TableCell className="text-right">
                            {res.price_per_bed !== null && res.price_per_bed !== undefined
                              ? parseFloat(Number(res.price_per_bed).toFixed(1))
                              : '-'}
                          </TableCell>
                          <TableCell className="text-right">{res.residence_type}</TableCell>
                          <TableCell className="text-right">{res.updated_at ? 'تعديل' : 'إضافة'}</TableCell>
                          <TableCell className="text-right min-w-[129px]">{getStatusBadge(res.status)}</TableCell>
                          <TableCell className="text-right">{new Date(res.created_at).toLocaleDateString('en')}</TableCell>
                          <TableCell className="text-right">
                            <Link 
                              className="flex items-center justify-center"
                              state={{ property: res }}
                              to={`/admin/properties/${res.id}`} 
                            >
                              <Eye className="w-5 h-5 text-center" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground py-6">
                          لا توجد بيانات
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
        </div>


    </div>
  );
};

export default PropertiesTable;
