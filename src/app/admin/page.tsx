import { db } from '@/db'
import { categories, forums, users } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { createCategory, createForum, deleteCategory, deleteForum } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Trash2, Plus } from 'lucide-react'
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
          <Dialog>
            <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Add Category</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>
                <form action={createCategory} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input name="name" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input name="description" />
                    </div>
                    <div className="space-y-2">
                        <Label>Sort Order</Label>
                        <Input name="sortOrder" type="number" defaultValue="0" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
          </Dialog>
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
                    <form action={deleteCategory}>
                        <input type="hidden" name="id" value={cat.id} />
                        <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </form>
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
          <Dialog>
            <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Add Forum</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Forum</DialogTitle>
                </DialogHeader>
                <form action={createForum} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <select name="categoryId" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" required>
                            {allCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input name="name" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input name="description" />
                    </div>
                    <div className="space-y-2">
                        <Label>Sort Order</Label>
                        <Input name="sortOrder" type="number" defaultValue="0" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
          </Dialog>
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
                                <form action={deleteForum}>
                                    <input type="hidden" name="id" value={forum.id} />
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </form>
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
