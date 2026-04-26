# API Endpoints Documentation

This document provides comprehensive documentation for all API endpoints in the Iskan React application.

## Base URL
```
http://localhost:8000
```

## Authentication
Most endpoints require Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register Customer
**POST** `/auth/register/customer`

Register a new customer account.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "password123",
  "user_type": "customer",
  "company_name": "Company Name",
  "registration_number": "REG123456",
  "approx_employee_count": 50,
  "business_activity": "Technology",
  "responsible_person": "John Doe",
  "first_phone_number": "+1234567890",
  "responsible_position": "Manager",
  "second_responsible_person": "Jane Smith",
  "second_phone_number": "+0987654321",
  "favorite_area": "Downtown"
}
```

**Responses:**
- `200`: Successful registration
- `422`: Validation error

---

### 2. Register Owner
**POST** `/auth/register/owner`

Register a new property owner account.

**Request Body:**
```json
{
  "email": "owner@example.com",
  "password": "password123",
  "user_type": "owner",
  "registration_number": "OWN123456",
  "val_license_number": "VAL789012",
  "business_activity": "Real Estate",
  "phone_number": "+1234567890",
  "address": "123 Main St",
  "region": "Central",
  "city": "Riyadh"
}
```

**Responses:**
- `200`: Successful registration
- `422`: Validation error

---

### 3. Register Residence Company
**POST** `/auth/register/residence_company`

Register a new residence company account.

**Request Body:**
```json
{
  "email": "company@example.com",
  "password": "password123",
  "user_type": "residence_company",
  "company_name": "Residence Co.",
  "registration_number": "COMP123456",
  "val_license_number": "VAL789012",
  "business_activity": "Property Management",
  "responsible_person": "John Doe",
  "phone_number": "+1234567890",
  "address": "456 Business Ave",
  "region": "Eastern",
  "city": "Dammam"
}
```

**Responses:**
- `200`: Successful registration
- `422`: Validation error

---

### 4. Login
**POST** `/auth/login`

Authenticate user and get access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "user_type": "customer"
}
```

**Responses:**
- `200`: Successful login
- `422`: Validation error

---

### 5. Reset Password
**POST** `/auth/reset-password`

Send password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Responses:**
- `200`: Reset email sent
- `422`: Validation error

---

## 📁 Upload Endpoints

### 6. Upload User Signup Document
**POST** `/uploads/documents/signup`

Upload a document during user signup process.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body (multipart/form-data):**
- `file`: Document file (PDF, JPG, etc.)
- `doc_type`: Document type (e.g., 'National ID', 'Passport')
- `expiry_date`: Document expiry date (YYYY-MM-DD)

**Response:**
```json
{
  "id": 1,
  "file_path": "documents/signup/user_123/national_id.pdf",
  "entity_type": "documents",
  "entity_id": 1,
  "uploaded_at": "2024-01-15T10:30:00Z"
}
```

**Responses:**
- `201`: Document uploaded successfully
- `422`: Validation error

---

### 7. Upload Residence Document
**POST** `/uploads/documents/residence/{residence_id}`

Upload a document for a specific residence.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `residence_id` (integer): Residence ID

**Request Body (multipart/form-data):**
- `file`: Document file
- `doc_type`: Document type
- `expiry_date`: Document expiry date (YYYY-MM-DD)

**Response:**
```json
{
  "id": 2,
  "file_path": "documents/residence/123/deed.pdf",
  "entity_type": "documents",
  "entity_id": 123,
  "uploaded_at": "2024-01-15T10:30:00Z"
}
```

**Responses:**
- `201`: Document uploaded successfully
- `422`: Validation error

---

### 8. List Residence Private Documents
**GET** `/uploads/documents/{residence_id}/private-documents`

Get all private documents for a specific residence.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `residence_id` (integer): Residence ID

**Responses:**
- `200`: List of documents with temporary URLs
- `422`: Validation error

---

### 9. View Document
**GET** `/uploads/documents/{document_id}/view`

Get a temporary URL to view a document.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `document_id` (integer): Document ID

**Response:**
```json
{
  "signed_url": "https://storage.example.com/documents/123?token=abc123..."
}
```

**Responses:**
- `200`: Temporary URL generated
- `422`: Validation error

---

### 10. List User Signup Documents
**GET** `/uploads/documents/signup/{user_id}`

List all documents uploaded by user during signup.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `user_id` (string): User ID

**Responses:**
- `200`: List of user signup documents
- `422`: Validation error

---

### 11. List Pending User Signup Documents
**GET** `/uploads/documents/pending_signup/{user_id}`

