Feature: Create User

    Scenario: Successfully creates a user
        Given Unauthenticated user provides a valid user
        When Unauthenticated user attempts to create a user
        Then The user should be created successfully

    Scenario: Fail creates a user with an empty name
        Given Unauthenticated user provides a user with an empty name
        When Unauthenticated user attempts to create a user
        Then The user should be not be created

    Scenario: Fail creates a user with an empty email
        Given Unauthenticated user provides a user with an empty email
        When Unauthenticated user attempts to create a user
        Then The user should be not be created

    Scenario: Fail creates a user with an invalid format email
        Given Unauthenticated user provides a user with an invalid format email
        When Unauthenticated user attempts to create a user
        Then The user should be not be created

    Scenario: Fail creates a user with an empty password
        Given Unauthenticated user provides a user with an empty password
        When Unauthenticated user attempts to create a user
        Then The user should be not be created

    Scenario: Fail creates a user with a less than 8 chars password
        Given Unauthenticated user provides a user with a less than 8 chars password
        When Unauthenticated user attempts to create a user
        Then The user should be not be created

    Scenario: Fail creates a user with a more than 50 chars password
        Given Unauthenticated user provides a user with a more than 50 chars password
        When Unauthenticated user attempts to create a user
        Then The user should be not be created