InstaBook is a server-rendered web application for sharing books and reviews with a community of readers.

Users can create an account, personalise their profile, add books they have read, write reviews, assign ratings, and upload images for both their profile and book entries. The home page displays community members and recent review activity, making it easy to discover other readers and their content.

- Main Features:
User registration and login.

Secure password hashing with bcrypt.

Editable user profiles with avatar uploads.

Optional reading-preference selection.

Create, edit, and delete book reviews.

Book details including title, genre, author, publication year, publisher, review, rating, and cover image.

Star-rating display for reviews.

Community page with registered users and recent book activity.

Validation for required fields, duplicate emails, and publication-year input.

Soft deletion for user accounts and related books.

- Technologies Used:
Node.js

Express

EJS for server-side rendered views

MySQL with mysql2

bcrypt for password hashing

Multer for user-avatar and book-cover uploads

Bootstrap 5 for responsive interface components

CSS for custom styling


- Purpose:
This project was developed to practice a complete CRUD application using the MVC-style structure provided by Express. It combines server-side rendering, relational database management, authentication logic, file uploads, form validation, and dynamic EJS templates.

The main goal was to build a functional community platform while strengthening backend fundamentals such as route handling, controllers, SQL queries, database relationships, password security, and managing user-generated content.
