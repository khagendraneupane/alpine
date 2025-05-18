import { Container } from "react-bootstrap";
import AppointmentsPageLoggedInView from "../components/AppointmentPageLoggedInView";
import AppointmentsPageLoggedOutView from "../components/AppointmentsPageLoggedOutView";
import { Student } from "../models/student";
import styles from "../styles/AppointmentsPage.module.css";

interface AppointmentsPageProps {
    loggedInUser: Student | null,
}

const AppointmentsPage = ({ loggedInUser }: AppointmentsPageProps) => {
    return (
        <Container className={styles.appointmentsPage}>
            <>
                {loggedInUser
                    ? <AppointmentsPageLoggedInView />
                    : <AppointmentsPageLoggedOutView />
                }
            </>
        </Container>
    );
}

export default AppointmentsPage;