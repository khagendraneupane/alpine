import React, { useState } from "react";
import axios from "axios";

const StudentSignupPage = () => {
    const [formData, setFormData] = useState({
        student_name: "",
        student_email: "",
        student_phone: "",
        student_nationality: "",
        student_password: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Update the corresponding field in formData
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear any previous errors
        setSuccessMessage(""); // Clear any previous success messages

        try {
            // Send the form data to the backend
            const response = await axios.post("/api/students/signup", formData);

            // Handle success
            setSuccessMessage("Signup successful! Please log in.");
            setFormData({
                student_name: "",
                student_email: "",
                student_phone: "",
                student_nationality: "",
                student_password: "",
            }); // Reset the form
        } catch (error: any) {
            // Handle error
            setError(error.response?.data?.error || "Signup failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Student Signup</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="student_name"
                    placeholder="Name"
                    value={formData.student_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="student_email"
                    placeholder="Email"
                    value={formData.student_email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="student_phone"
                    placeholder="Phone"
                    value={formData.student_phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="student_nationality"
                    placeholder="Nationality"
                    value={formData.student_nationality}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="student_password"
                    placeholder="Password"
                    value={formData.student_password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Signup</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
    );
};

export default StudentSignupPage;