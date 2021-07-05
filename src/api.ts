import fs from 'fs/promises';
import fetch from 'node-fetch';

export type Talent = {
  id: string;
  firstName: string;
  lastName: string;
  courseId: string;
  capstoneProject?: CapstoneProject;
};

export type CapstoneProject = {
  isDesktop: boolean;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  thumbnail: string;
};

export type TalentFromTalentApp = {
  avatar: {
    uploaded: number;
    urls: { lg: string; s: string; xl: string; m: string };
    id: string;
    sizes: { value: number; key: string }[];
    uploaded_by: string;
  };
  project: {
    projectDesc: string;
    techStack: string[];
    projectName: string;
    projectSubTitle: string;
    projectCertificateDesc: string;
    projectRepoUrl: string;
    projectDevice: 'mobile' | 'desktop';
    projectImage: {
      uploaded: number;
      urls: { lg: string; s: string; xl: string; m: string };
      id: string;
      sizes: { value: number; key: string }[];
      uploadedBy: string;
    };
    projectAppUrl: string;
  };
  termsOfUseAccepted: boolean;
  email: string;
  firstName: string | null;
  lastName: string | null;
  gitHub: string;
  online: boolean;
  livingLocation: string | null;
  employed: boolean;
  alumniLocation: string;
  lookingFor: string[];
  roles: string[];
  region: string;
  skills: string[];
  id: string;
};

const API_URL = process.env.API_URL;

export async function getTalent(id: string): Promise<Talent | undefined> {
  const response = await fetch(`${API_URL}/${id}`);
  const talent: TalentFromTalentApp = await response.json();

  const formattedTalent: Talent = {
    firstName: talent.firstName,
    lastName: talent.lastName,
    id: talent.id,
    courseId: 'web-cgn-21-2',
  };
  if (talent.project) {
    const formattedCapstoneProject = {
      title: talent.project.projectName,
      subtitle: talent.project.projectSubTitle,
      description: talent.project.projectCertificateDesc,
      isDesktop: talent.project.projectDevice === 'desktop',
      technologies: talent.project.techStack,
      thumbnail: talent.project.projectImage?.urls.xl,
    };
    return { ...formattedTalent, capstoneProject: formattedCapstoneProject };
  }
  return formattedTalent;
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

export async function getCourseFromFS(id: string): Promise<Course | undefined> {
  const courses: Course[] = JSON.parse(
    await fs.readFile('src/assets/samples/courses.json', 'utf-8')
  );
  const course = courses.find((course) => course.id === id);
  return course;
}
