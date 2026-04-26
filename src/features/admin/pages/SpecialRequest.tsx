
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Eye, Search, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { adminApi } from '@/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/components/Pagination';


const SpecialRequest: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in review' | 'contacted' | 'closed'>('all');
    const [sortDate, setSortDate] = useState<'newest' | 'oldest'>('newest');


    // Fetch requests
    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await adminApi.getAllSpecialRequests();
            setRequests(res);
        } catch (err) {
            console.error(err);
            setError('فشل في جلب الطلبات الخاصة');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);



    const deleteRequests = async (id: number) => {
        try {
            await adminApi.deleteSpecialRequest(id);
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error(err);
            setError('فشل في حذف الطلب الخاص');
        }
    };


   // Filter requests by company name, phone number, status
    const filteredRequests = requests
    .filter((r) => {
        const searchValue = searchQuery.toLowerCase();

        
        const matchSearch =
        !searchValue ||
        r.customer?.company_name?.toLowerCase().includes(searchValue) ||
        r.customer?.first_phone_number?.includes(searchValue);

        
        const matchStatus =
        statusFilter === 'all' || r.status?.toLowerCase() === statusFilter;

        return matchSearch && matchStatus;
    })
    .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortDate === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const getStatusBadge = (status: string) => {
        const normalized = status?.trim().toLowerCase();
        switch (normalized) {
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>;
            case "in review":
                return <Badge className="bg-blue-100 text-blue-800">تحت المراجعة</Badge>;
            case "contacted":
                return <Badge className="bg-green-100 text-green-800">تم التواصل</Badge>;
            case "closed":
                return <Badge className="bg-red-300 text-red-800">مغلق</Badge>;
            default:
                return <Badge variant="secondary">غير معروف</Badge>;
        }
    };

    
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;



    return (
        <div className="min-h-screen bg-muted">
            {/* Header */}
            <div className='mb-6 bg-white p-4 rounded-md shadow-md'>
                <h1 className="responsive-heading text-foreground sm:text-3xl mb-2">الطلبات الخاصة</h1>
                <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">جميع الطلبات التي أرسلها العملاء</p>
            </div>

            {/* Main Card */}
            <Card className="bg-card border-none shadow-md">
                <CardContent className="p-2 sm:p-6">

                    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-b-gray-200 pb-4 ">
                        {/* Search */}
                        <div className="relative  flex-1">
                            <Input
                                placeholder="بحث باسم الشركة أو رقم الهاتف"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10 text-right shadow-sm"
                                dir="rtl"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        </div>

                        <div className="flex gap-0 sm:gap-4 justify-between ">
                            {/* Sort By Status */}
                            {/* <div className='w-full sm:w-1/2'> */}
                                <Select
                                    value={statusFilter}
                                    onValueChange={(value) => {
                                    setStatusFilter(value as any);
                                    setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="حالة الطلب" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="all">كل الحالات</SelectItem>
                                    <SelectItem value="pending">قيد المراجعة</SelectItem>
                                    <SelectItem value="in review">تحت المراجعة</SelectItem>
                                    <SelectItem value="contacted">تم التواصل</SelectItem>
                                    <SelectItem value="closed">مغلق</SelectItem>
                                    </SelectContent>
                                </Select>
                            {/* </div> */}

                            {/* <div className='w-full sm:w-1/2'> */}
                            {/* Sort By oldest and newest */}
                                <Select
                                    value={sortDate}
                                    onValueChange={(value) => {
                                    setSortDate(value as 'newest' | 'oldest');
                                    setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="ترتيب حسب التاريخ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="newest">الأحدث أولاً</SelectItem>
                                    <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                                    </SelectContent>
                                </Select>
                            {/* </div> */}
                        </div>

                    </div>

                    { loading 
                        ?(
                            <div className="h-screen flex items-center  flex-col gap-4 mt-32">
                                <LoadingSpinner />
                                <p>جاري تحميل الطلبات الخاصة</p>
                            </div>
                        )
                        :(
                            <>
                                {/* Table */}
                                <div className="rounded-md shadow-md mt-4 sm:mt-8">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="text-center font-semibold">#</TableHead>
                                                <TableHead className="text-center font-semibold">اسم الشركة</TableHead>
                                                <TableHead className="text-center font-semibold">الشخص المسؤول</TableHead>
                                                <TableHead className="text-center font-semibold">رقم الهاتف</TableHead>
                                                <TableHead className="text-center font-semibold">عدد الغرف</TableHead>
                                                <TableHead className="text-center font-semibold">الحالة</TableHead>
                                                <TableHead className="text-center font-semibold">تاريخ الإنشاء</TableHead>
                                                <TableHead className="text-center font-semibold"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentData.length > 0 ? (
                                                currentData.map((r, index) => (
                                                    <TableRow key={r.id || index} className="hover:bg-muted/30">
                                                        <TableCell className="text-center">{startIndex + index + 1}</TableCell>
                                                        <TableCell className="text-center">{r.customer?.company_name || '-'}</TableCell>
                                                        <TableCell className="text-center">{r.customer?.responsible_person || '-'}</TableCell>
                                                        <TableCell className="text-center">{r.customer?.first_phone_number || '-'}</TableCell>
                                                        <TableCell className="text-center">{r.bed_count}</TableCell>
                                                        <TableCell className="text-center">{getStatusBadge(r.status)}</TableCell>
                                                        <TableCell className="text-center">
                                                            {new Date(r.created_at).toLocaleDateString('en')}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex items-center justify-center gap-4">
                                                                <Link
                                                                    className="flex items-center justify-center"
                                                                    to={`/admin/special-request/${r.id}`}
                                                                >
                                                                    <Eye className="w-5 h-5 text-center" />
                                                                </Link>
                                                                <Trash2
                                                                    onClick={() => {
                                                                        setSelectedId(r.id);
                                                                        setIsDialogOpen(true);
                                                                    }}
                                                                    className="w-5 h-5 text-center text-red-500 cursor-pointer"
                                                                />

                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                                                        لا توجد طلبات حالياً
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


            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogContent className="flex flex-col items-center justify-center">
                    <DialogHeader>
                        <DialogTitle className='text-center'>تأكيد الحذف</DialogTitle>
                        <DialogDescription className='text-center' >
                            هل أنت متأكد أنك تريد حذف هذا الطلب؟ لا يمكن التراجع بعد الحذف.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-start gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            إلغاء
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (selectedId) deleteRequests(selectedId);
                                setIsDialogOpen(false);
                            }}
                        >
                            حذف
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default SpecialRequest;
