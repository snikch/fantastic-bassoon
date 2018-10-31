import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RegistryAction, registryChange } from '../../redux/registry/items/actions';
import { RootState } from '../../redux/root-reducer';

interface Props {
  doQuantityChange(index: number, amount: number): void;
}
const Registry: React.SFC<RootState & Props> = ({ registry: { items }, doQuantityChange }) => {
  const total = items.reduce((accum: number, { quantity, price }) => (accum += quantity * price), 0);
  return (
    <React.Fragment>
      <Link to="/" className="button button--add">
        Back
      </Link>
      <h2>Total ${total}</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum
      </p>
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
