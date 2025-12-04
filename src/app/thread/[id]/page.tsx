import { db } from '@/db'
import { threads, posts, forums } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ReplyForm from './reply-form'
import Link from 'next/link'

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch thread details
  const thread = await db.query.threads.findFirst({
    where: eq(threads.id, id),
    with: {
      forum: true,
    }
  })

  if (!thread) {
    notFound()
  }

  // Fetch posts in this thread
  const threadPosts = await db.query.posts.findMany({
    where: eq(posts.threadId, id),
    orderBy: [asc(posts.createdAt)],
    with: {
      author: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Link href="/" className="hover:underline">Forums</Link>
            <span>/</span>
            <Link href={`/forum/${thread.forumId}`} className="hover:underline">{thread.forum.name}</Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{thread.title}</h1>
      </div>

      <div className="space-y-4">
        {threadPosts.map((post, index) => (
            <Card key={post.id} id={post.id}>
                <CardHeader className="bg-muted/30 py-3 px-4 flex flex-row items-center justify-between space-y-0">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                            {format(post.createdAt, "MMM d, yyyy")}
                        </span>
                        <span>at {format(post.createdAt, "h:mm a")}</span>
                   </div>
                   <div className="text-xs text-muted-foreground">
                        #{index + 1}
                   </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col sm:flex-row">
                    {/* Author Column */}
                    <div className="p-6 sm:w-48 sm:border-r flex flex-col items-center text-center gap-3 bg-muted/10">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={post.author.avatarUrl || ''} />
                            <AvatarFallback className="text-lg">
                                {post.author.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-bold text-lg break-all">{post.author.username}</div>
                            <div className="text-xs text-muted-foreground uppercase mt-1 font-medium">
                                {post.author.role}
                            </div>
                        </div>
                    </div>
                    
                    {/* Content Column */}
                    <div className="p-6 flex-1 min-w-0">
                        <div className="prose dark:prose-invert max-w-none break-words whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      <Separator className="my-8" />
      
      <div className="max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">Post a Reply</h3>
        <ReplyForm threadId={thread.id} />
      </div>
    </div>
  )
}

