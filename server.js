import Fastify from "fastify";
import proxy from "@fastify/http-proxy";

const PORT = Number(process.env.PORT || 3000);
const TARGET = process.env.TARGET_SITE || "https://arbatwood-temp-20260814.elb001.chatgpt.site";

const app = Fastify({ logger: true });

app.register(proxy, {
  upstream: TARGET,
  prefix: "/",
  rewritePrefix: "/",
  http2: false,
  replyOptions: {
    rewriteRequestHeaders: (_request, headers) => ({
      ...headers,
      host: new URL(TARGET).host
    }),
    rewriteHeaders: (headers) => {
      const next = { ...headers };
      delete next["content-security-policy"];
      delete next["x-frame-options"];
      return next;
    }
  }
});

app.listen({ port: PORT, host: "0.0.0.0" });
