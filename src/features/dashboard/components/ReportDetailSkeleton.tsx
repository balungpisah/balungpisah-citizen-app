import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ReportDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Link>

      <Card>
        <CardHeader className="space-y-4">
          {/* Status badges */}
          <div className="flex gap-2">
            <div className="bg-muted h-5 w-20 animate-pulse rounded-full" />
            <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
          </div>

          {/* Title */}
          <div className="bg-muted h-7 w-3/4 animate-pulse rounded" />

          {/* Meta */}
          <div className="flex gap-4">
            <div className="bg-muted h-4 w-32 animate-pulse rounded" />
            <div className="bg-muted h-4 w-40 animate-pulse rounded" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <div className="bg-muted mb-2 h-4 w-16 animate-pulse rounded" />
            <div className="flex gap-2">
              <div className="bg-muted h-7 w-24 animate-pulse rounded-full" />
              <div className="bg-muted h-7 w-28 animate-pulse rounded-full" />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="bg-muted mb-2 h-4 w-20 animate-pulse rounded" />
            <div className="space-y-2">
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
            </div>
          </div>

          {/* Impact */}
          <div>
            <div className="bg-muted mb-2 h-4 w-14 animate-pulse rounded" />
            <div className="space-y-2">
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t pt-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="bg-muted h-3 w-40 animate-pulse rounded" />
              <div className="bg-muted h-3 w-44 animate-pulse rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
