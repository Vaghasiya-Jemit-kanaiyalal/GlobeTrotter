import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import './TrendingExperiences.css';

export const TrendingExperiences = ({
  experiences = [],
  onSelectExperience,
}) => {
  return (
    <div className="gt-trending-exp-card">
      <h3 className="gt-trending-title brand-serif flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-amber-600" />
        Trending Experiences
      </h3>

      <div className="gt-trending-list flex flex-col gap-2 mt-2">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="gt-trending-item p-2 rounded-md hover:bg-subtle cursor-pointer border border-transparent hover:border-border transition-all"
            onClick={() => onSelectExperience(exp)}
          >
            <div className="font-semibold text-xs text-navy-900 line-clamp-2">
              {exp.title}
            </div>
            <div className="flex items-center justify-between mt-1 text-xs text-muted">
              <span>📍 {exp.destination}</span>
              <span className="flex items-center gap-0.5 text-red-500 font-bold">
                <Heart className="w-3 h-3 fill-current" /> {exp.likes}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
