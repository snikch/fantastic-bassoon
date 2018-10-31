import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RegistryAction, registryChange } from '../../redux/registry/items/actions';
import { RootState } from '../../redux/root-reducer';
import Cart from './cart';
import Floater from './floater';

interface Props {
  doQuantityChange(index: number, amount: number): void;
}
const Registry: React.SFC<RootState & Props> = ({ registry: { items }, doQuantityChange }) => {
  const didClickAddFn = (index: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    doQuantityChange(index, 1);
  };
  // const didClickRemoveFn = (index: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   doQuantityChange(index, -1);
  // };
  return (
    <React.Fragment>
      <div className="App">
        <h1>Booze Registry</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum
        </p>
      </div>
      <section>
        {items.map(({ image, name, price, quantity, unit }, i) => (
          <article key={i} style={{ clear: 'both', paddingTop: '10px' }}>
            <div style={{ float: 'right' }}>
              <img src={`/images/${image}`} height={120} title={name} />
            </div>
            <h2>{name}</h2>
            <div style={{ fontSize: '20px' }}>
              ${price}/{unit}
            </div>
            <a href="#" onClick={didClickAddFn(i)} className="button button--add">
              Add
            </a>
            {quantity > 0 && `${quantity} selected`}
          </article>
        ))}
      </section>
      <Cart />
      <Floater />
    </React.Fragment>
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
)(Registry);
