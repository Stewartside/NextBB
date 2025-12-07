'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { categories, forums, users } from '@/db/schema'
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

export async function createCategory(formData: FormData) {
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
    } catch (e) {
        return { error: 'Failed to create category' }
    }
}

export async function createForum(formData: FormData) {
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
    } catch (e) {
        return { error: 'Failed to create forum' }
    }
}

export async function deleteCategory(formData: FormData) {
     if (!await checkAdmin()) return { error: 'Unauthorized' }
     const id = formData.get('id') as string
     await db.delete(categories).where(eq(categories.id, id))
     revalidatePath('/admin')
     revalidatePath('/')
}

export async function deleteForum(formData: FormData) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }
    const id = formData.get('id') as string
    await db.delete(forums).where(eq(forums.id, id))
    revalidatePath('/admin')
    revalidatePath('/')
}
