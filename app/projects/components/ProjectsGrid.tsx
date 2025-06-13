"use client";

import { useState } from 'react';
import { ProjectCard, MoreComingCard } from './ProjectCard';
import { Tag } from './Tag';
import PageTitle from 'app/components/PageTitle';

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
    <>
      <PageTitle>Projects</PageTitle>
      
      {/* Under construction notification */}
      <div className="bg-accent-highlight/20 border-l-4 border-accent-highlight p-4 mb-8 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-accent-highlight" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-text-primary">
              <strong>Note:</strong> This page and its contents are under construction. Feel free to reach out if you have any questions!
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-semibold inline-block mt-2 text-text-heading">Filter By Tags</h3>
        <div className="flex flex-wrap gap-2 max-w-[80%] justify-end">
          {tags.map(tag => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                className={`cursor-pointer hover:opacity-100 px-3 py-1 rounded-full text-xs font-semibold transition focus:outline-none flex items-center gap-1 ${
                  active
                    ? 'scale-105'
                    : 'opacity-70'
                }`}
                style={{ background: 'transparent' }}
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(project => (
          <ProjectCard key={project.slug} project={project} />
        ))}
        <MoreComingCard />
      </div>
    </>
  );
}
