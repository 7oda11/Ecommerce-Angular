# E-Commerce Web Application

A full-stack e-commerce application built with Angular and .NET Core, featuring a modern UI and comprehensive user management system.

## Features

### Authentication & User Management
- **User Registration**
  - Email verification system
  - Password validation
  - User profile creation
  - Display name and username support

- **User Login**
  - Secure authentication
  - Remember me functionality
  - Password visibility toggle
  - Form validation with visual feedback

- **Password Management**
  - Forget password functionality
  - Email-based password reset
  - Secure token-based reset links
  - Password confirmation system

### User Interface
- Modern, responsive design using Bootstrap
- Interactive form validation
- Real-time feedback for user actions
- Loading states and spinners
- Toast notifications for user feedback

### Security Features
- JWT-based authentication
- Password encryption
- Email verification
- Secure password reset flow
- Form validation and sanitization

## Technical Stack

### Frontend
- Angular 17
- Bootstrap 5
- Font Awesome icons
- ngx-toastr for notifications
- Reactive Forms for form handling

### Backend
- .NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- Email Service Integration

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── shared/
│   │       └── Models/
│   │           ├── LoginDTO
│   │           ├── RegisterDTO
│   │           ├── ResetPasswordDTO
│   │           └── ActiveAccountDTO
│   ├── identity/
│   │   ├── login/
│   │   ├── register/
│   │   ├── reset-password/
│   │   └── identity.service.ts
│   └── shared/
└── assets/
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- .NET Core SDK (v7 or higher)
- SQL Server
- Angular CLI

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install frontend dependencies
```bash
cd client
npm install
```

3. Install backend dependencies
```bash
cd ../server
dotnet restore
```

4. Configure the database
- Update connection string in `appsettings.json`
- Run database migrations

5. Start the development servers

Frontend:
```bash
ng serve
```

Backend:
```bash
dotnet run
```

## API Endpoints

### Authentication
- `POST /api/Account/Register` - User registration
- `POST /api/Account/Login` - User login
- `POST /api/Account/active-account` - Email verification
- `GET /api/Account/send-email-forget-password` - Password reset request
- `POST /api/Account/reset-password` - Password reset

## Features in Detail

### User Registration
- Email and password validation
- Username and display name requirements
- Email verification system
- Success/error notifications

### Login System
- Email and password authentication
- Remember me functionality
- Password visibility toggle
- Form validation with visual feedback
- Loading states during authentication

### Password Reset
- Email-based reset request
- Secure token generation
- Password confirmation
- Visual feedback for all steps
- Automatic modal handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap for the UI components
- Font Awesome for the icons
- ngx-toastr for notifications
