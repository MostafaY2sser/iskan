import { Bell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import NotificationsList from './NotificationsList'



const OwnerNotifications = () => {
  return (
    <div className="">
        <NotificationsList/>
    </div>
  )
}

export default OwnerNotifications
