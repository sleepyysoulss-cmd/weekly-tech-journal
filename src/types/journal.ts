export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface SourceLink {
  title: string;
  url: string;
  outlet: string;
}

export interface Article {
  id: string;
  rank: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  coverImage: string;
  publishedDate: string;
  author: Author;
  fullContent: {
    paragraphs: string[];
    keyTakeaways: string[];
    sources: SourceLink[];
    quote?: {
      text: string;
      attribution: string;
    };
  };
}

export interface Edition {
  id: string;
  issueNumber: number;
  issueCode: string; // e.g., "#069"
  dateRange: string;
  headline: string;
  weeklySummary: {
    title: string;
    narrative: string;
    wordCount: number;
  };
  editorsNote: {
    title: string;
    content: string;
    editorName: string;
    editorRole: string;
    signOff: string;
  };
  stories: Article[];
}