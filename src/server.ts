import http from 'http';
import { getTalent, getCourseTopics } from './api';
import { responseCertificate } from './certificate';

const ONE_DAY = 86400;

http
  .createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', ONE_DAY);

    const url = new URL(req.url, 'http://localhost:3000');

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
      const name = url.searchParams.get('name');
      if (!name) {
        res.statusCode = 400;
        res.end('Missing search parameter "name"');
        return;
      }
      try {
        const talent = await getTalent(name);
        const courseTopics = await getCourseTopics(talent.courseId);
        responseCertificate(res, talent, courseTopics);
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
  .listen(3000, () => {
    console.log('Server running');
  });
