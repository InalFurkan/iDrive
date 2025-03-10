# iDrive - Cloud Storage Platform

## Overview

iDrive is a cloud-based file storage application that allows users to securely store, manage, and access their files online. The platform provides a user-friendly interface to interact with a cloud storage service via API requests. Users can log in with their credentials, manage their files and folders, and perform various file operations seamlessly.

## Features

- **User Authentication:** Secure login system using API-based authentication. On successful login, a `ticketId` is received and stored in a session.
- **File & Folder Management:**
  - View files and folders in a **grid view** with icons representing file types.
  - **Create, rename, and delete folders.**
  - **Upload, rename, and delete files.**
  - Navigate through folders and manage contents efficiently.
- **Session Handling:** Users remain logged in until they manually log out or the session times out.
- **API Integration:** All data and actions are managed through API requests to the company's test servers.

## Technologies Used

- **Programming Language:** JavaScript (Frontend and Backend)
- **Backend Framework:** Node.js with Express.js
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **UI Components:** Bootstrap for styling and responsive design
- **API Requests:** Fetch/AJAX for handling API communications
- **Session Management:** express-session for managing user sessions

## Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/InalFurkan/iDrive.git
   cd iDrive
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Run the Application:**
   ```bash
   npm start
   ```
4. **Configure API Access:** Ensure you have API access credentials and update the relevant config file if needed.

## Usage

1. **Login with valid credentials.**
   - **Demo Credentials:**
     - **Username:** Test
     - **Password:** 123456Abc.
2. **Navigate and manage files & folders.**
3. **Perform actions like uploading, renaming, and deleting files/folders.**
4. **Logout when done.**

## Contribution

Contributions are welcome! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.
