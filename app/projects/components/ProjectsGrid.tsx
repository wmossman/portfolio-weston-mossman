"use client";

import { useState } from 'react';
import { ProjectCard, MoreComingCard } from './ProjectCard';
import { Tag } from './Tag';

function getAllTags(projects: any[]) {
  const tagSet = new Set<string>();
  projects.forEach(p => p.tags.forEach((tag: string) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 70%)`;
}

export default function ProjectsGrid({ projects }: { projects: any[] }) {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const tags = getAllTags(projects);
  const filtered =
    activeTags.length === 0
      ? projects
      : projects.filter(p => activeTags.every(tag => p.tags.includes(tag)));

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(tag => {
          const active = activeTags.includes(tag);
          return (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition focus:outline-none flex items-center gap-1 ${
                active
                  ? 'border-black dark:border-white scale-105'
                  : 'border-neutral-300 dark:border-neutral-700 opacity-70'
              }`}
              style={{ background: 'transparent', borderColor: active ? undefined : undefined }}
              onClick={() =>
                setActiveTags(active ? activeTags.filter(t => t !== tag) : [...activeTags, tag])
              }
              data-testid={`tag-${tag}`}
            >
              <Tag tag={tag} />
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
        <MoreComingCard />
      </div>
    </main>
  );
}
