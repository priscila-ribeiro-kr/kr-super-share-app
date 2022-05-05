import "./list-item.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import { WSpacer } from "../../spacer/spacer";

function ListItem(props) {
  function handleRemove(e) {
    e.preventDefault();
    if (props.onClick) {
      props.onClick(props.id);
    }
  }

  return (
    <div className="ListItem">
      <FontAwesomeIcon icon={faCaretRight} className="Icon" />
      <WSpacer width="5px" />
      <div className="Item">{props.children}</div>
      <button onClick={handleRemove} className="Remove">
      <FontAwesomeIcon icon={faTrash} className="Icon" />
      </button>
    </div>
  );
}

export { ListItem };
