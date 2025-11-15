# Jimlad Real Estate Property Listing API

A clean, production-ready REST API for managing real estate property listings built with Node.js, Express, and PostgreSQL.

## Project Structure

```
real-estate-api/
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── index.js            # Models initialization
│   └── Property.js         # Property model/schema
├── controllers/
│   └── propertyController.js # Business logic
├── routes/
│   └── propertyRoutes.js   # API routes
├── middleware/
│   └── upload.js           # Multer image upload configuration
├── uploads/
│   └── properties/         # Uploaded images storage
├── .env                    # Environment variables (create from .env.example)
├── .env.example           # Environment variables template
├── server.js              # Application entry point
└── package.json           # Dependencies
```

## Features

- ✅ Clean MVC architecture
- ✅ RESTful API endpoints
- ✅ PostgreSQL with Sequelize ORM
- ✅ Input validation with proper error handling
- ✅ Consistent JSON response format
- ✅ Environment variable configuration
- ✅ Proper HTTP status codes
- ✅ UUID primary keys
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Image upload functionality with Multer
- ✅ CORS enabled for cross-origin requests
- ✅ Search & filter by location and price range
- ✅ Advanced search endpoint with multiple parameters

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/marcusdashe/jimlad-property-listing-backend.git
cd jimlad-property-listing-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL database**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE jimlad_estate_db;

# Exit PostgreSQL
\q
```

4. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials
```

5. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Get All Properties (with Filters)
```http
GET /properties
GET /properties?location=Miami
GET /properties?minPrice=500000&maxPrice=2000000
GET /properties?location=California&minPrice=1000000
GET /properties?search=luxury
```

**Query Parameters:**
- `location` (string, optional) - Filter by location (case-insensitive, partial match)
- `minPrice` (number, optional) - Minimum price filter
- `maxPrice` (number, optional) - Maximum price filter
- `search` (string, optional) - Search in title, location, and description

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "filters": {
    "location": "Miami",
    "minPrice": "500000",
    "maxPrice": "2000000"
  },
  "data": [
    {
      "id": "uuid-here",
      "title": "Modern Villa",
      "location": "Miami Beach, FL",
      "price": "1250000.00",
      "description": "Beautiful modern villa with pool",
      "imageUrl": "http://localhost:3000/uploads/properties/villa-123456.jpg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 2. Search Properties
```http
GET /properties/search?q=luxury
GET /properties/search?location=New%20York&minPrice=800000
GET /properties/search?maxPrice=1500000
```

**Query Parameters (at least one required):**
- `q` (string) - General search query (searches title, location, description)
- `location` (string) - Search by location
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "searchParams": {
    "q": "luxury",
    "location": null,
    "minPrice": null,
    "maxPrice": null
  },
  "data": [...]
}
```

#### 3. Get Property by ID
```http
GET /properties/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Modern Villa",
    "location": "Los Angeles, CA",
    "price": "1250000.00",
    "description": "Beautiful modern villa with pool",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Property not found"
}
```

#### 4. Create Property (with Image Upload)
```http
POST /properties
Content-Type: multipart/form-data

# With image upload
{
  "title": "Modern Villa",
  "location": "Los Angeles, CA",
  "price": 1250000,
  "description": "Beautiful modern villa with pool",
  "image": [file upload]
}

# Or with image URL
POST /properties
Content-Type: application/json

{
  "title": "Modern Villa",
  "location": "Los Angeles, CA",
  "price": 1250000,
  "description": "Beautiful modern villa with pool",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Required Fields:**
- `title` (string, 3-255 characters)
- `location` (string)
- `price` (number, >= 0)

**Optional Fields:**
- `description` (string)
- `imageUrl` (string, valid URL or upload path)
- `image` (file, JPEG/PNG/GIF/WebP, max 5MB) - multipart form data

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": "uuid-here",
    "title": "Modern Villa",
    "location": "Los Angeles, CA",
    "price": "1250000.00",
    "description": "Beautiful modern villa with pool",
    "imageUrl": "http://localhost:3000/uploads/properties/villa-1234567890.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 3 and 255 characters"
    }
  ]
}
```

#### 5. Delete Property
```http
DELETE /properties/:id
```

**Note:** This endpoint will also delete the associated image file if it was uploaded to the server.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Property not found"
}
```

## Testing with cURL

