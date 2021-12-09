export const TalentSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    courseId: { type: 'string' },
    capstoneProject: {
      type: 'object',
      properties: {
        isDesktop: { type: 'boolean' },
        title: { type: 'string' },
        subtitle: { type: 'string' },
        description: { type: 'string' },
        technologies: { type: 'array', items: { type: 'string' } },
        thumbnail: { type: 'string' },
      },
      required: [
        'isDesktop',
        'title',
        'description',
        'technologies',
        'thumbnail',
      ],
    },
  },
  required: ['firstName', 'lastName'],
};

export const WebCourseSchema = {
  type: 'object',
  properties: {
    coach: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    location: { type: 'string' },
    lang: { type: 'string' },
    type: { type: 'string' },
    topics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          items: { type: 'array', items: { type: 'string' } },
        },
        required: ['title', 'items'],
      },
    },
  },
  required: [
    'coach',
    'startDate',
    'endDate',
    'location',
    'lang',
    'type',
    'topics',
  ],
};

export const DataCourseSchema = {
  type: 'object',
  properties: {
    coach: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    location: { type: 'string' },
    lang: { type: 'string' },
    type: { type: 'string' },
    topics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                subtitle: { type: 'string' },
                subitems: { type: 'array', items: { type: 'string' } },
              },
              required: ['subtitle'],
            },
          },
        },
        required: ['title', 'items'],
      },
    },
  },
  required: [
    'coach',
    'startDate',
    'endDate',
    'location',
    'lang',
    'type',
    'topics',
  ],
};
