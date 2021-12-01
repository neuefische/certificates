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
  required: ['firstName', 'lastName', 'courseId'],
};
