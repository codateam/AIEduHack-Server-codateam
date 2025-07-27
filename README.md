# Project Documentation: FYP-backend

## Overview

FYP-backend is a Node.js backend application built with TypeScript and MongoDB (using Mongoose ODM). It provides RESTful APIs for managing courses, users, enrollments, exams, and related academic resources for a university or educational institution.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Database Schema](#database-schema)
   - [Course Schema](#course-schema)
   - [Other Schemas](#other-schemas)
3. [API Endpoints](#api-endpoints)
4. [Setup & Installation](#setup--installation)
5. [Logging & Error Handling](#logging--error-handling)
6. [Authentication](#authentication)

---

## Project Structure

```
FYP-backend/
├── config/           # Configuration files (passport, logger, etc.)
├── core/
│   ├── commons/      # Common utilities and shared code
│   ├── middlewares/  # Express middlewares (auth, error handling, etc.)
│   └── modules/      # Main business logic modules (auth, course, exam, etc.)
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── server.ts         # Application entry point
├── package.json      # Project dependencies and scripts
└── ...
```

---

## Database Schema

The application uses MongoDB as its database, with Mongoose for schema definition and data modeling. Below is a detailed description of the main schema:

### Course Schema (`core/modules/course/course.model.ts`)

Represents a university course.

| Field           | Type                        | Required | Description                               |
| --------------- | --------------------------- | -------- | ----------------------------------------- |
| code            | String                      | Yes      | Unique course code (e.g., CSC101)         |
| title           | String                      | Yes      | Course title                              |
| description     | String                      | No       | Course description                        |
| creditUnit      | Number                      | Yes      | Number of credit units (min: 1)           |
| level           | Number (100/200/...)        | Yes      | Academic level (100, 200, 300, 400, 500)  |
| semester        | String ("First"/"Second")   | Yes      | Semester in which the course is offered   |
| department      | String                      | Yes      | Department offering the course            |
| lecturers       | [ObjectId] (User reference) | Yes      | Array of lecturer IDs teaching the course |
| courseMaterials | [String]                    | No       | Array of course material file paths/URLs  |
| createdAt       | Date                        | Auto     | Timestamp of creation                     |
| updatedAt       | Date                        | Auto     | Timestamp of last update                  |

#### Example (Mongoose Schema):

```typescript
const courseSchema = new Schema<ICourse>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    creditUnit: { type: Number, required: true, min: 1 },
    level: { type: Number, required: true, enum: [100, 200, 300, 400, 500] },
    semester: { type: String, required: true, enum: ["First", "Second"] },
    department: { type: String, required: true, trim: true },
    lecturers: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    courseMaterials: [{ type: String, default: [] }],
  },
  { timestamps: true },
);
```

#### Notes:

- `lecturers` is an array of references to the `User` model (lecturer accounts).
- `courseMaterials` is an array of strings (file paths or URLs to materials).
- Timestamps (`createdAt`, `updatedAt`) are managed automatically by Mongoose.

---

### Other Schemas and Relationships

Below are the main database schemas and how they relate to each other:

#### User Schema (`core/modules/auth/auth.model.ts`)

Represents all users (students, lecturers, admins).

| Field       | Type    | Required | Description                       |
| ----------- | ------- | -------- | --------------------------------- |
| firstName   | String  | No       | User's first name                 |
| lastName    | String  | No       | User's last name                  |
| middleName  | String  | No       | User's middle name                |
| email       | String  | Yes      | Unique email address              |
| matricNo    | String  | No       | Student matriculation number      |
| password    | String  | Yes      | Hashed password                   |
| profilepics | String  | No       | Profile picture URL/path          |
| role        | String  | Yes      | 'admin', 'lecturer', or 'student' |
| userToken   | Boolean | No       | Token status                      |
| createdAt   | Date    | Auto     | Created timestamp                 |
| updatedAt   | Date    | Auto     | Updated timestamp                 |

- **Relationships:**
  - Referenced by `Course.lecturers` (as lecturers)
  - Referenced by `Enrollment.student` (as students)
  - Referenced by `Exam.lecturer` (as exam creator)
  - Referenced by `Answer.student` (as answer owner)
  - Referenced by `Token.userId` (for authentication)

---

#### Enrollment Schema (`core/modules/enrollment/enrollment.model.ts`)

Tracks which students are enrolled in which courses.

| Field      | Type     | Required | Description                                |
| ---------- | -------- | -------- | ------------------------------------------ |
| student    | ObjectId | Yes      | Reference to User (student)                |
| course     | ObjectId | Yes      | Reference to Course                        |
| level      | Number   | Yes      | Academic level                             |
| semester   | String   | Yes      | 'First' or 'Second'                        |
| session    | String   | Yes      | Academic session (e.g., '2024/2025')       |
| status     | String   | Yes      | 'active', 'completed', 'dropped', 'failed' |
| score      | Number   | No       | Final score                                |
| grade      | String   | No       | Final grade (A-F)                          |
| enrolledAt | Date     | Auto     | Enrollment timestamp                       |

- **Relationships:**
  - Links `User` (student) and `Course` (course)

---

#### Exam, Question, and Answer Schemas (`core/modules/exam/exam.model.ts`)

- **Exam Schema:** Represents an exam for a course.

  - Fields: `title`, `course` (ref: Course), `lecturer` (ref: User), `session`, `semester`, `examType`, `duration`, `startTime`, `endTime`, `totalMarks`, `isPublished`, `createdAt`
  - **Relationships:**
    - References `Course` (the course being examined)
    - References `User` (lecturer who created the exam)
    - Referenced by `Question.exam` and `Answer.exam`

- **Question Schema:** Represents a question in an exam.

  - Fields: `exam` (ref: Exam), `type` (mcq/theory/german), `text`, `options`, `correctAnswer`, `mark`
  - **Relationships:**
    - References `Exam` (the exam this question belongs to)
    - Referenced by `Answer.question`

- **Answer Schema:** Represents a student's answer to a question.
  - Fields: `student` (ref: User), `exam` (ref: Exam), `question` (ref: Question), `selectedAnswer`, `writtenAnswer`, `score`, `graded`, `remainingTime`
  - **Relationships:**
    - References `User` (student), `Exam`, and `Question`

---

#### Token Schema (`core/modules/auth/token.model.ts`)

Stores authentication tokens for users.

| Field      | Type   | Required | Description               |
| ---------- | ------ | -------- | ------------------------- |
| token      | String | Yes      | JWT or session token      |
| userId     | String | Yes      | Reference to User         |
| expiryDate | Date   | No       | Expiry date for the token |

- **Relationships:**
  - References `User` (userId)

---

### Entity Relationship Overview

- **User**: Can be a student, lecturer, or admin. Lecturers are assigned to courses. Students enroll in courses. Both students and lecturers can participate in exams (students take, lecturers create/grade).
- **Course**: Has one or more lecturers (User), and many students (via Enrollment).
- **Enrollment**: Connects students (User) to courses.
- **Exam**: Belongs to a course and is created by a lecturer (User).
- **Question**: Belongs to an exam.
- **Answer**: Connects a student (User) to a question in an exam.
- **Token**: Used for authentication, linked to a user.

---

## API Endpoints

- **Authentication**: `/api/auth/`
- **Courses**: `/api/courses/`
- **Enrollment**: `/api/enrollments/`
- **Exams**: `/api/exams/`

Refer to the route files in each module for detailed endpoint documentation.

---

## Setup & Installation

1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables as needed.
4. Start the server:
   ```sh
   npm run dev
   ```

---

## Logging & Error Handling

- Logs are stored in `exception.log`, `info.log`, and `rejections.log`.
- Centralized error handling middleware is used for consistent API error responses.

---

## Authentication

- Uses Passport.js for authentication.
- JWT tokens are used for securing API endpoints.

---

## Contribution

- Follow best practices for TypeScript and Node.js.
- Write unit tests for new features.

---

## License

Specify your license here.
