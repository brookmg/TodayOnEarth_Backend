---
prev: ../guide/setup
next: ./socials
---
# User
This model defines the properties of a single user. Every user has a `uid` which uniquely identifies them. It also includes other information such as email and phone number.

As shown in the [Profile](/guide/setup#profile) tab inside the guide, some fields are required to formulate a user object.  

Properties you would find in the user model are:

::: details uid
- An integer value that uniquely identifies the current user.
:::

::: details first_name <Badge text="required" type="warning" />
- Contains the first name of the user
:::

::: details middle_name
- Contains the middle name of the user. This field is an optional field as some countries don't have this.
:::

::: details last_name <Badge text="required" type="warning" />
- Contains the last name of the user
:::

::: details email <Badge text="required" type="warning" />
- Contains the email address of the user. It is a required field
:::

::: details role 
- Defines the role of the user. The higher the better. `role > 3` are considered as admin users
:::

::: details phone_number 
- Contains the phone number of the user
:::

::: details username <Badge text="required" type="warning" />
- Defines the username of the user. Can be used for signing in.
:::

::: details last_login_time
- Timestamp of the last login time of the user.
:::

::: details country <Badge text="required" type="warning" />
- The ISO-2 country code of the user's country. 
:::

::: details last_location <Badge text="unused" type="error" />
- This property doesn't provide any value at this point.
:::

::: details password_hash <Badge text="required" type="warning" />
- The hashed password value of the string user provided when signing up. 
- We currently use `bcrypt` for hashing with 10 round folding. 
:::

::: details is_verified 
- This will hold the status of the email verification for the user.
:::

::: details google_id
- If the account is liked to some google account, this will be the add of the linked account.
:::

::: details facebook_id
- If the account is liked to some facebook account, this will be the add of the linked account.
:::

::: details twitter_id
- If the account is liked to some twitter account, this will be the add of the linked account.
:::

::: details github_id
- If the account is liked to some github account, this will be the add of the linked account.
:::

::: details linkedin_id
- If the account is liked to some linkedin account, this will be the add of the linked account.
:::

::: details telegram_id
- If the account is liked to some telegram account, this will be the add of the linked account.
:::

## Graphql Schema
The gql schema for this model looks like
```graphql
type User {
    uid: Int!,
    first_name: String!,
    middle_name: String,
    last_name: String!,
    email: String!,
    username: String!,
    phone_number: String,
    interests: [Interest],
    country: String,
    is_verified: Boolean,
    last_location: String,
    google_id: String,
    facebook_id: String,
    twitter_id: String,
    github_id: String,
    linkedin_id: String,
    telegram_id: String
}
```
    
