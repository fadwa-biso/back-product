const PharmacyStock = require("../models/PharmacyStock");
const User = require("../models/User");
const Pharmacy = require("../models/Pharmacy");

const notifyLowStock = async (stockEntry) => {
  const threshold = 5;
  if (stockEntry.stock >= threshold) return;

  const alreadyNotified = stockEntry.notifications.some(
    (n) => n.message.includes("low stock") && !n.read
  );
  if (alreadyNotified) return;

  const pharmacy = await Pharmacy.findById(stockEntry.pharmacy_id).populate(
    "owner"
  );
  if (!pharmacy || !pharmacy.owner) return;

  const message = `⚠️ Low stock: ${stockEntry.product_id} is under ${threshold}`;

  stockEntry.notifications.push({ message });
  await stockEntry.save();

  pharmacy.owner.notifications.push({ message });
  await pharmacy.owner.save();
};

const notifyUsersProductAvailable = async (productId) => {
  const stocks = await PharmacyStock.find({ product_id: productId });
  const available = stocks.some((s) => s.stock > 0);
  if (!available) return;

  const users = await User.find({ watchlist: productId });

  for (const user of users) {
    const exists = user.notifications.some(
      (n) => n.message.includes("available again") && !n.seen
    );
    if (exists) continue;

    user.notifications.push({ message: `✅ Product is now available again!` });
    await user.save();
  }
};

module.exports = {
  notifyLowStock,
  notifyUsersProductAvailable,
};
