export interface CardUI {
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  footerText?: string;
  link?: string | string[];
  variant: 'project' | 'experience';
}
