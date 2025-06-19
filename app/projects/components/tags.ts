// Tag metadata for all projects
export const TAGS = {
  Climate: {
    label: 'Climate',
    emoji: '🌱',
    color: '#6FCF97', // green
  },
  Art: {
    label: 'Art',
    emoji: '🎨',
    color: '#F2994A', // orange
  },
  Business: {
    label: 'Business',
    emoji: '💼',
    color: '#BB6BD9', // purple
  },
  Community: {
    label: 'Community',
    emoji: '🤝',
    color: '#F2C94C', // yellow
  },
  'FE Software': {
    label: 'FE Software',
    emoji: '🖥️',
    color: '#4F8EF7', // front-end blue
  },
  'BE Software': {
    label: 'BE Software',
    emoji: '🗄️',
    color: '#7B61FF', // back-end purple
  },
  Product: {
    label: 'Product',
    emoji: '📦',
    color: '#FFB86B', // product orange
  },
  Design: {
    label: 'Design',
    emoji: '✏️',
    color: '#FF6F91', // design pink
  },
  Personal: {
    label: 'Personal',
    emoji: '🧑',
    color: '#FFD36E', // personal yellow
  },
  Consulting: {
    label: 'Consulting',
    emoji: '🧑‍💼',
    color: '#00B8A9', // consulting teal
  },
  Speaking: {
    label: 'Speaking',
    emoji: '🎤',
    color: '#FF7F50', // coral
  },
  Advising: {
    label: 'Advising',
    emoji: '🧑‍🏫',
    color: '#6A89CC', // blue-gray
  },
  Teambuilding: {
    label: 'Teambuilding',
    emoji: '🤸',
    color: '#43E97B', // green gradient
  },
} as const;

export type TagKey = keyof typeof TAGS;
export type TagMeta = (typeof TAGS)[TagKey];
