import "./Sources.css";

const Sources = () => {
  return (
    <div className="main-content">
      <h1 className="title">Sources</h1>
      <p className="description">
        Below is a list of all external resources (images, logos, animations, etc.) used in this project, along with proper attribution and source URLs.
      </p>

      <section className="source-section">
        <h2 className="section-title">📷 Images from Unsplash</h2>
        <ul className="source-list">
          <li>
            Neom:{" "}
            <a href="https://unsplash.com/photos/jTxhUMyPTrE" target="_blank" rel="noopener noreferrer">
              https://unsplash.com/photos/jTxhUMyPTrE
            </a>
          </li>
          <li>
            Neom:{" "}
            <a href="https://unsplash.com/photos/qGH25zv5xMk" target="_blank" rel="noopener noreferrer">
              https://unsplash.com/photos/qGH25zv5xMk
            </a>
          </li>
          <li>
            Neom:{" "}
            <a href="https://unsplash.com/photos/STV2s3FYw7Y" target="_blank" rel="noopener noreferrer">
              https://unsplash.com/photos/STV2s3FYw7Y
            </a>
          </li>
          <li>
            Pietro De Grandi:{" "}
            <a href="https://unsplash.com/photos/T7K4aEPoGGk" target="_blank" rel="noopener noreferrer">
              https://unsplash.com/photos/T7K4aEPoGGk
            </a>
          </li>
          <li>
            Sean Benesh:{" "}
            <a href="https://unsplash.com/photos/VnmbcgAfL3Q" target="_blank" rel="noopener noreferrer">
              https://unsplash.com/photos/VnmbcgAfL3Q
            </a>
          </li>
          <li>
            Todd Quackenbush:{" "}
            <a href="https://unsplash.com/photos/E9PJO_vL3E8" target="_blank" rel="noopener noreferrer">
              https://unsplash.com/photos/E9PJO_vL3E8
            </a>
          </li>
          <li>
            Viktor Bystrov:{" "}
            <a href="https://unsplash.com/photos/Gi0OMNguFaw" target="_blank" rel="noopener noreferrer">
              https://unsplash.com/photos/Gi0OMNguFaw
            </a>
          </li>
        </ul>
      </section>

      <section className="source-section">
        <h2 className="section-title">🤖 AI-Generated Content</h2>
        <p className="section-text">
          The following images and assets were created using OpenAI’s ChatGPT image generation tool:
        </p>
        <ul className="source-list">
          <li>Logo image (generated with prompt via ChatGPT)</li>
          <li>Animated illustrations used in landing section and documentation (ChatGPT-generated)</li>
        </ul>
      </section>
    </div>
  );
};

export default Sources;
