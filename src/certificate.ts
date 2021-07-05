import PDFDocument from 'pdfkit';
import http from 'http';
import fetch from 'node-fetch';
import { Course, CourseTopics, Talent } from './api';
import text from './components/text';
import { calculateFontSize } from './utils';

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

  if (talent.capstoneProject) {
    doc.addPage();
    await renderThirdPage(doc, talent);
  }

  doc.end();
}

function renderFirstPage(
  doc: PDFKit.PDFDocument,
  talent: Talent,
  course: Course
) {
  doc.image('src/assets/images/background.png', 0, 0, { fit: A4SIZE });

  doc.rect(163, 110, 269, 37).fillColor('#E74D0F').fill();

  text(doc, {
    text: 'ZERTIFIKAT',
    x: 5,
    y: 107,
    options: {
      width: A4SIZE[0],
      align: 'center',
      characterSpacing: 10,
    },
    fontSize: 29,
    font: 'src/assets/fonts/OpenSans/OpenSans-Bold.ttf',
    fillColor: '#fff',
  });

  text(doc, {
    text: 'Hiermit bestätigen wir, dass',
    x: 0,
    y: 193,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fillColor: PRIMARY_TEXT_COLOR,
    strokeColor: '#1A3251',
    fontSize: 17,
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
  });

  text(doc, {
    text: `${talent.firstName} ${talent.lastName}`,
    x: 0,
    y: 234,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fontSize: 28,
    font: 'src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf',
  });

  doc.moveTo(94, 274).lineTo(501, 274).stroke();

  text(doc, {
    text: 'das Intensivprogramm',
    x: 0,
    y: 300,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fontSize: 17,
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
  });

  text(doc, {
    text: 'Aus-/Weiterbildung zum/zur Software-Entwickler*in',
    x: 0,
    y: 336,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fontSize: 17,
    font: 'src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf',
  });

  text(doc, {
    text: '(Web Development)',
    x: 0,
    y: 366,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fontSize: 17,
    fillColor: SECONDARY_TEXT_COLOR,
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
  });

  text(doc, {
    text: 'mit 540 Stunden Programmierpraxis',
    x: 0,
    y: 405,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fontSize: 17,
    fillColor: PRIMARY_TEXT_COLOR,
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
  });

  text(doc, {
    text: '(entspricht 720 Unterrichtseinheiten)',
    x: 0,
    y: 435,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fontSize: 17,
    fillColor: SECONDARY_TEXT_COLOR,
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
  });

  text(doc, {
    text: 'erfolgreich absolviert hat.',
    x: 0,
    y: 473,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fontSize: 17,
    fillColor: PRIMARY_TEXT_COLOR,
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
  });

  doc.moveTo(91, 652).lineTo(267, 652).lineWidth(0.5).stroke();

  text(doc, {
    text: 'Dalia Das, Founder & CEO',
    x: 79,
    y: 662,
    options: {
      width: 200,
      align: 'center',
    },
    fontSize: 10,
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
  });

  doc.moveTo(325, 652).lineTo(501, 652).lineWidth(0.5).stroke();

  text(doc, {
    text: `${course.coach}, Head Coach`,
    x: 314,
    y: 662,
    options: {
      width: 200,
      align: 'center',
    },
    fontSize: 10,
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
  });

  text(doc, {
    text: `${new Date(course.startDate).toLocaleDateString(
      'de-DE'
    )} — ${new Date(course.endDate).toLocaleDateString(
      'de-DE'
    )}\nKöln, den ${new Date().toLocaleDateString('de-DE')}`,
    x: 0,
    y: 715,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fontSize: 10,
    fillColor: SECONDARY_TEXT_COLOR,
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
  });
}

