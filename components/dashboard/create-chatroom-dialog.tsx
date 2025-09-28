"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Plus, Loader2 } from "lucide-react"
import { useChatStore } from "@/lib/store"
import { generateId } from "@/lib/utils"
import { toast } from "sonner"

const chatroomSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title must be less than 50 characters").trim(),
})

type ChatroomFormData = z.infer<typeof chatroomSchema>

export function CreateChatroomDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addChatroom } = useChatStore()

  const form = useForm<ChatroomFormData>({
    resolver: zodResolver(chatroomSchema),
    defaultValues: {
      title: "",
    },
  })

  const handleSubmit = async (data: ChatroomFormData) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newChatroom = {
      id: generateId(),
      title: data.title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: 0,
    }

    addChatroom(newChatroom)
    toast.success("Chatroom created successfully!")

    form.reset()
    setOpen(false)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Chatroom</DialogTitle>
          <DialogDescription>Give your new conversation a memorable name.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatroom Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Project Planning, Creative Ideas..."
                      disabled={isLoading}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
