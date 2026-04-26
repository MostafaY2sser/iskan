# Booking Accept/Reject Implementation

## Overview
The accept and reject functionality for bookings has been successfully implemented in both the Bookings list page and the Booking Details page.

## Implementation Details

### 1. BookingsPage.tsx
- **Location**: `/src/pages/BookingsPage.tsx`
- **Features**:
  - Quick action buttons in the table for pending bookings
  - View details button for all bookings
  - Confirmation dialog before accepting/rejecting
  - Automatic refresh after status update

### 2. BookingDetailsPage.tsx
- **Location**: `/src/pages/BookingDetailsPage.tsx`
- **Features**:
  - Prominent action card for pending bookings (yellow highlighted)
  - Large, clear Accept and Reject buttons
  - Confirmation dialog with clear messaging
  - Shows customer details for owners/admins only

## User Roles Supported
The following user types can accept/reject bookings:
- `owner`
- `residence_company`
- `property_owner`
- `property-owner`
- `admin`

## API Integration
- **Endpoint**: `PATCH /bookings/{booking_id}/status`
- **Request Body**: `{ "status": "approved" | "rejected" }`
- **Error Handling**:
  - 409 Conflict: When approving a booking that conflicts with existing approved bookings
  - 401/403: Authentication errors (auto-logout)
  - Network errors: Proper error messages

## UI/UX Features

### Status Badges
- **قيد المراجعة** (Pending): Yellow badge with clock icon
- **مقبول** (Approved): Green badge with check icon
- **مرفوض** (Rejected): Red badge with X icon
- **تم تعيين وكيل** (Agent Assigned): Blue badge with users icon

### Action Buttons
- **Accept Button**: Green color with check icon
- **Reject Button**: Red color with X icon
- **View Details**: Eye icon for quick preview
- **External Link**: Opens full booking details page

### Confirmation Dialog
- Clear title indicating the action
- Descriptive message about what will happen
- Cancel and Confirm buttons
- Loading state during processing

## Testing Instructions

1. **Login as Admin/Owner**:
   - Use admin credentials or property owner account
   
2. **Navigate to Bookings**:
   - Go to Dashboard → الحجوزات (Bookings)
   
3. **Test in Table View**:
   - Find bookings with "قيد المراجعة" status
   - Click قبول (Accept) or رفض (Reject) buttons
   - Confirm the action in the dialog
   
4. **Test in Details View**:
   - Click the eye icon to view booking details
   - Or click external link for full page view
   - Use the prominent yellow action card to accept/reject
   
5. **Verify Status Update**:
   - Check that the status badge updates
   - Verify the booking list refreshes
   - Confirm success notification appears

## Debug Information
In development mode, the BookingDetailsPage shows debug info:
- Current user type
- Whether user is detected as owner
- Current booking status
- Whether action buttons should show

## Notes
- Only bookings with `pending_bc_approval` status show accept/reject buttons
- Admins can accept/reject any booking
- Property owners can only accept/reject bookings for their properties
- The system checks for booking conflicts when approving
