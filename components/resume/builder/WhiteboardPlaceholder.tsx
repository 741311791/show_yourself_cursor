"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useResumeStore } from "@/store/useResumeStore";
import { useDebounce } from "@/hooks/useDebounce";
import { ResumeDetail } from "@/types/resume";

// 动态导入 react-json-view 以减少初始包大小
const DynamicJsonView = dynamic(() => import("react-json-view"), {
  ssr: false,
  loading: () => <div>Loading JSON viewer...</div>,
});

export function WhiteboardPlaceholder() {
  // 从全局状态获取初始数据
  const resumeData = useResumeStore((state) => state.resumeData);

  // 本地状态
  const [stateChanges, setStateChanges] = useState<{
    resumeData: ResumeDetail | null;
    lastAction: {
      type: string;
      payload: any;
      timestamp: string;
    } | null;
  }>({
    resumeData: resumeData || null, // 使用全局状态初始化
    lastAction: null,
  });

  // 监听全局状态变化
  useEffect(() => {
    if (resumeData) {
      setStateChanges((prev) => ({
        ...prev,
        resumeData,
      }));
    }
  }, [resumeData]);

  // 订阅状态变化
  useEffect(() => {
    // 订阅基本信息更新
    const unsubBasic = useResumeStore.subscribe(
      (state) => state.resumeData,
      (newData, oldData) => {
        if (!oldData || !newData) return;

        const basicInfoChanged = ["name", "isPublic", "thumbnailUrl"].some(
          (key) =>
            oldData[key as keyof typeof oldData] !==
            newData[key as keyof typeof newData]
        );

        if (basicInfoChanged) {
          setStateChanges((prev) => ({
            ...prev,
            resumeData: newData,
            lastAction: {
              type: "UPDATE_BASIC_INFO",
              payload: {
                old: oldData,
                new: newData,
              },
              timestamp: new Date().toISOString(),
            },
          }));
        }
      }
    );

    // 订阅 sections 更新
    const unsubSections = useResumeStore.subscribe(
      (state) => state.resumeData?.sections,
      (newSections, oldSections) => {
        if (!oldSections || !newSections) return;

        setStateChanges((prev) => ({
          ...prev,
          lastAction: {
            type: "UPDATE_SECTIONS",
            payload: {
              old: oldSections,
              new: newSections,
            },
            timestamp: new Date().toISOString(),
          },
        }));
      }
    );

    // 订阅 metadata 更新
    const unsubMetadata = useResumeStore.subscribe(
      (state) => state.resumeData?.metadata,
      (newMetadata, oldMetadata) => {
        if (!oldMetadata || !newMetadata) return;

        setStateChanges((prev) => ({
          ...prev,
          lastAction: {
            type: "UPDATE_METADATA",
            payload: {
              old: oldMetadata,
              new: newMetadata,
            },
            timestamp: new Date().toISOString(),
          },
        }));
      }
    );

    // 清理订阅
    return () => {
      unsubBasic();
      unsubSections();
      unsubMetadata();
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* 固定的标题部分 */}
      <div className="p-6 border-b">
        <h3 className="text-xl font-semibold text-gray-800">简历状态调试面板</h3>
        <p className="text-sm text-gray-500 mt-1">实时监控简历数据变化</p>
      </div>

      {/* 内容部分 */}
      <div className="p-6">
        <div className="space-y-8">
          {/* 当前简历数据 */}
          <div className="space-y-2">
            <h4 className="font-medium sticky top-0 bg-white py-2">当前简历数据:</h4>
            <div className="p-4 bg-gray-50 rounded-md">
              <DynamicJsonView
                src={stateChanges?.resumeData || {}}
                name={null}
                theme="rjv-default"
                collapsed={2}
                displayDataTypes={false}
                enableClipboard={false}
              />
            </div>
          </div>

          {/* 当前 sections 数据 */}
          <div className="space-y-2">
            <h4 className="font-medium sticky top-0 bg-white py-2">当前 sections 数据:</h4>
            <div className="p-4 bg-gray-50 rounded-md">
              <DynamicJsonView
                src={stateChanges.resumeData?.sections || {}}
                name={null}
                theme="rjv-default"
                collapsed={2}
                displayDataTypes={false}
                enableClipboard={false}
              />
            </div>
          </div>

          {/* 当前 metadata 数据 */}
          <div className="space-y-2">
            <h4 className="font-medium sticky top-0 bg-white py-2">当前 metadata 数据:</h4>
            <div className="p-4 bg-gray-50 rounded-md">
              <DynamicJsonView
                src={stateChanges.resumeData?.metadata || {}}
                name={null}
                theme="rjv-default"
                collapsed={2}
                displayDataTypes={false}
                enableClipboard={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
