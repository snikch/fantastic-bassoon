import { RegistryItem } from '../../../models';
import { RegistryAction } from './actions';
import { REGISTRY_CHANGE } from './constants';

export type ItemState = RegistryItem[];

const defaultState: ItemState = [
  {
    image: 'chardonnay.png',
    name: 'Chardonnay',
    price: 12,
    quantity: 0,
    unit: 'case',
  },
  {
    image: 'sav.png',
    name: 'Sauvignon Blanc',
    price: 13,
    quantity: 0,
    unit: 'case',
  },
  {
    image: 'pinot-noir.png',
    name: 'Pinot Noir',
    price: 13,
    quantity: 0,
    unit: 'case',
  },
  {
    image: 'beer-craft.png',
    name: 'Craft Beer',
    price: 24,
    quantity: 0,
    unit: 'dozen',
  },
  {
    image: 'beer-lager.png',
    name: 'Beer - Lager',
    price: 24,
    quantity: 0,
    unit: 'dozen',
  },
  {
    image: 'beer-sour.png',
    name: 'Sour Beer',
    price: 24,
    quantity: 0,
    unit: 'dozen',
  },
];

export const itemReducer = (state = defaultState, action: RegistryAction): ItemState => {
  switch (action.type) {
    case REGISTRY_CHANGE:
      const newState = state.slice(0);
      newState[action.payload.index].quantity += action.payload.amount;
      if (newState[action.payload.index].quantity < 0) {
        newState[action.payload.index].quantity = 0;
      }
      return newState;
  }
  return state;
};
