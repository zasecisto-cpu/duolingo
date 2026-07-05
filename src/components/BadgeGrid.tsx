import React from "react";
import { BADGES } from "../lib/gamification";

interface BadgeGridProps {
  unlockedBadgeIds: string[];
  newlyUnlockedBadgeId?: string | null;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({
  unlockedBadgeIds,
  newlyUnlockedBadgeId,
}) => {
  const renderBadgePath = (iconName: string) => {
    switch (iconName) {
      case "check":
        return <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />;
      case "eye":
        return <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />;
      case "star":
        return <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />;
      case "trophy":
        return <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.21 1.79 4 4 4h2.5c.9 1.74 2.5 3 4.5 3v3H9v2h6v-2h-5v-3c2-.3 3.6-1.56 4.5-3H17c2.21 0 4-1.79 4-4V7c0-1.1-.9-2-2-2z" />;
      case "calendar":
        return <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />;
      case "droplet":
        return <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />;
      case "flame":
        return <path d="M12 2c-.5 0-1 1-1 2.5S11.5 7 12 7s1-1 1-2.5S12.5 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />;
      case "activity":
        return <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />;
      case "crown":
        return <path d="M5 16h14v2H5zm14-8l-3.5 3.5L12 5l-3.5 6.5L5 8l1.5 6h11z" />;
      default:
        return <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />;
    }
  };

  return (
    <div className="badge-grid-list">
      {BADGES.map((badge) => {
        const isUnlocked = unlockedBadgeIds.includes(badge.id);
        const isNew = badge.id === newlyUnlockedBadgeId;

        return (
          <div
            key={badge.id}
            className={`badge-card-tile ${!isUnlocked ? "locked" : ""} ${
              isNew ? "unlocked-anim" : ""
            }`}
          >
            <div className="badge-icon-box">
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="currentColor"
              >
                {renderBadgePath(badge.icon)}
              </svg>
            </div>
            <div className="badge-name-label">{badge.name}</div>
            <div className="badge-desc-text">{badge.desc}</div>
          </div>
        );
      })}
    </div>
  );
};

export default BadgeGrid;
