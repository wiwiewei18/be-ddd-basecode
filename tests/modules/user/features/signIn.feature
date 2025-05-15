Feature: Sign In

    Scenario: Successfully sign in
        Given Unauthenticated user provides a valid user credential
        When Unauthenticated user attempts to sign in
        Then The user should be signed in successfully

    Scenario: Successfully sign in
        Given Unauthenticated user provides an invalid user credential
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in