export type Talent = {
  firstName: string;
  lastName: string;
  courseId: string;
};

export async function getTalent(name: string): Promise<Talent> {
  if (!name) {
    throw "Couldn't find talent";
  }
  return {
    firstName: 'Caro',
    lastName: 'Machens',
    courseId: 'web-cgn-21-2',
  };
}

export type CourseTopics = {
  title: string;
  items: string[];
}[];

export async function getCourseTopics(courseId: string): Promise<CourseTopics> {
  if (!courseId) {
    throw "Couldn't find course topics";
  }
  return [
    {
      title: 'Shell',
      items: ['Unix Commands', 'Git Commands', 'Zsh'],
    },
    {
      title: 'HTML5',
      items: [
        'HTML5 Elemente',
        'Formulare und Inputs',
        'Semantik',
        'Responsive Websites',
        'Bootstrap',
      ],
    },
    {
      title: 'CSS3',
      items: [
        'CSS3',
        'Selektoren',
        'Spezifität',
        'Media Queries',
        'display: flex',
        'display: grid',
        'JSS',
      ],
    },
    {
      title: 'Backend',
      items: [
        'RESTful API',
        'Selektoren',
        'Spezifität',
        'Media Queries',
        'display: flex',
        'display: grid',
        'JSS',
      ],
    },
    {
      title: 'JavaScript',
      items: [
        'RESTful API',
        'Selektoren',
        'Spezifität',
        'Media Queries',
        'display: flex',
        'display: grid',
        'JSS',
      ],
    },
    {
      title: 'React',
      items: [
        'RESTful API',
        'Selektoren',
        'Spezifität',
        'Media Queries',
        'display: flex',
        'display: grid',
        'JSS',
      ],
    },
    {
      title: 'Weitere Lehrinhalte',
      items: [
        'RESTful API',
        'Selektoren',
        'Spezifität',
        'Media Queries',
        'display: flex',
        'display: grid',
        'JSS',
      ],
    },
    {
      title: 'Tools',
      items: [
        'RESTful API',
        'Selektoren',
        'Spezifität',
        'Media Queries',
        'display: flex',
        'display: grid',
        'JSS',
      ],
    },
  ];
}
