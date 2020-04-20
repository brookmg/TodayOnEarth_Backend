---
prev: ../
next: ../models/user
serverLocation: https://toeapi.herokuapp.com/graphql
---
# Setup
Our API is 99% graphql based (the 1% accounts for the auth process involving 0Auth). All the tasks you want to command should be given as either gql queries or mutations.

## Getting Started 
It's pretty simple to set up this API. Just sign up using either our [frontend app]('https://github.com/brookmg/TodayOnEarth_frontend') or our graphql mutation.

```graphql
mutation {
    signUp(new_user: {
        first_name: "Berry"
        last_name: "Allen"
        email: "berry@starlabs.lab"
        password: "ImTheFlash"
        country: "USA" # Optional
        username: "berryallen"
    }) {
        token
    }
}
```

You can also sign in if you have signed up before. 

```graphql
mutation {
    signIn(email: "berry@starlabs.lab", password: "ImTheFlash") {
        token
    }
}
```

**!Notice**: in both cases the mutation returns the token to be used for talking to our API. you can use this token in the `Authorization` header of your requests or if your client supports cookies, everything is handled by default for you.

## Installation <Badge text="Advanced" type="warning"/>

::: tip 
You can just use our API located at {{ $page.frontmatter.serverLocation }} if you don't want to set up your own.
:::

You can also get a copy of this API to run on your local machine or host. To get started:
 - clone the [API repository]('https://github.com/brookmg/TodayOnEarth_Backend') from github. 
 - Install redis using apt-get and start it as a service
 ```bash 
 sudo apt-get install redis-server && sudo service redis-server start
 ```
 - Install python3.6 using apt-get
 ```bash 
  sudo apt-get install python3.6
 ```
 - run ` npm install ` which should install all required dependencies and compile the native node modules.
 - rename `.env.sample` to `.env` and fill out the required keys inside the file. _for security purposes we can't give out actual keys_
 - Finally, run the following command where LIBPYTHON_PATH is an environment variable holding the python sharable object file location and SIMILARITY_SCORE_GENERATOR_PY_FOLDER is the location where the NLP computer python file is located ( you don't need to worry about the second one because it's in /src/native/extra folder by default )
 ```bash
    LIBPYTHON_PATH=/usr/lib/python3.6/config-3.6m-x86_64-linux-gnu/libpython3.6.so SIMILARITY_SCORE_GENERATOR_PY_FOLDER=${LOCATION_OF_PROJECT_CLONE}/src/native/extra npm run dev
 ``` 
 - Now you should have a gql server and subscription ws running on the same port 😁
 
## Repository directory structure

<!-- textlint-disable terminology -->

::: vue
.
├── docs _(**Documentation**)_
├── src
│   ├── auth _(**Authentication with passport**)_
│   ├── bot _(**Telegram bot**)_
│   ├── `db` _(**Utility methods for db interaction**)_
│   │   ├── `db.ts` _(**Main Db connection initializer**)_
│   │   ├── `interest_table.ts` _(**Utility methods for interest table**)_
│   │   ├── `keyword_table.ts` _(**Utility methods for keyword table**)_
│   │   ├── `login_table.ts` _(**Utility methods for login related tasks**)_
│   │   ├── `post_table.ts` _(**Utility methods for post table**)_
│   │   ├── `token_table.ts` _(**Utility methods for token table**)_
│   ├── `graphql` _(**Graphql schema definitions**)_
│   ├── model _(**Database table schema definitions**)_
│   ├── `native` _(**Native modules**)_
│   ├── `post_fetchers` _(**Social media scrappers**)_
│   ├── queue _(**Bull queue definitions and Arena**)_
│   ├── socials _(**Modules for social-platforms**)_
│   │   ├── `facebook.ts` _(**Methods to talk to facebook API**)_
│   │   ├── `linkedin.ts` _(**Methods to talk to LinkedIn API**)_
│   │   ├── `telegram.ts` _(**Methods to talk to Telegram Bot API**)_
│   │   ├── `twitter.ts` _(**Methods to talk to Twitter API**)_
│   ├── README.md
│ 
└── package.json
└── Procfile _(**Heroku configuration**)_
└── requirements.txt _(**Python dependencies**)_
└── runtime.txt _(**Python runtime version**)_
└── tsconfig.json _(**Typescript configuration**)_
:::

<!-- textlint-enable -->

## Profile
Every user in our system has a profile. Whether they are a Bot or an actual user, they will have certain properties that can be linked to them.

As you can see above, The attributes we require from a user when they first sign up are: 
```graphql
input IUser {
        first_name: String!, # first name is required
        middle_name: String,
        last_name: String!, # last name is required
        email: String!, # email is required
        username: String!, # username is required
        phone_number: String,
        country: String,
        last_location: String,
        password: String! # password is required
}
```

A user will also be linked with other properties such us [Interest](/models/interest) and [Provider](/models/provider) in a later time. You can access your own interests and providers using the `me` query.

```graphql
query {
    me {
        first_name
        last_name 
        interests { 
            interest 
            score 
        } 
    }
}
```
