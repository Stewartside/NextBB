'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { categories, forums, users, threads } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateUniqueShortCode } from '@/lib/utils/forum'

// Helper to check if user is admin
async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    // Check the user's role in the profiles table
    const profile = await db.query.users.findFirst({
        where: eq(users.id, user.id),
    })

    return profile?.role === 'admin'
}

export async function createCategory(prevState: any, formData: FormData) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0

    try {
        await db.insert(categories).values({
            name,
            description,
            sortOrder,
        })
        revalidatePath('/admin')
        revalidatePath('/')
        return null // Success - no error
    } catch (e) {
        return { error: 'Failed to create category' }
    }
}

export async function createForum(prevState: any, formData: FormData) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('categoryId') as string
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0

    try {
        // Generate unique short code for the forum
        const shortCode = await generateUniqueShortCode(name, categoryId)
        
        await db.insert(forums).values({
            name,
            shortCode,
            description,
            categoryId,
            sortOrder,
        })
        revalidatePath('/admin')
        revalidatePath('/')
        return null // Success - no error
    } catch (e) {
        return { error: 'Failed to create forum' }
    }
}

export async function deleteCategory(prevState: any, formData: FormData) {
    if (!await checkAdmin()) {
        return { error: 'Unauthorized' }
    }
    
    const id = formData.get('id') as string
    
    try {
        // Check if category has any forums
        const forumsInCategory = await db.query.forums.findMany({
            where: eq(forums.categoryId, id),
        })
        
        if (forumsInCategory.length > 0) {
            return { 
                error: `Cannot delete category. It contains ${forumsInCategory.length} forum${forumsInCategory.length > 1 ? 's' : ''}. Please delete or move all forums first.` 
            }
        }
        
        await db.delete(categories).where(eq(categories.id, id))
        revalidatePath('/admin')
        revalidatePath('/')
        return null // Success
    } catch (e: any) {
        // Handle foreign key constraint errors
        if (e?.code === '23503' || e?.cause?.code === '23503') {
            return { 
                error: 'Cannot delete category. It is still referenced by forums. Please delete or move all forums first.' 
            }
        }
        return { error: 'Failed to delete category' }
    }
}

export async function deleteForum(prevState: any, formData: FormData) {
    if (!await checkAdmin()) {
        return { error: 'Unauthorized' }
    }
    
    const id = formData.get('id') as string
    
    try {
        // Check if forum has any threads
        const threadsInForum = await db.query.threads.findMany({
            where: eq(threads.forumId, id),
        })
        
        if (threadsInForum.length > 0) {
            return { 
                error: `Cannot delete forum. It contains ${threadsInForum.length} thread${threadsInForum.length > 1 ? 's' : ''}. Please delete or move all threads first.` 
            }
        }
        
        await db.delete(forums).where(eq(forums.id, id))
        revalidatePath('/admin')
        revalidatePath('/')
        return null // Success
    } catch (e: any) {
        // Handle foreign key constraint errors
        if (e?.code === '23503' || e?.cause?.code === '23503') {
            return { 
                error: 'Cannot delete forum. It is still referenced by threads. Please delete or move all threads first.' 
            }
        }
        return { error: 'Failed to delete forum' }
    }
}
