import React from "react";
import "../styles/HomePage.css";

const HomePage = () => {
    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to Global Education Consultancy</h1>
                    <p>Your trusted partner for studying abroad and achieving your dreams.</p>
                    <button className="cta-button">Get Started</button>
                </div>
            </section>

            {/* Services Section */}
            <section className="services">
                <h2>Our Services</h2>
                <div className="services-grid">
                    <div className="service-card">
                        <h3>Career Counseling</h3>
                        <p>We help you choose the right career path based on your interests and skills.</p>
                    </div>
                    <div className="service-card">
                        <h3>University Selection</h3>
                        <p>Get guidance on selecting the best universities for your goals.</p>
                    </div>
                    <div className="service-card">
                        <h3>Visa Assistance</h3>
                        <p>Our experts ensure a smooth visa application process for you.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <h2>What Our Students Say</h2>
                <div className="testimonial-card">
                    <p>"Global Education Consultancy made my dream of studying abroad come true. Highly recommended!"</p>
                    <h4>- John Doe</h4>
                </div>
                <div className="testimonial-card">
                    <p>"The team was incredibly supportive throughout the entire process. Thank you!"</p>
                    <h4>- Jane Smith</h4>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact">
                <h2>Contact Us</h2>
                <form className="contact-form">
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </section>
        </div>
    );
};

export default HomePage;