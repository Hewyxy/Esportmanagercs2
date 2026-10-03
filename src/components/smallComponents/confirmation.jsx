import "./Confirmation.css";

function ConfirmationModal({
    isOpen,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    danger = false
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="confirmation-overlay" onClick={onCancel}>
            <div
                className="confirmation-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{title}</h2>

                <p>{message}</p>

                <div className="confirmation-buttons">
                    <button
                        className="confirmation-cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        className={`confirmation-confirm ${
                            danger ? "confirmation-danger" : ""
                        }`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
