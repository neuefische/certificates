import PDFDocument from 'pdfkit';
import http from 'http';
import { CourseTopics, Talent } from './api';

const A4SIZE: [number, number] = [595.28, 841.89];

export async function responseCertificate(
  res: http.ServerResponse,
  talent: Talent,
  courseTopics: CourseTopics
): Promise<void> {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/pdf');

  const doc = new PDFDocument({ size: 'A4' });
  doc.pipe(res);

  renderFirstPage(doc, talent.firstName);

  doc.addPage();

  renderSecondPage(doc, courseTopics);

  doc.end();
}

function renderFirstPage(doc: PDFKit.PDFDocument, name: string) {
  doc.image('src/assets/images/background.jpg', 0, 0, { fit: A4SIZE });

  doc.rect(163, 110, 269, 37);
  doc.fillColor('#ff5a36');
  doc.fill();

  doc.fontSize(26);
  doc.fillColor('#fff');
  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');
  doc.text('ZERTIFIKAT', 5, 111, {
    width: A4SIZE[0],
    align: 'center',
    characterSpacing: 10,
  });

  doc.fillColor('#1A3251');
  doc.strokeColor('#1A3251');

  doc.fontSize(17);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('Hiermit bestätigen wir, dass', 0, 193, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(20);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');
  doc.text(name, 0, 240, { width: A4SIZE[0], align: 'center' });

  doc.fontSize(17);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('das Intensivprogramm', 0, 300, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(17);
  doc.font('src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf');
  doc.text('Aus-/Weiterbildung zur Software-Entwicklerin', 0, 336, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(17);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('(Web Development)', 0, 367, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(17);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('mit 540 Stunden Programmierpraxis', 0, 405, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(17);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('(entspricht 720 Unterrichtseinheiten)', 0, 435, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(17);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('erfolgreich absolviert hat.', 0, 473, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(10);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('Dalia Das, Founder & CEO', 79, 662, {
    width: 200,
    align: 'center',
  });

  doc.fontSize(10);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('Leon Machens, Head Coach', 314, 662, {
    width: 200,
    align: 'center',
  });

  doc.fontSize(10);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('18.01.2021 — 09.04.2021\nKöln, den 09.04.2021', 0, 715, {
    width: A4SIZE[0],
    align: 'center',
  });
}

function renderSecondPage(doc: PDFKit.PDFDocument, topics: CourseTopics) {
  doc.image('src/assets/images/background.jpg', 0, 0, { fit: A4SIZE });

  doc.fillColor('#1A3251');
  doc.strokeColor('#1A3251');
  let x = 63;
  let y = 211;

  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');
  doc.fontSize(20);
  doc.text('Ausbildungsinhalte', 0, 107, { width: A4SIZE[0], align: 'center' });

  doc.font('src/assets/fonts/OpenSans/OpenSans-Regular.ttf');
  doc.fontSize(10);
  doc.text(
    'Die Teilnehmer*innen haben in 720 Unterrichtseinheiten folgende Inhalte gelernt,\ndiskutiert und in unterschiedlichen Aufgaben und Projekten vertieft:',
    0,
    145,
    { width: A4SIZE[0], align: 'center' }
  );

  topics.forEach((topic) => {
    let height = 0;
    doc.fontSize(10);
    doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');

    height += doc.heightOfString(topic.title);
    doc.fontSize(11);
    doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');

    topic.items.forEach((item) => {
      height += doc.heightOfString(item);
    });
    if (height + y > A4SIZE[1] - 160) {
      y = 211;
      x += 168;
    }

    doc.fontSize(10);
    doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');

    doc.text(topic.title, x, y);
    doc.fontSize(11);
    doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');

    topic.items.forEach((item) => {
      doc.text(item);
    });

    doc.roundedRect(x - 10, y - 10, 155, height + 20, 8);
    doc.lineWidth(0);
    doc.stroke();
    y += height + 30;
  });
}
