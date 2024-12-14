import { createSelector } from "reselect";

const selectOrdersState = (state) => state.order;
const selectUserId = (state) => state.user?.user?._id;

export const selectPurchaseHistory = createSelector(
  [selectOrdersState, selectUserId],
  (ordersState, userId) => {
    // console.log("Purchase history in selector before filtering: ", ordersState?.purchaseHistory);
    // console.log("User ID for filtering: ", userId);

    if (!userId) return [];
    const filteredHistory = ordersState?.purchaseHistory?.filter(
      (order) => String(order.userId) === String(userId)
    );
    // console.log("Filtered purchase history: ", filteredHistory);
    return filteredHistory || [];
  }
);
