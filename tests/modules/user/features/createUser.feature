Feature: Create User

    Scenario: Successfully creates a user
        Given Unauthenticated user provides a valid user
            | fullName       | email                     | password |
            | Monkey D Luffy | monkeydluffy@mugiwara.com | 12345678 |
        When Unauthenticated user attempts to create a user
        Then The user should be created successfully