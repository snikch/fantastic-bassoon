import { combineReducers } from 'redux';
// import { RegistryAction } from './actions';
// import { REGISTRY_ADD } from './constants';
import { itemReducer, ItemState } from './items/reducer';

export interface RegistryState {
  readonly items: ItemState;
}

export const registryReducer = combineReducers<RegistryState>({
  items: itemReducer,
});