List all pending documents for user signup.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `user_id` (string): User ID

**Responses:**
- `200`: List of pending documents
- `422`: Validation error

---

### 12. Delete Document
**DELETE** `/uploads/documents/{document_id}`

Delete a document and its associated file.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `document_id` (integer): Document ID

**Responses:**
- `204`: Document deleted successfully
- `422`: Validation error

---

### 13. Upload Residence Cover Photo
**POST** `/uploads/residences/{residence_id}/cover`

Upload a cover photo for a residence.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `residence_id` (integer): Residence ID

**Request Body (multipart/form-data):**
- `file`: Image file

**Response:**
```json
{
  "id": 1,
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "photo_id": 1,
  "name": "Beautiful Apartment",
  "location": "Downtown",
  "bed_count": 2,
  "price_per_bed": 1500.0,
  "amenities": "WiFi, AC, Parking",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Responses:**
- `201`: Cover photo uploaded successfully
- `422`: Validation error

---

### 14. Upload Residence Gallery Photo
**POST** `/uploads/residences/{residence_id}/gallery`

Add a photo to residence gallery.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `residence_id` (integer): Residence ID

**Request Body (multipart/form-data):**
- `file`: Image file

**Response:**
```json
{
  "id": 3,
  "file_path": "residences/123/gallery/photo1.jpg",
  "entity_type": "residences",
  "entity_id": 123,
  "uploaded_at": "2024-01-15T10:30:00Z"
}
```

**Responses:**
- `201`: Photo uploaded successfully
- `422`: Validation error

---

### 15. List Residence Gallery
**GET** `/uploads/residences/{residence_id}/gallery`

Get all public photos for a residence gallery.

**Path Parameters:**
- `residence_id` (integer): Residence ID

**Responses:**
- `200`: List of public photo URLs
- `422`: Validation error

---

### 16. View Residence Photo
**GET** `/uploads/residences/photos/{upload_id}/view`

Get the public URL for a residence photo.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `upload_id` (integer): Upload ID

**Response:**
```json
{
  "public_url": "https://storage.example.com/residences/123/photo1.jpg"
}
```

**Responses:**
- `200`: Public URL generated
- `422`: Validation error

---

### 17. Upload Contract Photo
**POST** `/uploads/contracts/{booking_id}`

Upload a contract photo for a booking.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `booking_id` (integer): Booking ID

**Request Body (multipart/form-data):**
- `file`: Contract image
- `commission_rate`: Commission rate (number)
- `final_price`: Final price (number)
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)

**Response:**
```json
{
  "id": 1,
  "booking_id": 123,
  "commission_rate": 0.1,
  "final_price": 5000.0,
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-01-20T00:00:00Z"
}
```

**Responses:**
- `201`: Contract uploaded successfully
- `422`: Validation error

---

### 18. View Contract
**GET** `/uploads/contracts/{contract_id}/view`

Get a temporary URL to view a contract photo.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `contract_id` (integer): Contract ID

**Response:**
```json
{
  "signed_url": "https://storage.example.com/contracts/123?token=abc123..."
}
```

**Responses:**
- `200`: Temporary URL generated
- `422`: Validation error

---

### 19. Get Residence Cover Photo
**GET** `/uploads/residences/{residence_id}/cover-photo`

Get the public URL for a residence's cover photo.

**Path Parameters:**
- `residence_id` (integer): Residence ID

**Response:**
```json
{
  "public_url": "https://storage.example.com/residences/123/cover.jpg"
}
```

**Responses:**
- `200`: Public URL generated
- `422`: Validation error

---

## 🏠 Residence Endpoints

### 20. Create New Residence
**POST** `/residence`

Create a new residence.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Beautiful Apartment",
  "location": "Downtown Riyadh",
  "bed_count": 2,
  "price_per_bed": 1500.0,
  "description": "Modern apartment with great amenities",
  "residence_type": "apartment",
  "rooms_count": 3,
  "kitchen_count": 1,
  "bathroom_count": 2,
  "building_year": 2020,
  "address": "123 King Fahd Road",
  "city": "Riyadh"
}
```

**Responses:**
- `200`: Residence created successfully
- `422`: Validation error

---

### 21. Get All Residences
**GET** `/residence/all`

