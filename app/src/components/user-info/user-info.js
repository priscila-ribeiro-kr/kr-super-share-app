import "./user-info.css";

function UserInfo(props) {
  return (
    <div className="user-info">
      <b>User:</b> {props.children}
    </div>
  );
}

export { UserInfo };
