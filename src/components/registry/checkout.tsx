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
      <h2>Total ${total}</h2>
      <p>Thanks for your contribution. We’re truly grateful.</p>
      <p>Please make payment via online banking to:</p> <pre>03-0211-0456964-000</pre>
      <p> Sorry we couldn’t automate this part of the process but we’d lose half your cash to fees.</p>
      <p>
        If you have any questions, hit us up at <a href="mailto:sarah.hawk@gmail.com">sarah.hawk@gmail.com</a>
      </p>
      <Link to="/" className="button button--add">
        Back
      </Link>
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
