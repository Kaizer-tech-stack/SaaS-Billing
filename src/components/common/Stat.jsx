function Stat({ icon, label, value, note }) {
  return (
    <article className="stat panel">
      <div className="stat-top">
        <span>{label}</span>
        <i>{icon}</i>
      </div>
      <h2>{value}</h2>
      <small>{note}</small>
    </article>
  );
}
export default Stat;
