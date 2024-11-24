import app from "./app.js";

const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => {
  console.log(`server start with ${PORT}`);
});
