const PharmacyStock = require("../models/PharmacyStock");
const Product = require("../models/product.model");
const Pharmacy = require("../models/Pharmacy");
const User = require("../models/User");
const {
  notifyLowStock,
  notifyUsersProductAvailable,
} = require("../utils/notifications");

// ➕ Add stock for a product in a pharmacy
exports.addStock = async (req, res) => {
  const { product_id, stock } = req.body;
  const pharmacyId = req.user.pharmacy_id;

  try {
    const existing = await PharmacyStock.findOne({
      pharmacy_id: pharmacyId,
      product_id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Stock already exists for this product" });
    }

    const stockEntry = new PharmacyStock({
      pharmacy_id: pharmacyId,
      product_id,
      stock: stock || 0,
    });

    await stockEntry.save();

    // Notify if initial stock < 5
    await notifyLowStock(stockEntry);
    // Notify users if this stock made the product available again
    if (stockEntry.stock > 0) await notifyUsersProductAvailable(product_id);

    res.status(201).json({ message: "Stock added", stock: stockEntry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add stock", error: error.message });
  }
};

// 🖊️ Update stock quantity manually (e.g. resupplying)
exports.updateStockQuantity = async (req, res) => {
  const { product_id, stock } = req.body;
  const pharmacyId = req.user.pharmacy_id;

  try {
    const stockEntry = await PharmacyStock.findOne({
      pharmacy_id: pharmacyId,
      product_id,
    });

    if (!stockEntry)
      return res.status(404).json({ message: "Stock entry not found" });

    const wasOutOfStock = stockEntry.stock === 0;

    stockEntry.stock = stock;
    await stockEntry.save();

    if (wasOutOfStock && stock > 0) {
      await notifyUsersProductAvailable(product_id);
    }

    await notifyLowStock(stockEntry);

    res.json({ message: "Stock updated", stock: stockEntry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update stock", error: error.message });
  }
};

// 🔽 Decrease stock after sale
exports.decreaseStock = async (req, res) => {
  const { product_id, quantity } = req.body;
  const pharmacyId = req.user.pharmacy_id;

  try {
    const stockEntry = await PharmacyStock.findOne({
      pharmacy_id: pharmacyId,
      product_id,
    });

    if (!stockEntry)
      return res.status(404).json({ message: "Stock entry not found" });
    if (stockEntry.stock < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    stockEntry.stock -= quantity;
    await stockEntry.save();

    await notifyLowStock(stockEntry);

    res.json({ message: "Stock decreased", stock: stockEntry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to decrease stock", error: error.message });
  }
};

// 📦 Get stock of logged-in pharmacy
exports.getMyStock = async (req, res) => {
  const pharmacyId = req.user.pharmacy_id;

  try {
    const stock = await PharmacyStock.find({
      pharmacy_id: pharmacyId,
    }).populate("product_id");
    res.json(stock);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch stock", error: error.message });
  }
};

// 🌍 Public: check product availability
exports.checkProductAvailability = async (req, res) => {
  const { productId } = req.params;

  try {
    const entries = await PharmacyStock.find({
      product_id: productId,
      stock: { $gt: 0 },
    }).populate({
      path: "pharmacy_id",
      select: "name address phone",
    });

    res.json({
      availableAt: entries.map((entry) => ({
        pharmacy: entry.pharmacy_id,
        stock: entry.stock,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to check availability", error: error.message });
  }
};

// 🔍 Get stock info for a specific product
exports.getStockByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const pharmacyId = req.user.pharmacy_id;

    if (!pharmacyId) {
      return res
        .status(400)
        .json({ message: "Pharmacy not associated with user" });
    }

    const stockEntry = await PharmacyStock.findOne({
      pharmacy_id: pharmacyId,
      product_id: productId,
    }).populate("product_id");

    if (!stockEntry) {
      return res
        .status(404)
        .json({ message: "Stock entry not found for this product" });
    }

    res.json(stockEntry);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stock entry", error: error.message });
  }
};

// ❌ Delete stock entry (only if stock = 0)
exports.deleteStockEntry = async (req, res) => {
  try {
    const { productId } = req.params;
    const pharmacyId = req.user.pharmacy_id;

    if (!pharmacyId) {
      return res
        .status(400)
        .json({ message: "Pharmacy not associated with user" });
    }

    const stock = await PharmacyStock.findOne({
      pharmacy_id: pharmacyId,
      product_id: productId,
    });

    if (!stock) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    if (stock.stock > 0) {
      return res.status(400).json({
        message:
          "Cannot delete stock entry while stock > 0. Please empty the stock first.",
      });
    }

    await PharmacyStock.deleteOne({ _id: stock._id });

    res.json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting stock entry", error: error.message });
  }
};
