export interface LocalizedText {
  en: string;
  vi: string;
}

const localized = (en: string, vi: string): LocalizedText => ({ en, vi });

export interface Price {
  usd: number;
  vnd: number;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface ProductVariant {
  id: string;
  name: LocalizedText;
  price: Price;
  originalPrice?: Price;
  sku: string;
  image: string;
  stock: boolean;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: LocalizedText;
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  images?: string[];
  price: Price;
  categoryId: string;
  rating: number;
  inventoryStatus: StockStatus;
  deliveryType: LocalizedText;
  variants?: ProductVariant[];
}

export interface Course {
  id: string;
  slug: string;
  title: LocalizedText;
  thumbnail: string;
  images?: string[];
  instructor: string;
  price: Price;
  description: LocalizedText;
  lessons: number;
  duration: LocalizedText;
  rating: number;
  status: 'Published' | 'Draft';
  createdAt?: string;
}

export interface Comment {
  id: string;
  itemId: string;
  itemType: 'product' | 'course';
  userId: string;
  userName: string;
  userAvatar?: string;
  comment: LocalizedText;
  createdAt: string;
  status: 'approved' | 'pending' | 'hidden';
}

export interface Promotion {
  id: string;
  code: string;
  name: LocalizedText;
  description: LocalizedText;
  discountPercent: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'scheduled';
  usageLimit?: number;
  usedCount: number;
}

export interface OrderItem {
  id: string;
  name: LocalizedText;
  type: 'product' | 'course';
  price: Price;
  quantity: number;
  variant?: LocalizedText;
  credentials?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: Price;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
  deliveryEmail?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'banned';
  createdAt: string;
}

export interface Review {
  id: string;
  itemId: string;
  itemName: LocalizedText;
  itemType: 'product' | 'course';
  userId: string;
  userName: string;
  rating: number;
  comment: LocalizedText;
  status: 'approved' | 'pending' | 'hidden';
  createdAt: string;
}

export const categories: Category[] = [
  { id: 'all', name: localized('All', 'Tất cả') },
  { id: 'ai-tools', name: localized('AI Tools', 'Công cụ AI') },
  { id: 'design-tools', name: localized('Design Tools', 'Công cụ thiết kế') },
  { id: 'entertainment', name: localized('Entertainment', 'Giải trí') },
  { id: 'productivity', name: localized('Productivity', 'Năng suất') },
];

export const products: Product[] = [
  {
    id: 'chatgpt-plus',
    slug: 'chatgpt-plus-account',
    name: localized('ChatGPT Plus Account', 'Tài khoản ChatGPT Plus'),
    description: localized(
      `## Premium AI access without throttling\n\n- Unlimited GPT-4o requests every day\n- Priority access during peak hours\n- Dedicated support team with 1-hour SLA\n- Fresh account replacement if any issue occurs within 30 days`,
      `## Truy cập AI cao cấp không giới hạn\n\n- Sử dụng GPT-4o không bị giới hạn mỗi ngày\n- Ưu tiên trong giờ cao điểm\n- Đội ngũ hỗ trợ riêng với SLA 1 giờ\n- Thay mới miễn phí nếu có vấn đề trong 30 ngày`
    ),
    image: '/images/products/chatgpt-plus/main.png',
    images: [
      '/images/products/chatgpt-plus/main.png',
      '/images/products/chatgpt-plus/dashboard.png',
      '/images/products/chatgpt-plus/support.png',
    ],
    price: { usd: 18.5, vnd: 459000 },
    categoryId: 'ai-tools',
    rating: 4.9,
    inventoryStatus: 'in-stock',
    deliveryType: localized('Instant email delivery', 'Giao qua email ngay'),
    variants: [
      {
        id: 'chatgpt-plus-month',
        name: localized('1 Month Access', '1 tháng sử dụng'),
        price: { usd: 18.5, vnd: 459000 },
        originalPrice: { usd: 22, vnd: 520000 },
        sku: 'CGPT-01',
        image: '/images/products/chatgpt-plus/main.png',
        stock: true,
        isDefault: true,
      },
      {
        id: 'chatgpt-plus-quarter',
        name: localized('3 Months Access', '3 tháng sử dụng'),
        price: { usd: 52, vnd: 1289000 },
        originalPrice: { usd: 60, vnd: 1499000 },
        sku: 'CGPT-03',
        image: '/images/products/chatgpt-plus/dashboard.png',
        stock: true,
      },
    ],
  },
  {
    id: 'canva-pro',
    slug: 'canva-pro-lifetime',
    name: localized('Canva Pro Lifetime', 'Canva Pro trọn đời'),
    description: localized(
      `Design faster with premium templates, brand kits, and AI tools. Includes unlimited background removals and team collaboration seats.`,
      `Thiết kế nhanh hơn với kho mẫu cao cấp, bộ nhận diện thương hiệu và công cụ AI. Bao gồm xóa phông không giới hạn và cộng tác nhóm.`
    ),
    image: '/images/products/canva-pro/main.png',
    images: ['/images/products/canva-pro/main.png', '/images/products/canva-pro/templates.png'],
    price: { usd: 32, vnd: 799000 },
    categoryId: 'design-tools',
    rating: 4.8,
    inventoryStatus: 'in-stock',
    deliveryType: localized(
      'Delivered via secure workspace invite',
      'Gửi lời mời workspace bảo mật'
    ),
    variants: [
      {
        id: 'canva-pro-solo',
        name: localized('1 Team Owner', '1 chủ sở hữu'),
        price: { usd: 32, vnd: 799000 },
        sku: 'CANVA-01',
        image: '/images/products/canva-pro/main.png',
        stock: true,
        isDefault: true,
      },
      {
        id: 'canva-pro-team',
        name: localized('Team (Up to 5)', 'Nhóm (tối đa 5)'),
        price: { usd: 55, vnd: 1299000 },
        sku: 'CANVA-TEAM',
        image: '/images/products/canva-pro/templates.png',
        stock: true,
      },
    ],
  },
  {
    id: 'netflix-uhd',
    slug: 'netflix-premium-uhd',
    name: localized('Netflix Premium 4K', 'Netflix Premium 4K'),
    description: localized(
      `Watch unlimited 4K HDR shows on up to 4 devices simultaneously. Auto-renewed profiles with private PIN and regional catalogue.`,
      `Xem phim 4K HDR không giới hạn trên tối đa 4 thiết bị cùng lúc. Hồ sơ riêng tư có mã PIN, nội dung theo khu vực.`
    ),
    image: '/images/products/netflix/main.png',
    images: ['/images/products/netflix/main.png', '/images/products/netflix/catalog.png'],
    price: { usd: 12.99, vnd: 329000 },
    categoryId: 'entertainment',
    rating: 4.7,
    inventoryStatus: 'low-stock',
    deliveryType: localized(
      'Shared slot with dedicated profile',
      'Chia sẻ tài khoản với hồ sơ riêng'
    ),
    variants: [
      {
        id: 'netflix-1m',
        name: localized('1 Month', '1 tháng'),
        price: { usd: 12.99, vnd: 329000 },
        sku: 'NFLX-1M',
        image: '/images/products/netflix/main.png',
        stock: true,
        isDefault: true,
      },
      {
        id: 'netflix-3m',
        name: localized('3 Months', '3 tháng'),
        price: { usd: 35, vnd: 899000 },
        sku: 'NFLX-3M',
        image: '/images/products/netflix/catalog.png',
        stock: false,
      },
    ],
  },
  {
    id: 'spotify-family',
    slug: 'spotify-premium-family',
    name: localized('Spotify Premium Family', 'Spotify Premium Family'),
    description: localized(
      `6 premium slots with personal playlists, AI DJ, and lossless beta access. Works on every region and supports offline downloads.`,
      `6 tài khoản Premium riêng biệt, playlist cá nhân, AI DJ và thử nghiệm lossless. Hoạt động mọi quốc gia và tải offline.`
    ),
    image: '/images/products/spotify/main.png',
    images: ['/images/products/spotify/main.png'],
    price: { usd: 14.5, vnd: 359000 },
    categoryId: 'entertainment',
    rating: 4.6,
    inventoryStatus: 'in-stock',
    deliveryType: localized('Invite sent to your mailbox', 'Gửi lời mời qua email'),
  },
  {
    id: 'figma-edu',
    slug: 'figma-edu-1y',
    name: localized('Figma Edu (1 Year)', 'Figma Edu (1 năm)'),
    description: localized(
      `Official education upgrade for personal or student accounts. Includes FigJam, Dev Mode, and unlimited projects.`,
      `Nâng cấp giáo dục chính chủ cho tài khoản cá nhân hoặc sinh viên. Bao gồm FigJam, Dev Mode và dự án không giới hạn.`
    ),
    image: '/images/products/figma/main.png',
    images: ['/images/products/figma/main.png'],
    price: { usd: 14, vnd: 349000 },
    categoryId: 'design-tools',
    rating: 4.95,
    inventoryStatus: 'in-stock',
    deliveryType: localized('Upgrade processed within 2 hours', 'Nâng cấp trong vòng 2 giờ'),
    variants: [
      {
        id: 'figma-1device',
        name: localized('1 Device', '1 thiết bị'),
        price: { usd: 4.5, vnd: 99000 },
        sku: 'FGM-1DEV',
        image: '/images/products/figma/main.png',
        stock: true,
        isDefault: true,
      },
      {
        id: 'figma-3device',
        name: localized('3 Devices', '3 thiết bị'),
        price: { usd: 11, vnd: 259000 },
        sku: 'FGM-3DEV',
        image: '/images/products/figma/main.png',
        stock: true,
      },
    ],
  },
  {
    id: 'm365-business',
    slug: 'microsoft-365-business',
    name: localized('Microsoft 365 Business', 'Microsoft 365 Business'),
    description: localized(
      `Full Office desktop apps, 1TB OneDrive, Exchange mailbox, and Defender security policies. Ideal for SMEs.`,
      `Bộ Office đầy đủ, OneDrive 1TB, hộp mail Exchange và chính sách bảo mật Defender. Phù hợp doanh nghiệp nhỏ.`
    ),
    image: '/images/products/m365/main.png',
    images: ['/images/products/m365/main.png'],
    price: { usd: 28, vnd: 699000 },
    categoryId: 'productivity',
    rating: 4.8,
    inventoryStatus: 'in-stock',
    deliveryType: localized(
      'Admin account with password reset',
      'Tài khoản quản trị kèm đổi mật khẩu'
    ),
  },
];

export const courses: Course[] = [
  {
    id: 'web-bootcamp',
    slug: 'fullstack-web-bootcamp',
    title: localized('Full-Stack Web Bootcamp', 'Bootcamp lập trình Full-Stack'),
    thumbnail: '/images/courses/web/main.png',
    images: ['/images/courses/web/main.png', '/images/courses/web/modules.png'],
    instructor: 'John Smith',
    price: { usd: 89, vnd: 2099000 },
    description: localized(
      `Master React, Next.js, databases, and deployment with hands-on projects and mentor feedback.

### Key Features:
- **Online Learning**: Learn anytime, anywhere with high-quality video lectures
- **Expert Instructors**: Taught by industry-leading experts and professionals
- **Real-world Projects**: Practice with real-world projects to reinforce your learning
- **Certificate of Completion**: Receive a certificate upon successful completion

### Why Choose This Course?

This comprehensive course is designed with a clear learning path, suitable for both beginners and experienced learners.

> *"Education is the best investment."*`,
      `Thành thạo React, Next.js, cơ sở dữ liệu và triển khai thực tế với dự án và mentor góp ý.

### Tính năng nổi bật:
- **Học trực tuyến**: Học mọi lúc mọi nơi với video bài giảng chất lượng cao
- **Giảng viên chuyên nghiệp**: Được giảng dạy bởi các chuyên gia hàng đầu trong lĩnh vực
- **Dự án thực tế**: Thực hành với các dự án thực tế để củng cố kiến thức
- **Chứng chỉ hoàn thành**: Nhận chứng chỉ sau khi hoàn thành khóa học

### Vì sao chọn khóa học này?

Khóa học được thiết kế bài bản với lộ trình học tập rõ ràng, phù hợp cho cả người mới bắt đầu và người đã có kinh nghiệm.

> *"Đầu tư cho giáo dục là đầu tư tốt nhất."*`
    ),
    lessons: 86,
    duration: localized('42 hours', '42 giờ'),
    rating: 4.8,
    status: 'Published',
    createdAt: '2024-01-15',
  },
  {
    id: 'ui-system',
    slug: 'ui-system-design',
    title: localized('UI System & Design Tokens', 'Hệ thống UI & Design Token'),
    thumbnail: '/images/courses/ui/main.png',
    images: ['/images/courses/ui/main.png'],
    instructor: 'Linh Nguyen',
    price: { usd: 64, vnd: 1599000 },
    description: localized(
      `Build scalable Figma libraries, motion guidelines, and ready-to-ship tokens for engineering.

### Key Features:
- **Online Learning**: Learn anytime, anywhere with high-quality video lectures
- **Expert Instructors**: Taught by industry-leading experts and professionals
- **Real-world Projects**: Practice with real-world projects to reinforce your learning
- **Certificate of Completion**: Receive a certificate upon successful completion

### Why Choose This Course?

This comprehensive course is designed with a clear learning path, suitable for both beginners and experienced learners.

> *"Education is the best investment."*`,
      `Xây thư viện Figma chuẩn hoá, hướng dẫn chuyển động và token sẵn sàng chuyển cho kỹ sư.

### Tính năng nổi bật:
- **Học trực tuyến**: Học mọi lúc mọi nơi với video bài giảng chất lượng cao
- **Giảng viên chuyên nghiệp**: Được giảng dạy bởi các chuyên gia hàng đầu trong lĩnh vực
- **Dự án thực tế**: Thực hành với các dự án thực tế để củng cố kiến thức
- **Chứng chỉ hoàn thành**: Nhận chứng chỉ sau khi hoàn thành khóa học

### Vì sao chọn khóa học này?

Khóa học được thiết kế bài bản với lộ trình học tập rõ ràng, phù hợp cho cả người mới bắt đầu và người đã có kinh nghiệm.

> *"Đầu tư cho giáo dục là đầu tư tốt nhất."*`
    ),
    lessons: 48,
    duration: localized('24 hours', '24 giờ'),
    rating: 4.7,
    status: 'Published',
    createdAt: '2024-02-01',
  },
  {
    id: 'ai-automation',
    slug: 'ai-automation-systems',
    title: localized('AI Automation Systems', 'Xây dựng hệ thống tự động hoá AI'),
    thumbnail: '/images/courses/ai/main.png',
    images: ['/images/courses/ai/main.png'],
    instructor: 'Sara Johnson',
    price: { usd: 120, vnd: 2899000 },
    description: localized(
      `Create GPT workflows, autonomous agents, and Zapier make scenarios for business ops.

### Key Features:
- **Online Learning**: Learn anytime, anywhere with high-quality video lectures
- **Expert Instructors**: Taught by industry-leading experts and professionals
- **Real-world Projects**: Practice with real-world projects to reinforce your learning
- **Certificate of Completion**: Receive a certificate upon successful completion

### Why Choose This Course?

This comprehensive course is designed with a clear learning path, suitable for both beginners and experienced learners.

> *"Education is the best investment."*`,
      `Xây quy trình GPT, agent tự động và kịch bản Zapier/Make cho vận hành doanh nghiệp.

### Tính năng nổi bật:
- **Học trực tuyến**: Học mọi lúc mọi nơi với video bài giảng chất lượng cao
- **Giảng viên chuyên nghiệp**: Được giảng dạy bởi các chuyên gia hàng đầu trong lĩnh vực
- **Dự án thực tế**: Thực hành với các dự án thực tế để củng cố kiến thức
- **Chứng chỉ hoàn thành**: Nhận chứng chỉ sau khi hoàn thành khóa học

### Vì sao chọn khóa học này?

Khóa học được thiết kế bài bản với lộ trình học tập rõ ràng, phù hợp cho cả người mới bắt đầu và người đã có kinh nghiệm.

> *"Đầu tư cho giáo dục là đầu tư tốt nhất."*`
    ),
    lessons: 62,
    duration: localized('31 hours', '31 giờ'),
    rating: 4.9,
    status: 'Draft',
    createdAt: '2024-02-10',
  },
];

export const comments: Comment[] = [
  {
    id: 'c1',
    itemId: 'chatgpt-plus',
    itemType: 'product',
    userId: 'u1',
    userName: 'Jane Smith',
    comment: localized(
      'Can I switch the login email later?',
      'Mình có thể đổi email đăng nhập sau này không?'
    ),
    createdAt: '2024-02-12',
    status: 'approved',
  },
  {
    id: 'c2',
    itemId: 'web-bootcamp',
    itemType: 'course',
    userId: 'u2',
    userName: 'Bao Tran',
    comment: localized(
      'Does the course include mentor reviews?',
      'Khóa học có mentor chấm bài không?'
    ),
    createdAt: '2024-02-18',
    status: 'approved',
  },
];

export const promotions: Promotion[] = [
  {
    id: 'promo-welcome',
    code: 'WELCOME20',
    name: localized('New Member Bonus', 'Ưu đãi thành viên mới'),
    description: localized(
      'Save 20% on your first software or course purchase.',
      'Giảm 20% cho đơn hàng tài khoản hoặc khóa học đầu tiên.'
    ),
    discountPercent: 20,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    usageLimit: 500,
    usedCount: 342,
  },
  {
    id: 'promo-edu',
    code: 'STUDENT15',
    name: localized('Student Week', 'Tuần lễ sinh viên'),
    description: localized(
      '15% off all education licenses.',
      'Giảm 15% cho mọi giấy phép giáo dục.'
    ),
    discountPercent: 15,
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    status: 'scheduled',
    usageLimit: 200,
    usedCount: 0,
  },
  {
    id: 'promo-bundle',
    code: 'BUNDLE30',
    name: localized('Bundle & Save', 'Mua gói tiết kiệm'),
    description: localized(
      '30% off when buying any 2 subscriptions together.',
      'Giảm 30% khi mua kèm 2 dịch vụ trở lên.'
    ),
    discountPercent: 30,
    startDate: '2023-11-01',
    endDate: '2023-12-31',
    status: 'expired',
    usageLimit: 100,
    usedCount: 100,
  },
];

export const orders: Order[] = [
  {
    id: 'ORD-1001',
    userId: 'u1',
    items: [
      {
        id: 'chatgpt-plus-month',
        name: localized('ChatGPT Plus Account', 'Tài khoản ChatGPT Plus'),
        type: 'product',
        price: { usd: 18.5, vnd: 459000 },
        quantity: 1,
        variant: localized('1 Month Access', '1 tháng'),
        credentials: 'user@example.com / ********',
      },
    ],
    total: { usd: 18.5, vnd: 459000 },
    status: 'completed',
    createdAt: '2024-02-10',
    deliveryEmail: 'jane@example.com',
  },
  {
    id: 'ORD-1002',
    userId: 'u2',
    items: [
      {
        id: 'canva-pro-solo',
        name: localized('Canva Pro Lifetime', 'Canva Pro trọn đời'),
        type: 'product',
        price: { usd: 32, vnd: 799000 },
        quantity: 1,
      },
      {
        id: 'web-bootcamp',
        name: localized('Full-Stack Web Bootcamp', 'Bootcamp lập trình Full-Stack'),
        type: 'course',
        price: { usd: 89, vnd: 2099000 },
        quantity: 1,
      },
    ],
    total: { usd: 121, vnd: 2898000 },
    status: 'pending',
    createdAt: '2024-02-12',
    deliveryEmail: 'bao@example.com',
  },
];

export const adminCourses: Course[] = courses.map((course) => ({ ...course }));

export const adminUsers: AdminUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-18',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'user',
    status: 'banned',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-22',
  },
];

