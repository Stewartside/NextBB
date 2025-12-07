import { db } from '@/db'
import { categories, forums, users } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreateForumDialog } from './create-forum-dialog'
import { CreateCategoryDialog } from './create-category-dialog'
import { DeleteCategoryButton } from './delete-category-button'
import { DeleteForumButton } from './delete-forum-button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const profile = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  })

  if (profile?.role !== 'admin') {
    redirect('/')
  }

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
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Categories Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <CreateCategoryDialog />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCategories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell>{cat.sortOrder}</TableCell>
                  <TableCell className="text-right">
                    <DeleteCategoryButton categoryId={cat.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Forums Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Forums</CardTitle>
          <CreateForumDialog categories={allCategories.map(cat => ({ id: cat.id, name: cat.name }))} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {allCategories.flatMap(cat => 
                    cat.forums.map(forum => (
                        <TableRow key={forum.id}>
                            <TableCell className="font-medium">{forum.name}</TableCell>
                            <TableCell>{cat.name}</TableCell>
                            <TableCell>{forum.description}</TableCell>
                            <TableCell>{forum.sortOrder}</TableCell>
                            <TableCell className="text-right">
                                <DeleteForumButton forumId={forum.id} />
                            </TableCell>
                        </TableRow>
                    ))
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
