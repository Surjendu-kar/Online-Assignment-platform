# Dynamic Components Documentation

## Overview

This document outlines all the approaches and data points that need to be made dynamic in our online assignment platform components.

## Current Static Components & Dynamic Requirements

### 1. Sidebar Navigation (RadixSidebarDemo.tsx)

#### Institution Switcher

**Current**: Static institutions array
**Dynamic Requirements**:

- Fetch user's accessible institutions from API
- Filter based on user permissions
- Real-time updates when access changes

```typescript
// Current Static Data
institutions: [
  { name: "Stanford University", logo: GalleryVerticalEnd, type: "Computer Science Department" },
  { name: "MIT", logo: AudioWaveform, type: "Engineering School" },
  { name: "CA Institute", logo: Command, type: "Professional Certification" }
]

// Dynamic Data Source
- API: GET /api/user/institutions
- Context: User permissions & affiliations
```

#### User Role-Based Navigation

**Current**: Static Admin navigation
**Dynamic Requirements**:

- Navigation based on user.role (Admin/Teacher/Student)
- Permission-based menu items
- Real-time role updates

```typescript
// Role-Based Navigation Structure
Admin: Management, Analytics, Communications, Settings
Teacher: Assignments, Students, Analytics, Settings
Student: Exams, Results, Profile

// Dynamic Data Source
- Context: User role from authentication
- API: GET /api/user/permissions
```

#### User Information

**Current**: Static user data
**Dynamic Requirements**:

- Real user profile from authentication
- Dynamic avatar, name, email, role
- Live status updates

```typescript
// Current Static Data
user: {
  name: "John Smith",
  email: "john.smith@university.edu",
  role: "Admin",
  avatar: "static-url"
}

// Dynamic Data Source
- Context: Authentication user object
- API: GET /api/user/profile
```

#### Recent Items

**Current**: Static recent assignments
**Dynamic Requirements**:

- User-specific recent activities
- Real-time updates
- Role-based content

```typescript
// Dynamic Data Sources
- API: GET /api/user/recent-assignments
- API: GET /api/user/pending-invitations
- WebSocket: Real-time updates
```

## Implementation Approaches

### 1. Role-Based Rendering (Recommended)

**Performance**: Fastest - Immediate rendering
**Implementation**: Conditional rendering based on user.role
**Pros**: Simple, fast, no additional API calls
**Cons**: Requires role in user context

```typescript
const getNavigationByRole = (role: string) => {
  switch (role) {
    case "Admin":
      return adminNavigation;
    case "Teacher":
      return teacherNavigation;
    case "Student":
      return studentNavigation;
    default:
      return defaultNavigation;
  }
};
```

### 2. Path-Based Rendering

**Performance**: Slower - Requires route checking
**Implementation**: Check current path and render accordingly
**Pros**: URL-driven, clear separation
**Cons**: Additional rendering cycles, complex routing

```typescript
const usePathname = () => {
  /* Next.js hook */
};
const currentPath = usePathname();
const navigation = getNavigationByPath(currentPath);
```

### 3. API-Driven Rendering

**Performance**: Slowest - Network requests
**Implementation**: Fetch navigation config from API
**Pros**: Highly flexible, server-controlled
**Cons**: Loading states, network dependency

## Data Sources to Make Dynamic

### Authentication Context

```typescript
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Teacher" | "Student";
  avatar?: string;
  institutions: Institution[];
  permissions: Permission[];
}
```

### Institution Management

```typescript
interface Institution {
  id: string;
  name: string;
  type: string;
  logo: string;
  userRole: string;
  permissions: string[];
}
```

### Navigation Configuration

```typescript
interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavigationSubItem[];
  permissions?: string[];
}
```

### Real-time Updates

```typescript
// WebSocket Events
-user.role.changed -
  institution.access.updated -
  assignment.created -
  invitation.received;
```

## Future Implementation Steps

1. **Phase 1**: Role-based navigation rendering
2. **Phase 2**: User context integration
3. **Phase 3**: API integration for institutions
4. **Phase 4**: Real-time updates via WebSocket
5. **Phase 5**: Permission-based feature access

## Context Providers Needed

```typescript
// AuthProvider - User authentication state
// InstitutionProvider - Current institution context
// PermissionProvider - User permissions
// NavigationProvider - Dynamic navigation state
```

## API Endpoints Required

```
GET /api/user/profile
GET /api/user/institutions
GET /api/user/permissions
GET /api/user/recent-assignments
GET /api/user/pending-invitations
POST /api/user/switch-institution
```

## Teachers Management Page - Future Functionality

### Bulk Actions (To be implemented later)

- Select multiple teachers for bulk operations
- Bulk status updates (activate/deactivate)
- Bulk email sending
- Bulk role assignments
- Bulk delete (with confirmation)

### Export Functionality (To be implemented later)

- Export teacher data to CSV format
- Export teacher data to Excel format
- Custom export filters (date range, status, etc.)
- Scheduled exports
- Email export reports

### API Endpoints for Teachers Management

```
GET /api/admin/teachers - Fetch teachers with pagination/filters
POST /api/admin/teachers - Create new teacher
PUT /api/admin/teachers/:id - Update teacher details
DELETE /api/admin/teachers/:id - Delete teacher
POST /api/admin/teachers/bulk-action - Bulk operations
GET /api/admin/teachers/export - Export teachers data
GET /api/admin/teachers/stats - Teacher statistics
```

### Teachers Data Structure

```typescript
interface Teacher {
  id: string;
  name: string;
  email: string;
  status: "accepted" | "pending";
  createdExams: number;
  invitedStudents: number;
  dateJoined: Date;
  lastActive: Date;
  profileImage?: string;
  phone?: string;
  department?: string;
  subjects?: string[];
}

interface TeachersResponse {
  teachers: Teacher[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: {
    totalTeachers: number;
    activeTeachers: number;
    inactiveTeachers: number;
  };
}
```

## Performance Considerations

- **Caching**: Cache user data and navigation config
- **Lazy Loading**: Load navigation items on demand
- **Optimistic Updates**: Update UI before API confirmation
- **Error Boundaries**: Handle dynamic loading failures

## Testing Scenarios

- Role switching (Admin → Teacher → Student)
- Institution switching
- Permission changes
- Network failures
- Real-time updates
- Multi-tab synchronization
