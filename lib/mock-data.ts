export interface ProductVariant {
  id: string
  name: string
  price: number
  originalPrice?: number
  sku: string
  image: string
  stock: boolean
  isDefault?: boolean
}

export interface Product {
  id: string
  slug: string // Added slug field for routing
  name: string
  image: string
  images?: string[]
  price: number
  category: string
  rating: number
  description: string
  stock: string
  deliveryType: string
  variants?: ProductVariant[]
}

export interface Course {
  id: string
  slug: string // Added slug field for routing
  title: string
  thumbnail: string
  images?: string[] // Added images array for multiple images
  instructor: string
  price: number
  description: string
  lessons: number
  duration: string
  rating: number
}

export interface Comment {
  id: string
  itemId: string
  itemType: "product" | "course"
  userId: string
  userName: string
  userAvatar?: string
  comment: string
  createdAt: string
  status: "approved" | "pending" | "hidden"
}

export interface Promotion {
  id: string
  code: string
  description: string
  discountPercent: number
  startDate: string
  endDate: string
  status: "active" | "expired" | "scheduled"
  usageLimit?: number
  usedCount: number
}

export interface Order {
  id: string
  userId: string
  items: {
    id: string
    name: string
    type: "product" | "course"
    price: number
    variant?: string
    credentials?: string
  }[]
  total: number
  status: "completed" | "pending" | "cancelled"
  createdAt: string
  deliveryEmail?: string
}

export interface AdminCourse {
  id: string
  title: string
  instructor: string
  price: number
  status: "Published" | "Draft"
  createdAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  status: "active" | "banned"
  createdAt: string
}

export interface Review {
  id: string
  itemId: string
  itemName: string
  itemType: "product" | "course"
  userId: string
  userName: string
  rating: number
  comment: string
  status: "approved" | "pending" | "hidden"
  createdAt: string
}

export const products: Product[] = [
  {
    id: "1",
    slug: "chatgpt-plus-account", // Added slug
    name: "ChatGPT Plus Account",
    image: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    price: 15.99,
    category: "AI Tools",
    rating: 4.8,
    description: `## Premium ChatGPT Plus Account

Get full access to **ChatGPT Plus** with GPT-4 and advanced features.

### Features:
- **GPT-4 Access**: Use the most advanced AI model
- **Priority Access**: Skip the queue during peak times
- **Faster Response**: Lightning-fast responses
- **Advanced Features**: Plugins, browsing, and more

> *"The best AI assistant for professionals"*`,
    stock: "In Stock",
    deliveryType: "Auto Delivery",
    variants: [
      {
        id: "chatgpt-1m",
        name: "1 Month",
        price: 15.99,
        originalPrice: 20,
        sku: "CHATGPT-1M",
        image: "/placeholder.svg?height=300&width=300",
        stock: true,
        isDefault: true,
      },
      {
        id: "chatgpt-3m",
        name: "3 Months",
        price: 42.99,
        originalPrice: 60,
        sku: "CHATGPT-3M",
        image: "/placeholder.svg?height=300&width=300",
        stock: true,
      },
      {
        id: "chatgpt-1y",
        name: "1 Year",
        price: 149.99,
        originalPrice: 240,
        sku: "CHATGPT-1Y",
        image: "/placeholder.svg?height=300&width=300",
        stock: true,
      },
    ],
  },
  {
    id: "2",
    slug: "canva-pro-account", // Added slug
    name: "Canva Pro Account",
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    price: 12.99,
    category: "Design Tools",
    rating: 4.9,
    description: `## Canva Pro Account

Access to Canva Pro with unlimited templates, photos, and premium features.

### Included:
- Premium templates
- Unlimited photos & graphics
- Brand Kit
- Background remover`,
    stock: "In Stock",
    deliveryType: "Auto Delivery",
  },
  {
    id: "3",
    slug: "netflix-premium-4k", // Added slug
    name: "Netflix Premium 4K",
    image: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    price: 9.99,
    category: "Entertainment",
    rating: 4.7,
    description: `## Netflix Premium 4K

Netflix Premium plan with 4K streaming and 4 simultaneous screens.

### Features:
- 4K Ultra HD
- 4 screens at once
- Download on 4 devices`,
    stock: "In Stock",
    deliveryType: "Manual Delivery",
  },
  {
    id: "4",
    slug: "figma-edu-1y", // Added slug
    name: "Figma Edu",
    image: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    price: 349000,
    category: "Design Tools",
    rating: 4.9,
    description: `### Official Figma Education License
    
**Fully licensed educational account** with complete access to Figma's professional design tools.

- Premium features unlocked
- Unlimited projects and files
- Advanced prototyping tools
- Team collaboration features
- Cloud storage included`,
    stock: "In Stock",
    deliveryType: "Auto Delivery",
    variants: [
      {
        id: "figma-1y",
        name: "1 Year",
        price: 349000,
        originalPrice: 800000,
        sku: "FIGMA-EDU-1Y",
        image: "/placeholder.svg?height=300&width=300",
        stock: true,
        isDefault: true,
      },
      {
        id: "figma-1m-1d",
        name: "1 Month - 1 Device",
        price: 90000,
        sku: "FIGMA-EDU-1M-1D",
        image: "/placeholder.svg?height=300&width=300",
        stock: true,
      },
      {
        id: "figma-7d-3d",
        name: "7 Days - 3 Devices",
        price: 45000,
        sku: "FIGMA-EDU-7D-3D",
        image: "/placeholder.svg?height=300&width=300",
        stock: false,
      },
    ],
  },
  {
    id: "5",
    slug: "spotify-premium", // Added slug
    name: "Spotify Premium",
    image: "/placeholder.svg?height=300&width=300",
    price: 6.99,
    category: "Entertainment",
    rating: 4.8,
    description: `## Spotify Premium

Ad-free music streaming with offline downloads and premium audio quality.`,
    stock: "In Stock",
    deliveryType: "Auto Delivery",
  },
  {
    id: "6",
    slug: "adobe-creative-cloud", // Added slug
    name: "Adobe Creative Cloud",
    image: "/placeholder.svg?height=300&width=300",
    price: 24.99,
    category: "Design Tools",
    rating: 4.9,
    description: `## Adobe Creative Cloud

Full access to Adobe Creative Cloud suite including Photoshop, Illustrator, and more.`,
    stock: "Low Stock",
    deliveryType: "Manual Delivery",
  },
]

