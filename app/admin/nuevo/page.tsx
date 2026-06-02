import { PostForm } from '../PostForm'

export const dynamic = 'force-dynamic'

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-background text-white p-6 md:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <PostForm />
      </div>
    </div>
  )
}
