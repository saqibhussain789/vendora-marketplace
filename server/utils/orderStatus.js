export const getOverallOrderStatus = (items = []) => {
  if (!items.length) return "pending";

  const statuses = items.map((item) => item.fulfillmentStatus);
  const uniqueStatuses = [...new Set(statuses)];

  if (uniqueStatuses.length > 1) {
    const allCancelled = statuses.every((status) => status === "cancelled");
    if (allCancelled) return "cancelled";

    const allDelivered = statuses.every((status) => status === "delivered");
    if (allDelivered) return "delivered";

    const allShippedOrDelivered = statuses.every((status) =>
      ["shipped", "delivered"].includes(status)
    );
    if (allShippedOrDelivered) return "shipped";

    return "mixed";
  }

  return statuses[0] || "pending";
};

export const getSellerSummaryStatus = (items = []) => {
  if (!items.length) return "pending";

  const statuses = [...new Set(items.map((item) => item.fulfillmentStatus))];

  if (statuses.length === 1) return statuses[0];
  return "mixed";
};