import { useForm } from "react-hook-form";
import { Student } from "../models/student";
import { SignUpCredentials } from "../network/appointment_api";
import * as AppointmentsApi from "../network/appointment_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { useState } from 'react';
import { ConflictError } from "../errors/http_errors";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: Student) => void,
}

const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>();

    async function onSubmit(credentials: SignUpCredentials) {
        try {
            const newUser = await AppointmentsApi.signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            if (error instanceof ConflictError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);
        }
    }

    return (
        // <Modal show onHide={onDismiss}>
        //     <Modal.Header closeButton>
        //         <Modal.Title>
        //             Sign Up
        //         </Modal.Title>
        //     </Modal.Header>

        //     <Modal.Body>
        //         {errorText &&
        //             <Alert variant="danger">
        //                 {errorText}
        //             </Alert>
        //         }
        //         <Form onSubmit={handleSubmit(onSubmit)}>
        //             <TextInputField
        //                 name="student_name"
        //                 label="Name"
        //                 type="text"
        //                 placeholder="Enter Your Name"
        //                 register={register}
        //                 registerOptions={{ required: "Required" }}
        //                 error={errors.student_name}
        //             />
        //             <TextInputField
        //                 name="student_email"
        //                 label="Email"
        //                 type="email"
        //                 placeholder="Enter Your Email"
        //                 register={register}
        //                 registerOptions={{ required: "Required" }}
        //                 error={errors.student_email}
        //             />
        //             <TextInputField
        //                 name="user_phone"
        //                 label="Phone"
        //                 type="text"
        //                 placeholder="Enter your phone number"
        //                 register={register}
        //                 registerOptions={{ required: "Required" }}
        //                 error={errors.student_phone}
        //             />
        //             <TextInputField
        //                 name="student_nationality"
        //                 label="Nationality"
        //                 type="text"
        //                 placeholder="Enter your Nationality"
        //                 register={register}
        //                 registerOptions={{ required: "Required" }}
        //                 error={errors.student_nationality}
        //             />

        //             <TextInputField
        //                 name="Student_password"
        //                 label="Password"
        //                 type="password"
        //                 placeholder="Enter your Password"
        //                 register={register}
        //                 registerOptions={{ required: "Required" }}
        //                 error={errors.student_password}
        //             />
        //             <Button
        //                 type="submit"
        //                 disabled={isSubmitting}
        //                 className={styleUtils.width100}>
        //                 Sign Up
        //             </Button>
        //         </Form>
        //     </Modal.Body>

        // </Modal>

        <Modal show onHide={onDismiss}>
        <Modal.Header closeButton>
            <Modal.Title>Signup Now</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/* Form to add appointment */}
            <Form id="signUpForm" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Student Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Your Name"
                        isInvalid={!!errors.student_name}
                        {...register("student_name", { required: "Student Name is required" })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.student_name?.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter Your Email"
                        isInvalid={!!errors.student_email}
                        {...register("student_email", { required: "Email is required" })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.student_email?.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your phone number"
                        isInvalid={!!errors.student_phone}
                        {...register("student_phone", { required: "Phone is required" })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.student_phone?.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nationality</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your Nationality"
                        isInvalid={!!errors.student_nationality}
                        {...register("student_phone", { required: "nationality is required" })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.student_nationality?.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your Password"
                        isInvalid={!!errors.student_password}
                        {...register("student_password", { required: "Password is required" })}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.student_password?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button
                type="submit"
                form="signUpForm"
                disabled={isSubmitting}
            >
                Book Appointment
            </Button>
        </Modal.Footer>
    </Modal>
    );
}

export default SignUpModal;