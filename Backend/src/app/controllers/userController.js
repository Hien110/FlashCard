const User = require("../models/User");

class userController {
  async registerUser(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Yêu cầu username và mật khẩu" });
      }
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username đã tồn tại" });
      }
      const newUser = new User({ username, password });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "Đăng ký người dùng thành công", data: newUser });
    } catch (error) {
      console.error("Lỗi đăng ký người dùng:", error);
      return res
        .status(500)
        .json({ message: "Đăng ký người dùng thất bại", error: error.message });
    }
  }

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Yêu cầu username và mật khẩu" });
      }
      const user = await User.findOne({ username, password });
      if (!user) {
        return res.status(401).json({ message: "Thông tin đăng nhập không hợp lệ" });
      }
      req.session.user = user; // Lưu thông tin người dùng vào session
      return res.status(200).json({ message: "Đăng nhập thành công", data: user });
    } catch (error) {
      console.error("Lỗi đăng nhập người dùng:", error);
      return res
        .status(500)
        .json({ message: "Đăng nhập người dùng thất bại", error: error.message });
    }
  }
}

module.exports = new userController();
