---
prev: ../guide/setup
next: ./token
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

## JSON Schema
The json schema for this model looks like
```js
{
    type: 'object',
    required: ['email', 'first_name' , 'last_name', 'password_hash', 'username'],
    properties: {
        uid: { type: 'integer'},
        first_name: { type: 'string', minLength: 3},
        middle_name: { type: 'string' },
        last_name: { type: 'string', minLength: 2},
        email: { type: 'email', format: 'email' },
        role: { type: 'integer'},    
        phone_number: { type: 'string'},
        username: { type: 'string' },
        last_login_time: { type: 'date' },
        country: { type: 'string'}, 
        last_location: { type: 'string'}, 
        password_hash: { type: 'string'}, 
    }
}
```
    
