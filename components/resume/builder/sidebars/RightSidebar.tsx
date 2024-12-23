"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RightSidebar() {
  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="templates" className="flex-1">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="templates"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
          >
            模板
          </TabsTrigger>
          <TabsTrigger
            value="layout"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
          >
            布局
          </TabsTrigger>
          <TabsTrigger
            value="typography"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
          >
            排版
          </TabsTrigger>
          <TabsTrigger
            value="colors"
            className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
          >
            颜色
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="templates" className="m-0 p-6">
            {/* 模板选择内容 */}
          </TabsContent>

          <TabsContent value="layout" className="m-0 p-6">
            {/* 布局设置内容 */}
          </TabsContent>

          <TabsContent value="typography" className="m-0 p-6">
            {/* 排版设置内容 */}
          </TabsContent>

          <TabsContent value="colors" className="m-0 p-6">
            {/* 颜色设置内容 */}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
} 