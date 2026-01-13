export { Counter } from "./counter";

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const id = env.COUNTER.idFromName("counter");
    const stub = env.COUNTER.get(id);
    let count = null;
    switch (url.pathname) {
      case "/increment":
        count = await stub.increment();
        break;
      case "/decrement":
        count = await stub.decrement();
        break;
      case "/":
        count = await stub.getValue();
        break;
      default:
        return new Response("Not found", { status: 404 });
    }
    return new Response(`Current value is: ${count}`, { status: 200 });
  },
} satisfies ExportedHandler<Env>;