Get all residences (authenticated users only).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Beautiful Apartment",
    "bed_count": 2,
    "description": "Modern apartment with great amenities",
    "residence_type": "apartment",
    "rooms_count": 3,
    "kitchen_count": 1,
    "bathroom_count": 2,
    "building_year": 2020,
    "address": "123 King Fahd Road",
    "city": "Riyadh",
    "price_with_commission": 1650.0,
    "created_at": "2024-01-15T10:30:00Z",
    "cover_photo_url": "https://storage.example.com/cover.jpg",
    "services": [
      {
        "name": "WiFi",
        "description": "High-speed internet",
        "extra_cost": 0
      }
    ]
  }
]
```

**Responses:**
- `200`: List of all residences

---

### 22. Get Residence By User ID
**GET** `/residence/user/{user_id}`

Get residences owned by a specific user.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `user_id` (string): User ID (UUID)

**Response:**
```json
[
  {
    "name": "Beautiful Apartment",
    "location": "Downtown Riyadh",
    "bed_count": 2,
    "price_per_bed": 1500.0,
    "description": "Modern apartment with great amenities",
    "residence_type": "apartment",
    "rooms_count": 3,
    "kitchen_count": 1,
    "bathroom_count": 2,
    "building_year": 2020,
    "address": "123 King Fahd Road",
    "city": "Riyadh",
    "id": 1,
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z",
    "cover_photo_url": "https://storage.example.com/cover.jpg",
    "services": []
  }
]
```

**Responses:**
- `200`: List of user's residences
- `422`: Validation error

---

### 23. Get All Approved Residences
**GET** `/residence/approved_residences`

Get all approved residences (public endpoint).

**Response:**
```json
[
  {
    "id": 1,
    "name": "Beautiful Apartment",
    "bed_count": 2,
    "description": "Modern apartment with great amenities",
    "residence_type": "apartment",
    "rooms_count": 3,
    "kitchen_count": 1,
    "bathroom_count": 2,
    "building_year": 2020,
    "address": "123 King Fahd Road",
    "city": "Riyadh",
    "price_with_commission": 1650.0,
    "created_at": "2024-01-15T10:30:00Z",
    "cover_photo_url": "https://storage.example.com/cover.jpg",
    "services": []
  }
]
```

**Responses:**
- `200`: List of approved residences

---

### 24. Get Owner Approved Residences
**GET** `/residence/approved_residence/{user_id}`

Get approved residences for a specific user.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `user_id` (string): User ID (UUID)

**Responses:**
- `200`: List of user's approved residences
- `422`: Validation error

---

### 25. Search Residences By Area
**GET** `/residence/search_by_area?area={area}`

Search residences by city/area.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `area` (string): City/area to filter by

**Responses:**
- `200`: List of residences in the specified area
- `422`: Validation error

---

### 26. Get Residence By ID
**GET** `/residence/{residence_id}`

Get a specific residence by its ID.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `residence_id` (integer): Residence ID

**Responses:**
- `200`: Residence details
- `422`: Validation error

---

### 27. Update Residence Status
**POST** `/residence/update_status/{booking_id}?status={status}`

Update residence status.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `booking_id` (integer): Booking ID

**Query Parameters:**
- `status` (string): New status

**Responses:**
- `200`: Status updated successfully
- `422`: Validation error

---

## 📅 Booking Endpoints

### 28. Create New Booking
**POST** `/bookings/`

Create a new booking.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "residence_id": 1,
  "bed_count": 2,
  "start_date": "2024-02-01",
  "end_date": "2024-02-05",
  "total_price_with_commission": 3300,
  "service_ids": [1, 2]
}
```

**Response:**
```json
{
  "id": 1,
  "customer_id": "123e4567-e89b-12d3-a456-426614174000",
  "residence_id": 1,
  "bed_count": 2,
  "start_date": "2024-02-01",
  "end_date": "2024-02-05",
  "status": "pending_bc_approval",
  "created_at": "2024-01-15T10:30:00Z",
  "total_price_with_commission": 3300,
  "services": [
    {
      "id": 1,
      "name": "WiFi",
      "price": 0
    }
  ],
  "agent": null
}
```

**Responses:**
- `201`: Booking created successfully
- `422`: Validation error

---

### 29. Get Booking Details
**GET** `/bookings/{booking_id}`

Get a specific booking with its details.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `booking_id` (integer): Booking ID

**Responses:**
- `200`: Booking details
- `422`: Validation error

---

### 30. Delete Booking
**DELETE** `/bookings/{booking_id}`

Delete a specific booking.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `booking_id` (integer): Booking ID

**Responses:**
- `204`: Booking deleted successfully
- `422`: Validation error

---

### 31. Assign Agent to Booking
**POST** `/bookings/{booking_id}/assign-agent`

