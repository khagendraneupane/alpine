import React, { useEffect, useState } from "react";
import { ConsultantInput } from "../network/consultant_api";
import { useForm } from "react-hook-form";
import axios from "axios";

interface Consultant {
    _id: string;
    name: string;
    specialization: string;
    email: string;
    phone: string;
    image: string;
    password: string;
}

interface AddEditConsultantDialogProps {
    consultantToEdit?: Consultant;
    onDismiss: () => void;
    onConsultantSaved: (consultant: Consultant) => void;
}

const AddEditConsultantDialog = ({
    consultantToEdit,
    onDismiss,
    onConsultantSaved,
}: AddEditConsultantDialogProps) => {
    const [consultants, setConsultants] = useState<Consultant[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ConsultantInput>({
        defaultValues: {
            name: consultantToEdit?.name || "",
            specialization: consultantToEdit?.specialization || "",
            email: consultantToEdit?.email || "",
            phone: consultantToEdit?.phone || "",
            image: undefined,
            password: consultantToEdit?.password || "",
        },
    });

    const onSubmit = async (data: ConsultantInput) => {
        try {
            // Call API to save consultant
            console.log("Consultant Data:", data);
            const imageString = data.image && data.image instanceof FileList && data.image[0] 
                ? URL.createObjectURL(data.image[0]) 
                : "";
            onConsultantSaved({ ...data, image: imageString, _id: consultantToEdit?._id || "new" });
        } catch (error) {
            console.error("Error saving consultant:", error);
        }
    };

    useEffect(() => {
        const fetchConsultants = async () => {

            try {
                const response = await axios.get("/api/consultants");
                setConsultants(response.data);
            } catch (error) {
                console.error("Error fetching consultants:", error);
            }
        };

        fetchConsultants();
    }, []);

    return (
        <>
        <div>
        {consultants.map((consultant) => (
                <option key={consultant._id} value={consultant._id}>
                    {consultant.name}
                    {" - " + consultant.specialization}
                    {" - " + consultant.email}
                </option>
            ))}
        </div>
        <div>
            <h2>{consultantToEdit ? "Edit Consultant" : "Add Consultant"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p>{errors.name.message}</p>}

                <input
                    type="text"
                    placeholder="Specialization"
                    {...register("specialization", { required: "Specialization is required" })}
                />
                {errors.specialization && <p>{errors.specialization.message}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p>{errors.email.message}</p>}

                <input
                    type="text"
                    placeholder="Phone"
                    {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && <p>{errors.phone.message}</p>}

                <input
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p>{errors.password.message}</p>}

                <input type="file" accept="image/*" {...register("image")} />

                <button type="submit" disabled={isSubmitting}>
                    {consultantToEdit ? "Save Changes" : "Add Consultant"}
                </button>
            </form>
            <button onClick={onDismiss}>Cancel</button>
        </div>
        </>
    );
};

export default AddEditConsultantDialog;