function renderSecondPage(doc: PDFKit.PDFDocument, topics: CourseTopics) {
  doc.image('src/assets/images/background.png', 0, 0, { fit: A4SIZE });

  doc.fillColor('#1A3251');
  doc.strokeColor('#1A3251');
  let x = 63;
  let y = 211;

  text(doc, {
    text: 'Ausbildungsinhalte',
    x: 0,
    y: 107,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    font: 'src/assets/fonts/OpenSans/OpenSans-Bold.ttf',
    fontSize: 20,
  });

  text(doc, {
    text: 'Die Teilnehmer*innen haben in 720 Unterrichtseinheiten folgende Inhalte gelernt,\ndiskutiert und in unterschiedlichen Aufgaben und Projekten vertieft:',
    x: 0,
    y: 145,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    font: 'src/assets/fonts/OpenSans/OpenSans-Regular.ttf',
    fontSize: 10,
  });

  topics.forEach((topic) => {
    let height = 0;
    doc.fontSize(10);
    doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');

    height += doc.heightOfString(topic.title, { lineGap: 3 });
    doc.fontSize(10);
    doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');

    topic.items.forEach((item) => {
      height += doc.heightOfString(item, { width: 140, lineGap: 1 });
    });
    if (height + y > A4SIZE[1] - 150) {
      y = 211;
      x += 168;
    }

    text(doc, {
      text: topic.title,
      x,
      y,
      options: {
        lineGap: 3,
      },
      fontSize: 10,
      font: 'src/assets/fonts/OpenSans/OpenSans-Bold.ttf',
    });

    topic.items.forEach((item) => {
      text(doc, {
        text: item,
        options: {
          width: 140,
          lineGap: 1,
        },
        fontSize: 10,
        font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
      });
    });

    doc.roundedRect(x - 10, y - 10, 155, height + 20, 8);
    doc.lineWidth(0.1);
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

  text(doc, {
    text: 'ZERTIFIKAT',
    x: 5,
    y: 107,
    options: {
      width: A4SIZE[0],
      align: 'center',
      characterSpacing: 10,
    },
    font: 'src/assets/fonts/OpenSans/OpenSans-Bold.ttf',
    fillColor: '#fff',
    fontSize: 29,
  });

  text(doc, {
    text: `${firstName} ${lastName}`,
    x: 0,
    y: 168,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    font: 'src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf',
    fillColor: PRIMARY_TEXT_COLOR,
    fontSize: 29,
  });

  const descriptionWidth = 430;
  text(doc, {
    text: capstoneProject.description,
    x: A4SIZE[0] / 2 - descriptionWidth / 2,
    y: 210,
    options: {
      width: descriptionWidth,
      align: 'center',
      lineGap: 3,
    },
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
    fillColor: PRIMARY_TEXT_COLOR,
    fontSize: 11,
  });

  if (capstoneProject.thumbnail) {
    const response = await fetch(capstoneProject.thumbnail);
    const thumbnail = await response.buffer();
    doc.image(thumbnail, 95, 355, { width: 162 });
  }

  let textAlignmentY = 328;

  text(doc, {
    text: 'TITEL:',
    x: 306,
    y: textAlignmentY,
    font: 'src/assets/fonts/OpenSans/OpenSans-Bold.ttf',
    fillColor: SECONDARY_TEXT_COLOR,
    fontSize: 14,
  });

  textAlignmentY += doc.heightOfString('TITEL:') + 5;

  doc.font('src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf');
  doc.fontSize(
    calculateFontSize(doc, `»${capstoneProject.title}«`, 10, 28, 200)
  );
  doc.fillColor('#E74D0F');
  doc.text(`»${capstoneProject.title}«`, 306, textAlignmentY);

  textAlignmentY += doc.heightOfString(`»${capstoneProject.title}«`, {
    width: 200,
  });

  text(doc, {
    text: capstoneProject.subtitle,
    x: 306,
    y: textAlignmentY,
    fontSize: 15,
  });

  textAlignmentY += doc.heightOfString(capstoneProject.subtitle, {
    width: 200,
  });

  text(doc, {
    text: 'HIGHLIGHTS:',
    x: 306,
    y: textAlignmentY > 468 ? textAlignmentY + 15 : 468,
    font: 'src/assets/fonts/OpenSans/OpenSans-Bold.ttf',
    fillColor: SECONDARY_TEXT_COLOR,
    fontSize: 14,
  });

  textAlignmentY += doc.heightOfString('HIGHLIGHTS:', { width: 200 }) + 15;

  const x = 316;
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

  text(doc, {
    text: capstoneProject.technologies.join(' / '),
    x: x + 2,
    y: y + 4,
    options: {
      width: 200,
      lineGap: 10,
    },
    font: 'src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf',
    fillColor: '#E74D0F',
    fontSize: 10,
  });

  text(doc, {
    text: 'ABSCHLUSSPROJEKT',
    x: 0,
    y: 728,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    font: 'src/assets/fonts/OpenSans/OpenSans-Bold.ttf',
    fillColor: SECONDARY_TEXT_COLOR,
    fontSize: 11,
  });

  text(doc, {
    text: '“DIGITALES GESELLENSTÜCK“',
    x: 0,
    y: 741,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    font: 'src/assets/fonts/OpenSans/OpenSans-Bold.ttf',
    fontSize: 11,
    fillColor: SECONDARY_TEXT_COLOR,
  });
}
