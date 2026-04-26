# Admin Dashboard Card Colors Fix

## Issue Identified
The admin dashboard (BookingsPage.tsx) was showing inconsistent card colors - some pending bookings had light green background while others had white background. This was because the card color logic was only implemented in the customer dashboard, not the admin dashboard.

## Fix Applied

### 1. **Added Card Color Logic to Admin Dashboard**
Updated the table rows in BookingsPage.tsx to include background colors:

```javascript
const isCurrentlyRunning = new Date(booking.start_date) <= now && new Date(booking.end_date) >= now;
const isAccepted = booking.status === 'approved' || booking.status === 'agent_assigned';
const isPending = booking.status === 'pending_bc_approval';

// Table row className:
className={`border-b border-gray-100 hover:bg-gray-50 ${
  isCurrentlyRunning ? 'bg-green-50' : 
  isAccepted ? 'bg-green-50' : 
  isPending ? 'bg-yellow-50' : ''
}`}
```

### 2. **Color Scheme**
- **🟢 Green background** (`bg-green-50`): Accepted bookings (`approved` or `agent_assigned`) + Currently running bookings
- **🟡 Yellow background** (`bg-yellow-50`): Pending bookings (`pending_bc_approval`)
- **⚪ White background**: Rejected or other status bookings

### 3. **Customer Dashboard "قيد المراجعة" Filter**
The customer dashboard filter for "قيد المراجعة" was already correctly implemented to show pending bookings (`pending_bc_approval` status).

## Result
- **Admin Dashboard**: All pending bookings now have consistent yellow background
- **Customer Dashboard**: "قيد المراجعة" filter correctly shows pending bookings with yellow background
- **Consistent behavior**: Both dashboards now use the same color logic

## Testing
1. **Admin Dashboard**: Check that all pending bookings have yellow background
2. **Customer Dashboard**: Use "قيد المراجعة" filter - should show pending bookings with yellow background
3. **Accepted bookings**: Should have green background in both dashboards



