import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Ajv from 'ajv';
import { getTalent, getCourseFromFS, Talent, Course } from './api';
import { createCertificate } from './certificate';
import { normalizeDiacritics } from './utils';
import { DataCourseSchema, TalentSchema, WebCourseSchema } from './schema';

const app = express();
const ajv = new Ajv();
const validateTalent = ajv.compile(TalentSchema);
const validateWebCourse = ajv.compile(WebCourseSchema);
const validateDataCourse = ajv.compile(DataCourseSchema);

app.use(express.json());

const PORT = process.env.PORT || 3030;

app.get('/', async (req, res) => {
  const { id, course: courseId } = req.query;

  if (typeof id !== 'string') {
    res.status(400).send('Id is malformed');
    return;
  }
  if (typeof courseId !== 'string') {
    res.status(400).send('CourseId is malformed');
    return;
  }
  if (!id) {
    res.status(400).send('Missing search parameter "id"');
    return;
  }

  try {
    const talent = await getTalent(id);
    if (!talent) {
      res.status(404).send('Talent not found');
      return;
    }
    const course = await getCourseFromFS(courseId);
    if (!course) {
      res.status(404).send('Course not found');
      return;
    }
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${normalizeDiacritics(
        talent.firstName
      )}_${normalizeDiacritics(talent.lastName)}_certificate.pdf"`
    );

    const doc = await createCertificate(talent, course);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(400).send('Invalid payload JSON');
  }
});

app.post('/', async (req, res) => {
  const { talent, course }: { talent: Talent; course: Course } = req.body;

  try {
    const valid = validateTalent(talent);
    if (!valid) {
      res.status(400).send('Malformed data');
      return;
    }
    if (!course) {
      const fsCourse = await getCourseFromFS(talent.courseId);
      if (!fsCourse) {
        res.status(404).send('Course not found');
        return;
      }
      const doc = await createCertificate(talent, fsCourse);
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);
    } else {
      if (validateWebCourse(course) || validateDataCourse(course)) {
        const doc = await createCertificate(talent, course);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);
      }
    }
  } catch (e) {
    console.error(e);
    res.status(400).send('Invalid payload JSON');
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