Assign an agent to a booking (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `booking_id` (integer): Booking ID

**Request Body:**
```json
{
  "agent_id": 1
}
```

**Responses:**
- `200`: Agent assigned successfully
- `422`: Validation error

---

### 32. Get Bookings for Residence
**GET** `/bookings/by_residence/{residence_id}`

Get all bookings for a specific residence.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `residence_id` (integer): Residence ID

**Responses:**
- `200`: List of bookings for the residence
- `422`: Validation error

---

### 33. Get Bookings for User's Residences
**GET** `/bookings/by/user`

Get all bookings across user's residences.

**Headers:**
- `Authorization: Bearer <token>`

**Responses:**
- `200`: List of bookings

---

### 34. Get Monthly Analytics
**GET** `/bookings/me/monthly-analytics`

Get monthly financial analytics for the logged-in user.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "month_year": "2024-01",
    "total_amount": 5000
  },
  {
    "month_year": "2024-02",
    "total_amount": 7500
  }
]
```

**Responses:**
- `200`: Monthly analytics data

---

### 35. Update Booking Status
**PATCH** `/bookings/{booking_id}/status`

Update booking status (Owner/Residence Company only).

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `booking_id` (integer): Booking ID

**Request Body:**
```json
{
  "status": "approved"
}
```

**Valid Status Values:**
- `approved`
- `rejected`

**Responses:**
- `200`: Status updated successfully
- `409`: Approval failed due to overlapping dates
- `422`: Validation error

---

## 👥 Customer Endpoints

### 36. Get All Customers
**GET** `/customers`

Get all customers (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "company_name": "Tech Corp",
    "registration_number": "REG123456",
    "approx_employee_count": 50,
    "business_activity": "Technology",
    "responsible_person": "John Doe",
    "first_phone_number": "+1234567890",
    "responsible_position": "Manager",
    "second_responsible_person": "Jane Smith",
    "second_phone_number": "+0987654321",
    "favorite_area": "Downtown",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**Responses:**
- `200`: List of all customers

---

### 37. Get My Customer Details
**GET** `/customers/me`

Get details for the currently authenticated customer.

**Headers:**
- `Authorization: Bearer <token>`

**Responses:**
- `200`: Customer details

---

### 38. Update My Customer Details
**PATCH** `/customers/me`

Update details for the currently authenticated customer.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "company_name": "Updated Company Name",
  "favorite_area": "New Area"
}
```

**Responses:**
- `200`: Details updated successfully
- `422`: Validation error

---

### 39. Get Customer by ID
**GET** `/customers/{user_id}`

Get customer details by user ID (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `user_id` (string): User ID (UUID)

**Responses:**
- `200`: Customer details
- `422`: Validation error

---

### 40. Get My Bookings
**GET** `/customers/me/bookings`

Get all bookings made by the currently authenticated customer.

**Headers:**
- `Authorization: Bearer <token>`

**Responses:**
- `200`: List of customer's bookings

---

## 👨‍💼 Admin Endpoints

### 41. Get All Users
**GET** `/admin/users?status={status}`

Get all users with optional status filter.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (string, optional): Filter by status (e.g., 'pending', 'approved')

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_type": "customer",
    "email": "user@example.com",
    "status": "approved",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**Responses:**
- `200`: List of users
- `422`: Validation error

---

### 42. Get All Approved Bookings
**GET** `/admin/bookings/approved`

Get all bookings with 'approved' status.

**Headers:**
- `Authorization: Bearer <token>`

**Responses:**
- `200`: List of approved bookings

---

### 43. Get All Pending Residences
**GET** `/admin/residences/pending`

Get all residences with 'pending' status.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Beautiful Apartment",
    "location": "Downtown Riyadh",
    "bed_count": 2,
    "price_per_bed": "1500.0",
    "status": "pending",
    "description": "Modern apartment with great amenities",
    "residence_type": "apartment",
    "building_year": 2020,
    "bathroom_count": 2,
    "rooms_count": 3,
    "kitchen_count": 1,
    "address": "123 King Fahd Road",
    "city": "Riyadh",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

**Responses:**
- `200`: List of pending residences

---

### 44. Update User Status
**PATCH** `/admin/users/{user_id}/status?new_status={new_status}`

Update user status (Admin only).

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `user_id` (string): User ID (UUID)

**Query Parameters:**
- `new_status` (string): New status

**Responses:**
- `200`: Status updated successfully
- `422`: Validation error

---

## 🛠️ Service Endpoints

### 45. Get All Services
**GET** `/service/all`

Get all available services.

**Headers:**
- `Authorization: Bearer <token>`

**Responses:**
- `200`: List of all services

---

### 46. Add Service
**POST** `/service/add`

Add a new service.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "WiFi",
  "description": "High-speed internet connection"
}
```

**Responses:**
- `200`: Service added successfully
- `422`: Validation error

---

### 47. Add Service to Residence
**POST** `/service/add_to_residence`

Add services to a residence.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "residence_id": 1,
  "services": [
    {
      "service_id": 1,
      "extra_cost": 0
    },
    {
      "service_id": 2,
      "extra_cost": 50
    }
  ]
}
```

