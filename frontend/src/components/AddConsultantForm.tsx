import React, { useState } from "react";
import axios from "axios";

const AddConsultantForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        email: "",
        phone: "",
        password: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            setStatusMessage("Please upload an image.");
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("specialization", formData.specialization);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("plain_password", formData.password);
        data.append("image", image);

        try {
            const response = await axios.post("/api/consultants/create", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setStatusMessage("Consultant added successfully!");
            console.log("Created Consultant:", response.data);
        } catch (error) {
            console.error("Error adding consultant:", error);
            setStatusMessage("Failed to add consultant.");
        }
    };

    return (
        <div>
            <h2>Add Consultant</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <input type="file" accept="image/*" onChange={handleFileChange} required />
                <button type="submit">Add Consultant</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default AddConsultantForm;