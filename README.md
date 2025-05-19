# Reusable Furniture Management System

A fullstack web application for tracking, filtering, and managing reusable furniture assets. The system enables organizations to efficiently add, edit, and remove furniture items, import/export data via CSV, upload images, and monitor recent activity-all through a modern, responsive interface.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Local Development](#setup--local-development)
- [User Manual](#user-manual)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Add, Edit, Delete Furniture**: Manage furniture records with detailed attributes and images.
- **Filtering & Search**: Find items by type, category, condition, or date.
- **Bulk Import/Export (CSV)**: Quickly add or export multiple records.
- **Image Upload**: Attach images to furniture items during creation or editing.
- **Activity Log**: Track recent additions, edits, and deletions.
- **Responsive UI**: Modern interface optimized for desktop and mobile.
- **Pagination**: Efficiently browse large inventories without performance loss.

---

## Tech Stack

### Frontend

- [React](https://react.dev/) (with [TypeScript](https://www.typescriptlang.org/))
- [Material UI](https://mui.com/) (component library)

### Backend

- [Spring Boot](https://spring.io/projects/spring-boot) (Java)
- RESTful API

### Database

- [MySQL](https://www.mysql.com/)

### Other Tools

- [Docker](https://www.docker.com/) (optional, for containerized development)
- [Apache POI](https://poi.apache.org/) (for Excel/CSV parsing)

---

## Setup & Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (for frontend)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Java 17+](https://adoptopenjdk.net/) (for backend)
- [Maven](https://maven.apache.org/) (for backend build)
- [MySQL](https://www.mysql.com/) server

### 1. Clone the Repository

- git clone [https://github.com/pahmel0/bachelor-project.git]
- in terminal cd bachelor-project


### 2. Backend Setup

- Create a MySQL database (e.g., `furniture_db`).
- Update `src/main/resources/application.properties` with your database credentials.
- Update .env file with JWT secret(visit backend folder for more INFO).
- Build and run the backend:

- cd backend
- mvn clean install
- mvn spring-boot:run

### 3. Frotend Setup

- cd frontend
- npm run dev

- The application can be accessed at [http://localhost:5173](http://localhost:5173)

### 4. (Optional) Docker Compose

If you prefer containerized development, use the provided `docker-compose.yml` to spin up the frontend, backend, and MySQL services.

docker-compose up --build
---

## User Manual

1. **Login/Register**: Access the application with your credentials.
2. **Dashboard**: View all furniture items and recent activity.
3. **Add Furniture**: Click "Add" and fill in the details. Upload images as needed.
4. **Edit/Delete**: Select an item to edit or remove it from the system.
5. **Filter/Search**: Use filters or the search bar to find specific items.
6. **Bulk Import**: Use the "Import CSV" option to upload multiple items at once. Download the template for correct formatting.
7. **Export**: Download the current inventory or activity log as a CSV file.
8. **Activity Log**: Monitor recent changes for transparency and auditing.
9. **Logout**: End your session securely.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements, bug fixes, or new features. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
