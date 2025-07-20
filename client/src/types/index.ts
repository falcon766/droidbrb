// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  location?: string;
  expertise: Expertise;
  isVerified: boolean;
  isPremium: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum Expertise {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

// Robot Types
export interface Robot {
  id: string;
  name: string;
  description: string;
  category: RobotCategory;
  brand?: string;
  model?: string;
  year?: number;
  specifications?: RobotSpecifications;
  images: string[];
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  ownerId: string;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
}

export enum RobotCategory {
  DRONE = 'DRONE',
  HUMANOID = 'HUMANOID',
  INDUSTRIAL = 'INDUSTRIAL',
  EDUCATIONAL = 'EDUCATIONAL',
  SERVICE = 'SERVICE',
  RESEARCH = 'RESEARCH',
  HOBBY = 'HOBBY',
  OTHER = 'OTHER'
}

export interface RobotSpecifications {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  batteryLife?: number;
  maxPayload?: number;
  maxSpeed?: number;
  sensors?: string[];
  capabilities?: string[];
  software?: string[];
  [key: string]: any;
}

// Rental Types
export interface Rental {
  id: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  status: RentalStatus;
  notes?: string;
  robotId: string;
  robot: Robot;
  renterId: string;
  renter: User;
  ownerId: string;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
}

export enum RentalStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

// Message Types
export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  createdAt: Date;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  location?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityMember {
  id: string;
  role: MemberRole;
  joinedAt: Date;
  userId: string;
  user: User;
  communityId: string;
  community: Community;
}

export enum MemberRole {
  MEMBER = 'MEMBER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

// Post Types
export interface Post {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  authorId: string;
  author: User;
  communityId?: string;
  community?: Community;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  postId: string;
  post: Post;
  createdAt: Date;
  updatedAt: Date;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  latitude?: number;
  longitude?: number;
  maxAttendees?: number;
  isPublic: boolean;
  organizerId: string;
  organizer: User;
  communityId?: string;
  community?: Community;
  attendees: EventAttendee[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventAttendee {
  id: string;
  status: AttendanceStatus;
  userId: string;
  user: User;
  eventId: string;
  event: Event;
  createdAt: Date;
}

export enum AttendanceStatus {
  GOING = 'GOING',
  MAYBE = 'MAYBE',
  NOT_GOING = 'NOT_GOING'
}

// Review Types
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  reviewerId: string;
  reviewer: User;
  reviewedUserId: string;
  reviewedUser: User;
  robotId?: string;
  robot?: Robot;
  createdAt: Date;
  updatedAt: Date;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface RobotForm {
  name: string;
  description: string;
  category: RobotCategory;
  brand?: string;
  model?: string;
  year?: number;
  specifications?: RobotSpecifications;
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  location: string;
  latitude?: number;
  longitude?: number;
}

export interface ProfileForm {
  firstName: string;
  lastName: string;
  username: string;
  bio?: string;
  location?: string;
  expertise: Expertise;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and Filter Types
export interface RobotFilters {
  category?: RobotCategory;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  radius?: number;
  isAvailable?: boolean;
  rating?: number;
  expertise?: Expertise;
}

export interface SearchParams {
  query?: string;
  filters?: RobotFilters;
  sortBy?: 'price' | 'rating' | 'distance' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// UI Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface Modal {
  id: string;
  isOpen: boolean;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

// Map Types
export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}

// File Upload Types
export interface FileUpload {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'message' | 'rental' | 'review' | 'event' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  relatedId?: string;
  createdAt: Date;
} 