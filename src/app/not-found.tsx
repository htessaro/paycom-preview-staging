import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <FileQuestion className="w-16 h-16 mb-6 text-muted-foreground" />
      <h1 className="text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Go home
        </Link>
        <Link
          href="/docs/introduction"
          className="px-5 py-2.5 bg-card border rounded-lg font-medium hover:shadow-md transition-shadow"
        >
          Browse docs
        </Link>
      </div>
    </div>
  );
}
