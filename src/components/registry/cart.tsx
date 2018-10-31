import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
// import { stripe } from 'src/stripe';
import { RegistryAction, registryChange } from '../../redux/registry/items/actions';
import { RootState } from '../../redux/root-reducer';

declare global {
  interface Window {
    paymentRequest: any;
  }
}
interface Props {
  doQuantityChange(index: number, amount: number): void;
}

const Cart: React.SFC<RootState & Props> = ({ registry: { items }, doQuantityChange }) => {
  // const didClickAddFn = (index: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   doQuantityChange(index, 1);
  // };
  const didClickRemoveFn = (index: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    doQuantityChange(index, -1);
  };
  const total = items.reduce((accum: number, { quantity, price }) => (accum += quantity * price), 0);
  const totalItems = items.reduce((accum: number, { quantity, price }) => (accum += quantity), 0);
  if (total <= 0) {
    return null;
  }
  // const didClickPay = (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   window.paymentRequest = stripe.paymentRequest({
  //     country: 'NZ',
  //     currency: 'nzd',
  //     requestPayerEmail: false,
  //     requestPayerName: false,
  //     total: {
  //       amount: total * 100,
  //       label: 'Sarah & Mal Wedding Registry',
  //     },
  //   });
  //   window.paymentRequest
  //     .canMakePayment()
  //     .then((result: any) => {
  //       console.log(result);
  //       window.paymentRequest.show();
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //     });
  // };
  // const filteredItems = items.filter(item => item.quantity > 0);
  return (
    <section className="selection" id="selection">
      <h1>Your Selection</h1>
      <table style={{ width: '100%' }}>
        <tr>
          <th style={{ width: '60%' }}>Item</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
        {items.map(({ name, price, quantity }, i) => {
          if (quantity <= 0) {
            return <span key={i} />;
          }
          return (
            <tr key={i}>
              <td>{name}</td>
              <td>{quantity}</td>
              <td>${price * quantity}</td>
              <td>
                <a href="#" onClick={didClickRemoveFn(i)} className="">
                  Remove
                </a>
              </td>
            </tr>
          );
        })}
        <tr>
          <td> Total</td>
          <td>{totalItems}</td>
          <td colSpan={3}>
            ${total}
            {/* <a href="#" onClick={didClickPay}>
              Pay
            </a> */}
          </td>
        </tr>
      </table>
      <Link to="/continue" className="button button--add">
        Continue
      </Link>
    </section>
  );
};

const mapStateToProps = (state: RootState) => state;

const mapDispatchToProps = (dispatch: Dispatch<RegistryAction>) => {
  return {
    doQuantityChange: (index: number, amount: number) => {
      dispatch(registryChange(index, amount));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
