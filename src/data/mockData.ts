export interface Book {
  id: string
  title: string
  author: string
  topic: string
  description: string
  price: number
  coverImage?: string
  softCopyAvailable: boolean
  softCopyPdf?: string
  hardCopyPrice: number
  softCopyPrice: number
  totalPurchases: number
  hardCopyPurchases: number
  softCopyPurchases: number
  createdAt: string
}

export interface Discussion {
  id: string
  title: string
  professor: string
  topic: string
  description: string
  schedule: string
  startDate: string
  endDate: string
  maxStudents: number
  enrolledStudents: number
  price: number
  createdAt: string
}

export interface Order {
  id: string
  studentName: string
  studentEmail: string
  itemType: 'book' | 'discussion'
  itemName: string
  itemId: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  orderDate: string
}

export interface Payment {
  id: string
  studentName: string
  studentEmail: string
  itemType: 'book' | 'discussion'
  itemName: string
  itemId: string
  amount: number
  paymentMethod: string
  status: 'success' | 'pending' | 'failed'
  paymentDate: string
}

export interface Student {
  id: string
  name: string
  email: string
  enrolledAt: string
}

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Advanced Calculus',
    author: 'Dr. James Smith',
    topic: 'Mathematics',
    description: 'Comprehensive guide to advanced calculus concepts including limits, derivatives, and integrals.',
    price: 45.99,
    hardCopyPrice: 45.99,
    softCopyPrice: 29.99,
    softCopyAvailable: true,
    totalPurchases: 156,
    hardCopyPurchases: 98,
    softCopyPurchases: 58,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Organic Chemistry Fundamentals',
    author: 'Prof. Sarah Johnson',
    topic: 'Chemistry',
    description: 'Essential textbook covering organic chemistry principles and reactions.',
    price: 52.50,
    hardCopyPrice: 52.50,
    softCopyPrice: 34.99,
    softCopyAvailable: true,
    totalPurchases: 203,
    hardCopyPurchases: 145,
    softCopyPurchases: 58,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '3',
    title: 'Introduction to Quantum Physics',
    author: 'Dr. Michael Chen',
    topic: 'Physics',
    description: 'An accessible introduction to quantum mechanics for undergraduate students.',
    price: 48.75,
    hardCopyPrice: 48.75,
    softCopyPrice: 0,
    softCopyAvailable: false,
    totalPurchases: 89,
    hardCopyPurchases: 89,
    softCopyPurchases: 0,
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '4',
    title: 'Data Structures and Algorithms',
    author: 'Dr. Emily Rodriguez',
    topic: 'Computer Science',
    description: 'Complete guide to data structures and algorithmic problem-solving techniques.',
    price: 55.00,
    hardCopyPrice: 55.00,
    softCopyPrice: 39.99,
    softCopyAvailable: true,
    totalPurchases: 312,
    hardCopyPurchases: 187,
    softCopyPurchases: 125,
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '5',
    title: 'World History: Ancient Civilizations',
    author: 'Prof. David Williams',
    topic: 'History',
    description: 'Exploring ancient civilizations from Mesopotamia to the Roman Empire.',
    price: 42.25,
    hardCopyPrice: 42.25,
    softCopyPrice: 0,
    softCopyAvailable: false,
    totalPurchases: 67,
    hardCopyPurchases: 67,
    softCopyPurchases: 0,
    createdAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '6',
    title: 'Molecular Biology',
    author: 'Dr. Lisa Anderson',
    topic: 'Biology',
    description: 'In-depth study of molecular biology principles and techniques.',
    price: 58.99,
    hardCopyPrice: 58.99,
    softCopyPrice: 42.99,
    softCopyAvailable: true,
    totalPurchases: 178,
    hardCopyPurchases: 112,
    softCopyPurchases: 66,
    createdAt: '2024-02-20T10:00:00Z',
  },
]