**Responses:**
- `200`: Services added successfully
- `422`: Validation error

---

### 48. Get Residence Services
**GET** `/service/residence/{residence_id}`

Get services for a specific residence.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `residence_id` (integer): Residence ID

**Responses:**
- `200`: List of residence services
- `422`: Validation error

---

### 49. Search Residences by Services
**POST** `/service/residence_by_services`

Search residences by service IDs.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
[1, 2, 3]
```

**Responses:**
- `200`: List of residences with specified services
- `422`: Validation error

---

## 📊 Data Models

### Common Response Schemas

#### AuthResponse
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "user_id": "uuid",
  "user_type": "string"
}
```

#### UploadOut
```json
{
  "id": "integer",
  "file_path": "string",
  "entity_type": "documents|contracts|residences",
  "entity_id": "integer",
  "uploaded_at": "datetime"
}
```

#### BookingResponse
```json
{
  "id": "integer",
  "customer_id": "uuid",
  "residence_id": "integer",
  "bed_count": "integer",
  "start_date": "date",
  "end_date": "date",
  "status": "string",
  "created_at": "datetime",
  "total_price_with_commission": "integer",
  "services": "ServiceResponse[]",
  "agent": "AgentResponse|null"
}
```

#### ResidencePublicResponse
```json
{
  "id": "integer",
  "name": "string",
  "bed_count": "integer",
  "description": "string",
  "residence_type": "string",
  "rooms_count": "integer",
  "kitchen_count": "integer",
  "bathroom_count": "integer",
  "building_year": "integer",
  "address": "string",
  "city": "string",
  "price_with_commission": "number",
  "created_at": "datetime",
  "cover_photo_url": "string|null",
  "services": "ResidenceServiceDetails[]"
}
```

---

## 🔒 Security

### Authentication
- Most endpoints require Bearer token authentication
- Include the token in the Authorization header: `Authorization: Bearer <token>`
- Tokens are obtained through the `/auth/login` endpoint

### User Types
- `customer`: Regular users who book residences
- `owner`: Property owners who list residences
- `residence_company`: Companies that manage multiple residences
- `admin`: System administrators with full access

### Permissions
- **Public endpoints**: No authentication required
- **User endpoints**: Require authentication, users can only access their own data
- **Admin endpoints**: Require admin privileges
- **Owner endpoints**: Require ownership of the resource

---

## 📝 Error Handling

### Common HTTP Status Codes
- `200`: Success
- `201`: Created successfully
- `204`: No content (successful deletion)
- `400`: Bad request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found
- `409`: Conflict (e.g., overlapping booking dates)
- `422`: Validation error
- `500`: Internal server error

### Error Response Format
```json
{
  "detail": [
    {
      "loc": ["field_name"],
      "msg": "Error message",
      "type": "error_type"
    }
  ]
}
```

---

## 🚀 Getting Started

1. **Register an account** using one of the registration endpoints
2. **Login** to get your access token
3. **Include the token** in subsequent requests
4. **Start using the API** based on your user type and needs

### Example Flow for Customer
1. Register as customer: `POST /auth/register/customer`
2. Login: `POST /auth/login`
3. Upload documents: `POST /uploads/documents/signup`
4. Browse residences: `GET /residence/approved_residences`
5. Create booking: `POST /bookings/`
6. View your bookings: `GET /customers/me/bookings`

### Example Flow for Owner
1. Register as owner: `POST /auth/register/owner`
2. Login: `POST /auth/login`
3. Upload documents: `POST /uploads/documents/signup`
4. Create residence: `POST /residence`
5. Upload cover photo: `POST /uploads/residences/{residence_id}/cover`
6. Add services: `POST /service/add_to_residence`
7. View bookings: `GET /bookings/by/user`
8. Update booking status: `PATCH /bookings/{booking_id}/status`

---

*This documentation covers all available API endpoints. For the most up-to-date information, refer to the OpenAPI specification or contact the development team.*
