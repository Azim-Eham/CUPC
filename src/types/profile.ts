export interface SocialLink {
  platform: string;
  url: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startYear?: string;
  endYear?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startYear?: string;
  endYear?: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  imageUrl?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal?: string;
  year?: string;
  link?: string;
}

export interface Achievement {
  id: string;
  title: string;
  date?: string;
  description?: string;
}

export interface MentorshipExpertise {
  id: string; // Add an ID for easy array manipulation in the UI
  topic: string;
}
