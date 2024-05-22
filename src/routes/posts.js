import { isAuth } from "../middlewares/is-auth.js";

const posts = [];

export async function postsRoutes(app) {
  app.get("/posts", { onRequest: [isAuth] }, async (request, reply) => {
    return reply.status(200).send(posts);
  });

  app.post("/posts", { onRequest: [isAuth] }, async (request, reply) => {
    const { username, title, content } = request.body;

    const post = {
      id: posts.length + 1,
      owner: username,
      title,
      content,
      date: new Date().toISOString(),
      comments: [],
      likes: [],
    };

    posts.push(post);

    return reply.status(201).send(post);
  });

  app.post(
    "/posts/:id/comment",
    { onRequest: [isAuth] },
    async (request, reply) => {
      const { id } = request.params;

      const postIndex = posts.findIndex((post) => post.id === +id);

      if (postIndex === -1) {
        return reply.status(404).send({
          message: "Post not found",
        });
      }

      const { username, content } = request.body;

      const comment = {
        owner: username,
        content,
        date: new Date().toISOString(),
      };

      posts[postIndex].comments.push(comment);

      return reply.status(201).send(posts[postIndex]);
    }
  );

  app.patch(
    "/posts/:id/like",
    { onRequest: [isAuth] },
    async (request, reply) => {
      const { id } = request.params;

      const postIndex = posts.findIndex((post) => post.id === +id);

      if (postIndex === -1) {
        return reply.status(404).send({
          message: "Post not found",
        });
      }

      const { username } = request.body;

      const likeIndex = posts[postIndex].likes.findIndex(
        (like) => like === username
      );

      if (likeIndex !== -1) {
        posts[postIndex].likes.splice(likeIndex, 1);
      } else {
        posts[postIndex].likes.push(username);
      }

      return reply.status(200).send(posts[postIndex]);
    }
  );

  app.delete("/posts/:id", { onRequest: [isAuth] }, async (request, reply) => {
    const { id } = request.params;

    const postIndex = posts.findIndex((post) => post.id === +id);

    if (postIndex === -1) {
      return reply.status(404).send({
        message: "Post not found",
      });
    }

    const { username } = request.body;

    if (posts[postIndex].owner !== username) {
      return reply.status(403).send({
        message: "Unauthorized",
      });
    }

    posts.splice(postIndex, 1);

    return reply.status(204).send();
  });
}
