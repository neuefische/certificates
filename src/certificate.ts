import PDFDocument from 'pdfkit';
import fetch from 'node-fetch';
import { Course, Talent, Topics } from './api';
import text from './components/text';
import { calculateFontSize } from './utils';
import { t } from './i18n';

const A4SIZE: [number, number] = [595.28, 841.89];
const PRIMARY_TEXT_COLOR = '#1A3251';
const SECONDARY_TEXT_COLOR = '#7589A2';

export async function createCertificate(
  talent: Talent,
  course: Course
): Promise<PDFKit.PDFDocument> {
  const doc = new PDFDocument({ size: 'A4' });

  renderFirstPage(doc, talent, course, course.lang);

  doc.addPage();

  renderSecondPage(doc, course.lang, course);

  if (talent.capstoneProject) {
    doc.addPage();
    await renderThirdPage(doc, talent, course.type, course.lang);
  }

  doc.end();
  return doc;
}

function renderFirstPage(
  doc: PDFKit.PDFDocument,
  talent: Talent,
  course: Course,
  lang: 'de' | 'en' = 'de'
) {
  doc.image('src/assets/images/background.png', 0, 0, { fit: A4SIZE });

  doc.fontSize(29);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');

  const certificateLength =
    doc.widthOfString(t('ZERTIFIKAT', lang), { characterSpacing: 10 }) + 15;

  doc
    .rect(A4SIZE[0] / 2 - certificateLength / 2, 110, certificateLength, 37)
    .fillColor('#E74D0F')
    .fill();

  text(doc, {
    text: t('ZERTIFIKAT', lang),
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
    text: t('Hiermit bestätigen wir, dass', lang),
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
  if (lang == 'en') {
    text(doc, {
      text: 'has successfully completed',
      y: 285,
      x: 0,
      options: {
        width: A4SIZE[0],
        align: 'center',
      },
      fontSize: 17,
      font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
    });
  }
  text(doc, {
    text: t('das Intensivprogramm', lang),
    x: 0,
    y: 310,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fontSize: 17,
    font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
  });

  let jobName;
  if (course.type === 'data') {
    jobName = 'Data Scientist';
  } else if (course.type === 'web' || course.type === 'java') {
    jobName = '/zur Software-Entwickler*in';
  } else if (course.type === 'aws') {
    jobName = 'Cloud-Developer';
  } else if (course.type === 'analytics') {
    jobName = 'Data Analyst';
  }

  text(doc, {
    text: `${t('Aus-/Weiterbildung zum', lang)} ${jobName}`,
    x: 0,
    y: 336,
    options: {
      width: A4SIZE[0],
      align: 'center',
    },
    fontSize: 17,
    font: 'src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf',
  });

  if (course.type === 'web') {
    text(doc, {
      text: t('(Web Development)', lang),
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
  }

  if (course.type === 'java') {
    text(doc, {
      text: t('(Java Development)', lang),
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
  }

  if (course.type === 'analytics') {
    text(doc, {
      text: t('(Advanced Data Analytics)', lang),
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
  }

  text(doc, {
    text: t('mit 540 Stunden Programmierpraxis', lang),
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
    text: t('(entspricht 720 Unterrichtseinheiten)', lang),
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

  if (lang === 'de') {
    text(doc, {
      text: t('erfolgreich absolviert hat.', lang),
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
  }

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
    )} – ${new Date(course.endDate).toLocaleDateString('de-DE')}\n${
      course.location
    }${t(', den', lang)} ${new Date().toLocaleDateString('de-DE')}`,
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

function renderSecondPage(
  doc: PDFKit.PDFDocument,
  lang: 'de' | 'en' = 'de',
  {
    topics,
    type: courseType,
  }: {
    topics: Topics;
    type: 'web' | 'java' | 'aws' | 'data' | 'analytics';
  }
) {
  doc.image('src/assets/images/background.png', 0, 0, { fit: A4SIZE });

  doc.fillColor('#1A3251');
  doc.strokeColor('#1A3251');
  let x = 63;
  let y = 211;

  text(doc, {
    text: t('Ausbildungsinhalte', lang),
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
    text: t(
      'Die Teilnehmer*innen haben in 720 Unterrichtseinheiten folgende Inhalte gelernt,\ndiskutiert und in unterschiedlichen Aufgaben und Projekten vertieft:',
      lang
    ),
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

    height += doc.heightOfString(topic.title, { paragraphGap: 3, width: 140 });
    doc.fontSize(10);
    doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');

    if (courseType === 'web' || courseType === 'java' || courseType === 'aws') {
      topic.items.forEach((item) => {
        height += doc.heightOfString(item, { width: 140, lineGap: 1 });
      });
    } else {
      topic.items.forEach((item) => {
        doc.font('src/assets/fonts/OpenSans/OpenSans-Regular.ttf');
        doc.fontSize(11);
        height += doc.heightOfString(item.subtitle, { lineGap: 1, width: 140 });
        if (item.subitems) {
          doc.font('src/assets/fonts/OpenSans/OpenSans-Light.ttf');
          doc.fontSize(10);
          item.subitems.forEach((subitem) => {
            height += doc.heightOfString(subitem, { width: 140 });
          });
        }
        //Hack to create a linegap between subcategories
        doc.fontSize(3);
        height += doc.heightOfString(' ');
      });
    }
    if (height + y > A4SIZE[1] - 100) {
      y = 211;
      x += 168;
    }

    text(doc, {
      text: topic.title,
      x,
      y,
      options: {
        paragraphGap: 3,
        width: 140,
      },
      fontSize: 10,
      font: 'src/assets/fonts/OpenSans/OpenSans-Bold.ttf',
    });

    if (courseType === 'web' || courseType === 'java' || courseType === 'aws') {
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
    } else {
      topic.items.forEach((item) => {
        text(doc, {
          text: item.subtitle,
          options: {
            width: 140,
            lineGap: 1,
          },
          fontSize: 11,
          font: 'src/assets/fonts/OpenSans/OpenSans-Regular.ttf',
        });
        if (item.subitems) {
          item.subitems.forEach((subitem) => {
            text(doc, {
              text: `• ${subitem}`,
              options: {
                width: 140,
              },
              fontSize: 10,
              font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
            });
          });
        }
        doc.fontSize(3);
        doc.text(' ');
      });
    }

    doc.roundedRect(x - 10, y - 10, 155, height + 20, 8);
    doc.lineWidth(0.1);
    doc.stroke();
    y += height + 30;
  });
}

async function renderThirdPage(
  doc: PDFKit.PDFDocument,
  { capstoneProject, lastName, firstName }: Talent,
  courseType: string,
  lang: 'de' | 'en' = 'de'
) {
  if (courseType === 'web' || courseType === 'java') {
    doc.image('src/assets/images/background_with_phone_frame.png', 0, 0, {
      fit: A4SIZE,
    });
  } else if (courseType === 'aws') {
    doc.image('src/assets/images/background.png', 0, 0, { fit: A4SIZE });
  } else {
    doc.image('src/assets/images/background_data.png', 0, 0, { fit: A4SIZE });
  }

  doc.fontSize(29);
  doc.font('src/assets/fonts/OpenSans/OpenSans-Bold.ttf');

  const certificateLength =
    doc.widthOfString(t('ZERTIFIKAT', lang), { characterSpacing: 10 }) + 15;

  doc
    .rect(A4SIZE[0] / 2 - certificateLength / 2, 110, certificateLength, 37)
    .fillColor('#E74D0F')
    .fill();
  text(doc, {
    text: t('ZERTIFIKAT', lang),
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

  if (courseType === 'web' || courseType === 'java' || courseType === 'aws') {
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
      if (courseType === 'aws') {
        doc.image(thumbnail, 45, 355, { width: 230 });
      } else {
        doc.image(thumbnail, 95, 355, { width: 162 });
      }
    }

    let textAlignmentY = 328;

    text(doc, {
      text: t('TITEL:', lang),
      x: 306,
      y: textAlignmentY,
      font: 'src/assets/fonts/OpenSans/OpenSans-Bold.ttf',
      fillColor: SECONDARY_TEXT_COLOR,
      fontSize: 14,
    });

    textAlignmentY += doc.heightOfString('TITEL:') + 5;

    text(doc, {
      text: `»${capstoneProject.title}«`,
      x: 306,
      y: textAlignmentY,
      fontSize: calculateFontSize({
        doc,
        text: `»${capstoneProject.title}«`,
        minFontSize: 10,
        maxFontSize: 28,
        maxWidth: 200,
      }),
      fillColor: '#E74D0F',
      font: 'src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf',
    });

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
      text: t('HIGHLIGHTS:', lang),
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
  } else {
    text(doc, {
      text: t('PROJEKT:', lang),
      x: 70,
      y: 230,
      font: 'src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf',
      fillColor: SECONDARY_TEXT_COLOR,
      fontSize: 14,
      options: { paragraphGap: 10 },
    });
    text(doc, {
      text: capstoneProject.title,
      x: 70,

      fillColor: PRIMARY_TEXT_COLOR,
      fontSize: 22,
      options: { width: 290, paragraphGap: 10 },
    });
    text(doc, {
      text: capstoneProject.subtitle,
      x: 70,
      font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
      fontSize: 15,
      options: { width: 290, paragraphGap: 25 },
    });
    text(doc, {
      text: capstoneProject.description,
      x: 70,
      font: 'src/assets/fonts/OpenSans/OpenSans-Light.ttf',
      fillColor: SECONDARY_TEXT_COLOR,
      fontSize: 12,
      options: { width: 290 },
    });

    if (capstoneProject.thumbnail) {
      const response = await fetch(capstoneProject.thumbnail);
      const thumbnail = await response.buffer();
      doc.image(thumbnail, 400, 382, { width: 90, height: 90 });
    }

    const x = 70;
    const y = 650;

    text(doc, {
      text: t('TECH-STACK:', lang),
      x: x,
      y: y - 40,
      font: 'src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf',
      fillColor: SECONDARY_TEXT_COLOR,
      fontSize: 14,
    });

    doc.fontSize(10);
    doc.roundedRect(
      x,
      y - 10,
      455,
      doc.heightOfString(capstoneProject.technologies.join(' / '), {
        width: 420,
        lineGap: 10,
      }) + 20,
      8
    );
    doc.fillOpacity(1);
    doc.fillAndStroke('#fff', '#E74D0F');

    text(doc, {
      text: capstoneProject.technologies.join(' / '),
      x: x + 18,
      y: y + 4,
      options: {
        width: 420,
        lineGap: 10,
      },
      font: 'src/assets/fonts/OpenSans/OpenSans-SemiBold.ttf',
      fillColor: '#E74D0F',
      fontSize: 10,
    });
  }

  text(doc, {
    text: t('ABSCHLUSSPROJEKT', lang),
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
    text: t('“DIGITALES GESELLENSTÜCK“', lang),
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
