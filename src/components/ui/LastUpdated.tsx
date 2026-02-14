'use client';

import { useEffect, useState } from 'react';
import { getTimeAgo } from '@/lib/utils';

interface LastUpdatedProps {
  date: Date;
}

export function LastUpdated({ date }: LastUpdatedProps) {
  const [timeAgo, setTimeAgo] = useState(getTimeAgo(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo(date));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [date]);

  return (
    <div className="text-sm text-text-tertiary">
      Last updated <span className="text-text-secondary">{timeAgo}</span>
    </div>
  );
}
