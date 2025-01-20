"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DraggableItem {
  id: string
  [key: string]: string | number | boolean | undefined | string[] | null | Record<string, unknown>[] | Record<string, unknown> | unknown[]
}

interface DraggableCardListProps<T extends DraggableItem> {
  items: T[]
  onChange: (items: T[]) => void
  onAddItem?: () => void
  renderCollapsedContent: (item: T) => React.ReactNode
  renderExpandedContent: (item: T) => React.ReactNode
  itemClassName?: string
  addButtonText?: string
}

export function DraggableCardList<T extends DraggableItem>({
  items,
  onChange,
  onAddItem,
  renderCollapsedContent,
  renderExpandedContent,
  itemClassName,
  addButtonText = "添加"
}: DraggableCardListProps<T>) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)
    onChange(newItems)
  }

  const toggleExpand = (id: string) => {
    const newExpandedItems = new Set(expandedItems)
    if (expandedItems.has(id)) {
      newExpandedItems.delete(id)
    } else {
      newExpandedItems.add(id)
    }
    setExpandedItems(newExpandedItems)
  }

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "relative rounded-lg border bg-card shadow-sm transition-colors",
                        snapshot.isDragging && "border-primary",
                        itemClassName
                      )}
                    >
                      <div className="flex items-center p-4">
                        <div
                          {...provided.dragHandleProps}
                          className="mr-2 cursor-grab text-muted-foreground"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <div className="flex-grow">
                          {renderCollapsedContent(item)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleExpand(item.id)}
                          >
                            {expandedItems.has(item.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {expandedItems.has(item.id) && (
                        <div className="border-t p-4">
                          {renderExpandedContent(item)}
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        type="button"
        variant="outline"
        onClick={onAddItem}
        className="w-full h-9 border-dashed hover:border-solid flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm">{addButtonText}</span>
      </Button>
    </div>
  )
} 