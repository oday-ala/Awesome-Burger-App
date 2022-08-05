import React, { Component } from "react";
import Order from "../../components/Oder/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Orders extends Component {
  state = {
    orders: [],
    loading: false,
  };
  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get("/orders.json")
      .then((res) => {
        console.log(res.data);
        const fetchedOrders = [];
        for (let key in res.data) {
          fetchedOrders.push({ ...res.data[key], id: key });
        }
        this.setState({ loading: false, orders: fetchedOrders });
      })
      .catch((error) => this.setState({ loading: false }));
  }
  render() {
    return (
      <div>
        {console.log(this.state.orders)}
        {this.state.orders.map((order) => (
          <Order
            key={order.id}
            ingredients={order.ingredient}
            price={order.price}
          />
        ))}
      </div>
    );
  }
}

export default Orders;
