import Link from 'next/link'
import { db } from '@/db'
import { categories, forums } from '@/db/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { eq, asc } from 'drizzle-orm'
import { MessageSquare } from 'lucide-react'

export default async function HomePage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.sortOrder)],
    with: {
      forums: {
        orderBy: [asc(forums.sortOrder)],
      },
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Forums</h1>
      </div>

      {allCategories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No categories found. Please add some from the admin dashboard.
        </div>
      ) : (
        allCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {category.forums.map((forum) => (
                  <div
                    key={forum.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/forum/${forum.id}`}
                        className="font-medium hover:underline text-lg block"
                      >
                        {forum.name}
                      </Link>
                      {forum.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {forum.description}
                        </p>
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-sm text-muted-foreground gap-1 min-w-[100px]">
                       {/* Placeholders for stats - would require more complex queries */}
                      {/* <span>0 threads</span> */}
                      {/* <span>0 posts</span> */}
                    </div>
                  </div>
                ))}
              </div>
              {category.forums.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground text-center italic">
                  No forums in this category.
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