export const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Calculus Problem Solving Workshop',
    professor: 'Dr. James Smith',
    topic: 'Mathematics',
    description: 'Interactive workshop focusing on solving complex calculus problems with step-by-step guidance.',
    schedule: 'Monday, Wednesday, Friday 10:00 AM - 11:30 AM',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    maxStudents: 30,
    enrolledStudents: 24,
    price: 199.99,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Organic Chemistry Lab Techniques',
    professor: 'Prof. Sarah Johnson',
    topic: 'Chemistry',
    description: 'Hands-on lab sessions covering essential organic chemistry techniques and safety protocols.',
    schedule: 'Tuesday, Thursday 2:00 PM - 4:00 PM',
    startDate: '2024-03-05',
    endDate: '2024-06-05',
    maxStudents: 20,
    enrolledStudents: 18,
    price: 249.99,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '3',
    title: 'Quantum Mechanics Study Group',
    professor: 'Dr. Michael Chen',
    topic: 'Physics',
    description: 'Weekly study sessions for quantum mechanics course with problem-solving and concept review.',
    schedule: 'Wednesday 3:00 PM - 5:00 PM',
    startDate: '2024-03-06',
    endDate: '2024-05-29',
    maxStudents: 25,
    enrolledStudents: 22,
    price: 179.99,
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '4',
    title: 'Algorithm Design Masterclass',
    professor: 'Dr. Emily Rodriguez',
    topic: 'Computer Science',
    description: 'Advanced course on algorithm design patterns and optimization techniques.',
    schedule: 'Monday, Wednesday 1:00 PM - 2:30 PM',
    startDate: '2024-03-04',
    endDate: '2024-05-27',
    maxStudents: 35,
    enrolledStudents: 32,
    price: 299.99,
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '5',
    title: 'Ancient History Discussion Circle',
    professor: 'Prof. David Williams',
    topic: 'History',
    description: 'Engaging discussions about ancient civilizations, their cultures, and historical significance.',
    schedule: 'Thursday 4:00 PM - 5:30 PM',
    startDate: '2024-03-07',
    endDate: '2024-05-30',
    maxStudents: 15,
    enrolledStudents: 12,
    price: 149.99,
    createdAt: '2024-02-15T10:00:00Z',
  },
]

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    studentName: 'John Doe',
    studentEmail: 'john.doe@university.edu',
    itemType: 'book',
    itemName: 'Advanced Calculus',
    itemId: '1',
    amount: 45.99,
    status: 'completed',
    orderDate: '2024-03-01T09:15:00Z',
  },
  {
    id: 'ORD-002',
    studentName: 'Jane Smith',
    studentEmail: 'jane.smith@university.edu',
    itemType: 'discussion',
    itemName: 'Calculus Problem Solving Workshop',
    itemId: '1',
    amount: 199.99,
    status: 'completed',
    orderDate: '2024-03-02T11:30:00Z',
  },
  {
    id: 'ORD-003',
    studentName: 'Mike Johnson',
    studentEmail: 'mike.johnson@university.edu',
    itemType: 'book',
    itemName: 'Organic Chemistry Fundamentals',
    itemId: '2',
    amount: 52.50,
    status: 'pending',
    orderDate: '2024-03-03T14:20:00Z',
  },
  {
    id: 'ORD-004',
    studentName: 'Sarah Williams',
    studentEmail: 'sarah.williams@university.edu',
    itemType: 'discussion',
    itemName: 'Organic Chemistry Lab Techniques',
    itemId: '2',
    amount: 249.99,
    status: 'completed',
    orderDate: '2024-03-04T10:45:00Z',
  },
  {
    id: 'ORD-005',
    studentName: 'David Brown',
    studentEmail: 'david.brown@university.edu',
    itemType: 'book',
    itemName: 'Introduction to Quantum Physics',
    itemId: '3',
    amount: 48.75,
    status: 'completed',
    orderDate: '2024-03-05T08:30:00Z',
  },
  {
    id: 'ORD-006',
    studentName: 'Emily Davis',
    studentEmail: 'emily.davis@university.edu',
    itemType: 'book',
    itemName: 'Data Structures and Algorithms',
    itemId: '4',
    amount: 55.00,
    status: 'cancelled',
    orderDate: '2024-03-06T13:15:00Z',
  },
  {
    id: 'ORD-007',
    studentName: 'Chris Wilson',
    studentEmail: 'chris.wilson@university.edu',
    itemType: 'discussion',
    itemName: 'Quantum Mechanics Study Group',
    itemId: '3',
    amount: 179.99,
    status: 'completed',
    orderDate: '2024-03-07T15:00:00Z',
  },
  {
    id: 'ORD-008',
    studentName: 'Amanda Taylor',
    studentEmail: 'amanda.taylor@university.edu',
    itemType: 'book',
    itemName: 'World History: Ancient Civilizations',
    itemId: '5',
    amount: 42.25,
    status: 'pending',
    orderDate: '2024-03-08T09:45:00Z',
  },
]

