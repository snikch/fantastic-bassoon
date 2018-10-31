import * as React from 'react';
import { connect } from 'react-redux';
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
  const totalItems = items.reduce((accum: number, { quantity }) => (accum += quantity), 0);
  if (totalItems <= 0) {
    return null;
  }
  return (
    <a href="#selection" id="floater">
      Selected Item
      {totalItems > 1 ? 's' : 's'}: {totalItems}
    </a>
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
