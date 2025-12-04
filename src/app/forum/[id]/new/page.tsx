'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createThread } from '@/app/forum/actions'
import { useParams } from 'next/navigation'

export default function NewThreadPage() {
  const params = useParams<{ id: string }>()
  const [state, formAction, isPending] = useActionState(createThread, null)

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="forumId" value={params.id} />
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Thread title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                name="content" 
                placeholder="Write your post here..." 
                className="min-h-[200px]" 
                required 
              />
            </div>

            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}

            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                {isPending ? 'Posting...' : 'Post Thread'}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