export const reviews: Review[] = [
  {
    id: 'r1',
    itemId: 'chatgpt-plus',
    itemName: localized('ChatGPT Plus Account', 'Tài khoản ChatGPT Plus'),
    itemType: 'product',
    userId: 'u2',
    userName: 'Bao Tran',
    rating: 5,
    comment: localized(
      'Account arrived instantly and the support team solved my question in 5 minutes.',
      'Nhận tài khoản ngay lập tức và team hỗ trợ giải đáp trong 5 phút.'
    ),
    status: 'approved',
    createdAt: '2024-02-05',
  },
  {
    id: 'r2',
    itemId: 'canva-pro',
    itemName: localized('Canva Pro Lifetime', 'Canva Pro trọn đời'),
    itemType: 'product',
    userId: 'u3',
    userName: 'Hannah Lee',
    rating: 4,
    comment: localized(
      'Great value and all templates unlocked.',
      'Giá tốt và mở khoá mọi template.'
    ),
    status: 'approved',
    createdAt: '2024-02-04',
  },
  {
    id: 'r3',
    itemId: 'web-bootcamp',
    itemName: localized('Full-Stack Web Bootcamp', 'Bootcamp lập trình Full-Stack'),
    itemType: 'course',
    userId: 'u1',
    userName: 'Jane Smith',
    rating: 5,
    comment: localized(
      'Projects are realistic and mentor feedback is detailed.',
      'Dự án thực tế và mentor phản hồi rất chi tiết.'
    ),
    status: 'approved',
    createdAt: '2024-02-01',
  },
];
