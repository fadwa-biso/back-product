 const Cart = require("../models/Cart.model");
const Product = require("../models/product.model");
const Order = require('../models/Order.model');
const Pharmacy = require('../models/Pharmacy');

const getCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;
    console.log("Getting cart for user...");
    console.log("User ID:", userId);

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price image",
      model: "Product",
    });
    // Added by Safwat: populate pharmacy info in cart
    await cart?.populate("pharmacy", "name address phone availablePaymentMethods");
    console.log("Cart found:", cart);

    if (!cart) {
      return res.status(200).json({ items: [], total: 0 });
    }

    console.log("Cart items before transform:", cart.items);

    // Transform the response to match frontend expectations
    const transformedItems = cart.items.map((item) => {
      console.log("=== Processing cart item ===");
      console.log("Item:", item);
      console.log("Product:", item.product);
      console.log("Product type:", typeof item.product);
      console.log("Product _id:", item.product?._id);
      console.log("Product images:", item.product?.images);

      // Handle images properly
      let imageUrl = "";
      if (item.product?.image) {
        imageUrl = item.product.image;
        console.log("Using product image:", imageUrl);
      } else {
        imageUrl = "https://via.placeholder.com/150x150?text=No+Image";
        console.log("Using placeholder image:", imageUrl);
      }

      const transformedItem = {
        _id: item.product?._id?.toString() || item.product?.toString() || "",
        id: item.product?._id?.toString() || item.product?.toString() || "",
        name: item.product?.name || "Unknown Product",
        price: item.price,
        quantity: item.quantity,
        image: imageUrl,
        color: item.color || "",
      };

      console.log("Transformed item:", transformedItem);
      return transformedItem;
    });

    const response = {
      items: transformedItems,
      total: cart.total || 0,
    };

    console.log("Final response:", response);
    res.json(response);
  } catch (error) {
    console.error("Get cart error:", error);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;
    console.log("Adding item to cart...");
    console.log("Request body:", req.body);

    const { productId, quantity = 1, pharmacyId } = req.body; // Added by Safwat: pharmacyId for pharmacy selection

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    console.log("Looking for product:", productId);
    const product = await Product.findById(productId);
    console.log("Product found:", product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let cart = await Cart.findOne({ user: userId });
    console.log("Existing cart:", cart);

    if (!cart) {
      cart = new Cart({
        user: userId,
        pharmacy: pharmacyId || null, // Added by Safwat: set pharmacy if provided
        items: [
          {
            product: productId,
            quantity,
            price: product.price,
          },
        ],
      });
      console.log("Created new cart");
    } else {
      // Added by Safwat: Prevent adding products from different pharmacies to the same cart
      if (cart.items.length > 0 && cart.pharmacy && cart.pharmacy.toString() !== pharmacyId) {
        return res.status(400).json({ 
          message: "لا يمكن إضافة منتجات من صيدليات مختلفة. أفرغ السلة أولاً أو اختر نفس الصيدلية." 
        });
      }
      
      // Added by Safwat: update pharmacy if provided
      if (pharmacyId && cart.pharmacy?.toString() !== pharmacyId) {
        cart.pharmacy = pharmacyId;
      }
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = product.price;
        console.log("Updated existing item");
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
        });
        console.log("Added new item");
      }
    }
    await cart.save();
    await cart.populate("items.product", "name price image");
    // Added by Safwat: populate pharmacy info
    await cart.populate("pharmacy", "name address phone");
    console.log("Cart saved successfully");

    // Transform the response to match frontend expectations
    const transformedItems = cart.items.map((item) => {
      console.log("Processing cart item:", item);
      console.log("Product:", item.product);
      console.log("Product image:", item.product?.image);

      // Handle images properly
      let imageUrl = "";
      if (item.product?.image) {
        imageUrl = item.product.image;
      } else {
        imageUrl = "https://via.placeholder.com/150x150?text=No+Image"; // Default placeholder
      }

      return {
        _id: item.product?._id?.toString() || item.product?.toString() || "",
        id: item.product?._id?.toString() || item.product?.toString() || "",
        name: item.product?.name || "Unknown Product",
        price: item.price,
        quantity: item.quantity,
        image: imageUrl,
        color: item.color || "",
      };
    });

    const response = {
      items: transformedItems,
      total: cart.total || 0,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Add to cart error:", error);
    res
      .status(500)
      .json({ message: "Error adding item to cart", error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    await cart.populate("items.product", "name price image");

    // Transform the response to match frontend expectations
    const transformedItems = cart.items.map((item) => {
      console.log("Processing cart item:", item);
      console.log("Product:", item.product);
      console.log("Product image:", item.product?.image);

      // Handle images properly
      let imageUrl = "";
      if (item.product?.image) {
        imageUrl = item.product.image;
      } else {
        imageUrl = "https://via.placeholder.com/150x150?text=No+Image"; // Default placeholder
      }

      return {
        _id: item.product?._id?.toString() || item.product?.toString() || "",
        id: item.product?._id?.toString() || item.product?.toString() || "",
        name: item.product?.name || "Unknown Product",
        price: item.price,
        quantity: item.quantity,
        image: imageUrl,
        color: item.color || "",
      };
    });

    const response = {
      items: transformedItems,
      total: cart.total || 0,
    };

    res.json(response);
  } catch (error) {
    console.error("Remove from cart error:", error);
    res
      .status(500)
      .json({ message: "Error removing item from cart", error: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = [];
    await cart.save();

    // Return empty cart with correct format
    const response = {
      items: [],
      total: 0,
    };

    res.json(response);
  } catch (error) {
    console.error("Clear cart error:", error);
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    console.log("=== UPDATE CART ITEM DEBUG ===");
    console.log("Product ID from params:", productId);
    console.log("Quantity from body:", quantity);

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    cartItem.quantity = quantity;
    cartItem.price = product.price;
    await cart.save();
    await cart.populate("items.product", "name price image");

    // Transform the response to match frontend expectations
    const transformedItems = cart.items.map((item) => {
      console.log("Processing cart item:", item);
      console.log("Product:", item.product);
      console.log("Product image:", item.product?.image);

      // Handle images properly
      let imageUrl = "";
      if (item.product?.image) {
        imageUrl = item.product.image;
      } else {
        imageUrl = "https://via.placeholder.com/150x150?text=No+Image"; // Default placeholder
      }

      return {
        _id: item.product?._id?.toString() || item.product?.toString() || "",
        id: item.product?._id?.toString() || item.product?.toString() || "",
        name: item.product?.name || "Unknown Product",
        price: item.price,
        quantity: item.quantity,
        image: imageUrl,
        color: item.color || "",
      };
    });

    const response = {
      items: transformedItems,
      total: cart.total || 0,
    };

    res.json(response);
  } catch (error) {
    console.error("Update cart error:", error);
    res
      .status(500)
      .json({ message: "Error updating cart item", error: error.message });
  }
};

// Checkout process
const checkout = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userId = req.user.id;
    const { name, phone, address, location, paymentMethod, coupon, paymentDetails } = req.body;
    // Added by Safwat: get pharmacy from cart instead of request body
    const cart = await Cart.findOne({ user: userId }).populate("pharmacy");
    if (!cart || !cart.pharmacy) {
      return res.status(400).json({ message: "No pharmacy selected in cart" });
    }
    const pharmacy = cart.pharmacy;
    
    console.log("=== CHECKOUT PROCESS ===");
    console.log("User ID:", userId);
    console.log("Order data:", { name, phone, address, location, paymentMethod, coupon, pharmacy: pharmacy.name });

    // Validate required fields
    if (!name || !phone || !address || !paymentMethod) {
      return res.status(400).json({ 
        message: "Missing required fields: name, phone, address, and payment method are required" 
      });
    }

    // Get user's cart
    const cartWithItems = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price image stock",
      model: "Product",
    });

    if (!cartWithItems || cartWithItems.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check stock availability
    for (const item of cartWithItems.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    // Calculate totals
    const subtotal = cartWithItems.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 10; // Fixed delivery fee
    const tax = subtotal * 0.14; // 14% tax
    const discount = coupon === 'WELCOME10' ? subtotal * 0.1 : 0;
    const total = subtotal + deliveryFee + tax - discount;

    // Create order object
    const orderDoc = new Order({
      user: userId,
      pharmacy: pharmacy._id, // Added by Safwat: use pharmacy from cart
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        name: item.product.name
      })),
      shipping: {
        name,
        phone,
        address,
        location: location || null
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'paid',
        paymentDetails: paymentDetails || null,
      },
      totals: {
        subtotal,
        delivery: deliveryFee,
        tax,
        discount,
        total
      },
      status: 'pending',
      orderDate: new Date(),
      coupon: coupon || null,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    });

    // Update product stock
    for (const item of cartWithItems.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Save order
    await orderDoc.save();

    // Clear the cart
    cartWithItems.items = [];
    await cartWithItems.save();

    // TODO: Integrate with payment gateway if paymentMethod is not 'cod'
    // Example: if (paymentMethod === 'credit_card') { ... integrate payment ... }

    res.status(200).json({
      message: "Order placed successfully!",
      order: orderDoc
    });

  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ 
      message: "Error processing checkout", 
      error: error.message 
    });
  }
};

