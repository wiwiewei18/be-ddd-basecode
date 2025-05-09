import type { AggregateRoot } from '../aggregateRoot';
import type { DomainEvent } from './domainEvent';

type EventHandler = (event: DomainEvent) => void;

type Subscribers = { [key: string]: EventHandler[] };

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EventProcessor {
	private static subscribers: Subscribers = {};
	private static markedAggregates: AggregateRoot<unknown>[] = [];

	static markAggregateForDispatch(aggregate: AggregateRoot<unknown>): void {
		const isAggregateFound = !!EventProcessor.findMarkedAggregateId(aggregate.id);

		if (!isAggregateFound) {
			EventProcessor.markedAggregates.push(aggregate);
		}
	}

	private static findMarkedAggregateId(id: string): AggregateRoot<unknown> | null {
		const found = EventProcessor.markedAggregates.find((aggregate) => aggregate.id === id) || null;
		return found;
	}

	static subscribe(callback: (event: DomainEvent) => void, eventClassName: string): void {
		if (!Object.hasOwn(EventProcessor, eventClassName)) {
			EventProcessor.subscribers[eventClassName] = [];
		}

		EventProcessor.subscribers[eventClassName]?.push(callback);
	}

	static publishEventForAggregate(aggregateId: string) {
		const aggregateIndex = EventProcessor.markedAggregates.findIndex((a) => a.id === aggregateId);

		if (aggregateIndex === -1) return;

		const aggregate = EventProcessor.markedAggregates[aggregateIndex] as AggregateRoot<unknown>;

		for (const domainEvent of aggregate.domainEvents) {
			const eventClassName = domainEvent.constructor.name;

			const subscribers = EventProcessor.subscribers[eventClassName];

			if (!subscribers) continue;

			for (const subscriber of subscribers) {
				subscriber(domainEvent);
			}
		}

		aggregate.clearEvents();

		EventProcessor.markedAggregates.splice(aggregateIndex, 1);
	}
}
