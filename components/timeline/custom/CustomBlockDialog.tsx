"use client"

import React, { useState, useEffect } from "react"
import { Plus, X, FileText, Layout } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CustomBlock, CustomBlockField, CustomBlockType } from "@/types/custom"

interface CustomBlockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: Omit<CustomBlock, 'id' | 'createdAt' | 'updatedAt'>) => void
  initialData?: {
    name: string
    type: CustomBlockType
    fields: CustomBlockField[]
  }
  mode?: 'create' | 'edit'
}

export function CustomBlockDialog({
  open,
  onOpenChange,
  onConfirm,
  initialData,
  mode = 'create'
}: CustomBlockDialogProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [type, setType] = useState<CustomBlockType>(initialData?.type || 'page')
  const [fields, setFields] = useState<CustomBlockField[]>(initialData?.fields || [])

  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name)
      setType(initialData.type)
      setFields(initialData.fields)
    }
  }, [open, initialData])

  const handleAddField = () => {
    const newField: CustomBlockField = {
      id: Math.random().toString(),
      label: '',
      type: 'text',
      required: false
    }
    setFields(prev => [...prev, newField])
  }

  const handleRemoveField = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id))
  }

  const handleUpdateField = (
    id: string, 
    key: keyof CustomBlockField, 
    value: string | boolean
  ) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    ))
  }

  const handleConfirm = () => {
    if (!name.trim()) {
      // TODO: 显示错误提示
      return
    }

    const route = `custom-menu-${Date.now()}`
    onConfirm({
      name,
      route,
      type,
      fields,
      icon: 'FileText' // 默认图标
    })
    
    // 重置表单
    setName('')
    setType('page')
    setFields([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? '编辑自定义块' : '新增自定义块'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>菜单名称</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入菜单名称"
              />
            </div>
            <div className="space-y-2">
              <Label>展示形式</Label>
              <Select value={type} onValueChange={(value: 'page' | 'timeline') => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">
                    <div className="flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      <span>单页</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="timeline">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>时间线</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 自定义字段 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>自定义字段</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddField}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                添加字段
              </Button>
            </div>
            
            <div className="space-y-3">
              {fields.map(field => (
                <div key={field.id} className="flex items-start gap-3 group">
                  <div className="w-[30%]">
                    <Input
                      value={field.label}
                      onChange={(e) => handleUpdateField(field.id, 'label', e.target.value)}
                      placeholder="字段名称"
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      value={field.type}
                      onValueChange={(value) => handleUpdateField(field.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">文本</SelectItem>
                        <SelectItem value="date">日期</SelectItem>
                        <SelectItem value="textarea">多行文本</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveField(field.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  点击上方按钮添加自定义字段
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 