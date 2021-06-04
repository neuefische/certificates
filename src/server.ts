import http from 'http';

http
  .createServer((req, res) => {
    res.write('Success');
    res.end();
  })
  .listen(3000, () => {
    console.log('Server running');
  });
