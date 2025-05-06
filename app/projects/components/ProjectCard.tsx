import Link from 'next/link';
import Image from 'next/image';
import { Project } from '../utils';

function stringToColor(str: string) {
  // Simple hash to HSL color
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 70%)`;
}

export function ProjectCard({ project, onClick, asLink = true }: {
  project: Project;
  onClick?: () => void;
  asLink?: boolean;
}) {
  const card = (
    <div
      className="bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col cursor-pointer border border-neutral-200 dark:border-neutral-800"
      onClick={onClick}
      data-testid={`project-card-${project.slug}`}
    >
      <Image
        src={project.image}
        alt={project.title}
        width={400}
        height={200}
        className="rounded mb-2 object-cover w-full h-40"
      />
      <h2 className="font-bold text-lg mb-1">{project.title}</h2>
      <div className="flex flex-wrap gap-1 mb-2">
        {project.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: stringToColor(tag), color: '#222' }}
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">{project.shortDescription}</p>
    </div>
  );
  return asLink ? (
    <Link href={`/projects/${project.slug}`}>{card}</Link>
  ) : card;
}

export function MoreComingCard() {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow p-4 flex flex-col items-center justify-center grayscale border border-dashed border-neutral-300 dark:border-neutral-700">
      <Image
        src="/images/portfolio-photo.jpg"
        alt="More coming soon"
        width={400}
        height={200}
        className="rounded mb-2 object-cover w-full h-40 opacity-50"
      />
      <h2 className="font-bold text-lg mb-1 text-neutral-400">More on the way!</h2>
    </div>
  );
}
