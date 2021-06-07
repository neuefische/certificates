import http from 'http';
import { getTalent, getCourse } from './api';
import { responseCertificate } from './certificate';

const ONE_DAY = 86400;
const PORT = process.env.PORT || 3030;

http
  .createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', ONE_DAY);

    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (url.pathname !== '/') {
      res.statusCode = 404;
      res.end();
      return;
    }

    if (req.method === 'OPTIONS') {
      res.setHeader('ALLOW', 'OPTIONS, GET');
      res.end();
      return;
    }

    if (req.method === 'GET') {
      const id = url.searchParams.get('id');
      if (!id) {
        res.statusCode = 400;
        res.end('Missing search parameter "id"');
        return;
      }
      try {
        const talent = await getTalent(id);
        if (!talent) {
          res.statusCode = 404;
          res.end('Talent not found');
          return;
        }
        const course = await getCourse(talent.courseId);
        if (!course) {
          res.statusCode = 404;
          res.end('Course not found');
          return;
        }
        responseCertificate(res, talent, course);
      } catch (error) {
        console.log(error);
        res.statusCode = 400;
        res.end('Invalid payload JSON');
      }
      return;
    }

    res.statusCode = 405;
    res.end();
  })
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
