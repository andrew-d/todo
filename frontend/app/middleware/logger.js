export default function loggerMiddleware (next) {
  return action => {
    // TODO: only in prod builds?
    console.log(action);
    next(action);
  };
}