export const courses: Course[] = [
  {
    id: "1",
    slug: "complete-web-development-bootcamp", // Added slug
    title: "Complete Web Development Bootcamp",
    thumbnail: "/placeholder.svg?height=300&width=400",
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    instructor: "John Smith",
    price: 49.99,
    description: "Learn full-stack web development from scratch with hands-on projects.",
    lessons: 45,
    duration: "20 hours",
    rating: 4.9,
  },
  {
    id: "2",
    slug: "ai-machine-learning-masterclass", // Added slug
    title: "AI & Machine Learning Masterclass",
    thumbnail: "/placeholder.svg?height=300&width=400",
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    instructor: "Sarah Johnson",
    price: 69.99,
    description: "Master AI and machine learning with Python and real-world applications.",
    lessons: 60,
    duration: "30 hours",
    rating: 4.8,
  },
  {
    id: "3",
    slug: "digital-marketing-strategy", // Added slug
    title: "Digital Marketing Strategy",
    thumbnail: "/placeholder.svg?height=300&width=400",
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    instructor: "Mike Chen",
    price: 39.99,
    description: "Learn effective digital marketing strategies to grow your business.",
    lessons: 35,
    duration: "15 hours",
    rating: 4.7,
  },
  {
    id: "4",
    slug: "ui-ux-design-fundamentals", // Added slug
    title: "UI/UX Design Fundamentals",
    thumbnail: "/placeholder.svg?height=300&width=400",
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    instructor: "Emily Davis",
    price: 44.99,
    description: "Create stunning user interfaces and experiences with modern design principles.",
    lessons: 40,
    duration: "18 hours",
    rating: 4.8,
  },
]

export const comments: Comment[] = [
  {
    id: "1",
    itemId: "1",
    itemType: "product",
    userId: "2",
    userName: "Jane Smith",
    comment: "Does this account support multiple devices?",
    createdAt: "2024-02-21",
    status: "approved",
  },
  {
    id: "2",
    itemId: "1",
    itemType: "product",
    userId: "3",
    userName: "Bob Johnson",
    comment: "How long does delivery usually take?",
    createdAt: "2024-02-20",
    status: "approved",
  },
  {
    id: "3",
    itemId: "1",
    itemType: "course",
    userId: "5",
    userName: "Charlie Brown",
    comment: "Is this course suitable for complete beginners?",
    createdAt: "2024-02-19",
    status: "approved",
  },
]

export const promotions: Promotion[] = [
  {
    id: "1",
    code: "WELCOME20",
    description: "20% off your first purchase",
    discountPercent: 20,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
    usageLimit: 1000,
    usedCount: 245,
  },
  {
    id: "2",
    code: "SPRING25",
    description: "Spring Sale - 25% off all courses",
    discountPercent: 25,
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    status: "active",
    usageLimit: 500,
    usedCount: 89,
  },
  {
    id: "3",
    code: "CYBER50",
    description: "Cyber Monday - 50% off everything",
    discountPercent: 50,
    startDate: "2023-11-27",
    endDate: "2023-11-28",
    status: "expired",
    usageLimit: 2000,
    usedCount: 1847,
  },
]

