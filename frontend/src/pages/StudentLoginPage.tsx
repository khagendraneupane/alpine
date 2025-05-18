import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [formData, setFormData] = useState({ student_email: "", student_password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/students/login", formData);
            const { token } = response.data;

            // Save the token in localStorage
            localStorage.setItem("token", token);

            // Redirect to the dashboard
            navigate("/student-dashboard");
        } catch (error: any) {
            setError(error.response?.data?.error || "Login failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Student Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.student_email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.student_password}
                    onChange={handleChange}
                    required
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;