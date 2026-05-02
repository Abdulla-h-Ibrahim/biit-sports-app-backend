const connectDB = require('../config/databaseConnection');
const User = require('../models/userModel');

async function setAdmin() {
  await connectDB();

  let user = await User.findOne({
    name: /abdullah/i,
    $or: [{ name: /ibrahim/i }, { email: /ibrahim/i }],
  });

  if (!user) {
    user = await User.create({
      name: 'Abdullah Ibrahim',
      arid_no: 'ADMIN-ABDULLAH-IBRAHIM',
      age: 22,
      email: 'abdullah.ibrahim@biit.edu.pk',
      password: 'Pass@123',
      role: 'admin',
      gender: 'other',
    });
    console.log('Created admin user Abdullah Ibrahim:', user._id.toString());
  } else {
    user.role = 'admin';
    await user.save();
    console.log('Updated user to admin:', user.name, user._id.toString());
  }

  process.exit(0);
}

setAdmin().catch((error) => {
  console.error('Failed to set Abdullah Ibrahim as admin:', error.message);
  process.exit(1);
});
