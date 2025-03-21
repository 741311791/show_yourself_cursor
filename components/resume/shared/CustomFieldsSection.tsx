"use client"

import { useState, useMemo } from "react"
import { FileText, Plus, Trash2, icons } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CustomField } from "@/types/shared"

interface CustomFieldsSectionProps {
  title?: string
  fields?: CustomField[]
  onChange?: (fields: CustomField[]) => void
  className?: string
}

// 获取所有 Lucide 图标
const iconList = Object.entries(icons).map(([name]) => ({
  name,
  Icon: icons[name as keyof typeof icons]
}))

export function CustomFieldsSection({
  fields = [],
  onChange,
  className
}: CustomFieldsSectionProps) {
  const [iconSearch, setIconSearch] = useState("")
  const [openIconPicker, setOpenIconPicker] = useState<string | null>(null)

  const handleFieldChange = (id: string, key: keyof Omit<CustomField, 'id'>, value: string) => {
    const newFields = fields.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    )
    onChange?.(newFields)
  }

  const addField = () => {
    onChange?.([
      ...fields, 
      { 
        id: crypto.randomUUID(),
        icon: 'FileText',
        title: '',
        content: ''
      }
    ])
  }

  const removeField = (id: string) => {
    onChange?.(fields.filter(field => field.id !== id))
  }

  const filteredIcons = useMemo(() => {
    return iconList
      .filter(icon => 
        icon.name.toLowerCase().includes(iconSearch.toLowerCase())
      )
      .slice(0, 10)
  }, [iconSearch])

  return (
    <div className={cn("space-y-3", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={addField}
        className="w-full h-9 border-dashed hover:border-solid flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm">添加自定义字段</span>
      </Button>

      {fields.map(field => {
        const IconComponent = icons[field.icon as keyof typeof icons] || FileText

        return (
          <div 
            key={field.id} 
            className="group grid grid-cols-[8%,22%,55%,8%] gap-2 items-center"
          >
            <Popover
              open={openIconPicker === field.id}
              onOpenChange={(open) => {
                setOpenIconPicker(open ? field.id : null)
                if (!open) setIconSearch("")
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="搜索图标..." 
                    value={iconSearch}
                    onValueChange={setIconSearch}
                  />
                  <CommandList>
                    <CommandEmpty>未找到相关图标</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-auto">
                      {filteredIcons.map(({ name, Icon }) => (
                        <CommandItem
                          key={name}
                          value={name}
                          onSelect={() => {
                            handleFieldChange(field.id, 'icon', name)
                            setOpenIconPicker(null)
                            setIconSearch("")
                          }}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Input
              value={field.title}
              onChange={(e) => handleFieldChange(field.id, 'title', e.target.value)}
              placeholder="标题"
              className="h-9"
            />

            <Input
              value={field.content}
              onChange={(e) => handleFieldChange(field.id, 'content', e.target.value)}
              placeholder="内容"
              className="h-9"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeField(field.id)}
              className="h-9 w-9"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      })}
    </div>
  )
} 