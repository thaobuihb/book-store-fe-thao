Đây là giao diện người dùng của ứng dụng Book Store được xây dựng bằng **ReactJS** và **Material UI**, cho phép người dùng xem sách, thêm vào giỏ hàng, wishlist, đặt hàng và quản lý tài khoản; ad min có thể quản lý sách, đơn hàng, người dùng, danh mục...

---

## Tính Năng Chính

- Giỏ hàng, thêm/xoá/cập nhật số lượng sách
- Wishlist cho cả khách và người dùng đăng nhập
- Đăng ký / Đăng nhập / Đặt lại mật khẩu
- Thanh toán đơn hàng (COD hoặc PayPal giả)
- Xem lịch sử đơn hàng
- Duyệt sách theo danh mục, sách mới, sách nổi bật, sách giảm giá
- Trang admin: quản lý sách, người dùng, đơn hàng, danh mục

---

## Công Nghệ Sử Dụng

- ReactJS (Hooks, Context API / Redux)
- Material UI (MUI)
- Axios (REST API communication)
- React Router DOM
- React Hook Form + Yup (form validation)
- React Toastify (thông báo)
- LocalStorage + Sync hóa dữ liệu

---

## 📦 Các thư viện sử dụng

### ⚛️ React & Core
- react
- react-dom
- react-router-dom
- react-scripts

### 🎨 UI Framework – Material UI (MUI)
- @mui/material
- @mui/icons-material
- @mui/lab
- @emotion/react
- @emotion/styled

### 🌐 Đa ngôn ngữ (i18n)
- i18next
- react-i18next
- i18next-browser-languagedetector

### 🧠 Form & Validation
- react-hook-form
- @hookform/resolvers
- yup

### 🧰 Redux & State Management
- @reduxjs/toolkit
- react-redux
- redux-thunk
- redux-persist
- redux-mock-store

### 🌐 HTTP & Token
- axios
- jwt-decode
- js-cookie

### 💸 Thanh toán – PayPal
- @paypal/paypal-js
- @paypal/react-paypal-js

### 📦 Tải tệp & Upload
- react-dropzone
- cloudinary

### 🔢 Format & Hiệu suất
- numeral
- web-vitals

### 🎞️ Animation
- @react-spring/web

### 🛠 Khác
- swiper
- react-toastify
- ajv, ajv-keywords

### 🧪 Dev Dependencies
- @babel/core
- @babel/preset-env
- @babel/preset-react
- @babel/plugin-proposal-private-property-in-object
- babel-jest
- typescript

---

## 📦 Cài Đặt Dự Án

### Yêu cầu:
- Node.js: >=V22.1.0
- NPM: >=10.8.1

### Bước 1: Clone project
```bash
git clone https://github.com/thaobuihb/book-store-fe-thao.git
cd book-store-fe-thao
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình môi trường

Tạo file `.env` trong thư mục `client`:

```env
REACT_APP_BACKEND_API = http://localhost:5001/api
REACT_APP_BACKEND_API = https://final-project-be-zsty.onrender.com
```

### Bước 4: Khởi chạy frontend
```bash
npm start
```

Truy cập tại: [http://localhost:5001](http://localhost:5001)

---

## 📁 Cấu trúc thư mục

```
client/
│
├── public/
├── src/
│   ├── app/
│   │   ├── apiService.js      # Quản lý gọi API
│   │   ├── config.js          # Biến môi trường / cấu hình app
│   │   └── store.js           # Redux store
│   ├── components/            # Các component dùng chung (Button, Card, Modal...)
│   ├── context/               # Context API (AuthContext.js quản lý xác thực người dùng)
│   ├── features/              # Tính năng chia theo domain (admin, book, cart, order, category, user, wishlist)
│   ├── hooks/                 # Custom hooks (useAuth.js, v.v.)
│   ├── layout/                # Các thành phần bố cục như BlankLayout.js, MainHeader.js, MainFooter.js, MainLayout.js
│   ├── pages/
│   │   ├── BestSellerPage.js
│   │   ├── BookPage.js
│   │   ├── CartPage.js
│   │   ├── DetailPage.js
│   │   ├── ForgotPasswordPage.js
│   │   ├── HelpCenter.js
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── NotFoundPage.js
│   │   ├── OrderPage.js
│   │   ├── RegisterPage.js
│   │   ├── ResetPasswordPage.js
│   │   ├── ThankYouPage.js
│   │   ├── UnauthorizedPage.js
│   │   ├── UserProfilePage.js
│   │   └── WishlistPage.js
│   ├── pages/admin/
│   │   ├── AdminLayout.js
│   │   ├── BooksPage.js
│   │   ├── CategoriesPage.js
│   │   ├── DashboardPage.js
│   │   ├── OrdersPage.js
│   │   └── UsersPage.js
│   ├── routers/               # Quản lý route: AuthRequire.js, AdminOnlyRoute.js, index.js
│   ├── services/              # Gọi API theo domain 
│   ├── theme/                 # Cấu hình giao diện Material UI 
│   ├── utils/                 # Hàm tiện ích dùng chung 
│   ├── App.js                 # Component gốc của ứng dụng
│   └── index.js               # Điểm khởi chạy ứng dụng React
└── .env
```

---

## Lộ trình phát triển (Roadmap)

- [ ] Hỗ trợ giao diện Dark Mode
- [ ] Đáp ứng trang trên di động
- [ ] Thêm chức năng đánh giá & bình luận sách
- [ ] Gợi ý sách theo hành vi và lịch sử người dùng
- [ ] Đọc sách trực tuyến ngay trên website
- [ ] Hỗ trợ nghe sách dạng audio (Audiobook)
- [ ] Đa ngôn ngữ (Tiếng Việt / English)
- [ ] Thanh toán trực tuyến thực tế (VNPAY, MoMo, PayPal)
- [ ] Quản lý kho sách (dành cho admin)
- [ ] Xuất hóa đơn điện tử PDF sau khi mua hàng
- [ ] Trang dashboard nâng cao (thống kê doanh thu, lượt truy cập...)
---
