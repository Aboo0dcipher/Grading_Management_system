const bcrypt = require('bcryptjs'); // or 'bcrypt' if you are using bcrypt

async function testHash() {
  const enteredPassword = 'admin123'; // This is the password we are testing
  const storedHashedPassword = '$2a$10$aGtJZ5ZQRFsiQW8XOScUauETmNwlMeubSMuGsC/seGUD1YcYwF7Z2'; // This should be the admin password hash from your DB

  // Manually hash the entered password
  const hashedEnteredPassword = await bcrypt.hash(enteredPassword, 10);
  console.log('Manual hash of entered password:', hashedEnteredPassword);

  // Compare the entered password with the stored hash
  const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
  console.log('Comparison result with stored hash:', isMatch);
}

testHash();
