import express from "express";
import { server } from "./server";

async function startApolloServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve) => {
    app.listen(PORT, resolve as any);
  });

  console.log(`
🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}
🚄 Express Server listening on PORT: ${PORT}
`);

  return {
    server,
    app,
  };
}

startApolloServer();
