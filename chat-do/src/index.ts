export { Chat } from "./chat";

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("room") || "all";
    const id = env.CHAT.idFromName(roomId);
    const stub = env.CHAT.get(id);
    switch (url.pathname) {
      case "/messages":
        return new Response(JSON.stringify(await stub.getMessages()), {
          headers: { "Content-Type": "application/json" },
        });
      case "/websocket":
        return stub.fetch(request);
      default:
        return new Response("Not found", { status: 404 });
    }
  },
} satisfies ExportedHandler<Env>;
