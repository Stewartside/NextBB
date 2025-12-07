'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteCategory } from './actions'
import { toast } from 'sonner'

interface DeleteCategoryButtonProps {
  categoryId: string
}

export function DeleteCategoryButton({ categoryId }: DeleteCategoryButtonProps) {
  const [state, formAction, isPending] = useActionState<{ error?: string } | null, FormData>(
    deleteCategory,
    null
  )

  // Show error toast if deletion fails
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={categoryId} />
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-destructive"
        disabled={isPending}
        type="submit"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </form>
  )
}