export const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    studentName: 'John Doe',
    studentEmail: 'john.doe@university.edu',
    itemType: 'book',
    itemName: 'Advanced Calculus',
    itemId: '1',
    amount: 45.99,
    paymentMethod: 'Credit Card',
    status: 'success',
    paymentDate: '2024-03-01T09:20:00Z',
  },
  {
    id: 'PAY-002',
    studentName: 'Jane Smith',
    studentEmail: 'jane.smith@university.edu',
    itemType: 'discussion',
    itemName: 'Calculus Problem Solving Workshop',
    itemId: '1',
    amount: 199.99,
    paymentMethod: 'PayPal',
    status: 'success',
    paymentDate: '2024-03-02T11:35:00Z',
  },
  {
    id: 'PAY-003',
    studentName: 'Mike Johnson',
    studentEmail: 'mike.johnson@university.edu',
    itemType: 'book',
    itemName: 'Organic Chemistry Fundamentals',
    itemId: '2',
    amount: 52.50,
    paymentMethod: 'Credit Card',
    status: 'pending',
    paymentDate: '2024-03-03T14:25:00Z',
  },
  {
    id: 'PAY-004',
    studentName: 'Sarah Williams',
    studentEmail: 'sarah.williams@university.edu',
    itemType: 'discussion',
    itemName: 'Organic Chemistry Lab Techniques',
    itemId: '2',
    amount: 249.99,
    paymentMethod: 'Bank Transfer',
    status: 'success',
    paymentDate: '2024-03-04T10:50:00Z',
  },
  {
    id: 'PAY-005',
    studentName: 'David Brown',
    studentEmail: 'david.brown@university.edu',
    itemType: 'book',
    itemName: 'Introduction to Quantum Physics',
    itemId: '3',
    amount: 48.75,
    paymentMethod: 'Credit Card',
    status: 'success',
    paymentDate: '2024-03-05T08:35:00Z',
  },
  {
    id: 'PAY-006',
    studentName: 'Emily Davis',
    studentEmail: 'emily.davis@university.edu',
    itemType: 'book',
    itemName: 'Data Structures and Algorithms',
    itemId: '4',
    amount: 55.00,
    paymentMethod: 'Credit Card',
    status: 'failed',
    paymentDate: '2024-03-06T13:20:00Z',
  },
  {
    id: 'PAY-007',
    studentName: 'Chris Wilson',
    studentEmail: 'chris.wilson@university.edu',
    itemType: 'discussion',
    itemName: 'Quantum Mechanics Study Group',
    itemId: '3',
    amount: 179.99,
    paymentMethod: 'PayPal',
    status: 'success',
    paymentDate: '2024-03-07T15:05:00Z',
  },
  {
    id: 'PAY-008',
    studentName: 'Amanda Taylor',
    studentEmail: 'amanda.taylor@university.edu',
    itemType: 'book',
    itemName: 'World History: Ancient Civilizations',
    itemId: '5',
    amount: 42.25,
    paymentMethod: 'Credit Card',
    status: 'pending',
    paymentDate: '2024-03-08T09:50:00Z',
  },
  {
    id: 'PAY-009',
    studentName: 'Robert Martinez',
    studentEmail: 'robert.martinez@university.edu',
    itemType: 'discussion',
    itemName: 'Algorithm Design Masterclass',
    itemId: '4',
    amount: 299.99,
    paymentMethod: 'Credit Card',
    status: 'success',
    paymentDate: '2024-03-09T12:00:00Z',
  },
  {
    id: 'PAY-010',
    studentName: 'Lisa Anderson',
    studentEmail: 'lisa.anderson@university.edu',
    itemType: 'book',
    itemName: 'Molecular Biology',
    itemId: '6',
    amount: 58.99,
    paymentMethod: 'PayPal',
    status: 'success',
    paymentDate: '2024-03-10T16:30:00Z',
  },
]

export const mockStudents: Student[] = [
  {
    id: 'STU-001',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    enrolledAt: '2024-03-02T11:35:00Z',
  },
  {
    id: 'STU-002',
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    enrolledAt: '2024-03-02T11:40:00Z',
  },
  {
    id: 'STU-003',
    name: 'Mike Johnson',
    email: 'mike.johnson@university.edu',
    enrolledAt: '2024-03-03T10:15:00Z',
  },
  {
    id: 'STU-004',
    name: 'Sarah Williams',
    email: 'sarah.williams@university.edu',
    enrolledAt: '2024-03-04T09:20:00Z',
  },
  {
    id: 'STU-005',
    name: 'David Brown',
    email: 'david.brown@university.edu',
    enrolledAt: '2024-03-05T14:30:00Z',
  },
  {
    id: 'STU-006',
    name: 'Emily Davis',
    email: 'emily.davis@university.edu',
    enrolledAt: '2024-03-06T11:00:00Z',
  },
  {
    id: 'STU-007',
    name: 'Chris Wilson',
    email: 'chris.wilson@university.edu',
    enrolledAt: '2024-03-07T15:10:00Z',
  },
  {
    id: 'STU-008',
    name: 'Amanda Taylor',
    email: 'amanda.taylor@university.edu',
    enrolledAt: '2024-03-08T10:45:00Z',
  },
  {
    id: 'STU-009',
    name: 'Robert Martinez',
    email: 'robert.martinez@university.edu',
    enrolledAt: '2024-03-09T12:15:00Z',
  },
  {
    id: 'STU-010',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@university.edu',
    enrolledAt: '2024-03-10T16:35:00Z',
  },
  {
    id: 'STU-011',
    name: 'Michael Thompson',
    email: 'michael.thompson@university.edu',
    enrolledAt: '2024-03-11T08:20:00Z',
  },
  {
    id: 'STU-012',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@university.edu',
    enrolledAt: '2024-03-12T13:50:00Z',
  },
]

