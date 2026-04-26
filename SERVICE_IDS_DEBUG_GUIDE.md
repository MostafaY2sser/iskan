# Service IDs Debug Guide - Investigating Null Service IDs

## 🐛 **Problem:**
The booking system is sending `service_ids: [null]` instead of actual service IDs.

## 🔍 **Debugging Setup:**

I've added console logging to help identify the issue:

### **1. Residence Data Debugging:**
- **File:** `src/pages/ResidenceDetailsPage.tsx`
- **Added:** Console logs to show residence data and services structure
- **Location:** Lines 49-50

### **2. BookingForm Debugging:**
- **File:** `src/components/BookingForm.tsx`
- **Added:** Console logs for:
  - Selected residence data (lines 84-85)
  - Service checkbox changes (lines 374-375)
  - Form submission data (lines 112-113)

## 🧪 **Testing Steps:**

### **Step 1: Check Residence Data Structure**
1. **Navigate to:** `http://localhost:8086/residence/6` (or any residence with services)
2. **Open Browser Console** (F12 → Console tab)
3. **Look for:** `Residence data:` and `Residence services:` logs
4. **Check:** What fields are available in the services array

### **Step 2: Test BookingForm Service Selection**
1. **Navigate to:** Create booking page
2. **Select a residence** with services
3. **Check Console** for:
   - `Selected residence:` log
   - `Selected residence services:` log
4. **Try selecting services** and check:
   - `Service checkbox changed:` log
   - `Service service_id:` log

### **Step 3: Test Form Submission**
1. **Fill out booking form** with services selected
2. **Submit the form**
3. **Check Console** for:
   - `Submitting booking data:` log
   - `Service IDs being sent:` log

## 🔍 **What to Look For:**

### **Expected Service Structure:**
```javascript
{
  id: 1,           // Relationship ID
  service_id: 1,    // ✅ Actual service ID
  name: "WiFi",
  extra_cost: 0
}
```

### **Possible Issues:**

#### **Issue 1: Missing `service_id` Field**
```javascript
// ❌ BAD - Only has relationship ID
{
  id: 1,
  name: "WiFi", 
  extra_cost: 0
  // Missing service_id field
}
```

#### **Issue 2: Wrong Field Name**
```javascript
// ❌ BAD - Field named differently
{
  id: 1,
  serviceId: 1,     // Different naming
  name: "WiFi",
  extra_cost: 0
}
```

#### **Issue 3: Null Values**
```javascript
// ❌ BAD - Null service_id
{
  id: 1,
  service_id: null,  // Null value
  name: "WiFi",
  extra_cost: 0
}
```

## 🛠️ **Potential Fixes:**

### **Fix 1: Use Different Field**
If `service_id` is null but another field exists:
```typescript
// Use the relationship ID instead
service_ids: [...prev.service_ids, service.id]
```

### **Fix 2: Handle Null Values**
If `service_id` is null, filter them out:
```typescript
// Filter out null service_ids
service_ids: formData.service_ids.filter(id => id !== null)
```

### **Fix 3: Use Array Index**
If no proper ID field exists:
```typescript
// Use array index as fallback
service_ids: [...prev.service_ids, index]
```

## 📊 **Expected Console Output:**

### **Good Output:**
```
Residence services: [
  { id: 1, service_id: 1, name: "WiFi", extra_cost: 0 },
  { id: 2, service_id: 2, name: "Parking", extra_cost: 50 }
]
Service checkbox changed: { id: 1, service_id: 1, name: "WiFi", extra_cost: 0 }
Service service_id: 1
Submitting booking data: { service_ids: [1, 2] }
```

### **Bad Output (Current Issue):**
```
Residence services: [
  { id: 1, service_id: null, name: "WiFi", extra_cost: 0 },
  { id: 2, service_id: null, name: "Parking", extra_cost: 50 }
]
Service checkbox changed: { id: 1, service_id: null, name: "WiFi", extra_cost: 0 }
Service service_id: null
Submitting booking data: { service_ids: [null] }
```

## 🚀 **Next Steps:**

1. **Run the test** and check console output
2. **Identify the actual service structure** from the logs
3. **Apply the appropriate fix** based on what we find
4. **Remove debugging logs** once issue is resolved

**The debugging is now set up - please test and share the console output!** 🔍
