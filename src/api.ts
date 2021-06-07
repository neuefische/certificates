import fs from 'fs/promises';

export type Talent = {
  id: string;
  firstName: string;
  lastName: string;
  courseId: string;
};

export async function getTalent(id: string): Promise<Talent | undefined> {
  const talents: Talent[] = JSON.parse(
    await fs.readFile('src/assets/samples/talents.json', 'utf-8')
  );
  const talent = talents.find((talent) => talent.id === id);
  return talent;
}

export type CourseTopics = {
  title: string;
  items: string[];
}[];

export type Course = {
  id: string;
  coach: string;
  startDate: string;
  endDate: string;
  topics: CourseTopics;
};

export async function getCourse(id: string): Promise<Course | undefined> {
  const courses: Course[] = JSON.parse(
    await fs.readFile('src/assets/samples/courses.json', 'utf-8')
  );
  const course = courses.find((course) => course.id === id);
  return course;
}
