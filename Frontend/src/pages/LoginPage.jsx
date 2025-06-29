import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import  Bg_login  from "../assets/image/bg_login.jpg";

import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/userService";



export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(username, password);
      console.log("Login successful:", data);
      navigate("/"); // Redirect to home page on success
    } catch (error) {
      console.error("Login failed:", error);
        setError(error.message || "Đăng nhập không thành công");
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
            Đăng nhập
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 rounded-xl ">
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

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Button
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
              Bạn chưa có tài khoản?
              <Link
                to="/register"
                className="text-white ml-1 hover:underline"
              >
                Đăng ký
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
