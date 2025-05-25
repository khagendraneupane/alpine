import React, { useState, useEffect } from "react";
import axios from "axios";

interface UpdateServiceFormProps {
    serviceId: string;
}

const UpdateServiceForm = ({ serviceId }: UpdateServiceFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        rate: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");

    useEffect(() => {
        // Fetch the existing service details
        const fetchService = async () => {
            try {
                const response = await axios.get(`/api/services/${serviceId}`);
                const { name, category, description, rate } = response.data;
                setFormData({ name, category, description, rate });
            } catch (error) {
                console.error("Error fetching service:", error);
                setStatusMessage("Failed to fetch service details.");
            }
        };

        fetchService();
    }, [serviceId]);

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

        const data = new FormData();
        data.append("name", formData.name);
        data.append("category", formData.category);
        data.append("description", formData.description);
        data.append("rate", formData.rate);
        if (image) {
            data.append("image", image);
        }

        try {
            const response = await axios.patch(`/api/services/${serviceId}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setStatusMessage("Service updated successfully!");
            console.log("Updated Service:", response.data);
        } catch (error) {
            console.error("Error updating service:", error);
            setStatusMessage("Failed to update service.");
        }
    };

    return (
        <div>
            <h2>Update Service</h2>
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
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Update Service</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default UpdateServiceForm;