import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Bg_login from "../assets/image/bg_login.jpg";

import { registerUser } from "../services/userService";

import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmError("Mật khẩu xác nhận không khớp");
    } else {
      setConfirmError("");
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(">>> Submit called");

    try {
      const data = await registerUser(username, password);
      console.log("Registration successful:", data);
      navigate("/login"); // Redirect to login page on success
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.message || "Đăng ký không thành công");
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url(${Bg_login})`,
        }}
      ></div>

      <div className="relative z-10 flex justify-center items-center min-h-screen">
        <div className="bg-white/30 backdrop-blur-md p-10 rounded-md w-full max-w-md">
          <h2 className="text-white text-2xl font-bold mb-6 text-center">
            Đăng ký
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 p-8 rounded-xl "
          >
            <TextField
              fullWidth
              label="Username"
              variant="filled"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{ className: "bg-[#333] text-white rounded-md" }}
              InputLabelProps={{ className: "text-[#aaa]" }}
            />

            <TextField
              fullWidth
              label="Mật khẩu"
              variant="filled"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{ className: "bg-[#333] text-white rounded-md" }}
              InputLabelProps={{ className: "text-[#aaa]" }}
            />

            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              variant="filled"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmError}
              helperText={confirmError}
              InputProps={{ className: "bg-[#333] text-white rounded-md" }}
              InputLabelProps={{ className: "text-[#aaa]" }}
            />

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <Button
              disabled={
                !username || !password || !confirmPassword || !!confirmError
              }
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                bgcolor: "#99BAB9",
                borderRadius: 2,
                fontWeight: 600,
                mt: 1,
                "&:hover": { bgcolor: "#85D6D4" },
              }}
            >
              Đăng nhập
            </Button>

            <div className="mt-2 text-sm text-center text-gray-300">
              Bạn đã có tài khoản?
              <Link to="/login" className="text-white ml-1 hover:underline">
                Đăng nhập
              </Link>
            </div>

            <div className="text-sm text-center text-gray-300">
              <Link to="/auth/reset-password" className="hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
