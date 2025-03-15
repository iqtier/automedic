# GarageSync
GarageSync is a Point of Sale (POS) system for automotive repair shops. The system aims to streamline operations by providing features such as service management, employee management, and user authentication. Although the project is not yet complete, it currently supports core functionalities with many more features planned for the future.

## INSTALLATION
## PREREQUISITES
- Node.js
- PostgreSQL

## Setup
### Clone the repository:

```sh
git clone https://github.com/iqtier/automedic.git
cd automedic
```

### Install dependencies:

```sh
npm install
```
Setup environment variables: Create a .env file in the root directory and add the following:

```env
DATABASE_URL=your_database_url
NEXT_PUBLIC_API_URL=your_api_url
```
Run database migrations:

```sh
npx prisma migrate dev --name init
```
Start the development server:

```sh
npm run dev
```

## Usage
Open your browser and navigate to http://localhost:3000 to see the application in action. You can add, edit, and delete services, manage employees, and handle authentication through the interface.

## Features
- User Authentication: Secure user authentication and role-based access.

- Employee Management: Manage employees' information and roles.

- Service Management: Add, edit, and delete automotive services.

## Planned Features
- Inventory Management: Track and manage inventory of parts and materials.

- Customer Management: Store and manage customer information and service history.

- Billing and Invoicing: Generate invoices and process payments.

- Reporting and Analytics: Generate reports and analyze business data.

- Appointment Scheduling: Schedule and manage repair appointments.

- Notifications: Send notifications for upcoming appointments and service reminders.

## Technologies
- Next.js: React framework for server-side rendering and generating static websites.

- TypeScript: Typed superset of JavaScript that compiles to plain JavaScript.

- React: JavaScript library for building user interfaces.

- Prisma: Next-generation ORM for Node.jsand TypeScript.

- PostgreSQL: Open-source relational database.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
