import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter } from '../ui/dialog';
import { MessageSquare, TriangleAlert } from 'lucide-react';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const ContactHost = ({showContactHost , setShowContactHost }) => {
  return (
        <Dialog  open={showContactHost} onOpenChange={setShowContactHost}>
            <DialogContent>
                <div className="">
                <MessageSquare />
                <h1 className='text-lg font-semibold mt-2 '>التواصل مع المستضيف</h1>
                <p className='text-sm font-normal'>
                    للتواصل مع المستضيف المسؤول، يُمكنك التواصل من خلال رقم الجوال <span className='text-base font-medium'> 9502155+</span> او إرسال رسالة
                </p>
                </div>
            <DialogDescription>
                <div className="flex gap-2 bg-[#FFF5CC] rounded-md py-[6px] px-2 mt-3 mb-2">
                <TriangleAlert className='text-[#FFAB00] w-6 h-6'/>
                <p className='text-[#7A4100] text-[13px] font-normal'>يرجى الانتباه إلى أن هذا الرقم مخصص للاستفسارات المتعلقة بالحجز أو أي مساعدة أخرى قد تحتاجها.</p>
                </div>
                <div className="mt-4">
                <form action="#" className='flex flex-col gap-2'>
                    <label htmlFor="message_ambassador">الرسالة *</label>
                    <Textarea name="message_ambassador" id="message_ambassador"></Textarea>
                </form>
                </div>
            </DialogDescription>

            <DialogFooter>
                <Button
                onClick={() => {
                    setShowContactHost(false);
                }}
                >إرسال</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ContactHost