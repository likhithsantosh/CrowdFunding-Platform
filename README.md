# CrowdFunding-Platform


A full-stack crowdfunding platform inspired by Kickstarter, where users can create and support creative projects.



---

## 🚀 Features

- 🔐 JWT-based Authentication (Login / Signup / Logout)
- 📝 Create and manage crowdfunding posts
- 💰 Fund projects with custom amounts
- 📊 Funding progress bar
- ❤️ Like and delete posts (only by creators)
- 🧑‍💼 User Profile page (view your own posts)
- 🔍 Explore/filter posts by category or funding status
- 🎨 Responsive design using HTML, CSS, and JS

---

## 🛠️ Tech Stack

### Frontend:
- HTML5, CSS3
- JavaScript (Vanilla)
- Responsive design with Grid/Flexbox

### Backend:
- Node.js + Express
- MongoDB (via Mongoose)
- JWT for Auth
- File storage (images via links or uploads)

---

## 🔐 Auth Structure

- JWT token stored in `localStorage`
- Protected routes with middleware
- Only post creators can delete their posts

---



