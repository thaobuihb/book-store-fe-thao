import { createSelector } from "reselect";

const selectOrdersState = (state) => state.order;

export const selectPurchaseHistory = createSelector(
    [selectOrdersState],
    (ordersState) => {
      console.log("Orders state in selector:$$$$$", ordersState);
      return ordersState?.purchaseHistory || [];
    }
  );
  