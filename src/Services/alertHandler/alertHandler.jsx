import { toast } from 'react-toastify';
import './alertHandler.css';

/**
 * Affiche une toast de confirmation personnalisable.
 * @param {Object} options - Options de la confirmation.
 * @param {string} options.title - Titre ou question à afficher.
 * @param {string} [options.description] - Description optionnelle.
 * @param {function} options.onConfirm - Fonction appelée si l'utilisateur confirme.
 * @param {function} [options.onCancel] - Fonction appelée si l'utilisateur annule.
 * @param {string} [options.confirmLabel] - Texte du bouton de confirmation.
 * @param {string} [options.cancelLabel] - Texte du bouton d'annulation.
 * @param {any[]} [options.confirmArgs] - Arguments à passer à onConfirm.
 */
export function confirmToast({
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Oui",
  cancelLabel = "Annuler",
  confirmArgs = []
}) {
  toast(
    ({ closeToast }) => (
      <div>
        <div>{title}</div>
        {description && <div style={{ margin: "8px 0" }}>{description}</div>}
        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
          <button
            className="toast-confirm-btn confirm"
            onClick={async () => {
              await onConfirm(...confirmArgs);
              closeToast();
            }}
          >
            {confirmLabel}
          </button>
          <button
            className="toast-confirm-btn cancel"
            onClick={() => {
              if (onCancel) onCancel();
              closeToast();
            }}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    ),
    { autoClose: false }
  );
}

/**
 * Affiche une alerte de succès qui disparaît automatiquement.
 * @param {string} message - Le message à afficher.
 */
export function successToast(message) {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored"
  });
}

export function errorToast(message) {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored"
  });
}

export function infoToast(message) {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored"
  });
}