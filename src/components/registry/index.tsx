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
          We love a drink as much (ok, probably more) than the next guy. If you’d like to contribute to our wedding,
          grabbing some booze from our registry would be a great way to do that! It’ll all be drunk on the day.
        </p>
        <p>Don’t forget to sort your bus tickets at the same time.</p>
        <p>
          Important note: Mal chose the pictures below. They are not necessarily indicative of the real thing. We
          wouldn’t wish Huntaway Chardonnay on anybody. Except mum. She likes it.
        </p>
        <p>
          Another important note: the venue is BYO so if you have a favourite spirit that isn’t gin, feel free to bring
          it along.
        </p>
      </div>
      <section>
        {items.map(({ image, name, price, quantity, unit }, i) => (
          <article key={i} style={{ clear: 'both', paddingTop: '10px' }}>
            <div style={{ float: 'right', width: '', textAlign: 'center', marginRight: name === 'Bus' ? '-30px' : '' }}>
              <img src={`/images/${image}`} height={name === 'Bus' ? 80 : 120} title={name} />
            </div>
            <h2>{name}</h2>
            <div style={{ fontSize: '20px', marginBottom: '3px' }}>
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
