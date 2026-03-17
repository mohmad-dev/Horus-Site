import 'dotenv/config';

import mongoose from 'mongoose';
import { CourseModel } from '../models/Course';

type Chapter = { chapterTitle: string; lessons: string[] };

type SeedCourse = {
  title: string;
  slug: string;
  imageUrl: string;
  category: string;
  price: number;
  level: string;
  duration: string;
  description: string;
  aboutCourse: string;
  learningOutcomes: string[];
  requirements: string[];
  curriculum: Chapter[];
};

const courses: SeedCourse[] = [
  {
    title: 'أساسيات JavaScript',
    slug: 'js-basics-ar',
    imageUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    category: 'برمجة',
    price: 199,
    level: 'مبتدئ',
    duration: '4 أسابيع',
    description: 'مدخل عملي لتعلّم JavaScript من الصفر وبناء أساس قوي للبرمجة.',
    aboutCourse:
      'في هذه الدورة ستتعلّم أساسيات JavaScript خطوة بخطوة بطريقة عملية.\n' +
      'سنركّز على فهم المفاهيم وليس الحفظ، مع تطبيقات وتمارين في كل درس.\n' +
      'في النهاية ستبني مشروعين صغيرين يساعدانك على تثبيت المعلومات.',
    learningOutcomes: [
      'فهم المتغيرات وأنواع البيانات',
      'كتابة الشروط والحلقات بشكل صحيح',
      'إنشاء الدوال واستخدامها',
      'التعامل مع DOM بشكل مبسّط',
      'بناء مشروعين عمليين',
    ],
    requirements: ['كمبيوتر أو لابتوب', 'اتصال إنترنت', 'الرغبة في التعلّم والتطبيق'],
    curriculum: [
      {
        chapterTitle: 'الأساسيات',
        lessons: ['ما هي JavaScript؟', 'المتغيرات وأنواع البيانات', 'العوامل (Operators)'],
      },
      {
        chapterTitle: 'منطق البرمجة',
        lessons: ['الشروط (if/else)', 'الحلقات (for/while)', 'الدوال (Functions)'],
      },
      {
        chapterTitle: 'تطبيق عملي',
        lessons: ['مقدمة عن DOM', 'الأحداث (Events)', 'مشروع: ToDo بسيط'],
      },
    ],
  },
  {
    title: 'تصميم UI/UX للمبتدئين',
    slug: 'ui-ux-ar',
    imageUrl:
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80',
    category: 'تصميم',
    price: 149,
    level: 'مبتدئ',
    duration: '3 أسابيع',
    description: 'تعلم أساسيات تصميم واجهات المستخدم وتجربة المستخدم لبناء منتجات جذابة وسهلة.',
    aboutCourse:
      'ستتعلم مبادئ التصميم مثل التباين والتباعد والهرمية البصرية، وكيفية التفكير بتجربة المستخدم.\n' +
      'سنقوم ببناء Wireframes ثم Prototype تفاعلي باستخدام Figma.\n' +
      'الدورة مناسبة لمن يريد بداية صحيحة في مجال التصميم.',
    learningOutcomes: [
      'فهم الفرق بين UI و UX',
      'تطبيق مبادئ الألوان والخطوط والتباعد',
      'رسم Wireframes لصفحات حقيقية',
      'بناء Prototype تفاعلي على Figma',
    ],
    requirements: ['حاسوب', 'حساب Figma مجاني', 'وقت للتطبيق'],
    curriculum: [
      { chapterTitle: 'مبادئ التصميم', lessons: ['الألوان', 'الخطوط', 'Grid و Spacing'] },
      {
        chapterTitle: 'UX عملي',
        lessons: ['User Flow', 'Wireframes', 'Prototype تفاعلي في Figma'],
      },
    ],
  },
  {
    title: 'اللغة الإنجليزية للتقنيين',
    slug: 'english-tech-ar',
    imageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    category: 'لغات',
    price: 99,
    level: 'متوسط',
    duration: '6 أسابيع',
    description: 'طوّر إنجليزيتك للمجال التقني: مصطلحات، مراسلات، وتقارير أخطاء.',
    aboutCourse:
      'هذه الدورة مصممة لمساعدتك على استخدام الإنجليزية بثقة في بيئة العمل التقنية.\n' +
      'سنركز على المصطلحات الشائعة، كتابة الإيميلات، وكتابة Bug Reports بشكل احترافي.\n' +
      'مع تدريبات أسبوعية ومهام قصيرة لتحسين المحادثة والكتابة.',
    learningOutcomes: [
      'استخدام مصطلحات البرمجة الشائعة',
      'كتابة إيميلات تقنية باحتراف',
      'كتابة Bug Report واضح ومفيد',
      'تحضير لمقابلات تقنية باللغة الإنجليزية',
    ],
    requirements: ['مستوى A2+ أو ما يعادله', 'دفتر ملاحظات', 'استمرارية في التدريب'],
    curriculum: [
      { chapterTitle: 'أساسيات العمل', lessons: ['Emails', 'Meetings', 'Presentations'] },
      { chapterTitle: 'إنجليزية تقنية', lessons: ['Software terms', 'Bug reports', 'Interview Q&A'] },
    ],
  },
  {
    title: 'ريادة الأعمال والشركات الناشئة',
    slug: 'startup-ar',
    imageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    category: 'أعمال',
    price: 179,
    level: 'مبتدئ',
    duration: '4 أسابيع',
    description: 'ابدأ مشروعك من الفكرة إلى نموذج العمل وخطة الإطلاق بطريقة عملية.',
    aboutCourse:
      'ستتعلم كيف تختبر فكرتك وتحدد المشكلة والحل، وتبني نموذج عمل (Business Model Canvas).\n' +
      'سنناقش بناء MVP، التسعير، وخطة الإطلاق الأولية.\n' +
      'الدورة عملية وبها قوالب جاهزة وتمارين تطبيقية.',
    learningOutcomes: [
      'تحليل السوق والمنافسين',
      'تحديد العميل المستهدف (Persona)',
      'بناء نموذج عمل واضح',
      'إعداد خطة إطلاق مبدئية',
    ],
    requirements: ['فكرة مشروع (اختياري)', 'التزام أسبوعي', 'رغبة في التجربة والتطوير'],
    curriculum: [
      { chapterTitle: 'الفكرة والسوق', lessons: ['Problem/Solution', 'Persona', 'Competitive analysis'] },
      { chapterTitle: 'النموذج والإطلاق', lessons: ['MVP', 'Pricing', 'Go-to-market'] },
    ],
  },
  {
    title: 'أساسيات الشبكات (CCNA)',
    slug: 'ccna-basics-ar',
    imageUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    category: 'شبكات',
    price: 229,
    level: 'متوسط',
    duration: '5 أسابيع',
    description: 'أساسيات الشبكات مع تدريب عملي وتمهيد لمفاهيم CCNA المهمة.',
    aboutCourse:
      'تغطي الدورة طبقات OSI/TCP-IP، عناوين IP، Subnetting، أساسيات Switching و Routing.\n' +
      'كما سنأخذ لمحة عن أفضل ممارسات أمن الشبكات.\n' +
      'الدورة تحتوي على تمارين وLabs للتطبيق.',
    learningOutcomes: [
      'فهم OSI و TCP/IP',
      'إتقان أساسيات IP Addressing',
      'حل مسائل Subnetting',
      'فهم أساسيات Switching و Routing',
    ],
    requirements: ['أساسيات كمبيوتر', 'Packet Tracer (مجاني)', 'وقت للتطبيق'],
    curriculum: [
      { chapterTitle: 'الأساسيات', lessons: ['OSI vs TCP/IP', 'IP Addressing', 'Subnetting'] },
      { chapterTitle: 'تطبيق عملي', lessons: ['Switching basics', 'Routing basics', 'Security basics'] },
    ],
  },
];

