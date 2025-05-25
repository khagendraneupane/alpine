import styles from "../styles/Appointment.module.css";
import { Card, Button } from "react-bootstrap";
import { Service as ServiceModel } from "../models/service";
import { formatDate }from "../utils/formatDate";
import styleUtils from "../styles/utils.module.css";


interface ServiceProps {
    service: ServiceModel,
    onServiceClicked: (service: ServiceModel) => void,
    onDeleteServiceClicked: (service: ServiceModel) => void,
    className?: string,
}
const Service = ({service,onServiceClicked, onDeleteServiceClicked, className}: ServiceProps) => {
    const {
    name,
    category,
    description,
    rate,
    image,
    createdAt,
    updatedAt,
    } = service;
    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated On: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created On: " + formatDate(createdAt);
    }

    return (
        <Card className={`${styles.serviceCard} ${className}`}>
            <Card.Body className={styles.cardbody}>
                <Card.Title className={styleUtils.flexCenter}>
                {/* <MdDelete
                            className="text-muted ms-auto"
                            onClick={(e) => {
                                onDeleteServiceClicked(service);
                                e.stopPropagation();
                            }}
                        />  */}
        <Button className="text-muted ms-auto btn-sm"
                        onClick={(e) => {
                            onDeleteServiceClicked(service);
                            e.stopPropagation();
                        }}> Delete Service
        </Button>
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    <img src={image} alt={name} className={styles.serviceImage} />
                    <strong>Name:</strong> {name}<br />
                    <strong>Category:</strong> {category}<br />
                    <strong>Description:</strong> {description}<br />
                    <strong>Rate:</strong> {rate}<br />
                </Card.Text>
                
            </Card.Body>
            <Card.Footer className="text-muted">
                    {createdUpdatedText}
                </Card.Footer>
        </Card>
    )
}
export default Service;
