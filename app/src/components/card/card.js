import "./card.css";

function Card(props) {
  return <div className="Card kds-Card ProductCard border-default-300 border-solid border w-full flex flex-col overflow-hidden px-8 pb-32 shadow-4">{props.children}</div>;
}

export { Card };
