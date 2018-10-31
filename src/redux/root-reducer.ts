import { combineReducers } from 'redux';
import { registryReducer, RegistryState } from './registry/reducer';

export interface RootState {
  registry: RegistryState;
}

export const rootReducer = combineReducers<RootState>({
  registry: registryReducer,
});
