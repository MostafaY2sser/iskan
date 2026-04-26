# 🗺️ Location Picker Testing Guide

## How to Test the Location Functionality

### 🚀 **Quick Start:**
1. Navigate to `/add-residence` in your browser
2. Go through steps 1 & 2 of the form
3. On **Step 3 (الموقع والعنوان)**, you'll see the enhanced location picker

### 🎯 **Testing Methods:**

#### **Method 1: Quick Location Buttons (Easiest)**
- Look for the **"مواقع سريعة للتجربة"** card
- Click any city button (الرياض, جدة, الدمام, مكة)
- ✅ **Expected Result**: Location should be set instantly with coordinates and map preview

#### **Method 2: Search by City Name**
- In the **"البحث عن الموقع"** card, type a city name like:
  - `الرياض`
  - `جدة` 
  - `الدمام`
  - `مكة`
  - `المدينة`
  - `الطائف`
- Click the search button or press Enter
- ✅ **Expected Result**: Location found with coordinates and address

#### **Method 3: GPS Location (Requires Permission)**
- Click **"استخدام الموقع الحالي"** button
- Allow location access when browser prompts
- ✅ **Expected Result**: Your actual GPS coordinates are captured

#### **Method 4: Manual Coordinates**
- In the **"إدخال الإحداثيات يدوياً"** card, enter:
  - **Latitude**: `24.7136` (for Riyadh)
  - **Longitude**: `46.6753` (for Riyadh)
- ✅ **Expected Result**: Coordinates are set and map preview appears

### 🔍 **What to Look For:**

#### **Visual Feedback:**
- ✅ **Green Success Card**: Shows when location is set successfully
- 🗺️ **Map Preview**: Displays placeholder map with location marker
- 📍 **Coordinates Display**: Shows exact lat/lng values
- 🔔 **Toast Notifications**: Success/error messages appear

#### **Console Logs:**
Open browser DevTools (F12) → Console tab to see:
```
🔍 Searching for location: الرياض
✅ Location found: {latitude: 24.7136, longitude: 46.6753, ...}
📍 Getting current location...
✅ GPS coordinates received: {latitude: ..., longitude: ...}
```

#### **Form Integration:**
- Location data should populate the city/location fields automatically
- Summary card should show coordinates
- Form validation should pass when location is set

### 🐛 **Troubleshooting:**

#### **"Nothing happens when I click"**
1. **Check Console**: Open DevTools → Console for error messages
2. **Check Network**: Ensure no network errors blocking the app
3. **Try Different Method**: If GPS fails, try quick buttons or search
4. **Refresh Page**: Sometimes helps with state issues

#### **GPS Not Working**
- **Browser Permission**: Make sure you allowed location access
- **HTTPS Required**: GPS only works on HTTPS or localhost
- **Device GPS**: Ensure your device has GPS enabled

#### **Search Not Finding Cities**
- **Exact Names**: Try exact Arabic city names like `الرياض`
- **Use Quick Buttons**: They always work for testing
- **Check Spelling**: Make sure Arabic text is correct

### 📱 **Mobile Testing:**
- GPS location works better on mobile devices
- Touch interactions should work smoothly
- All buttons should be easily tappable

### 🎉 **Success Indicators:**
When location picker is working correctly, you should see:
1. ✅ **Green success card** with location details
2. 🗺️ **Map preview** showing the location
3. 📍 **Exact coordinates** displayed
4. 🔔 **Success toast** notification
5. 📝 **Form fields** auto-populated
6. ✨ **Summary card** updated with coordinates

### 🔧 **For Developers:**
- All interactions are logged to console with emojis
- Location data is passed to parent component via `onLocationSelect`
- Component handles all error states gracefully
- Ready for real API integration (Google Maps, etc.)

---

**Need Help?** Check the browser console for detailed logs and error messages!
