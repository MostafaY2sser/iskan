import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Bell, 
  Search, 
  LayoutDashboard, 
  Mail, 
  Home, 
  Calendar,
  Users,
  Building,
  TrendingUp,
  Banknote
} from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="h-20 bg-white border-b border-border flex items-center justify-between px-6">
        {/* Left side - Avatar and buttons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
              <Plus className="w-4 h-4 ml-2" />
              اضافة عقار
            </Button>
            <div className="relative">
              <Button variant="secondary" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-3 w-3 p-0 rounded-full"
                />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Avatar className="w-16 h-16 border-4 border-white">
              <AvatarImage src="/placeholder.svg" alt="المستخدم" />
              <AvatarFallback>أح</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-sm mx-8">
          <div className="relative">
            <Input 
              placeholder="ابحث هنا..." 
              className="pr-12 bg-muted border-0 rounded-full h-12"
            />
            <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-primary" />
            </Button>
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/bd28609d-7d3d-4a9c-841f-aa2ac0cac4b2.png" 
            alt="GRH" 
            className="h-16 w-auto"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6 lg:pl-80">
          {/* Dashboard Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">لوحة التحكم</h1>
            <p className="text-muted-foreground">مرحباً بك في نظام إدارة العقارات</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي العقارات</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+5 جديد هذا الأسبوع</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المستأجرين</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">معدل الإشغال</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">+2.1% من الشهر الماضي</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$847,293</div>
                <p className="text-xs text-muted-foreground">+8.3% من الشهر الماضي</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Properties */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>العقارات الحديثة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Home className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">شقة في حي النزهة</h4>
                        <p className="text-sm text-muted-foreground">3 غرف نوم، 2 حمام</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">2,500 ريال</p>
                      <p className="text-sm text-muted-foreground">شهرياً</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:right-0 lg:z-50">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-l border-border px-6 pb-4">
            {/* Logo in sidebar */}
            <div className="flex h-20 shrink-0 items-center justify-center border-b border-border">
              <img 
                src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" 
                alt="GRH" 
                className="h-16 w-auto"
                loading="lazy"
              />
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-2">
                <li>
                  <Button 
                    variant="default" 
                    className="w-full justify-end bg-primary text-primary-foreground"
                  >
                    <span className="mr-3">لوحة التحكم</span>
                    <LayoutDashboard className="w-5 h-5" />
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-end">
                    <span className="mr-3">الرسائل (3)</span>
                    <Mail className="w-5 h-5" />
                  </Button>
                </li>
                <li className="py-4">
                  <div className="border-b border-border" />
                </li>
                <li>
                  <p className="text-xs font-semibold leading-6 text-muted-foreground uppercase tracking-wide text-right">
                    إدارة قائمة العقارات
                  </p>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-end">
                    <span className="mr-3">العقارات</span>
                    <Home className="w-5 h-5" />
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-end">
                    <span className="mr-3">إضافة عقار جديد</span>
                    <Plus className="w-5 h-5" />
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-end">
                    <span className="mr-3">الحجوزات</span>
                    <Calendar className="w-5 h-5" />
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay - hidden by default, show with responsive menu */}
      <div className="lg:hidden">
        {/* Mobile menu button could go here */}
      </div>
    </div>
  );
};

export default Dashboard;