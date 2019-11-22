export const undefinedRouteHandler = (req, res, next) => {
  let err = new Error("404 not found");
  err.status = 404;
  next(err);
};
