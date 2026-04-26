# Booking Accept/Reject Buttons Fix

## Issue
The accept and reject buttons were not appearing in the booking details modal even when logged in as an owner.

## Root Causes Identified
1. **Status Value Mismatch**: The API might return different status values (`pending_bc_approval`, `pending`, or even Arabic `قيد المراجعة`)
2. **User Type Check Missing**: The buttons were not checking if the current user is an owner/admin
3. **Wrong API Endpoint**: The `/bookings/by/user` endpoint returns bookings made BY the user, not bookings FOR the owner's properties

## Fixes Applied

### 1. Added User Type Check
```javascript
const userType = localStorage.getItem('user_type');
const isOwnerOrAdmin = ['owner', 'residence_company', 'property_owner', 'property-owner', 'admin'].includes(userType?.toLowerCase() || '');
```

### 2. Updated Status Conditions
Now checks for multiple possible status values:
- `pending_bc_approval`
- `pending`
- `قيد المراجعة`

### 3. Updated Button Visibility Conditions
Buttons now show when:
- User is owner/admin AND
- Booking status is one of the pending values

### 4. Improved API Endpoint Logic
```javascript
if (isOwnerOrAdmin) {
  // Try to fetch all bookings for owners/admins
  data = await api.get<Booking[]>('/bookings');
} else {
  // Regular customers fetch their own bookings
  data = await api.get<Booking[]>('/bookings/by/user');
}
```

### 5. Added Debug Information
In development mode, the modal now shows:
- Current booking status
- User type
- Whether user is detected as owner/admin
- Whether buttons should be showing

## Testing
1. Refresh the page after the changes
2. Open any booking with "قيد المراجعة" status
3. Check the debug info box to see:
   - What status value is being returned
   - If your user type is correctly detected
   - If the buttons should be showing

## Supported User Types
The following user types can now accept/reject bookings:
- `owner`
- `residence_company`
- `property_owner`
- `property-owner`
- `admin`

## Next Steps
If buttons still don't appear:
1. Check the debug info to see what status value is being returned
2. Verify your user_type in localStorage
3. Check browser console for any API errors
