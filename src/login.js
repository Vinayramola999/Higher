import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import loginImage from "./Assets/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  const handleEmailVerify = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post("http://higher.co.in:3001/mail-verify", { email });
      if (response.data.message === "User found. You can proceed to login.") {
        setIsEmailVerified(true);
        setSuccess("Email verified! Please enter your password.");
        setError("");
      } else {
        setError("Unexpected response.");
      }
    } catch (err) {
      setError("Error verifying email. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    if (!recaptchaToken) {
      alert("Please verify the reCAPTCHA before submitting.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://higher.co.in:3001/login", {
        email,
        password,
        recaptchaToken,
      });
      const { token, userId } = response.data;
      if (token && userId) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        setSuccess("Login successful!");
        setError("");
        setTimeout(() => navigate("/assets"), 1000);
      } else {
        throw new Error("Token or User ID not received");
      }
    } catch (err) {
      setError("Invalid email or password.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    
    <div className="min-h-screen flex flex-col md:flex-row bg-grey-100">
      {/* Left side: Image */}
      <div className="md:w-1/2 h-full">
        <img
          src={loginImage}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side: Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-center text-blue-600 mb-6">
            Welcome
          </h2>

          <form onSubmit={isEmailVerified ? handleLogin : handleEmailVerify}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            {isEmailVerified && (
              <div className="mb-6 relative">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            )}

            {isEmailVerified && (
              <div className="mb-6">
                <ReCAPTCHA
                  sitekey="6LfKfF0qAAAAAIM87fTQ4wVycH6yB-1NtFl-55Lx"
                  onChange={handleRecaptchaChange}
                  action="LOGIN"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 text-white font-bold rounded-lg 
              ${isEmailVerified && recaptchaToken ? "bg-blue-600" : "bg-gray-400"} 
              ${isEmailVerified && recaptchaToken ? "hover:bg-blue-700" : "cursor-not-allowed"}`}
              disabled={isEmailVerified && !recaptchaToken}
            >
              {isEmailVerified ? "Login" : "Verify Email"}
            </button>

            {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
            {success && (
              <div className="mt-4 text-green-600 text-sm">{success}</div>
            )}
          </form>
        </div>
      </div>
    </div>
    
  );
};

export default Login;
