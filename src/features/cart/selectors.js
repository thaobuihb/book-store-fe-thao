import { createSelector } from "reselect";

const selectCartState = (state) => state.cart;

export const selectCartItems = createSelector(
  [selectCartState],
  (cartState) => cartState.cart
);

export const selectDetailedCart = createSelector(
  [selectCartState],
  (cartState) => cartState.detailedCart
);

export const selectCartReloadTrigger = createSelector(
  [selectCartState],
  (cartState) => cartState.cartReloadTrigger
);
