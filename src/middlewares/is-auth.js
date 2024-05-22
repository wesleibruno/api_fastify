export function isAuth(request, reply, done) {
  const { authorization } = request.headers;

  if (authorization !== "token") {
    return reply.status(403).send({
      message: "Unauthorized",
    });
  }

  done();
}
