import styles from "../styles/Appointment.module.css";
import { Button, Card } from "react-bootstrap";
import { Appointment as AppointmentModel } from "../models/appointment";
import { formatDate }from "../utils/formatDate";
import { shortDate } from "../utils/shortDate";
import { MdDelete } from "react-icons/md";
import styleUtils from "../styles/utils.module.css";

interface AppointmentProps {
    appointment: AppointmentModel,
    onCancelAppointmentCLicked: (appointment: AppointmentModel) => void,
    className?: string,
}
const Appointment = ({appointment, onCancelAppointmentCLicked, className}: AppointmentProps) => {
    const {
    appointment_date,
    appointment_time,
    appointment_with,
    appointment_status,
    createdAt,
    updatedAt,
    } = appointment;
    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated On: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Booked On: " + formatDate(createdAt);
    }


    
 return (
    
    <Card className={`${styles.appointmentCard} ${className}`}>
        <Card.Body className={styles.cardbody}>
            <Card.Title className={styleUtils.flexCenter}>
                
                <Button 
                size="sm"
                variant="danger"
                className="text-muted ms-auto"
                onClick={(e) => {
                onCancelAppointmentCLicked(appointment);
                    e.stopPropagation();
                }}
                >
                    Cancel Appointment
                </Button>
                
                
                
             
            </Card.Title>
            <Card.Text className={styles.cardText}>
                <strong>Date:</strong> {shortDate(appointment_date)}<br />
                <strong>Time:</strong> {appointment_time}<br />
                <strong>With:</strong> {appointment_with}<br />
                <strong>Status:</strong> {appointment_status}<br />
            </Card.Text>
            
        </Card.Body>
        <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
    </Card>
  
 )
}

export default Appointment;