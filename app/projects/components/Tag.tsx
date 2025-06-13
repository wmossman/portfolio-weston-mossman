import React from 'react';
import { TAGS, TagKey } from './tags';

export function Tag({ tag }: { tag: string }) {
  const meta = TAGS[tag as TagKey];
  if (!meta) {
    // fallback for unknown tags
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent-secondary/20 text-text-heading border border-accent-secondary">
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