// Added by Safwat: Set pharmacy in cart
const setPharmacyInCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userId = req.user.id;
    const { pharmacyId } = req.body;
    
    if (!pharmacyId) {
      return res.status(400).json({ message: "Pharmacy ID is required" });
    }
    
    // Verify pharmacy exists
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    cart.pharmacy = pharmacyId;
    await cart.save();
    await cart.populate("pharmacy", "name address phone availablePaymentMethods");
    
    res.status(200).json({
      message: "Pharmacy set in cart successfully",
      cart: cart
    });
    
  } catch (error) {
    console.error("Set pharmacy error:", error);
    res.status(500).json({ 
      message: "Error setting pharmacy in cart", 
      error: error.message 
    });
  }
};

// Added by Safwat: Get available payment methods for selected pharmacy
const getAvailablePaymentMethods = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "pharmacy",
      populate: {
        path: "availablePaymentMethods.method",
        model: "PaymentMethod"
      }
    });
    
    if (!cart || !cart.pharmacy) {
      return res.status(400).json({ message: "No pharmacy selected in cart" });
    }
    
    const paymentMethods = cart.pharmacy.availablePaymentMethods.map(pm => ({
      method: pm.method,
      details: pm.details
    }));
    
    res.status(200).json({
      pharmacy: {
        name: cart.pharmacy.name,
        address: cart.pharmacy.address,
        phone: cart.pharmacy.phone
      },
      availablePaymentMethods: paymentMethods
    });
    
  } catch (error) {
    console.error("Get payment methods error:", error);
    res.status(500).json({ 
      message: "Error getting payment methods", 
      error: error.message 
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  checkout,
  setPharmacyInCart, // Added by Safwat
  getAvailablePaymentMethods, // Added by Safwat
};