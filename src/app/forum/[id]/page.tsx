import Link from 'next/link'
import { db } from '@/db'
import { forums, threads, users, posts } from '@/db/schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { eq, desc, sql } from 'drizzle-orm'
import { formatDistanceToNow } from 'date-fns'
import { Pin, Lock } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function ForumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const forum = await db.query.forums.findFirst({
    where: eq(forums.id, id),
  })

  if (!forum) {
    notFound()
  }

  // Fetch threads with author info
  const forumThreads = await db.query.threads.findMany({
    where: eq(threads.forumId, id),
    orderBy: [desc(threads.isPinned), desc(threads.updatedAt)],
    with: {
      author: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{forum.name}</h1>
            {forum.description && <p className="text-muted-foreground mt-1">{forum.description}</p>}
        </div>
        <Button asChild>
          <Link href={`/forum/${id}/new`}>Post New Thread</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
            <div className="divide-y">
                {forumThreads.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        There are no threads in this forum yet. Be the first to post!
                    </div>
                ) : (
                    forumThreads.map((thread) => (
                        <div key={thread.id} className="p-4 hover:bg-muted/50 transition-colors flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {thread.isPinned && <Pin className="w-4 h-4 text-primary rotate-45" />}
                                    {thread.isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                                    <Link href={`/thread/${thread.id}`} className="font-semibold text-lg hover:underline truncate block">
                                        {thread.title}
                                    </Link>
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span>by <span className="font-medium text-foreground">{thread.author.username}</span></span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(thread.createdAt)} ago</span>
                                </div>
                            </div>
                            <div className="hidden sm:flex flex-col items-end text-sm text-muted-foreground min-w-[100px]">
                                <span className="font-medium text-foreground">{thread.viewCount} views</span>
                                {/* We could query post count here too if we optimize the query */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

