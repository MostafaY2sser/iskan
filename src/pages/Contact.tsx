import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Home, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Contact: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { toast } = useToast();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();

    if (!name || !email || !message) {
      toast({
        title: isRTL ? 'الرجاء ملء الحقول المطلوبة' : 'Please fill the required fields',
        description: isRTL ? 'الاسم والبريد والرسالة مطلوبة' : 'Name, email and message are required',
      });
      return;
    }

    toast({
      title: isRTL ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent',
      description: isRTL ? 'سنتواصل معك في أقرب وقت ممكن' : 'We will contact you as soon as possible',
    });
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ===== Header / Banner ===== */}
      <section className="relative bg-[#2E4166] text-white overflow-hidden  mb-10 sm:mb-[100px]">
        {/* repeating houses pattern along bottom-left */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 bottom-0 h-24 sm:h-28 opacity-25"
          style={{
            backgroundImage: "url(/lovable-uploads/home-vector.svg)",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom left",
            backgroundSize: "220px auto",
          }}
        />

<div className="responsive-container py-8 sm:py-10">
  {/* breadcrumb */}
  <div
    className={`flex items-center gap-2 justify-Start text-right text-sm sm:text-base`}
  >
    <Home className="w-4 h-4 opacity-90" />
    <span className="opacity-90">{isRTL ? 'الرئيسية' : 'Home'}</span>
    {isRTL ? (
      <ChevronsLeft className="w-4 h-4 opacity-60" />
    ) : (
      <ChevronsRight className="w-4 h-4 opacity-60" />
    )}
    <span className="opacity-90">{isRTL ? 'تواصل معنا' : 'Contact Us'}</span>
  </div>

          {/* title */}
          <h1
            className={`mt-6 font-ibm-plex-arabic font-extrabold leading-tight ${
              isRTL ? 'text-right' : 'text-left'
            } text-3xl sm:text-5xl`}
          >
            {isRTL ? 'تواصل معنا' : 'Contact Us'}
          </h1>
        </div>
      </section>


      {/* ===== Form ===== */}
      <section className="pb-16 pt-8">
        <div className="responsive-container">
          <Card className="max-w-3xl mx-auto shadow-sm">
            <CardContent className="p-6 sm:p-8">
            <div className="mb-8 text-center">
            <h2 className="font-ibm-plex-arabic font-bold text-[#2E4166] text-xl sm:text-3xl leading-snug">
                  {isRTL
                    ? 'نعمل باستمرار ليجعل تجربتك مع خدماتنا أسهل. سوف نتجاوب معك خلال أقرب وقت ممكن.'
                    : 'We work continuously to make your experience easier. We will respond as soon as possible.'}
                </h2>
                <p className="mt-2 text-muted-foreground font-ibm-plex-arabic text-sm">
                  {isRTL
                    ? 'يسعدنا التواصل معك! سواء كانت لديك أسئلة أو تحتاج إلى دعم أو ترغب في مناقشة مشروع، فلا تتردد في التواصل معنا.'
                    : 'We are happy to connect. Ask a question, request support, or discuss a project.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" >
                {/* Name */}
                <div className="space-y-2">
                  <Label className="font-ibm-plex-arabic text-[#2E4166]">
                    {isRTL ? 'الاسم الكامل' : 'Full name'} <span className="text-red-500">*</span>
                  </Label>
                  <Input name="name" placeholder={isRTL ? 'الاسم الكامل' : 'Full name'} />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="font-ibm-plex-arabic text-[#2E4166]">
                    {isRTL ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
                  </Label>
                  <Input name="email" type="email" placeholder={isRTL ? 'مثال: example@email.com' : 'e.g. example@email.com'} />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label className="font-ibm-plex-arabic text-[#2E4166]">
                    {isRTL ? 'رسالة' : 'Message'} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea name="message" rows={8} placeholder={isRTL ? '...رسالة' : 'Your message...'} />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#2E4166] hover:bg-[#243652] text-white font-ibm-plex-arabic h-12"
                >
                  {isRTL ? 'إرسال' : 'Send'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Contact;
