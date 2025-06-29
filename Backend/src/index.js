const express = require('express');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const route = require('./routes');
const db = require('./config/db');

// Load biến môi trường từ file .env
dotenv.config({ path: './.env' });

// Kết nối MongoDB
db.connect();

// Port của ứng dụng
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Ứng dụng đang chạy trên cổng ${PORT}`);
});

// ✅ Cấu hình CORS (QUAN TRỌNG: đặt trước các middleware và route)
app.use(cors({
  origin: 'https://flashcard-beyeu.onrender.com', // Thay bằng domain FE của bạn trên Render
  credentials: true // Cho phép gửi cookie/session
}));

// Middleware để parse dữ liệu
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('combined'));

// Sử dụng express-session và connect-mongo để lưu session vào MongoDB
app.use(session({
  secret: 'your-secret-key', // Nên để trong biến môi trường
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb+srv://minhhiendev:g4E39INKCZkkqlC0@cluster0.vicsyot.mongodb.net/FlashCard?retryWrites=true&w=majority&appName=Cluster0',
    collectionName: 'sessions'
  }),
  cookie: {
    secure: false, // Nếu dùng HTTPS thì đặt true
    maxAge: 30 * 60 * 1000 // 30 phút
  }
}));

// Gán session vào biến locals để sử dụng trong view nếu cần
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Gọi hàm để khởi tạo toàn bộ routes
route(app);
