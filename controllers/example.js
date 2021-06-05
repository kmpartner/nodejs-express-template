exports.exampleGet = (req, res, next) => {
 res.status(200).json({ message: 'example route get success'}); 
}

exports.exampleGetError = (req, res, next) => {
  // just for example error send
  const error = new Error('error response from example route.');
  error.statusCode = 400;
  throw error;

  // res.status(400).json({ message: 'error response from example route.'})
}