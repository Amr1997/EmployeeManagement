# Fullstack Project

## Project Overview
This project consists of two parts:
1. **API Backend:** Built using Django and Django Rest Framework (DRF) with PostgreSQL as the database.
2. **Frontend:** Built using React with Redux Toolkit (RTK) for state management.

### API Backend Setup
#### Steps to Setup the Backend:
1. **Navigate to the API Directory:**
   ```bash
   cd api
   ```

2. **Create a Virtual Environment:**
   ```bash
   virtualenv env
   ```

3. **Activate the Virtual Environment:**
   - On Windows:
     ```bash
     env\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source env/bin/activate
     ```

4. **Create the .env File:**
   Add the following credentials:
   ```plaintext
   SECRET_KEY=
   DEBUG=True
   DATABASE_NAME=
   DATABASE_USER=
   DATABASE_PASSWORD=
   DATABASE_HOST=
   DATABASE_PORT=
   ```

5. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Run Django Migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create a Superuser:**
   ```bash
   python manage.py createsuperuser
   ```
   Provide email and password during the setup.

8. **Run the Server:**
   ```bash
   python manage.py runserver
   ```

9. **API Documentation:**
   Visit the Swagger documentation at:
   ```plaintext
   /swagger/
   ```

### Frontend Setup
#### Steps to Setup the Frontend:
1. **Navigate to the Frontend Directory:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

---

## Task Completion Checklist
### Backend Tasks
1. **Models:**
   - **User Accounts:**
     - [x] User Name
     - [x] Email Address (Login ID)
     - [x] Role
   - **Company:**
     - [x] Company Name
     - [x] Number of Departments
     - [x] Number of Employees
   - **Department:**
     - [x] Company (Select)
     - [x] Department Name
     - [x] Number of Employees
   - **Employee:**
     - [x] Company (Select)
     - [x] Department (Select)
       - [x] Only departments related to the selected company
     - [x] Employee Status (Workflow managed)
     - [x] Employee Name
     - [x] Email Address
     - [x] Mobile Number
     - [x] Address
     - [x] Designation
     - [x] Hired On (If applicable)
     - [x] Days Employed (If applicable)

2. **Validations & Business Logic:**
   - [x] Validate all required fields.
   - [x] Validate email addresses and mobile numbers format.
   - [x] Automatically calculate company and department statistics.
   - [x] Handle cascading deletions properly.
   - [x] Provide error handling and messages.

3. **Workflow:**
   - [x] Onboarding process with stages:
     - Application Received, Interview Scheduled, Hired, Not Accepted.
   - [x] Define allowed transitions between stages.

4. **Security & Permissions:**
   - [x] Implement role-based access control.
   - [x] Secure authentication and authorization.

5. **APIs:**
   - [x] CRUD for Company, Department, Employee.
   - [x] RESTful conventions and secure data handling.
   - [x] Swagger API documentation.

6. **Testing (Bonus):**
   - [x] Unit tests.
   - [x] Integration tests.

### Frontend Tasks
1. **User Interface:**
   - [x] Login Page with secure authentication.
   - [x] Company Management:
     - [x] List Companies Page.
     - [x] View Company Page.
   - [x] Department Management:
     - [x] List Departments Page.
     - [x] View Department Page.
   - [x] Employee Management:
     - [x] List Employees Page.
     - [x] Create Employee Page.
     - [x] Edit Employee Page.
     - [x] View Employee Page.
   - [x] User Account Management (Bonus).
   - [x] Summary Dashboard (Bonus).

2. **Validations:**
   - [x] Validate required fields.
   - [x] Validate email and mobile number formats.
   - [x] Ensure correct department filtering.
   - [x] Provide user-friendly error messages.

---

### Notes
- All tasks listed in the checklist have been completed.
- The project uses Django Rest Framework for APIs, PostgreSQL for the database, React for the frontend, and Redux Toolkit (RTK) for state management.
- The project follows best practices for security, validations, and UI/UX design.

- Used JWT for Authintication and Custom Permissions for authorization 