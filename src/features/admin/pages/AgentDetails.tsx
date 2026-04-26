import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminApi } from '@/api';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Agent {
  id: number;
  name: string;
  contact_info: string;
}

const AgentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [popupOpen, setPopupOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact_info: '' });
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getAgentById(Number(id));
        setAgent(res);
        setFormData({ name: res.name, contact_info: res.contact_info });
      } catch (err) {
        console.error(err);
        setError('فشل في جلب بيانات الوكيل.');
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [id]);



  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner/></div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!agent) return <div className="p-10 text-center">لا يوجد بيانات لهذا الوكيل</div>;

  
  const handleSave = async () => {
    try {
      setSaving(true);
      await adminApi.updateAgent(agent.id, { contact_info: formData.contact_info });

      setAgent({ ...agent, ...formData });
      setPopupOpen(false);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تحديث الوكيل');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted p-2 sm:p-6">

       <div className='mb-6  bg-white rounded-md p-4 shadow-md'>
        <h1 className="responsive-heading text-foreground sm:text-3xl mb-2">تفاصيل الوكيل</h1>
        <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">نظرة عامة على تفاصيل الوكيل</p>
      </div> 


      {/* Agent Info :---------------------- */}
      <Card className="border-none shadow-md p-2 sm:p-4">
        <CardContent className="p-4 flex justify-between flex-col sm:flex-row">
          <div className="">
            <p><strong>الاسم:</strong> {agent.name}</p>
            <p className="mt-4"><strong>معلومات التواصل:</strong> {agent.contact_info}</p>
            <p className="mt-4"><strong>معرف الوكيل:</strong> {agent.id}</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0 text-[#DDD4BA]" 
            onClick={() => setPopupOpen(true)}
          >تحديث بيانات الوكيل</Button>
        </CardContent>
      </Card>
      {/* Agent Info :---------------------- */}




      {/* Update Agent Popup :---------------------- */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">تحديث بيانات الوكيل</h2>

            <div className="flex flex-col gap-4">
              <Input
                value={formData.contact_info}
                onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                placeholder="معلومات التواصل"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPopupOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Update Agent Popup :---------------------- */}


    </div>
  );
};

export default AgentDetails;
