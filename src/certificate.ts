import PDFDocument from 'pdfkit';
import http from 'http';
import fetch from 'node-fetch';
import { Course, CourseTopics, Talent } from './api';

const A4SIZE: [number, number] = [595.28, 841.89];
const PRIMARY_TEXT_COLOR = '#1A3251';
const SECONDARY_TEXT_COLOR = '#7589A2';

export async function responseCertificate(
  res: http.ServerResponse,
  talent: Talent,
  course: Course
): Promise<void> {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/pdf');

  const doc = new PDFDocument({ size: 'A4' });
  doc.pipe(res);

  renderFirstPage(doc, talent, course);

  doc.addPage();

  renderSecondPage(doc, course.topics);

  doc.addPage();

  await renderThirdPage(doc, talent);

  doc.end();
}

function renderFirstPage(
  doc: PDFKit.PDFDocument,
  talent: Talent,
  course: Course
) {
  doc.image('src/assets/images/background.png', 0, 0, { fit: A4SIZE });

  doc.rect(163, 110, 269, 37);
  doc.fillColor('#E74D0F');
  doc.fill();

  doc.fontSize(29);
  doc.fillColor('#fff');
  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');
  doc.text('ZERTIFIKAT', 5, 107, {
    width: A4SIZE[0],
    align: 'center',
    characterSpacing: 10,
  });

  doc.fillColor(PRIMARY_TEXT_COLOR);
  doc.strokeColor('#1A3251');

  doc.fontSize(17);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('Hiermit bestätigen wir, dass', 0, 193, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(28);
  doc.font('src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf');
  doc.text(`${talent.firstName} ${talent.lastName}`, 0, 234, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.moveTo(94, 274).lineTo(501, 274).stroke();

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
  doc.fillColor(SECONDARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('(Web Development)', 0, 366, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(17);
  doc.fillColor(PRIMARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('mit 540 Stunden Programmierpraxis', 0, 405, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(17);
  doc.fillColor(SECONDARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('(entspricht 720 Unterrichtseinheiten)', 0, 435, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(17);
  doc.fillColor(PRIMARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('erfolgreich absolviert hat.', 0, 473, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.moveTo(91, 652).lineTo(267, 652).lineWidth(0.5).stroke();

  doc.fontSize(10);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text('Dalia Das, Founder & CEO', 79, 662, {
    width: 200,
    align: 'center',
  });

  doc.moveTo(325, 652).lineTo(501, 652).lineWidth(0.5).stroke();

  doc.fontSize(10);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text(`${course.coach}, Head Coach`, 314, 662, {
    width: 200,
    align: 'center',
  });

  doc.fontSize(10);
  doc.fillColor(SECONDARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  doc.text(
    `${new Date(course.startDate).toLocaleDateString('de-DE')} — ${new Date(
      course.endDate
    ).toLocaleDateString('de-DE')}\nKöln, den ${new Date().toLocaleDateString(
      'de-DE'
    )}`,
    0,
    715,
    {
      width: A4SIZE[0],
      align: 'center',
    }
  );
}

function renderSecondPage(doc: PDFKit.PDFDocument, topics: CourseTopics) {
  doc.image('src/assets/images/background.png', 0, 0, { fit: A4SIZE });

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

async function renderThirdPage(
  doc: PDFKit.PDFDocument,
  { capstoneProject, lastName, firstName }: Talent
) {
  doc.image('src/assets/images/background_with_phone_frame.png', 0, 0, {
    fit: A4SIZE,
  });

  doc.rect(163, 110, 269, 37);
  doc.fillColor('#E74D0F');
  doc.fill();

  doc.fontSize(29);
  doc.fillColor('#fff');
  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');
  doc.text('ZERTIFIKAT', 5, 107, {
    width: A4SIZE[0],
    align: 'center',
    characterSpacing: 10,
  });

  doc.fontSize(29);
  doc.fillColor(PRIMARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf');
  doc.text(`${firstName} ${lastName}`, 0, 168, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(11);
  doc.fillColor(PRIMARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
  const descriptionWidth = 430;
  doc.text(
    capstoneProject.description,
    A4SIZE[0] / 2 - descriptionWidth / 2,
    210,
    {
      width: descriptionWidth,
      align: 'center',
      lineGap: 3,
    }
  );

  const response = await fetch(capstoneProject.thumbnail);
  const thumbnail = await response.buffer();
  doc.image(thumbnail, 95, 355, { width: 162 });

  let textAlignmentY = 328;

  doc.fontSize(14);
  doc.fillColor(SECONDARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');
  doc.text('TITEL:', 306, textAlignmentY);

  textAlignmentY += doc.heightOfString('TITEL:') + 5;

  doc.fontSize(28);
  doc.fillColor('#E74D0F');
  doc.font('src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf');
  doc.text(`»${capstoneProject.title}«`, 306, textAlignmentY);

  textAlignmentY += doc.heightOfString(`»${capstoneProject.title}«`, {
    width: 200,
  });

  doc.fontSize(15);
  doc.text(capstoneProject.subtitle, 306, textAlignmentY);

  textAlignmentY += doc.heightOfString(capstoneProject.subtitle, {
    width: 200,
  });

  doc.fontSize(14);
  doc.fillColor(SECONDARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');
  doc.text(
    'HIGHLIGHTS:',
    306,
    textAlignmentY > 468 ? textAlignmentY + 15 : 468
  );

  textAlignmentY += doc.heightOfString('HIGHLIGHTS:', { width: 200 }) + 15;

  const x = 316;
  console.log(textAlignmentY);
  const y = textAlignmentY > 510 ? textAlignmentY + 20 : 510;
  doc.fontSize(10);
  doc.roundedRect(
    x - 10,
    y - 10,
    218,
    doc.heightOfString(capstoneProject.technologies.join(' / '), {
      width: 200,
      lineGap: 10,
    }) + 20,
    8
  );
  doc.fillOpacity(1);
  doc.fillAndStroke('#fff', '#E74D0F');

  doc.fontSize(10);
  doc.fillColor('#E74D0F');
  doc.font('src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf');
  doc.text(capstoneProject.technologies.join(' / '), x + 2, y + 4, {
    width: 200,
    lineGap: 10,
  });

  doc.fontSize(11);
  doc.fillColor(SECONDARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');
  doc.text('ABSCHLUSSPROJEKT', 0, 728, {
    width: A4SIZE[0],
    align: 'center',
  });

  doc.fontSize(11);
  doc.fillColor(SECONDARY_TEXT_COLOR);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');
  doc.text('“DIGITALES GESELLENSTÜCK“', 0, 741, {
    width: A4SIZE[0],
    align: 'center',
  });
}
