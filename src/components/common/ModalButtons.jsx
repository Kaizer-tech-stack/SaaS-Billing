function ModalButtons({ onCancel }) {
  return (
    <div className="modal-actions">
      <button type="button" className="secondary" onClick={onCancel}>
        Cancel
      </button>
      <button className="primary" type="submit">
        Save
      </button>
    </div>
  );
}
export default ModalButtons;
