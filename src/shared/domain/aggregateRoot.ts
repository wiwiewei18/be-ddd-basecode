import { logger } from '@shared/logger';
import { Entity } from './entity';
import type { DomainEvent } from './events/domainEvent';
import { EventProcessor } from './events/eventProcessor';

export abstract class AggregateRoot<T> extends Entity<T> {
	private _domainEvents: DomainEvent[] = [];

	get id(): string {
		return this._id;
	}

	get domainEvents(): DomainEvent[] {
		return this._domainEvents;
	}

	protected raiseDomainEvent(domainEvent: DomainEvent): void {
		this._domainEvents.push(domainEvent);
		EventProcessor.markAggregateForDispatch(this);
		this.logDomainEventRaised(domainEvent);
	}

	private logDomainEventRaised(domainEvent: DomainEvent): void {
		const thisClass = Reflect.getPrototypeOf(this);
		const domainEventClass = Reflect.getPrototypeOf(domainEvent);
		logger.info(
			`Domain Event raised: ${thisClass?.constructor.name} ==> ${domainEventClass?.constructor.name}`,
		);
	}

	clearEvents() {
		this._domainEvents = [];
	}
}
