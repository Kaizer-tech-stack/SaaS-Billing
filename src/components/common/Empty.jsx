function Empty({ cols }) {
  return (
    <tr>
      <td colSpan={cols} className="empty">
        No matching records found.
      </td>
    </tr>
  );
}
export default Empty;
