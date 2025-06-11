export interface Course {
  id: string;
  name: string;
  duration: string;
  description: string;
  popularity: number;
  type: 'UG' | 'PG' | 'Diploma';
  stream: 'Science' | 'Commerce' | 'Arts' | 'Other';
  fees: number;
  seats: number;
  finance_type: 'Self-Finance' | 'Government';
}

export interface Institute {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
    address: string;
  };
  website: string;
  courses: string[]; // Array of course IDs
  affiliation: string;
}

export interface MeritList {
  id: string;
  name: string;
  board: string;
  date: string;
  downloadUrl: string;
  isNew: boolean;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: 'Exams' | 'Tips' | 'Courses' | 'Trends';
  thumbnail: string;
  isFeatured: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}