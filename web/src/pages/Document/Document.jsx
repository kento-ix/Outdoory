import "./Document.css"

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
            <h2 className="section-title">Design Choices</h2>
            <p className="section-text">
                - Font: Sans-serif fonts with left-aligned paragraphs<br />
                - Clear contrast between text and background<br />
                - Headings styled with larger font-size and spacing<br />
                - Elements grouped logically using cards and containers
            </p>
            </section>
        </div>
    );
}
export default Document;
