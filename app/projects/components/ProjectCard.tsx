import Link from 'next/link';
import { Project } from '../utils';
import { Tag } from './Tag';
import ImageWithFallback from 'app/components/ImageWithFallback';

function stringToColor(str: string) {
  // Simple hash to HSL color
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 70%)`;
}

export function ProjectCard({
  project,
  onClick,
  asLink = true,
}: {
  project: Project;
  onClick?: () => void;
  asLink?: boolean;
}) {
  const card = (
    <div
      className="bg-background-content border border-accent-secondary rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col cursor-pointer"
      style={{ height: 420 }}
      onClick={onClick}
      data-testid={`project-card-${project.slug}`}
    >
      <ImageWithFallback
        src={project.image}
        alt={project.title}
        width={400}
        height={186}
        className="rounded mb-2 object-contain w-full"
        style={{ height: 186, objectFit: 'contain' }}
      />
      <h2 className="font-bold text-lg mb-1 line-clamp-2 min-h-[58px] max-h-[58px] text-text-heading">
        {project.title}
      </h2>
      <div
        className="flex flex-wrap gap-1 mb-2 min-h-[58px] max-h-[58px] overflow-hidden"
        style={{ WebkitLineClamp: 2 }}
      >
        {project.tags.map((tag) => (
          <Tag key={tag} tag={tag} />
        ))}
      </div>
      <p className="text-sm text-text-primary mb-2 line-clamp-2 min-h-[58px] max-h-[58px]">
        {project.summary}
      </p>
    </div>
  );
  return asLink ? <Link href={`/projects/${project.slug}`}>{card}</Link> : card;
}

export function MoreComingCard() {
  return (
    <div className="bg-accent-decorative/10 rounded-lg shadow p-4 flex flex-col items-center justify-center grayscale border border-dashed border-accent-secondary">
      <ImageWithFallback
        src="/images/portfolio-photo.jpg"
        alt="More coming soon"
        width={400}
        height={200}
        className="rounded mb-2 object-contain w-full h-40 opacity-50"
      />
      <h2 className="font-bold text-lg mb-1 text-text-link">
        More on the way!
      </h2>
    </div>
  );
}
