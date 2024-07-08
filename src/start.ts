import { app, port } from "./main";

app.listen(port, () => {
  console.info(`
      ------------
      Internal Application Started!
      API: http://localhost:${port}/
      ------------
`);
});
