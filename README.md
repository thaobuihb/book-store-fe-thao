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
- Formik + Yup (form validation)
- Dayjs (xử lý thời gian)
- React Toastify (thông báo)
- LocalStorage + Sync hóa dữ liệu

---

## 📦 Cài Đặt Dự Án

### Yêu cầu:
- Node.js >= 16

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
```

### Bước 4: Khởi chạy frontend
```bash
npm start
```

Truy cập tại: [http://localhost:3000](http://localhost:3000)

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

