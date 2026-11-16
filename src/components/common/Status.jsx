function Status({ status }) {
  return (
    <span
      className={`status ${status === "Active" || status === "Unique" || status === "Ready" ? "good" : status === "Past due" || status === "Overdue" || status === "Duplicate" ? "bad" : ""}`}
    >
      {status}
    </span>
  );
}
export default Status;
