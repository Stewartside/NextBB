'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { threads, posts, forums } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { getForumUrlIdentifier, findForumByIdentifier } from '@/lib/utils/forum'

export async function createThread(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { error: 'You must be logged in to create a thread.' }
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const forumIdentifier = formData.get('forumId') as string

  if (!title || !content || !forumIdentifier) {
    return { error: 'Please fill in all fields.' }
  }

  try {
    // Find forum by either ID or short_code
    const forum = await findForumByIdentifier(forumIdentifier)
    
    if (!forum) {
      return { error: 'Forum not found.' }
    }
    
    // Start a transaction to create thread AND first post
    const threadId = await db.transaction(async (tx) => {
      const [newThread] = await tx.insert(threads).values({
        forumId: forum.id,
        authorId: user.id,
        title: title,
      }).returning({ id: threads.id })

            await tx.insert(posts).values({
                threadId: newThread.id,
                authorId: user.id,
                content: content,
            })
            
            return newThread.id
        })
        
        // Revalidate using short_code if available, otherwise use ID
        const forumUrlId = getForumUrlIdentifier(forum)
        revalidatePath(`/forum/${forumUrlId}`)
        redirect(`/thread/${threadId}`)

  } catch (err: any) {
    // In case of redirect error (NEXT_REDIRECT), rethrow it
    if (err.message === 'NEXT_REDIRECT') throw err;
    console.error(err)
    return { error: 'Failed to create thread.' }
  }
}

export async function createReply(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
  
    if (error || !user) {
      return { error: 'You must be logged in to reply.' }
    }
  
    const content = formData.get('content') as string
    const threadId = formData.get('threadId') as string
  
    if (!content || !threadId) {
      return { error: 'Please write some content.' }
    }
  
    try {
      // Get the forum ID from the thread before updating
      const thread = await db.query.threads.findFirst({
        where: eq(threads.id, threadId),
      })

      if (!thread) {
        return { error: 'Thread not found.' }
      }

      await db.insert(posts).values({
          threadId: threadId,
          authorId: user.id,
          content: content,
      })
      
      // Update thread updated_at when a new reply is posted
      await updateThreadUpdatedAt(threadId)
      
      // Get forum to use short_code for revalidation
      const forum = await db.query.forums.findFirst({
        where: eq(forums.id, thread.forumId),
      })
      
      const forumUrlId = forum ? getForumUrlIdentifier(forum) : thread.forumId
      revalidatePath(`/thread/${threadId}`)
      revalidatePath(`/forum/${forumUrlId}`) // Revalidate forum page to show updated thread order
    } catch (err: any) {
      console.error(err)
      return { error: 'Failed to post reply.' }
    }
  }

export async function incrementThreadViewCount(threadId: string) {
  try {
    // Increment view count atomically using SQL
    await db
      .update(threads)
      .set({ viewCount: sql`view_count + 1` })
      .where(eq(threads.id, threadId))
  } catch (err: any) {
    // Silently fail - view count is not critical
    console.error('Failed to increment view count:', err)
  }
}

export async function updateThreadUpdatedAt(threadId: string) {
  try {
    // Update thread updated_at timestamp
    await db
      .update(threads)
      .set({ updatedAt: new Date() })
      .where(eq(threads.id, threadId))
  } catch (err: any) {
    // Log error but don't fail - thread update is not critical
    console.error('Failed to update thread timestamp:', err)
  }
}

