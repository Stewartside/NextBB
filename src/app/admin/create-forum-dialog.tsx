'use client'

import { useState, useEffect, useRef } from 'react'
import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { createForum } from './actions'
import { Plus } from 'lucide-react'

interface CreateForumDialogProps {
  categories: Array<{ id: string; name: string }>
}

export function CreateForumDialog({ categories }: CreateForumDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<{ error?: string } | null, FormData>(
    createForum,
    null
  )
  const prevPendingRef = useRef(false)

  // Close dialog when form is successfully submitted (no error)
  useEffect(() => {
    // If we just finished submitting (was pending, now not pending) and there's no error
    if (prevPendingRef.current && !isPending && !state?.error) {
      setOpen(false)
    }
    prevPendingRef.current = isPending
  }, [isPending, state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Forum
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Forum</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              name="categoryId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
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
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
