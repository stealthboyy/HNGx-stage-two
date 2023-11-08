import { app, port } from "./app.main";

app.listen(port, () => {
  console.info(`
      ------------
      Internal Application Started!
      API: http://localhost:${port}/
      ------------
`);
});
