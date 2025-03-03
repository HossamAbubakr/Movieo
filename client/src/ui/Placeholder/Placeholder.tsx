import "./Placeholder.css";

interface PlaceholderProps {
  heading: string;
  message: string;
}

function Placeholder({ heading, message }: PlaceholderProps) {
  return (
    <div className="placeholder">
      <div className="placeholder-content">
        <h2>{heading}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Placeholder;
