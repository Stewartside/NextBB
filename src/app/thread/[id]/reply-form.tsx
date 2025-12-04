'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createReply } from '@/app/forum/actions'
import { Loader2 } from 'lucide-react'

export default function ReplyForm({ threadId }: { threadId: string }) {
  const [state, formAction, isPending] = useActionState(createReply, null)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="threadId" value={threadId} />
      
      <Textarea 
        name="content" 
        placeholder="Write your reply here..." 
        className="min-h-[150px]"
        required
      />

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Post Reply
        </Button>
      </div>
    </form>
  )
}

