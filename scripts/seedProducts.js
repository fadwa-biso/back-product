const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/product.model');

const sampleProducts = [
  {
    name: "Aspirin",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    description: {
      product_name: "Aspirin 100mg",
      scientific_name: "Acetylsalicylic acid",
      belongs_to: "NSAIDs",
      mechanism_of_action: "Inhibits cyclooxygenase enzymes, reducing prostaglandin synthesis",
      medical_uses: ["Pain relief", "Fever reduction", "Blood thinning"],
      usage_instructions: ["Take with food", "Do not exceed 4g per day", "Take with water"],
      side_effects: ["Stomach upset", "Bleeding risk", "Ringing in ears"],
      pregnancy_breastfeeding: "Consult doctor before use",
      helpful_tips: ["Store in cool, dry place", "Keep out of reach of children"],
      warnings_precautions: ["May cause stomach bleeding", "Avoid if allergic to aspirin"],
      storage_instructions: ["Store at room temperature", "Keep container tightly closed"],
      more_information: "Common pain reliever and blood thinner"
    }
  },
  {
    name: "Ibuprofen",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
    description: {
      product_name: "Ibuprofen 200mg",
      scientific_name: "Ibuprofen",
      belongs_to: "NSAIDs",
      mechanism_of_action: "Inhibits prostaglandin synthesis",
      medical_uses: ["Pain relief", "Inflammation reduction", "Fever reduction"],
      usage_instructions: ["Take with food", "Maximum 1200mg per day", "Take with water"],
      side_effects: ["Stomach irritation", "Dizziness", "Headache"],
      pregnancy_breastfeeding: "Avoid in third trimester",
      helpful_tips: ["Take with meals", "Stay hydrated"],
      warnings_precautions: ["May cause stomach ulcers", "Avoid if allergic"],
      storage_instructions: ["Store at room temperature", "Protect from light"],
      more_information: "Effective anti-inflammatory medication"
    }
  },
  {
    name: "Paracetamol",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    description: {
      product_name: "Paracetamol 500mg",
      scientific_name: "Acetaminophen",
      belongs_to: "Analgesics",
      mechanism_of_action: "Inhibits prostaglandin synthesis in CNS",
      medical_uses: ["Pain relief", "Fever reduction"],
      usage_instructions: ["Take every 4-6 hours", "Maximum 4g per day", "Take with water"],
      side_effects: ["Liver damage in high doses", "Rare allergic reactions"],
      pregnancy_breastfeeding: "Generally safe, consult doctor"],
      helpful_tips: ["Safe for most people", "Good for fever"],
      warnings_precautions: ["Avoid alcohol", "Check liver function"],
      storage_instructions: ["Store at room temperature", "Keep dry"],
      more_information: "Safe and effective pain reliever"
    }
  },
  {
    name: "Omeprazole",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
    description: {
      product_name: "Omeprazole 20mg",
      scientific_name: "Omeprazole",
      belongs_to: "Proton Pump Inhibitors",
      mechanism_of_action: "Inhibits gastric acid secretion",
      medical_uses: ["Acid reflux", "Stomach ulcers", "GERD"],
      usage_instructions: ["Take before meals", "Once daily", "Take with water"],
      side_effects: ["Headache", "Diarrhea", "Nausea"],
      pregnancy_breastfeeding: "Consult doctor"],
      helpful_tips: ["Take on empty stomach", "Avoid lying down after taking"],
      warnings_precautions: ["May affect calcium absorption", "Long-term use risks"],
      storage_instructions: ["Store at room temperature", "Keep in original container"],
      more_information: "Effective acid reflux treatment"
    }
  },
  {
    name: "Cetirizine",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    description: {
      product_name: "Cetirizine 10mg",
      scientific_name: "Cetirizine hydrochloride",
      belongs_to: "Antihistamines",
      mechanism_of_action: "Blocks histamine H1 receptors",
      medical_uses: ["Allergy relief", "Hay fever", "Hives"],
      usage_instructions: ["Take once daily", "Take with or without food", "Take with water"],
      side_effects: ["Drowsiness", "Dry mouth", "Headache"],
      pregnancy_breastfeeding: "Consult doctor"],
      helpful_tips: ["Take in evening if drowsy", "Good for seasonal allergies"],
      warnings_precautions: ["May cause drowsiness", "Avoid alcohol"],
      storage_instructions: ["Store at room temperature", "Keep dry"],
      more_information: "Non-drowsy allergy medication"
    }
  },
  {
    name: "Vitamin D3",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    description: {
      product_name: "Vitamin D3 1000IU",
      scientific_name: "Cholecalciferol",
      belongs_to: "Vitamins",
      mechanism_of_action: "Promotes calcium absorption and bone health",
      medical_uses: ["Bone health", "Immune support", "Vitamin D deficiency"],
      usage_instructions: ["Take once daily", "Take with fatty meal", "Take with water"],
      side_effects: ["Rare at normal doses", "Nausea in high doses"],
      pregnancy_breastfeeding: "Generally safe, consult doctor"],
      helpful_tips: ["Take with food for better absorption", "Good for winter months"],
      warnings_precautions: ["Don't exceed recommended dose", "Check blood levels"],
      storage_instructions: ["Store at room temperature", "Keep in original container"],
      more_information: "Essential vitamin for bone and immune health"
    }
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rxcure');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);

    console.log('Sample products:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name}: $${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts(); 