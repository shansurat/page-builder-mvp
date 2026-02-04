import { BlockComponent } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface FormBlockProps {
  block: BlockComponent
}

export function FormBlock({ block }: FormBlockProps) {
  const { content } = block
  const fields = (content.items as Array<{ type: string; label: string; required?: boolean }>) || []

  if (fields.length === 0) {
    fields.push(
      { type: 'text', label: 'Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'textarea', label: 'Message', required: true }
    )
  }

  return (
    <div className="py-12 max-w-2xl mx-auto">
      {content.title && (
        <h2 className="text-3xl font-bold mb-4 text-center">{content.title}</h2>
      )}
      {content.subtitle && (
        <p className="text-gray-600 mb-8 text-center">{content.subtitle}</p>
      )}
      <form className="space-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <Textarea rows={4} />
            ) : (
              <Input type={field.type} />
            )}
          </div>
        ))}
        <Button type="submit" className="w-full">
          {content.buttonText || 'Submit'}
        </Button>
      </form>
    </div>
  )
}