export interface Topic {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface Professor {
  id: string
  name: string
  email: string
  department: string
  specialization: string
  phone?: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface PaymentMethod {
  id: string
  name: string
  type: 'credit_card' | 'paypal' | 'bank_transfer' | 'other'
  isActive: boolean
  configuration?: Record<string, any>
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'moderator' | 'viewer'
  isActive: boolean
  createdAt: string
}

export const mockTopics: Topic[] = [
  {
    id: 'TOP-001',
    name: 'Mathematics',
    description: 'All mathematics-related courses and materials',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'TOP-002',
    name: 'Physics',
    description: 'Physics courses covering classical and modern physics',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'TOP-003',
    name: 'Chemistry',
    description: 'Chemistry courses including organic and inorganic chemistry',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'TOP-004',
    name: 'Computer Science',
    description: 'Computer science and programming courses',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'TOP-005',
    name: 'History',
    description: 'Historical studies and analysis',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'TOP-006',
    name: 'Biology',
    description: 'Biological sciences and life sciences',
    createdAt: '2024-01-01T10:00:00Z',
  },
]

export const mockProfessors: Professor[] = [
  {
    id: 'PROF-001',
    name: 'Dr. James Smith',
    email: 'james.smith@university.edu',
    department: 'Mathematics',
    specialization: 'Calculus and Advanced Mathematics',
    phone: '+1-555-0101',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'PROF-002',
    name: 'Prof. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    department: 'Chemistry',
    specialization: 'Organic Chemistry',
    phone: '+1-555-0102',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'PROF-003',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@university.edu',
    department: 'Physics',
    specialization: 'Quantum Physics',
    phone: '+1-555-0103',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'PROF-004',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    department: 'Computer Science',
    specialization: 'Algorithms and Data Structures',
    phone: '+1-555-0104',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'PROF-005',
    name: 'Prof. David Williams',
    email: 'david.williams@university.edu',
    department: 'History',
    specialization: 'Ancient History',
    phone: '+1-555-0105',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'PROF-006',
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@university.edu',
    department: 'Biology',
    specialization: 'Molecular Biology',
    phone: '+1-555-0106',
    createdAt: '2024-01-01T10:00:00Z',
  },
]

export const mockCategories: Category[] = [
  {
    id: 'CAT-001',
    name: 'Textbooks',
    description: 'Academic textbooks and course materials',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'CAT-002',
    name: 'Reference Books',
    description: 'Reference materials and study guides',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'CAT-003',
    name: 'Workshops',
    description: 'Interactive workshops and study groups',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'CAT-004',
    name: 'Online Courses',
    description: 'Digital courses and e-learning materials',
    createdAt: '2024-01-01T10:00:00Z',
  },
]

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'PAY-METH-001',
    name: 'Credit Card',
    type: 'credit_card',
    isActive: true,
    configuration: {
      processor: 'Stripe',
      apiKey: 'sk_live_***',
    },
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'PAY-METH-002',
    name: 'PayPal',
    type: 'paypal',
    isActive: true,
    configuration: {
      clientId: 'paypal_client_***',
      mode: 'live',
    },
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'PAY-METH-003',
    name: 'Bank Transfer',
    type: 'bank_transfer',
    isActive: true,
    configuration: {
      accountNumber: '****1234',
      bankName: 'First National Bank',
    },
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'PAY-METH-004',
    name: 'Mobile Money',
    type: 'other',
    isActive: false,
    configuration: {
      provider: 'M-Pesa',
    },
    createdAt: '2024-01-01T10:00:00Z',
  },
]

export const mockUsers: User[] = [
  {
    id: 'USER-001',
    name: 'Admin User',
    email: 'admin@pangolin.edu',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'USER-002',
    name: 'Moderator One',
    email: 'moderator1@pangolin.edu',
    role: 'moderator',
    isActive: true,
    createdAt: '2024-01-02T10:00:00Z',
  },
  {
    id: 'USER-003',
    name: 'Moderator Two',
    email: 'moderator2@pangolin.edu',
    role: 'moderator',
    isActive: true,
    createdAt: '2024-01-03T10:00:00Z',
  },
  {
    id: 'USER-004',
    name: 'Viewer One',
    email: 'viewer1@pangolin.edu',
    role: 'viewer',
    isActive: true,
    createdAt: '2024-01-04T10:00:00Z',
  },
  {
    id: 'USER-005',
    name: 'Viewer Two',
    email: 'viewer2@pangolin.edu',
    role: 'viewer',
    isActive: false,
    createdAt: '2024-01-05T10:00:00Z',
  },
]

