import React, { Component } from "react";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burgre/Burger";
import BuildControls from "../../components/Burgre/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OlderSummary from "../../components/Burgre/OlderSummary/OlderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.6,
};
class BurgreBuilder extends Component {
  state = {
    ingredient: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: null,
  };

  componentDidMount() {
    axios
      .get("link")
      .then((response) => {
        this.setState({ ingredient: response.data });
        // console.log(response);
      })
      .catch((err) => this.setState({ error: true }));
  }
  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ purchasable: sum > 0 });
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredient[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredient,
    };

    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({ ingredient: updatedIngredients, totalPrice: newPrice });
    this.updatePurchaseState(updatedIngredients);
  };
  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredient[type];
    if (oldCount === 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredient,
    };

    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({ ingredient: updatedIngredients, totalPrice: newPrice });
    this.updatePurchaseState(updatedIngredients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };
  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };
  purchaseContinueHandler = () => {
    // alert("Continue...");

    const queryParams = [];
    for (let i in this.state.ingredient) {
      queryParams.push(
        encodeURIComponent(i) +
          "=" +
          encodeURIComponent(this.state.ingredient[i])
      );
    }
    queryParams.push("price=" + this.state.totalPrice);
    const querySting = queryParams.join("&");
    this.props.history.push({
      pathname: "/checkout",
      search: "?" + querySting,
    });
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredient,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummery = null;
    let burger = this.state.error ? (
      <h1>Ingredients can't be loaded!</h1>
    ) : (
      <Spinner />
    );
    if (this.state.ingredient) {
      burger = (
        <Auxiliary>
          <Burger ingredient={this.state.ingredient} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
            ordered={this.purchaseHandler}
          />
        </Auxiliary>
      );
      orderSummery = (
        <OlderSummary
          totalPrice={this.state.totalPrice}
          ingredient={this.state.ingredient}
          purechaseCancelled={this.purchaseCancelHandler}
          purechaseContinue={this.purchaseContinueHandler}
        />
      );
    }
    if (this.state.loading) {
      orderSummery = <Spinner />;
    }
    return (
      <Auxiliary>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummery}
        </Modal>
        {burger}
      </Auxiliary>
    );
  }
}

export default withErrorHandler(BurgreBuilder, axios);
