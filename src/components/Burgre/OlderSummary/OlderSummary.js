import React from "react";
import Auxiliary from "../../../hoc/Auxiliary/Auxiliary";
import Button from "../../UI/Button/Button";
const olderSummary = (props) => {
  const ingredientSummary = Object.keys(props.ingredient).map((igKey) => {
    return (
      <li key={igKey}>
        <span style={{ textTransform: "capitalize" }}>{igKey}</span>:{" "}
        {props.ingredient[igKey]}
      </li>
    );
  });
  return (
    <Auxiliary>
      <h3>You Order</h3>
      <p>A delcious burger with the following ingredients: </p>
      <ul>{ingredientSummary}</ul>
      <p>
        <strong>Total Price: {props.totalPrice.toFixed(2)}</strong>
      </p>
      <p>Continue to Checkout</p>
      <Button btnType="Danger" clicked={props.purechaseCancelled}>
        CANCEL
      </Button>
      <Button btnType="Success" clicked={props.purechaseContinue}>
        CONTINUE{" "}
      </Button>
    </Auxiliary>
  );
};

export default olderSummary;
