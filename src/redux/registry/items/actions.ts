import * as constants from './constants';

export interface RegistryChange {
  type: constants.REGISTRY_CHANGE;
  payload: {
    index: number;
    amount: number;
  };
}

export type RegistryAction = RegistryChange;

export function registryChange(index: number, amount: number): RegistryChange {
  return {
    payload: {
      amount,
      index,
    },
    type: constants.REGISTRY_CHANGE,
  };
}
