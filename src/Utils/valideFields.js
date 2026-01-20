const valideFields = (req) => {
  const allowedFields = ["name", "price", "description", "stock", "productImg"];

  const allowedProduct = Object.keys(req.body).filter(
    (fields) => !allowedFields.includes(fields),
  );

  if (allowedProduct.length > 0) {
    throw new Error(`This Fields are not allowed ${allowedProduct}`);
  }
};
export default valideFields;
