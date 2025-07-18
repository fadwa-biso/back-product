require("../config/db.connect");
// استيراد الاتصال من db.config

const mongoose = require("mongoose");
const UserRole = require("../models/UserRole");

const seedRoles = async () => {
  const roles = ["user", "pharmacy_owner", "admin"];
  try {
    // تأكد من الاتصال بقاعدة البيانات أولاً
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // البدء في إضافة الأدوار
    for (const role of roles) {
      const exists = await UserRole.findOne({ role });

      if (!exists) {
        await UserRole.create({ role });
        console.log(`✅ Role "${role}" created`);
      } else {
        console.log(`ℹ️ Role "${role}" already exists`);
      }
    }
    console.log("🎉 Role seeding completed");
  } catch (error) {
    console.error("❌ Role seeding failed:", error.message);
  } finally {
    mongoose.connection.close(); // إغلاق الاتصال بعد الانتهاء
  }
};

seedRoles();
