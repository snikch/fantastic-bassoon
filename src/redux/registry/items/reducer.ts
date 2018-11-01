import { RegistryItem } from '../../../models';
import { RegistryAction } from './actions';
import { REGISTRY_CHANGE } from './constants';

export type ItemState = RegistryItem[];

const defaultState: ItemState = [
  {
    image: 'chardonnay.png',
    name: 'Chardonnay',
    price: 18,
    quantity: 0,
    unit: 'bottle',
  },
  {
    image: 'sav.png',
    name: 'Pinot Gris',
    price: 18,
    quantity: 0,
    unit: 'bottle',
  },
  {
    image: 'bubbles.png',
    name: 'Bubbles',
    price: 30,
    quantity: 0,
    unit: 'bottle',
  },
  {
    image: 'pinot-noir.png',
    name: 'Pinot Noir',
    price: 22,
    quantity: 0,
    unit: 'bottle',
  },
  {
    image: 'beer-lager.png',
    name: 'Random Beer',
    price: 26,
    quantity: 0,
    unit: 'dozen',
  },
  {
    image: 'gin.png',
    name: 'Gin',
    price: 50,
    quantity: 0,
    unit: 'bottle',
  },
  {
    image: 'bus.png',
    name: 'Bus',
    price: 10,
    quantity: 0,
    unit: 'person',
  },
];

const registryItemKey = (item: RegistryItem): string => [item.image, item.name, item.price, item.unit].join('-');

export const itemReducer = (state = defaultState, action: RegistryAction): ItemState => {
  switch (action.type) {
    case REGISTRY_CHANGE:
      if (state.map(registryItemKey).join('-') !== defaultState.map(registryItemKey).join('-')) {
        return defaultState;
      }
      const newState = state.slice(0);
      newState[action.payload.index].quantity += action.payload.amount;
      if (newState[action.payload.index].quantity < 0) {
        newState[action.payload.index].quantity = 0;
      }
      return newState;
  }
  return state;
};
