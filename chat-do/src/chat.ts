import { DurableObject } from "cloudflare:workers";

export class Chat extends DurableObject<Env> {
  async fetch(request: Request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Not found", { status: 404 });
    }
    const [client, server] = Object.values(new WebSocketPair());
    const clientId = crypto.randomUUID();
    server.serializeAttachment({ clientId });
    this.ctx.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  async getMessages() {
    const messages = await this.ctx.storage.get<string[]>("messages");
    return messages || [];
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    const { clientId: senderClientId } = await ws.deserializeAttachment();
    const messageString = message.toString();
    this.ctx.getWebSockets().forEach(async (ws) => {
      const { clientId } = await ws.deserializeAttachment();
      if (clientId === senderClientId) return;
      try {
        ws.send(messageString);
      } catch (error) {
        ws.close();
      }
    });
    const messages = await this.getMessages();
    messages.push(messageString);
    await this.ctx.storage.put("messages", messages);
  }
}
