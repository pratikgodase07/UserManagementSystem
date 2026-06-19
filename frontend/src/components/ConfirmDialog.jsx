/**
 * ConfirmDialog Component
 * Pre-requisites covered: Components, Props, Conditional Rendering
 * Reusable dialog for update/delete confirmations
 */

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  // Conditional Rendering: only mount when open
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="dialog">
        <h3 className="dialog-title">CONFIRMATION</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-confirm" onClick={onConfirm}>YES</button>
          <button className="btn btn-cancel" onClick={onCancel}>NO</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
