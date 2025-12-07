import { db } from '@/db'
import { forums, categories } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Converts a forum name to a URL-friendly short code
 * Example: "Forum Title" -> "forum_title"
 */
export function generateShortCode(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/-+/g, '_') // Replace hyphens with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
}

/**
 * Generates a unique short code for a forum
 * If the base short code exists in a different category, prefixes with category name
 */
export async function generateUniqueShortCode(
  forumName: string,
  categoryId: string,
  excludeForumId?: string
): Promise<string> {
  const baseShortCode = generateShortCode(forumName)
  
  // Get the category name for prefixing if needed
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
  })
  
  const categoryShortCode = category ? generateShortCode(category.name) : null
  
  // Check if base short code is available (excluding current forum if updating)
  const existingForums = await db.query.forums.findMany({
    where: eq(forums.shortCode, baseShortCode),
    with: {
      category: true,
    },
  })
  
  // Filter out the forum being updated
  const conflictingForums = existingForums.filter(
    (f) => f.id !== excludeForumId
  )
  
  // If no conflicts, return base short code
  if (conflictingForums.length === 0) {
    return baseShortCode
  }
  
  // Check if conflicts are in different categories
  const conflictsInOtherCategories = conflictingForums.filter(
    (f) => f.categoryId !== categoryId
  )
  
  // If there are conflicts in other categories, use category prefix
  if (conflictsInOtherCategories.length > 0 && categoryShortCode) {
    const prefixedCode = `${categoryShortCode}_${baseShortCode}`
    
    // Check if prefixed code is available
    const prefixedConflicts = await db.query.forums.findMany({
      where: eq(forums.shortCode, prefixedCode),
    })
    
    const prefixedConflictExists = prefixedConflicts.some(f => f.id !== excludeForumId)
    
    if (!prefixedConflictExists) {
      return prefixedCode
    }
  }
  
  // If still conflicts (same category or prefixed also conflicts), append a number
  let counter = 1
  let finalCode = categoryShortCode 
    ? `${categoryShortCode}_${baseShortCode}_${counter}`
    : `${baseShortCode}_${counter}`
  
  while (true) {
    const conflicts = await db.query.forums.findMany({
      where: eq(forums.shortCode, finalCode),
    })
    
    const conflictExists = conflicts.some(f => f.id !== excludeForumId)
    
    if (!conflictExists) {
      return finalCode
    }
    
    counter++
    finalCode = categoryShortCode
      ? `${categoryShortCode}_${baseShortCode}_${counter}`
      : `${baseShortCode}_${counter}`
  }
}

/**
 * Gets the forum URL identifier (prefers short_code, falls back to id)
 */
export function getForumUrlIdentifier(forum: { id: string; shortCode: string | null }): string {
  return forum.shortCode || forum.id
}

/**
 * Finds a forum by either ID or short_code
 */
export async function findForumByIdentifier(identifier: string) {
  // Try to find by short_code first (if it's not a UUID)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier)
  
  if (!isUuid) {
    // Try short_code first
    const forumByShortCode = await db.query.forums.findFirst({
      where: eq(forums.shortCode, identifier),
    })
    
    if (forumByShortCode) {
      return forumByShortCode
    }
  }
  
  // Fall back to ID
  return await db.query.forums.findFirst({
    where: eq(forums.id, identifier),
  })
}
