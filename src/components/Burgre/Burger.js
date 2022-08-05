import React from "react";
import classes from "./Burger.css";
import BurgerIngredient from "./BurgreIngredient/BurgreIngredient";

const burger = (props) => {
  let transformedIngredient = Object.keys(props.ingredient)
    .map((igKey) => {
      return [...Array(props.ingredient[igKey])].map((_, i) => {
        // console.log(igKey, Array(props.ingredient[igKey]));
        return <BurgerIngredient key={igKey + i} type={igKey} />;
      });
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);
  if (transformedIngredient.length === 0) {
    transformedIngredient = <p>Please start adding ingredient</p>;
  }
  console.log(transformedIngredient);
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredient}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};
export default burger;
