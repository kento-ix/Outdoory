import './Event.css';

const Event = () => {
    // const handleEvent = async (e) => {
    //     e.preventDefault();
    //     const form = e.target;
    //     const title = form[0].value;
    //     const location = form[1].value;
    //     const event_time = fomr[2].value;
    //     const capacity = form[3].value;
    // }


  return (
    <div className="event-page">
      <div className="event-form-container">
        <h2>Create event</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div>
            <label>Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} />
          </div>

          <div>
            <label>Date:</label>
            <input type="datetime-local" name="event_time" value={formData.event_time} onChange={handleChange} required />
          </div>

          <div>
            <label>Capacity:</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
          </div>

          <div>
            <label>Upload Image:</label>
            <input type="file" name="image" accept="image/*" onChange={handleFileChange}/>
          </div>

          <button type="submit">Event create</button>
        </form>
      </div>
    </div>
  );
};

export default Event;
