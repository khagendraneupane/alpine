import { Card, Button } from "react-bootstrap";
import { Appointment as AppointmentModel } from "../models/appointment";
import { Consultation as ConsultationModel } from "../models/consultation";
import styles from "../styles/Appointment.module.css";
import styleUtils from "../styles/utils.module.css";

interface ConsultationProps {
    consultation: ConsultationModel,
    onConsultationClicked: (consultation: ConsultationModel) => void,
    onBookConsultationCLicked: (consultation: AppointmentModel) => void,
    className?: string,
}

const Consultation = ({consultation,onConsultationClicked, onBookConsultationCLicked, className}: ConsultationProps) => {
    const {
        consultation_type,
        consultation_duration,
    } = consultation;
        
 return (
    
    <Card className={`${styles.consultantcard} ${className}`}>
        <Card.Body className={styles.cardbody}>
            <Card.Title className={styleUtils.flexCenter}>
            </Card.Title>
            <Card.Text className={styles.cardText}>
                <strong>Consultation Type:</strong> {consultation_type}<br />
                <strong>Consultation Duration:</strong> {consultation_duration}<br />
                <strong>Avaliable From: {consultation_duration}</strong>

            </Card.Text>
            
        </Card.Body>
<Button> Book Appointment</Button>
    </Card>
  
 )
}

export default Consultation;
