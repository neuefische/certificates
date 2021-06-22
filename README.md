# neuefische certificates

> API based certificate creation

This micro service creates unsigned neuefische certificate pdfs based on the Talent API.

## Development Setup

```
npm install
```

Create a `.env` file based on the `.env.example`.

| KEY     | VALUE                                                      |
| ------- | ---------------------------------------------------------- |
| API_URL | Link to the unofficial Student API endpoint                |
| PORT    | (Optional) Port for the dev environment (defaults to 3030) |

```
npm run dev
```

## Deployment

A docker image is available for deployment.
The same `.env` variables are needed for the deployment.
