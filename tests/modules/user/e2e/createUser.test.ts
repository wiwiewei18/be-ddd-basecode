import { describe, test } from 'bun:test';

describe('CreateUser E2E', () => {
	test(`
    Scenario: Successfully creates a user
        Given Unauthenticated user provides a valid user
        When Unauthenticated user attempts to create a user
        Then The user should be created successfully
    `, () => {});
});
