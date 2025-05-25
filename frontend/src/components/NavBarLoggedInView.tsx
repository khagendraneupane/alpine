import { Button, Navbar } from "react-bootstrap";
import { Student } from "../models/student";
import * as AppointmentsApi from "../network/appointment_api";

interface NavBarLoggedInViewProps {
    user: Student,
    onLogoutSuccessful: () => void,
}
const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {

    async function logout() {
        try {
            await AppointmentsApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    return (
        <>
            <Navbar.Text className="me-2">
                Signed in as: {user.email}
            </Navbar.Text>
            <Button onClick={logout}>Log out</Button>
        </>
    );
}
export default NavBarLoggedInView;