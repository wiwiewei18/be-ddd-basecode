Feature: Sign In

    Scenario: Successfully sign in
        Given Unauthenticated user provides a valid user credential
        When Unauthenticated user attempts to sign in
        Then The user should be signed in successfully

    Scenario: Fail to sign in with an invalid email
        Given Unauthenticated user provides an invalid email
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in

    Scenario: Fail to sign in with an invalid password
        Given Unauthenticated user provides an invalid password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in

    Scenario: Fail to sign in with an empty email
        Given Unauthenticated user provides an user with an empty email
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in

    Scenario: Fail to sign in with an invalid format email
        Given Unauthenticated user provides an user with an invalid format email
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in

    Scenario: Fail to sign in with an empty password
        Given Unauthenticated user provides an user with an empty password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in

    Scenario: Fail to sign in with a less than 8 chars password
        Given Unauthenticated user provides an user with a less than 8 chars password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in

    Scenario: Fail to sign in with a more than 50 chars password
        Given Unauthenticated user provides an user with a more than 50 chars password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in