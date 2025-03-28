"use client"

import type React from "react"

import { useDrag } from "react-dnd"
import { Type, ImageIcon, AlignLeft, MousePointer } from "lucide-react"
import { ElementType } from "@/lib/types"

const DraggableElement = ({ type, icon, label }: { type: ElementType; icon: React.ReactNode; label: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ELEMENT",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`flex items-center p-3 border rounded-md cursor-move hover:bg-gray-50 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="mr-3 text-gray-600">{icon}</div>
      <span>{label}</span>
    </div>
  )
}

export default function ElementPanel() {
  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Drag elements to your template</h3>

      <div className="space-y-3">
        <DraggableElement type={ElementType.TEXT} icon={<Type className="w-5 h-5" />} label="Text" />

        <DraggableElement type={ElementType.TEXTAREA} icon={<AlignLeft className="w-5 h-5" />} label="Text Area" />

        <DraggableElement type={ElementType.IMAGE} icon={<ImageIcon className="w-5 h-5" />} label="Image" />

        <DraggableElement type={ElementType.BUTTON} icon={<MousePointer className="w-5 h-5" />} label="Button" />
      </div>
    </div>
  )
}