export const orders: Order[] = [
  {
    id: "1",
    userId: "2",
    items: [
      {
        id: "1",
        name: "ChatGPT Plus Account",
        type: "product",
        price: 15.99,
        variant: "1 Month",
        credentials: "email: user@example.com | password: ********",
      },
    ],
    total: 15.99,
    status: "completed",
    createdAt: "2024-02-20",
    deliveryEmail: "user@example.com",
  },
  {
    id: "2",
    userId: "2",
    items: [
      {
        id: "1",
        name: "Complete Web Development Bootcamp",
        type: "course",
        price: 49.99,
      },
    ],
    total: 49.99,
    status: "completed",
    createdAt: "2024-02-15",
  },
]

export const adminCourses: AdminCourse[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    instructor: "John Smith",
    price: 49.99,
    status: "Published",
    createdAt: "2023-12-01",
  },
  {
    id: "2",
    title: "AI & Machine Learning Masterclass",
    instructor: "Sarah Johnson",
    price: 69.99,
    status: "Published",
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    title: "Digital Marketing Strategy",
    instructor: "Mike Chen",
    price: 39.99,
    status: "Published",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    title: "UI/UX Design Fundamentals",
    instructor: "Emily Davis",
    price: 44.99,
    status: "Draft",
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    title: "Python Programming for Beginners",
    instructor: "David Lee",
    price: 34.99,
    status: "Published",
    createdAt: "2024-01-20",
  },
]

export const adminUsers: AdminUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    createdAt: "2023-12-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "user",
    status: "banned",
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "6",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-25",
  },
  {
    id: "7",
    name: "Ethan Hunt",
    email: "ethan.hunt@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "8",
    name: "Fiona Gallagher",
    email: "fiona.gallagher@example.com",
    role: "user",
    status: "banned",
    createdAt: "2024-02-05",
  },
]

export const reviews: Review[] = [
  {
    id: "1",
    itemId: "1",
    itemName: "ChatGPT Plus Account",
    itemType: "product",
    userId: "2",
    userName: "Jane Smith",
    rating: 5,
    comment: "Excellent service! The account was delivered instantly and works perfectly. Highly recommended!",
    status: "approved",
    createdAt: "2024-02-20",
  },
  {
    id: "2",
    itemId: "1",
    itemName: "ChatGPT Plus Account",
    itemType: "product",
    userId: "3",
    userName: "Bob Johnson",
    rating: 4,
    comment: "Good quality account. Fast delivery and responsive support.",
    status: "approved",
    createdAt: "2024-02-18",
  },
  {
    id: "3",
    itemId: "2",
    itemName: "Canva Pro Account",
    itemType: "product",
    userId: "5",
    userName: "Charlie Brown",
    rating: 5,
    comment: "Amazing! All premium features work flawlessly. Great value for money.",
    status: "approved",
    createdAt: "2024-02-15",
  },
  {
    id: "4",
    itemId: "3",
    itemName: "Netflix Premium 4K",
    itemType: "product",
    userId: "7",
    userName: "Ethan Hunt",
    rating: 3,
    comment: "Account works but delivery took longer than expected.",
    status: "pending",
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    itemId: "1",
    itemName: "Complete Web Development Bootcamp",
    itemType: "course",
    userId: "2",
    userName: "Jane Smith",
    rating: 5,
    comment:
      "This course is absolutely fantastic! John Smith is an excellent instructor who explains everything clearly.",
    status: "approved",
    createdAt: "2024-02-08",
  },
  {
    id: "6",
    itemId: "1",
    itemName: "Complete Web Development Bootcamp",
    itemType: "course",
    userId: "5",
    userName: "Charlie Brown",
    rating: 4,
    comment: "Great content and well-structured lessons. Learned a lot!",
    status: "approved",
    createdAt: "2024-02-05",
  },
  {
    id: "7",
    itemId: "2",
    itemName: "AI & Machine Learning Masterclass",
    itemType: "course",
    userId: "3",
    userName: "Bob Johnson",
    rating: 5,
    comment: "Sarah Johnson is an amazing teacher. Complex topics explained in simple terms.",
    status: "approved",
    createdAt: "2024-02-01",
  },
  {
    id: "8",
    itemId: "4",
    itemName: "Adobe Creative Cloud",
    itemType: "product",
    userId: "8",
    userName: "Fiona Gallagher",
    rating: 2,
    comment: "Not satisfied with the service.",
    status: "hidden",
    createdAt: "2024-01-28",
  },
]

export const categories = ["All", "AI Tools", "Design Tools", "Entertainment", "Cloud Storage", "Productivity"]
