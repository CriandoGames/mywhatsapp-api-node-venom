module.exports = (req, res, next) => {
  try {
    const token = req.body.authorization;
    //
    const response = await fetch('http://localhost:9000/sistema/Start', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authorization: req.body.token
      })
    });
    const content = await response.json();
    return content;
    //
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};