# Students Attendance System

**Author:Jaswanth**

## Table of Contents
- [Project Purpose](#project-purpose)
- [Features](#features)
- [Getting Started](#getting-started)
- [User Registration](#user-registration)
  - [Student Registration](#student-registration)
  - [Teacher Registration](#teacher-registration)
- [How the Project Works](#how-the-project-works)
  - [Role of Students](#role-of-students)
  - [Role of Teachers](#role-of-teachers)
- [Attendance Management](#attendance-management)
  - [Marking Attendance](#marking-attendance)
  - [Attendance Reports](#attendance-reports)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Project Purpose
The Students Attendance System is a web application designed to facilitate the management of student attendance in educational institutions. The application allows teachers to mark attendance for their classes and generate reports, while students can register and enroll in their respective batches.

## Features
- User authentication for students and teachers.
- Registration forms for students and teachers.
- Dashboard for students to view their enrollment status.
- Dashboard for teachers to mark attendance and view enrolled students.
- Generation of attendance reports in PDF format.

## Getting Started
To get started with the project, clone the repository and install the necessary dependencies.

```bash
git clone <repository-url>
cd Students-Attendance-System-V2
npm install
npm run dev
```

## User Registration

### Student Registration
Students can register by navigating to the registration page. They need to provide their full name, roll number, and select a batch. Upon successful registration, their details are stored in local storage, and they can enroll in a batch.

### Teacher Registration
Teachers can register similarly by providing their details. They must use a specific email format (e.g., teachername@faculty.edu) to be eligible for registration. Once registered, they can access the teacher dashboard to manage attendance.

## How the Project Works

### Role of Students
1. **Registration**: Students register by providing their personal details and selecting a batch.
2. **Enrollment**: After registration, students can enroll in their respective batches, which allows them to be tracked for attendance.
3. **Dashboard Access**: Students can log in to their dashboard to view their enrollment status and any relevant information.

### Role of Teachers
1. **Registration**: Teachers register by providing their personal details and must use a faculty email address.
2. **Dashboard Access**: After logging in, teachers access their dashboard where they can view all enrolled students in their classes.
3. **Marking Attendance**: Teachers select a batch and mark attendance for each student by toggling their status as present or absent.
4. **Generating Reports**: After marking attendance, teachers can generate and download attendance reports in PDF format, summarizing the attendance statistics for their classes.

## Attendance Management

### Marking Attendance
Teachers can mark attendance by selecting a batch from their dashboard. They can toggle the attendance status (present/absent) for each student. Once the attendance is marked, they can submit it, which saves the data in local storage.

### Attendance Reports
After submitting attendance, teachers can generate a report summarizing the attendance statistics. The report includes the number of present and absent students and can be downloaded as a PDF.

## Technologies Used
- React
- Vite
- Tailwind CSS
- Framer Motion
- jsPDF

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

