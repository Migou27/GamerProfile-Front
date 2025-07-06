import './Loading.css';

const Loading = ({ message = "Chargement..." }) => (
  <div className="loading-container">
    <div className="spinner" />
    <span>{message}</span>
  </div>
);

export default Loading;