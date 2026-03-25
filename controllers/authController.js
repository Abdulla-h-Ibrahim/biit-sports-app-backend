
exports.homePage = (req, res) => {
  try {
    return res.send(`Welcome to Home Page of BIIT Sports Society ... `);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};