import PropTypes from 'prop-types';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, onConfirm, heading, confirmText }) {
  if (!isOpen) return null;
  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>{heading}</h2>

          <button className={styles.modalconfirmBtn} onClick={onConfirm}>
            {confirmText}
          </button>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired,
};

export default Modal;
