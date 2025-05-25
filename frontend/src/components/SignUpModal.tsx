import { useState } from 'react';
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConflictError } from "../errors/http_errors";
import { Student } from "../models/student";
import * as AppointmentsApi from "../network/appointment_api";
import { SignUpCredentials } from "../network/appointment_api";

import styleUtils from "../styles/utils.module.css";
import TextInputField from "./form/TextInputField";

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
        <>
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Sign Up
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {errorText &&
                    <Alert variant="danger">
                        {errorText}
                    </Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="student_name"
                        label="Name"
                        type="text"
                        placeholder="Enter Your Name"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.student_name}
                    />
                    <TextInputField
                        name="student_email"
                        label="Email"
                        type="email"
                        placeholder="Enter Your Email"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.student_email}
                    />
                    <TextInputField
                        name="user_phone"
                        label="Phone"
                        type="text"
                        placeholder="Enter your phone number"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.student_phone}
                    />
                    <TextInputField
                        name="student_nationality"
                        label="Nationality"
                        type="text"
                        placeholder="Enter your Nationality"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.student_nationality}
                    />

                    <TextInputField
                        name="Student_password"
                        label="Password"
                        type="password"
                        placeholder="Enter your Password"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.student_password}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={styleUtils.width100}>
                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>
        </>
    );
}

export default SignUpModal;