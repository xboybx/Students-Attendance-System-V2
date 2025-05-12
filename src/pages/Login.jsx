import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AttendanceTracker from "../components/AttendanceTracker";
import { PageTransition } from "../components/PageTransition";
import { LoginForm } from "../components/LoginForm";
import { NavigationButtons } from "../components/NavigationButtons";

function Login() {
  const navigate = useNavigate();
  const [showAttendanceTracker, setShowAttendanceTracker] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (!user) {
        setError("Invalid credentials");
        return;
      }

      if (user.role !== formData.role) {
        setError(
          `This email is registered as a ${user.role}. Please select the correct role.`
        );
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "teacher" ? "/dashboard" : "/student-dashboard");
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          <NavigationButtons
            showAttendanceTracker={showAttendanceTracker}
            setShowAttendanceTracker={setShowAttendanceTracker}
          />

          {showAttendanceTracker ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AttendanceTracker />
            </motion.div>
          ) : (
            <LoginForm
              formData={formData}
              setFormData={setFormData}
              error={error}
              onSubmit={handleSubmit}
            />
          )}

          <div className="mt-6 bg-gray-50 p-4 rounded-md text-sm text-gray-700">
            <h3 className="font-semibold mb-2">How to Use / Test the App:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Register students by providing their details on the registration
                page.
              </li>
              <li>
                Register teachers using a faculty email address (e.g.,
                teachername@faculty.edu).
              </li>
              <li>
                Login with the registered credentials selecting the correct
                role.
              </li>
              <li>
                Teachers can mark attendance and generate reports from their
                dashboard.
              </li>
              <li>
                Students can view their enrollment status on their dashboard.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default Login;
