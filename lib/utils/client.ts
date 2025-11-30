import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardClient } from '../types';
import type { Queue } from 'bullmq';

/**
 * @description
 * Provides a convenience wrapper for BullMQAdapter instantiation over the BullBoard Client API.
 *
 * Note: Do not mix this encapsulated API with the original BullBoard Client API.
 * For example, adding a BullMQ queue via `this.instance.addQueue` and removing it
 * with `this.removeQueue` will fail silentlt, as the class instance has no track of those directly added queue instances.
 */
export class BullBoardClientImpl implements BullBoardClient {
  public instance: BullBoardClient['instance'];
  private QUEUE_ADAPTER_MAP: WeakMap<Queue, BullMQAdapter>;

  constructor(instance: BullBoardClient['instance']) {
    this.instance = instance;
  }

  public setQueues(queues: Queue[]): void {
    const adapters: BullMQAdapter[] = [];
    queues.forEach(queue => {
      const adapter = new BullMQAdapter(queue);
      this.QUEUE_ADAPTER_MAP.set(queue, adapter);
      adapters.push(adapter);
    });
    this.instance.setQueues(adapters);
  }
  public replaceQueues(queues: Queue[]): void {
    const adapters = queues.map(q => new BullMQAdapter(q));
    this.instance.replaceQueues(adapters);
  }
  public addQueue(queue: Queue) {
    const adapter = new BullMQAdapter(queue);
    this.QUEUE_ADAPTER_MAP.set(queue, adapter);
    this.instance.addQueue(adapter);
  }
  public removeQueue(queueOrName: string | Queue) {
    if (typeof queueOrName === 'string')
      return this.instance.removeQueue(queueOrName);
    const adapter = this.QUEUE_ADAPTER_MAP.get(queueOrName);
    if (!adapter) return;
    this.instance.removeQueue(adapter);
  }
}
