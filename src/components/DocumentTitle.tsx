import { useEffect } from 'react';

/** Keeps <title> in sync for crawlers that execute JS or soft-navigate. */
export default function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}
