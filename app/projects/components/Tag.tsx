import React from 'react';
import { TAGS, TagKey } from './tags';

export function Tag({ tag }: { tag: string }) {
  const meta = TAGS[tag as TagKey];
  if (!meta) {
    // fallback for unknown tags
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600">
        {tag}
      </span>
    );
  }
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border h-[24px]"
      style={{ background: meta.color + '22', color: '#FFF', borderColor: meta.color }}
      title={meta.label}
    >
      <span>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
