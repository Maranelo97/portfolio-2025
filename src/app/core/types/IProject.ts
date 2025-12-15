export interface IProject {
  id: string;
  title: string;
  shortDescription: string;
  cardImageUrl: string;
  technologies: string[];
  completionDate: string;
  fullDescription: string;
  repoUrl?: string;
  liveUrl?: string;
}
