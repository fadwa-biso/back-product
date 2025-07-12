const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number, 
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    product_name: String,
    scientific_name: String,
    belongs_to: String,
    mechanism_of_action: String,
    medical_uses: [String],
    usage_instructions: [String],
    side_effects: [String],
    pregnancy_breastfeeding: String,
    helpful_tips: [String],
    warnings_precautions: [String],
    storage_instructions: [String],
    more_information: String
  }
}, {
  timestamps: true
});


productSchema.index({
  name: 'text',
  'description.product_name': 'text',
  'description.scientific_name': 'text'
});

module.exports = mongoose.model('Product', productSchema);