```bash
# Get all properties
curl http://localhost:3000/properties

# Filter by location
curl "http://localhost:3000/properties?location=Miami"

# Filter by price range
curl "http://localhost:3000/properties?minPrice=500000&maxPrice=2000000"

# Search properties
curl "http://localhost:3000/properties/search?q=luxury&minPrice=1000000"

# Get single property
curl http://localhost:3000/properties/{property-id}

# Create property with JSON
curl -X POST http://localhost:3000/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Luxury Apartment",
    "location": "New York, NY",
    "price": 850000,
    "description": "Stunning penthouse apartment",
    "imageUrl": "https://example.com/apartment.jpg"
  }'

# Create property with image upload
curl -X POST http://localhost:3000/properties \
  -F "title=Beach House" \
  -F "location=Miami Beach, FL" \
  -F "price=2500000" \
  -F "description=Oceanfront property" \
  -F "image=@/path/to/image.jpg"

# Delete property
curl -X DELETE http://localhost:3000/properties/{property-id}
```

## Database Schema

### Properties Table

| Column      | Type          | Constraints                    |
|-------------|---------------|--------------------------------|
| id          | UUID          | PRIMARY KEY                    |
| title       | VARCHAR(255)  | NOT NULL, 3-255 chars          |
| location    | VARCHAR(255)  | NOT NULL                       |
| price       | DECIMAL(12,2) | NOT NULL, >= 0                 |
| description | TEXT          | NULL                           |
| imageUrl    | VARCHAR(500)  | NULL, URL or upload path       |
| createdAt   | TIMESTAMP     | DEFAULT NOW()                  |
| updatedAt   | TIMESTAMP     | DEFAULT NOW()                  |

## CORS Configuration

The API is configured with CORS to allow requests from **any origin**. This makes it easy to integrate with:
- Frontend applications (React, Vue, Angular)
- Mobile applications
- Third-party services
- API testing tools (Postman, Insomnia)

**CORS Settings:**
- **Allowed Origins:** `*` (all origins)
- **Allowed Methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Allowed Headers:** Content-Type, Authorization
- **Credentials:** Enabled

If you need to restrict CORS to specific origins in production, update the `cors` configuration in `server.js`:

```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Image Upload

**Supported Formats:** JPEG, JPG, PNG, GIF, WebP  
**Max File Size:** 5MB  
**Storage:** Local filesystem in `uploads/properties/` directory  
**Access:** Images are served statically at `/uploads/properties/{filename}`

**Upload Process:**
1. Client sends multipart form data with `image` field
2. Server validates file type and size
3. File is saved with unique filename (timestamp + random string)
4. Full URL is generated and stored in database
5. On property deletion, associated image file is automatically removed

**Example with FormData (JavaScript):**
```javascript
const formData = new FormData();
formData.append('title', 'Beach House');
formData.append('location', 'Miami, FL');
formData.append('price', 2500000);
formData.append('description', 'Oceanfront property');
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3000/properties', {
  method: 'POST',
  body: formData
});
```

## Search & Filter Features

### Filter Properties (GET /properties)
Use query parameters to filter the property list:
- **location**: Case-insensitive partial match
- **minPrice**: Properties with price >= minPrice
- **maxPrice**: Properties with price <= maxPrice
- **search**: Searches in title, location, and description

### Search Endpoint (GET /properties/search)
Dedicated search endpoint with required parameters:
- At least one search parameter must be provided
- Supports: `q`, `location`, `minPrice`, `maxPrice`
- Returns detailed search metadata

**Examples:**
```bash
# Find properties in Miami between $500K and $2M
GET /properties?location=Miami&minPrice=500000&maxPrice=2000000

# Search for "luxury" properties
GET /properties/search?q=luxury

# Find waterfront properties under $3M
GET /properties/search?q=waterfront&maxPrice=3000000
```

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional: detailed validation errors
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Environment Variables

| Variable    | Description              | Default       |
|-------------|--------------------------|---------------|
| PORT        | Server port              | 3000          |
| NODE_ENV    | Environment              | development   |
| DB_NAME     | Database name            | real_estate_db|
| DB_USER     | Database user            | postgres      |
| DB_PASSWORD | Database password        | -             |
| DB_HOST     | Database host            | localhost     |
| DB_PORT     | Database port            | 5432          |

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

## License

ISC