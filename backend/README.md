# Attvin Materials Management System Backend

This Spring Boot application serves as the backend for the Attvin Materials Management System.

## Environment Configuration

The application uses environment variables for sensitive configuration settings to improve security.

### Setting Up Environment Variables

1. Create a `.env` file in the backend directory based on the provided `.env.example` template:

```
cp .env.example .env
```

2. Edit the `.env` file to set your environment-specific values:

```
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:derby:memory:local;create=true
SPRING_JPA_HIBERNATE_DDL_AUTO=create

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRATION=86400
```

**IMPORTANT**: Never commit your `.env` file to version control as it contains sensitive information.

### JWT Configuration

The application uses JSON Web Tokens (JWT) for authentication:

- `JWT_SECRET`: A secure secret key used to sign JWTs. Use a strong, random value for production.
- `JWT_EXPIRATION`: Token expiration time in seconds (default: 86400 = 24 hours).

## Running the Application

To run the application with the environment variables:

```bash
./mvnw spring-boot:run
```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get JWT token
- `GET /api/auth/me`: Get current user information

### Materials

- `GET /api/materials`: List all materials
- `POST /api/materials`: Create a new material record
- `GET /api/materials/{id}`: Get a specific material
- `PUT /api/materials/{id}`: Update a material
- `DELETE /api/materials/{id}`: Delete a material

## Security

All API endpoints except for `/api/auth/register` and `/api/auth/login` require authentication. Include the JWT token in the Authorization header for all protected requests:

```
Authorization: Bearer your_jwt_token_here
```
