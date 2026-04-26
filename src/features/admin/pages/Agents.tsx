import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Trash2, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { adminApi } from '@/api';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import Pagination from '@/components/Pagination';

interface Agent {
  id: number;
  name: string;
  contact_info: string;
}

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', contact_info: '' });
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);



  // Fetch Agents :----------
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getAllAgents();
        setAgents(res);
      } catch (err) {
        console.error(err);
        setError('فشل في جلب بيانات الوكلاء.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Delete agent
  const deleteAgent = async (id: number) => {
    try {
      await adminApi.deleteAgent(id);
      setAgents((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      setError('فشل في حذف الوكيل.');
    }
  };

  // Filtered and Paginated Data :----------
  const filteredAgents = agents.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.contact_info.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredAgents.slice(startIndex, startIndex + itemsPerPage);

  
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;


  return (
    <div className="min-h-screen bg-muted">

      <div className='mb-6 flex items-center justify-between bg-white rounded-md p-4 shadow-md'>
        <div>
          <h1 className="responsive-heading text-foreground sm:text-3xl mb-2">الوكلاء</h1>
          <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">نظرة عامة على الوكلاء</p>
        </div>
        <Button
            className='text-[#DDD4BA]'
            variant='default' 
            onClick={() => setIsOpen(true)}
          >
            اضافة وكيل جديد
        </Button>
      </div>  

      <Card className="bg-card border-none shadow-md ">
        <CardContent className="p-2 sm:p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Input
                placeholder="بحث"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right"
                dir="rtl"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
          </div>

          { loading 
            ?(
              <div className='h-screen flex items-center mt-32 flex-col gap-4'>
                <LoadingSpinner/>
                <p>جاري تحميل الوكلاء</p>
              </div>
            )
            :(
              <>
                <div className="rounded-md shadow-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-right font-semibold">#</TableHead>
                        <TableHead className="text-right font-semibold">الوكيل</TableHead>
                        <TableHead className="text-right font-semibold">معلومات التواصل</TableHead>
                        <TableHead className="text-right font-semibold">عرض</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {currentData.map((b, index) => (
                        <TableRow key={b.id} className="hover:bg-muted/30">
                          <TableCell className="text-right">{startIndex + index + 1}</TableCell>
                          <TableCell className="text-right">{b.name}</TableCell>
                          <TableCell className="text-right">{b.contact_info}</TableCell>
                          <TableCell className="text-right flex items-center gap-4">
                          <Link 
                              className=""
                              to={`/admin/agents/${b.id}`}
                            >
                              <Eye className="w-5 h-5 text-center" />
                          </Link>
                          <Trash2
                              onClick={() => {
                                  setSelectedId(b.id);
                                  setIsDialogOpen(true);
                              }}
                              className="w-5 h-5 text-center text-red-500 cursor-pointer"
                          />
                          </TableCell>
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


      {/* Add New Agent Modal :--------------------------------*/}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h1 className="text-xl font-semibold mb-4">اضافة وكيل جديد</h1>

            <div className="flex flex-col gap-4">
              <Input
                placeholder="الاسم"
                value={newAgent.name}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, name: e.target.value })
                }
                dir="rtl"
              />

              <Input
                placeholder="معلومات التواصل"
                value={newAgent.contact_info}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, contact_info: e.target.value })
                }
                dir="rtl"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                إلغاء
              </Button>

              <Button
                onClick={async () => {
                  try {
                    setSaving(true);
                    await adminApi.AddNEwAgent(newAgent); 
                    setIsOpen(false);
                    setNewAgent({ name: '', contact_info: '' });
                    const res = await adminApi.getAllAgents();
                    setAgents(res);
                  } catch (err) {
                    console.error(err);
                    alert('حدث خطأ أثناء إضافة الوكيل');
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? 'جاري الإضافة...' : 'إضافة'}
              </Button>

            </div>
          </div>
        </div>
      )}
      {/* Add New Agent Modal :--------------------------------*/}


      {/* Delete Confirmation Dialog :--------------------------------*/}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex flex-col items-center justify-center">
          <AlertDialogHeader>
            <DialogTitle className="text-center">تأكيد الحذف</DialogTitle>
            <DialogDescription className="text-center">
              هل أنت متأكد أنك تريد حذف هذا الوكيل؟ لا يمكن التراجع بعد الحذف.
            </DialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-start gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedId) deleteAgent(selectedId);
                setIsDialogOpen(false);
              }}
            >
              حذف
            </Button>
          </AlertDialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog :--------------------------------*/}



    </div>
  );
};

export default Agents;
