# neuefische certificates

> API based certificate creation

This micro service creates unsigned neuefische certificate pdfs based on the Talent API.

## Setup

```shell
npm install
```

This will install the dependencies required to run this project.

Create a `.env` file based on the `.env.example`.

| KEY     | VALUE                                                      |
| ------- | ---------------------------------------------------------- |
| API_URL | Link to the unofficial student API endpoint                |
| PORT    | (Optional) Port for the dev environment (defaults to 3030) |

The `API_URL` is used to fetch student data by `id`. Please ask the maintainers for a valid url.

## Development

```shell
npm run dev
```

This will run the server on `localhost:3030`.

To generate a certificate for a student, visit `http://localhost:3030/?id={studentId}&course={courseId}`.

| param       | explanation                                              | example                                |
| ----------- | -------------------------------------------------------- | -------------------------------------- |
| `studentId` | studentId that is used in the talent app                 | `73df25e3-abc1-1234-b270-a480e38ac6dc` |
| `courseId`  | courseId is defined in `src/assets/samples/courses.json` | `hh-web-21-3`                          |

You can find the `studentId` by looking at the URL of the student profile.

Example:  
`https://talents.neuefische.com/student/73df25e3-c6db-4267-b270-a480e38ac6dc`  
The `studentId` is `73df25e3-c6db-4267-b270-a480e38ac6dc`.

The `courseId` is the id of the course you want to select from `src/assets/samples/courses.json`. In the future, we like to fetch the course from the talent API.

## Add new course

Right now, we can not get course data from the talent API. In the meantime, `src/assets/samples/courses.json` is used to define course data. If you like to add a new course, please add it to the `src/assets/samples/courses.json` and create a pull request.

## Deployment

A docker image is available for deployment.
The same `.env` variables are needed for the deployment.
