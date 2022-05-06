import "./subtitle.css";

function Subtitle(props) {
  return (
    <div className="Subtitle">
      <h2 className={props.color}>{props.children}</h2>
    </div>
  );
}

export { Subtitle };
