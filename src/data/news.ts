export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string; // ISO string
  category: string;
  imageUrl: string;
}

export const newsData: NewsItem[] = [
  {
    id: "1",
    slug: "housing-market-trends",
    title: "اتجاهات السوق مربحة",
    excerpt: "إن الإطلاع على اتجاهات سوق الإسكان يساعد على اتخاذ قرارات أكثر ذكاءً",
    body: `
      <div dir="rtl" class="prose prose-lg max-w-none">
        <p>يشهد سوق الإسكان في المملكة العربية السعودية نمواً ملحوظاً خلال الفترة الحالية، مدفوعاً بعدة عوامل اقتصادية واستراتيجية.</p>
        
        <h3>العوامل المؤثرة في السوق</h3>
        <ul>
          <li>الاستثمارات الحكومية الضخمة في مشاريع الإسكان</li>
          <li>زيادة الطلب على الوحدات السكنية من قبل الشركات</li>
          <li>تطوير التقنيات الرقمية في إدارة العقارات</li>
        </ul>
        
        <h3>التوقعات المستقبلية</h3>
        <p>تشير التوقعات إلى استمرار النمو في هذا القطاع خلال السنوات القادمة، مع التركيز على الحلول المتكاملة لإدارة السكن المؤسسي.</p>
        
        <blockquote>
          "نتوقع نمواً بنسبة 25% في قطاع الإسكان المؤسسي خلال العام القادم"
        </blockquote>
      </div>
    `,
    date: "2025-01-15T10:00:00Z",
    category: "general",
    imageUrl: "/lovable-uploads/bd28609d-7d3d-4a9c-841f-aa2ac0cac4b2.png"
  },
  {
    id: "2",
    slug: "digital-transformation",
    title: "التحول الرقمي في إدارة العقارات",
    excerpt: "كيف تغير التقنيات الحديثة من طريقة إدارة وتشغيل المؤسسات العقارية",
    body: `
      <div dir="rtl" class="prose prose-lg max-w-none">
        <p>يشهد قطاع إدارة العقارات تحولاً رقمياً شاملاً، حيث تتبنى الشركات تقنيات متطورة لتحسين كفاءة العمليات.</p>
        
        <h3>التقنيات الجديدة</h3>
        <ul>
          <li>أنظمة إدارة العقارات الذكية</li>
          <li>تطبيقات الهواتف المحمولة للمستأجرين</li>
          <li>تحليل البيانات لاتخاذ قرارات أفضل</li>
        </ul>
        
        <p>هذا التحول يساعد على تقليل التكاليف وتحسين تجربة العملاء بشكل كبير.</p>
      </div>
    `,
    date: "2025-01-10T14:30:00Z",
    category: "updates",
    imageUrl: "/lovable-uploads/bdf84f49-e9fb-4869-a95d-8bf6656853a8.png"
  },
  {
    id: "3",
    slug: "government-partnerships",
    title: "شراكات حكومية جديدة",
    excerpt: "توقيع اتفاقيات شراكة مع الجهات الحكومية لتطوير قطاع الإسكان",
    body: `
      <div dir="rtl" class="prose prose-lg max-w-none">
        <p>وقعت عدة شركات عقارية اتفاقيات شراكة استراتيجية مع الجهات الحكومية لتطوير مشاريع الإسكان المؤسسي.</p>
        
        <h3>أهداف الشراكة</h3>
        <ul>
          <li>تطوير حلول إسكان مبتكرة</li>
          <li>ضمان جودة الخدمات المقدمة</li>
          <li>تحقيق أهداف رؤية 2030</li>
        </ul>
        
        <p>تهدف هذه الشراكات إلى خلق بيئة استثمارية محفزة وتطوير القطاع بشكل مستدام.</p>
      </div>
    `,
    date: "2025-01-05T09:15:00Z",
    category: "partnerships",
    imageUrl: "/lovable-uploads/ddc315e2-6249-4e27-959a-435ae29cc145.png"
  },
  {
    id: "4",
    slug: "security-updates",
    title: "تحديثات أمنية شاملة",
    excerpt: "تطبيق أحدث معايير الأمان السيبراني لحماية بيانات العملاء",
    body: `
      <div dir="rtl" class="prose prose-lg max-w-none">
        <p>تم تطبيق تحديثات أمنية شاملة على جميع المنصات الرقمية لضمان حماية أقصى لبيانات العملاء.</p>
        
        <h3>التحديثات المطبقة</h3>
        <ul>
          <li>تشفير البيانات من الطرف إلى الطرف</li>
          <li>نظام مصادقة ثنائية</li>
          <li>مراقبة أمنية على مدار الساعة</li>
        </ul>
      </div>
    `,
    date: "2024-12-28T16:45:00Z",
    category: "security",
    imageUrl: "/lovable-uploads/e1e89307-5268-44c4-ae3f-d78800e5523e.png"
  },
  {
    id: "5",
    slug: "investment-tips",
    title: "نصائح للاستثمار العقاري",
    excerpt: "دليل شامل للاستثمار الناجح في قطاع العقارات المؤسسية",
    body: `
      <div dir="rtl" class="prose prose-lg max-w-none">
        <p>يقدم خبراء العقارات مجموعة من النصائح القيمة للمستثمرين الجدد في قطاع الإسكان المؤسسي.</p>
        
        <h3>النصائح الأساسية</h3>
        <ul>
          <li>دراسة السوق بعناية قبل الاستثمار</li>
          <li>اختيار المواقع الاستراتيجية</li>
          <li>التركيز على جودة البناء والخدمات</li>
        </ul>
      </div>
    `,
    date: "2024-12-20T11:20:00Z",
    category: "tips",
    imageUrl: "/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png"
  },
  {
    id: "6",
    slug: "real-estate-expo",
    title: "معرض العقارات السنوي",
    excerpt: "انطلاق فعاليات معرض العقارات السنوي بمشاركة أبرز الشركات",
    body: `
      <div dir="rtl" class="prose prose-lg max-w-none">
        <p>انطلقت فعاليات معرض العقارات السنوي بمشاركة واسعة من الشركات الرائدة في القطاع.</p>
        
        <h3>برنامج المعرض</h3>
        <ul>
          <li>جلسات حوارية مع خبراء القطاع</li>
          <li>عرض أحدث المشاريع والحلول</li>
          <li>ورش عمل تخصصية</li>
        </ul>
      </div>
    `,
    date: "2024-12-15T08:00:00Z",
    category: "events",
    imageUrl: "/lovable-uploads/16edcdc1-6683-4bdd-9c19-8943c60fb534.png"
  }
];

// Service functions
export const getLatestNews = (count: number = 3): NewsItem[] => {
  return newsData.slice(0, count);
};

export const getAllNews = (): NewsItem[] => {
  return newsData;
};

export const getNewsBySlug = (slug: string): NewsItem | undefined => {
  return newsData.find(item => item.slug === slug);
};

export const getNewsByCategory = (category: string): NewsItem[] => {
  return newsData.filter(item => item.category === category);
};