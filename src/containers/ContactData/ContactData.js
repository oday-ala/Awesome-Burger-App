import React, { Component } from "react";
import Button from "../../components/UI/Button/Button";
import classes from "./ContactData.css";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import { withRouter } from "react-router-dom";
import Input from "../../components/UI/Input/Input";
class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 10,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "ZIP Code ",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your E-Mail",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        validation: {},
        value: "",
        valid: true,
      },
    },
    formIsValid: false,
    loading: false,
  };
  orderSubmitHandler = (e) => {
    e.preventDefault();
    this.setState({ loading: true });

    const formData = {};
    for (let key in this.state.orderForm) {
      formData[key] = this.state.orderForm[key].value;
    }
    const order = {
      ingredient: this.props.ingredients,
      price: this.props.price,
      orderData: formData,
    };
    axios
      .post("/orders.json", order)
      .then((response) => {
        this.setState({ loading: false });
        this.props.history.push("/");
      })
      .catch((error) => this.setState({ loading: false }));
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    return isValid;
  }

  inputHandler = (event, inputIdentify) => {
    const updatedOrderForm = {
      ...this.state.orderForm,
    };
    const updateElement = {
      ...updatedOrderForm[inputIdentify],
    };
    updateElement.value = event.target.value;
    updateElement.valid = this.checkValidity(
      updateElement.value,
      updateElement.validation
    );
    updateElement.touched = true;
    updatedOrderForm[inputIdentify] = updateElement;

    let formIsValid = true;
    for (let key in updatedOrderForm) {
      formIsValid = updatedOrderForm[key].valid && formIsValid;
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };
  render() {
    const formElementArray = [];
    for (let key in this.state.orderForm) {
      formElementArray.push({ id: key, config: this.state.orderForm[key] });
    }
    let form = (
      <form onSubmit={this.orderSubmitHandler}>
        {formElementArray.map((formElement) => (
          <Input
            key={formElement.id}
            elementConfig={formElement.config.elementConfig}
            elementType={formElement.config.elementType}
            value={formElement.config.value}
            inputHandler={(event) => this.inputHandler(event, formElement.id)}
            invalid={!formElement.config.valid}
            touched={formElement.config.touched}
            shouldValidate={formElement.config.validation}
          />
        ))}
        {console.log(this.state.formIsValid)}
        <Button
          disabled={this.state.formIsValid}
          btnType="Success"
          clicked={this.orderSubmitHandler}
        >
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter Your Contact Details</h4>
        {form}
      </div>
    );
  }
}

export default withRouter(ContactData);
