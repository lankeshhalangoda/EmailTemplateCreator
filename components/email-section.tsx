"use client"

import { useDrop } from "react-dnd"
import { type Section, type Element, ElementType } from "@/lib/types"
import { X } from "lucide-react"

interface EmailSectionProps {
  section: Section
  onDrop: (sectionId: number, columnId: number, item: { type: ElementType }) => void
  onClick: () => void
  onElementClick: (columnId: number, elementId: number) => void
  onElementRemove: (sectionId: number, columnId: number, elementId: number) => void
  onSectionRemove: (sectionId: number) => void
  onColumnClick: (sectionId: number, columnId: number) => void
  isActive: boolean
  activeColumnId: number | null
}

interface ColumnDropTargetProps {
  sectionId: number
  columnId: number
  width: number
  elements: Element[]
  onDrop: (sectionId: number, columnId: number, item: { type: ElementType }) => void
  onElementClick: (columnId: number, elementId: number) => void
  onElementRemove: (sectionId: number, columnId: number, elementId: number) => void
  onColumnClick: (sectionId: number, columnId: number) => void
  columnCount: number
  columnIndex: number
  isActive: boolean
}

function ColumnDropTarget({
  sectionId,
  columnId,
  width,
  elements,
  onDrop,
  onElementClick,
  onElementRemove,
  onColumnClick,
  columnCount,
  columnIndex,
  isActive,
}: ColumnDropTargetProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "ELEMENT",
    drop: (item: { type: ElementType }) => {
      onDrop(sectionId, columnId, item)
      return undefined
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  const borderClass =
    columnCount > 1 && columnIndex !== columnCount - 1 ? "border-r border-dashed border-gray-300" : ""

  return (
    <td
      ref={drop}
      className={`align-top ${isOver ? "bg-blue-50" : ""} ${isActive ? "bg-gray-100" : ""} ${borderClass}`}
      style={{ width: `${width}%` }}
      onClick={(e) => {
        e.stopPropagation()
        onColumnClick(sectionId, columnId)
      }}
    >
      <div className="p-2 min-h-[50px]">
        {elements.map((element) => (
          <div
            key={element.id}
            className="mb-2 cursor-pointer relative group border border-dashed border-gray-300 p-1"
            onClick={(e) => {
              e.stopPropagation()
              onElementClick(columnId, element.id)
            }}
          >
            <div className="absolute top-1 right-1 z-10 ui-control">
              <button
                className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 ui-control"
                onClick={(e) => {
                  e.stopPropagation()
                  onElementRemove(sectionId, columnId, element.id)
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {element.type === ElementType.TEXT && (
              <div
                style={{
                  color: element.style.color,
                  fontSize: element.style.fontSize,
                  fontWeight: element.style.fontWeight,
                  textAlign: element.style.textAlign as any,
                  padding: element.style.padding,
                  lineHeight: element.style.lineHeight || "1.5",
                }}
              >
                {element.content}
              </div>
            )}

            {element.type === ElementType.TEXTAREA && (
              <div
                style={{
                  color: element.style.color,
                  fontSize: element.style.fontSize,
                  fontWeight: element.style.fontWeight,
                  textAlign: element.style.textAlign as any,
                  padding: element.style.padding,
                  lineHeight: element.style.lineHeight || "1.5",
                  whiteSpace: "pre-wrap", // ✅ Fixes the line-break rendering
                }}
              >
                {element.content}
              </div>
            )}

            {element.type === ElementType.IMAGE && (
              <div
                style={{
                  textAlign: element.style.textAlign as any,
                  padding: element.style.padding,
                }}
              >
                <img
                  src={element.content || "/placeholder.svg"}
                  alt="Email content"
                  style={{
                    display: "inline-block",
                    maxWidth: "100%",
                    width: element.style.width || "auto",
                    height: element.style.height || "auto",
                  }}
                />
              </div>
            )}

            {element.type === ElementType.BUTTON && (
              <div
                style={{
                  textAlign: element.style.textAlign as any,
                  padding: element.style.padding,
                }}
              >
                <a
                  href="#"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    backgroundColor: element.style.backgroundColor || "#0c7bbf",
                    color: element.style.color,
                    fontSize: element.style.fontSize,
                    fontWeight: element.style.fontWeight,
                    textDecoration: "none",
                    borderRadius: "4px",
                    lineHeight: element.style.lineHeight || "1.5",
                  }}
                >
                  {element.content}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </td>
  )
}

export default function EmailSection({
  section,
  onDrop,
  onClick,
  onElementClick,
  onElementRemove,
  onSectionRemove,
  onColumnClick,
  isActive,
  activeColumnId,
}: EmailSectionProps) {
  return (
    <div
      className={`mb-4 border ${isActive ? "border-blue-500" : "border-gray-200"}`}
      style={{ backgroundColor: section.backgroundColor }}
      onClick={onClick}
    >
      <table className="w-full" cellPadding="0" cellSpacing="0">
        <tbody>
          <tr>
            {section.columns.map((column, index) => (
              <ColumnDropTarget
                key={column.id}
                sectionId={section.id}
                columnId={column.id}
                width={column.width}
                elements={column.elements}
                onDrop={onDrop}
                onElementClick={onElementClick}
                onElementRemove={onElementRemove}
                onColumnClick={onColumnClick}
                columnCount={section.columns.length}
                columnIndex={index}
                isActive={isActive && activeColumnId === column.id}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