async function main() {
  const uri = process.env['MONGODB_URI'];
  if (!uri) throw new Error('Missing MONGODB_URI');

  await mongoose.connect(uri);
  try {
    const arabicSlugs = courses.map((c) => c.slug);
    const oldSlugs = [
      'js-programming-basics',
      'ui-ux-design-fundamentals',
      'english-for-tech-business',
      'entrepreneurship-startup-basics',
      'networking-essentials-ccna',
    ];

    const del = await CourseModel.deleteMany({ slug: { $in: [...arabicSlugs, ...oldSlugs] } }).exec();
    console.log(`[DELETE] removed=${del.deletedCount ?? 0}`);

    for (const c of courses) {
      const created = await CourseModel.create(c);
      console.log(`[CREATE] ${created.slug}`);
    }

    // Verify no question marks leaked.
    const check = await CourseModel.find({ slug: { $in: arabicSlugs } })
      .select({ title: 1, description: 1, aboutCourse: 1, category: 1, level: 1, duration: 1 })
      .lean()
      .exec();

    const bad = JSON.stringify(check).includes('????');
    console.log(`[VERIFY] hasQuestionMarks=${bad}`);
    if (bad) process.exitCode = 2;
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('reset-and-seed-arabic-courses FAIL', err);
  process.exit(1);
});

