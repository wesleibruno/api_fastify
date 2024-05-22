import fastify from "fastify";
import { postsRoutes } from "./routes/posts.js";

const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

app.register(postsRoutes);

app.listen({
  host: "0.0.0.0",
  port: 3333,
});
