import "./Document.css"
import { Link } from 'react-router-dom';

const Document = () => {
    return(
        <div className="main-content">
            <h1 className="title">Documentation</h1>
            <p className="description">
                Welcome to Outdoory documentation!
                This page provides documentation for the Outdoory project, including usage instructions, features implemented, and validation results. Additional resources and component references are listed below.
            </p>

            <section className="doc-section">
                <h2 className="section-title">User Guide</h2>
                <p className="section-text">
                    Users can browse activity spots, view details, and sign up to create or save favorites.
                    The navigation is mobile-friendly and supports login/logout with modal dialogs.
                </p>
            </section>

            <section className="doc-section">
                <h2 className="section-title">Features Implemented</h2>
                <ul className="feature-list">
                    <li>Responsive Design (mobile & desktop)</li>
                    <li>User Authentication (login/signup modal)</li>
                    <li>Activity posting and saving</li>
                    <li>Dynamic event list fetched from PHP backend</li>
                </ul>
            </section>

            <section className="doc-section">
                <h2 className="section-title">Proud Implementations</h2>
                <p className="section-text">
                    - We implemented a fully responsive navigation bar that adapts seamlessly between mobile and desktop views. Check it out on the<Link to="/">Home Page</Link>.<br />
                    - Integrated PHP backend with React frontend for dynamic event listing with real-time updates.<br />
                    - Modal dialogs for login and registration that improve user experience.
                </p>
            </section>

            <section className="doc-section">
                <h2 className="section-title">Design Choices</h2>
                <p className="section-text">
                    - Sans-serif fonts for clean and readable text, with paragraphs left-aligned.<br />
                    - Strong contrast between text and background for accessibility.<br />
                    - Headings use larger font sizes and spacing to distinguish from body text.<br />
                    - Logical grouping of related elements using cards and container divs.<br />
                    - Consistent alignment ensures a polished layout.
                </p>
            </section>
        </div>
    );
}

export default Document;
