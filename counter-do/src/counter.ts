import { DurableObject } from "cloudflare:workers";

export class Counter extends DurableObject<Env> {
  async getValue() {
    const value = await this.ctx.storage.get<number>("value");
    return value || 0;
  }

  async increment() {
    let value = await this.getValue();
    value++;
    await this.ctx.storage.put("value", value);
    return value;
  }

  async decrement() {
    let value = await this.getValue();
    value--;
    await this.ctx.storage.put("value", value);
    return value;
  }
}
