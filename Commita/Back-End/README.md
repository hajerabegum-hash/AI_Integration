# AI Commit Summariser API

## Setup

1. From this directory, install dependencies with `npm install`.
2. Copy `.env.sample` to `.env`.
3. Set `GEMINI_API_KEY`, `MONGODB_URL`, and a strong `JWT_SECRET`.
4. Start the API with `npm run dev` or `npm start`.

The default port is `8080`. Set `PORT` in `.env` to use another port.

## Authentication

Signup and signin return a JWT. Send it on every protected request:

```text
Authorization: Bearer <token>
```

### `POST /api/auth/signup`

Request body:

```json
{
  "email": "user@example.com",
  "username": "user",
  "password": "password123"
}
```

Response: `201` with `token` and a `user` object.

### `POST /api/auth/signin`

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response: `200` with `token` and a `user` object.

## Protected summary routes

### `POST /api/summaries/generate`

Requires a JWT. Request body:

```json
{
  "githubURL": "https://github.com/owner/repository"
}
```

The API also accepts `github.com/owner/repository` without the protocol and
normalizes repository URLs copied from GitHub subpages to the base repository
URL. HTTPS is required.

The response contains the generated `finalSummaryArray` and `githubURL`. The
same values are saved in MongoDB with the authenticated user's ID and username.

### `GET /api/summaries/history`

Requires a JWT. Returns only the authenticated user's history:

```json
{
  "history": [
    {
      "_id": "...",
      "githubURL": "https://github.com/owner/repository",
      "finalSummaryArray": [
        {
          "summary": "...",
          "commitHash": "...",
          "commitMessage": "...",
          "commitAuthorName": "...",
          "commitAuthorImg": "...",
          "commitDate": "..."
        }
      ],
      "createdAt": "..."
    }
  ]
}
```

The frontend can use `githubURL` as an accordion header and render each item
in `finalSummaryArray` as its accordion body. Multiple generations are
returned as separate history entries, newest first.

## Error responses

Validation errors return `400`, missing or invalid JWTs return `401`, duplicate
accounts return `409`, and unexpected server failures return `500`. Errors use
the shape `{ "msg": "..." }`.


## Prompt used to generate this version of backend:

Hey AI, I am building an application called "AI-COMMIT-SUMMARISER". First I want to complete my backend and then I will go for frontend. I have installed some libraries already like jsonwebtoken, bcrypt, mongoose, express, etc. I have also written the core bussiness logic of my application, you can refer the index.js file and I have also created helper functions in "lib" folder, you can refer them as well. I have created a ".env.sample" you can refer that file to take idea about ".env" file.

BACKEND TASKS:
- Create and implement authentication and create signup, signin routes. Keep the signup route simple just take "email", "username", "password". and create signin route accordingly.
- make sure other routes are portected.
- Create a generate summary route where user will send the githubURL from frontend and you have to generatre the finalSummaryArray for him and send the response back. also, save the finalSummaryArray in db with the username and githubURL associated.
- Create another router to get the history of previously generated github commit summaries, which we already save it db. This route should send all the previously generate summaries for each github repo user asked to generate summary for. make sure to keep githubURL with the summary array because at frontend I want to create a page where I show all the summaries in the form of accordian, where githubURl is the accordian header and the commits and their summaries will be accordian body.
- write all your steps and api routes you create in the README.md file, such that it should server as an API Documentation as well as It should serve as a helper file for AI to create frontend for this backend accordingly.