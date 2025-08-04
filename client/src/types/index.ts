// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  location: string;
  latitude?: number;
  longitude?: number;
  zipcode?: string;
  address?: string;
  expertise: Expertise;
  isVerified: boolean;
  isPremium: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum Expertise {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface Robot {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  zipcode?: string;
  address?: string;
  minRental: number;
  maxRental: number;
  pickupTime: string;
  returnTime: string;
  features: string[];
  specifications: {
    weight: string;
    dimensions: string;
    batteryLife: string;
    connectivity: string;
  };
  images: string[];
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  totalRentals: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: string;
  robotId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Rental {
  id: string;
  robotId: string;
  robotName: string;
  ownerId: string;
  renterId: string;
  renterName: string;
  startDate: Date;
  endDate: Date;
  total: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Message Types
export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  receiverEmail?: string;
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

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ProfileForm {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  expertise: Expertise;
}

export interface CreateRobotForm {
  name: string;
  category: string;
  description: string;
  price: number;
  location: string;
  minRental: number;
  maxRental: number;
  pickupTime: string;
  returnTime: string;
  features: string[];
  specifications: {
    weight: string;
    dimensions: string;
    batteryLife: string;
    connectivity: string;
  };
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
  category?: string;
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