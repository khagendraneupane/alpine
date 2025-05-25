import React, { useState } from "react";
import axios from "axios";

const AddServiceForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        rate: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        data.append("category", formData.category);
        data.append("description", formData.description);
        data.append("rate", formData.rate);
        data.append("image", image);

        try {
            const response = await axios.post("/api/services/create", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setStatusMessage("Service created successfully!");
            console.log("Created Service:", response.data);
        } catch (error) {
            console.error("Error creating service:", error);
            setStatusMessage("Failed to create service.");
        }
    };

    return (
        <div>
            <h2>Add Service</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Service Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="rate"
                    placeholder="Rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    required
                />
                <input type="file" accept="image/*" onChange={handleFileChange} required />
                <button type="submit">Add Service</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default AddServiceForm;