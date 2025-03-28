"use client"

import { useState, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  Copy,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  FileDown,
  HelpCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import ElementPanel from "./element-panel"
import EmailSection from "./email-section"
import { initialSections } from "@/lib/initial-data"
import { type Section, type Element, ElementType } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { emailVariables } from "@/lib/variables"
import { Modal } from "./ui/modal"

export default function EmailTemplateCreator() {
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const [activeColumn, setActiveColumn] = useState<number | null>(null)
  const [activeElement, setActiveElement] = useState<{ sectionId: number; columnId: number; elementId: number } | null>(
    null,
  )
  const [showVariablesModal, setShowVariablesModal] = useState(false)
  const [showInstructionsModal, setShowInstructionsModal] = useState(false)

  const previewRef = useRef<HTMLDivElement>(null)

  const addSection = () => {
    const newSection: Section = {
      id: sections.length > 0 ? Math.max(...sections.map((s) => s.id)) + 1 : 0,
      backgroundColor: "#ffffff",
      columns: [{ id: 0, elements: [], width: 100 }],
    }
    setSections([...sections, newSection])
  }

  const removeSection = (sectionId: number) => {
    setSections(sections.filter((section) => section.id !== sectionId))
    if (activeSection === sectionId) {
      setActiveSection(null)
      setActiveColumn(null)
    }
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSections(items)
  }

  const handleDrop = (sectionId: number, columnId: number, item: { type: ElementType }) => {
    const newElement: Element = {
      id: Math.random(),
      type: item.type,
      content:
        item.type === ElementType.TEXT
          ? "Text content"
          : item.type === ElementType.TEXTAREA
            ? "Longer text content..."
            : item.type === ElementType.IMAGE
              ? "https://storage.emojot.com/pictures/generalImages/67761761cb917201e680c031-skin2.png"
              : item.type === ElementType.BUTTON
                ? "Button Text"
                : "",
      style: {
        color: item.type === ElementType.BUTTON ? "#ffffff" : "#000000",
        fontSize: "16px",
        fontWeight: item.type === ElementType.BUTTON ? "bold" : "normal",
        textAlign: item.type === ElementType.BUTTON ? "center" : "left",
        padding: "10px",
        width: item.type === ElementType.IMAGE ? "auto" : undefined,
        height: item.type === ElementType.IMAGE ? "100px" : undefined,
        backgroundColor: item.type === ElementType.BUTTON ? "#0c7bbf" : undefined,
        lineHeight: "1.5",
      },
    }

    if (item.type === ElementType.BUTTON) {
      newElement.href =
        "https://emojot.com/emojotDashboard/samlsso?redirectPage=reports/incidentManagement/incidentEdit.jsp&workflowID=$workflow_id$&incidentID=$incident_id$&trimOut=true&companyID=6791d6ad94210ae8d23f93ae&unmask=true"
      newElement.companyId = "6791d6ad94210ae8d23f93ae"
    }

    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            columns: section.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  elements: [...column.elements, newElement],
                }
              }
              return column
            }),
          }
        }
        return section
      }),
    )
  }

  const updateElement = (sectionId: number, columnId: number, elementId: number, updates: Partial<Element>) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            columns: section.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  elements: column.elements.map((element) => {
                    if (element.id === elementId) {
                      // If updating href and it contains companyID, update the companyId property
                      if (updates.href && typeof updates.href === "string") {
                        const match = updates.href.match(/companyID=([^&]+)/)
                        if (match && match[1]) {
                          updates.companyId = match[1]
                        }
                      }

                      // If updating companyId, update the href property
                      if (updates.companyId && element.href) {
                        const updatedHref = element.href.replace(/companyID=([^&]+)/, `companyID=${updates.companyId}`)
                        updates.href = updatedHref
                      }

                      return { ...element, ...updates }
                    }
                    return element
                  }),
                }
              }
              return column
            }),
          }
        }
        return section
      }),
    )
  }

  const removeElement = (sectionId: number, columnId: number, elementId: number) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            columns: section.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  elements: column.elements.filter((element) => element.id !== elementId),
                }
              }
              return column
            }),
          }
        }
        return section
      }),
    )

    if (
      activeElement &&
      activeElement.sectionId === sectionId &&
      activeElement.columnId === columnId &&
      activeElement.elementId === elementId
    ) {
      setActiveElement(null)
    }
  }

  const updateSectionBackground = (sectionId: number, color: string) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return { ...section, backgroundColor: color }
        }
        return section
      }),
    )
  }

  const splitSection = (sectionId: number, numColumns: number) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          // Calculate equal width for each column
          const columnWidth = 100 / numColumns

          // Create new columns array
          const newColumns = []

          // Get all existing elements
          const allElements = section.columns.flatMap((column) => column.elements)

          // Keep the first column with all elements
          newColumns.push({
            id: 0,
            elements: allElements,
            width: columnWidth,
          })

          // Add new empty columns
          for (let i = 1; i < numColumns; i++) {
            newColumns.push({
              id: Math.max(...section.columns.map((c) => c.id), 0) + i,
              elements: [],
              width: columnWidth,
            })
          }

          return {
            ...section,
            columns: newColumns,
          }
        }
        return section
      }),
    )
  }

  const mergeColumns = (sectionId: number) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          // Collect all elements from all columns
          const allElements = section.columns.flatMap((column) => column.elements)

          // Create a single column with all elements
          return {
            ...section,
            columns: [
              {
                id: 0,
                elements: allElements,
                width: 100,
              },
            ],
          }
        }
        return section
      }),
    )

    setActiveColumn(null)
  }

  const generateHtml = () => {
    if (!previewRef.current) return ""
  
    // Create a deep clone of the preview content
    const tempContainer = document.createElement("div")
    tempContainer.innerHTML = previewRef.current.innerHTML
  
    // Remove all UI control elements
    const uiControls = tempContainer.querySelectorAll(".ui-control, .section-controls, button")
    uiControls.forEach((el) => el.parentNode?.removeChild(el))
  
    // Apply white-space: pre-wrap to any divs with line breaks
    const divs = tempContainer.querySelectorAll("div")
    divs.forEach((div) => {
      const text = div.textContent || ""
    
      if (text.includes("\n") && div.children.length === 0) {
        const style = div.getAttribute("style") || ""
    
        // Split by line and preserve blank lines with &nbsp;
        const lines = text.split("\n")
        const htmlWithBreaks = lines
          .map((line) => {
            const sanitized = line.replace(/</g, "&lt;").replace(/>/g, "&gt;")
            return sanitized.trim() === "" ? "&nbsp;" : sanitized
          })
          .join("<br/>")
    
        div.innerHTML = htmlWithBreaks
    
        // Ensure spacing is preserved
        if (!style.includes("white-space")) {
          div.setAttribute("style", `${style}; white-space: pre-wrap;`)
        }
      }
    })
    
  
    // Remove any border-dashed classes and other UI-specific classes
    const elements = tempContainer.querySelectorAll("*")
    elements.forEach((el) => {
      if (el.classList) {
        el.classList.remove("border-dashed", "border-gray-300", "cursor-pointer")
        // Remove active state classes
        el.classList.remove("bg-blue-50", "bg-gray-100", "border-blue-500")
      }
    })
  
    // Remove empty divs that were just containers for UI controls
    const emptyDivs = tempContainer.querySelectorAll("div:empty")
    emptyDivs.forEach((div) => div.parentNode?.removeChild(div))
  
    // Get the cleaned HTML
    const cleanedHtml = tempContainer.innerHTML
      .replace(/class=""/g, "") // Remove empty class attributes
      .replace(/style=""/g, "") // Remove empty style attributes
      .replace(/\s+>/g, ">") // Clean up extra whitespace before closing tags
  
    // Create a full HTML document with necessary styles
    const fullHtml = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        font-size: 100%;
        font-family: 'Roboto', Arial, sans-serif;
      }
      body {
        width: 100% !important;
        height: 100%;
        background: #f8f8f8;
        color: #000000;
        line-height: 1.5;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        width: 100%;
      }
      td {
        padding: 0;
        vertical-align: top;
      }
      img {
        max-width: 100%;
        margin: 0 auto;
        display: block;
      }
      a {
        color: #0c7bbf;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
      }
      .content {
        background-color: #ffffff;
      }
      .header {
        background-color: #ffffff;
      }
      .footer {
        background-color: #0c7bbf;
        color: #ffffff;
      }
      .button {
        display: inline-block;
        color: white;
        background: #0c7bbf;
        border: none;
        padding: 10px 20px;
        font-weight: bold;
        border-radius: 4px;
        text-decoration: none;
      }
      .button:hover {
        text-decoration: none;
      }
      @media only screen and (max-width: 620px) {
        .container {
          width: 100% !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${cleanedHtml}
    </div>
  </body>
  </html>
  `
  
    return fullHtml
  }
  

  const downloadHtml = () => {
    const html = generateHtml()
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "email-template.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyHtml = () => {
    const html = generateHtml()
    navigator.clipboard
      .writeText(html)
      .then(() => {
        alert("HTML copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy HTML: ", err)
      })
  }

  const getActiveElementDetails = () => {
    if (!activeElement) return null

    const { sectionId, columnId, elementId } = activeElement
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return null

    const column = section.columns.find((c) => c.id === columnId)
    if (!column) return null

    const element = column.elements.find((e) => e.id === elementId)
    if (!element) return null

    return { section, column, element }
  }

  const moveSection = (sectionId: number, direction: "up" | "down") => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId)

    if (sectionIndex === -1) {
      return // Section not found
    }

    const newIndex = direction === "up" ? sectionIndex - 1 : sectionIndex + 1

    if (newIndex < 0 || newIndex >= sections.length) {
      return // Out of bounds
    }

    const newSections = [...sections]
    // Swap sections
    ;[newSections[sectionIndex], newSections[newIndex]] = [newSections[newIndex], newSections[sectionIndex]]

    setSections(newSections)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://storage.emojot.com/pictures/generalImages/67761761cb917201e680c031-skin2.png"
                alt="Emojot Logo"
                className="h-10 mr-3"
              />
              <h1 className="text-2xl font-bold text-gray-800">Email Template Creator</h1>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowVariablesModal(true)}>
                <FileDown className="w-4 h-4 mr-1" /> Variables List
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowInstructionsModal(true)}>
                <HelpCircle className="w-4 h-4 mr-1" /> Instructions
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Elements & Properties */}
            <div className="lg:col-span-1">
              <Tabs defaultValue="elements">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="elements" className="flex-1">
                    Elements
                  </TabsTrigger>
                  <TabsTrigger value="properties" className="flex-1">
                    Properties
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="elements" className="border rounded-md p-4 bg-white">
                  <ElementPanel />
                </TabsContent>

                <TabsContent value="properties" className="border rounded-md p-4 bg-white">
                  {activeSection !== null && activeColumn === null && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Section Properties</h3>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveSection(activeSection, "up")}
                            disabled={sections.findIndex((s) => s.id === activeSection) === 0}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveSection(activeSection, "down")}
                            disabled={sections.findIndex((s) => s.id === activeSection) === sections.length - 1}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm text-gray-600">Background Color</label>
                          <div className="flex items-center mt-1">
                            <input
                              type="color"
                              value={sections[activeSection]?.backgroundColor || "#ffffff"}
                              onChange={(e) => updateSectionBackground(activeSection, e.target.value)}
                              className="w-10 h-10 rounded border"
                            />
                            <Input
                              type="text"
                              value={sections[activeSection]?.backgroundColor || "#ffffff"}
                              onChange={(e) => updateSectionBackground(activeSection, e.target.value)}
                              className="ml-2 flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-6"
                            onClick={() => removeSection(activeSection)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Remove Section
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <h3 className="font-medium">Column Layout</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 w-24">Split into:</span>
                          <Select
                            value={sections[activeSection].columns.length.toString()}
                            onValueChange={(value) => splitSection(activeSection, Number.parseInt(value))}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Column</SelectItem>
                              <SelectItem value="2">2 Columns</SelectItem>
                              <SelectItem value="3">3 Columns</SelectItem>
                              <SelectItem value="4">4 Columns</SelectItem>
                              <SelectItem value="5">5 Columns</SelectItem>
                            </SelectContent>
                          </Select>

                          {sections[activeSection].columns.length > 1 && (
                            <Button variant="outline" size="sm" onClick={() => mergeColumns(activeSection)}>
                              Merge Columns
                            </Button>
                          )}
                        </div>

                        {sections[activeSection].columns.length > 1 && (
                          <div className="mt-2 p-2 bg-gray-50 rounded border">
                            <p className="text-xs text-gray-500">Click on a column to select it for editing</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeSection !== null && activeColumn !== null && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Column Properties</h3>
                        <Button variant="outline" size="sm" onClick={() => setActiveColumn(null)}>
                          Back to Section
                        </Button>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">
                          Column {sections[activeSection].columns.findIndex((c) => c.id === activeColumn) + 1} of{" "}
                          {sections[activeSection].columns.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Drag elements to this column to add content</p>
                      </div>

                      <div className="mt-4">
                        <label className="text-sm text-gray-600">Column Width (%)</label>
                        <Input
                          type="number"
                          min="10"
                          max="100"
                          value={sections[activeSection].columns.find((c) => c.id === activeColumn)?.width || 100}
                          onChange={(e) => {
                            const newWidth = Number.parseInt(e.target.value)
                            if (isNaN(newWidth) || newWidth < 10 || newWidth > 100) return

                            setSections(
                              sections.map((section) => {
                                if (section.id === activeSection) {
                                  return {
                                    ...section,
                                    columns: section.columns.map((column) => {
                                      if (column.id === activeColumn) {
                                        return {
                                          ...column,
                                          width: newWidth,
                                        }
                                      }
                                      return column
                                    }),
                                  }
                                }
                                return section
                              }),
                            )
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {activeElement !== null && (
                    <div className="space-y-4 mt-4">
                      <Separator />
                      <h3 className="font-medium">Element Properties</h3>

                      {(() => {
                        const details = getActiveElementDetails()
                        if (!details) return null

                        const { element } = details

                        return (
                          <div className="space-y-4">
                            {element.type === ElementType.TEXT || element.type === ElementType.TEXTAREA ? (
                              <div>
                                <label className="text-sm text-gray-600">Content</label>
                                {element.type === ElementType.TEXT ? (
                                  <Input
                                    value={element.content}
                                    onChange={(e) =>
                                      updateElement(
                                        activeElement.sectionId,
                                        activeElement.columnId,
                                        activeElement.elementId,
                                        { content: e.target.value },
                                      )
                                    }
                                    className="mt-1"
                                  />
                                ) : (
                                  <Textarea
                                    value={element.content}
                                    onChange={(e) =>
                                      updateElement(
                                        activeElement.sectionId,
                                        activeElement.columnId,
                                        activeElement.elementId,
                                        { content: e.target.value },
                                      )
                                    }
                                    className="mt-1"
                                    rows={6}
                                  />
                                )}
                              </div>
                            ) : element.type === ElementType.IMAGE ? (
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm text-gray-600">Image URL</label>
                                  <Input
                                    value={element.content}
                                    onChange={(e) =>
                                      updateElement(
                                        activeElement.sectionId,
                                        activeElement.columnId,
                                        activeElement.elementId,
                                        { content: e.target.value },
                                      )
                                    }
                                    className="mt-1"
                                    placeholder="https://example.com/image.jpg"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm text-gray-600">Width</label>
                                    <Input
                                      value={element.style.width || "auto"}
                                      onChange={(e) =>
                                        updateElement(
                                          activeElement.sectionId,
                                          activeElement.columnId,
                                          activeElement.elementId,
                                          { style: { ...element.style, width: e.target.value } },
                                        )
                                      }
                                      className="mt-1"
                                      placeholder="200px or 100%"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-600">Height</label>
                                    <Input
                                      value={element.style.height || "auto"}
                                      onChange={(e) =>
                                        updateElement(
                                          activeElement.sectionId,
                                          activeElement.columnId,
                                          activeElement.elementId,
                                          { style: { ...element.style, height: e.target.value } },
                                        )
                                      }
                                      className="mt-1"
                                      placeholder="auto or 150px"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : element.type === ElementType.BUTTON ? (
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm text-gray-600">Button Text</label>
                                  <Input
                                    value={element.content}
                                    onChange={(e) =>
                                      updateElement(
                                        activeElement.sectionId,
                                        activeElement.columnId,
                                        activeElement.elementId,
                                        { content: e.target.value },
                                      )
                                    }
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-600">Button Color</label>
                                  <div className="flex items-center mt-1">
                                    <input
                                      type="color"
                                      value={element.style.backgroundColor || "#0c7bbf"}
                                      onChange={(e) =>
                                        updateElement(
                                          activeElement.sectionId,
                                          activeElement.columnId,
                                          activeElement.elementId,
                                          { style: { ...element.style, backgroundColor: e.target.value } },
                                        )
                                      }
                                      className="w-10 h-10 rounded border"
                                    />
                                    <Input
                                      type="text"
                                      value={element.style.backgroundColor || "#0c7bbf"}
                                      onChange={(e) =>
                                        updateElement(
                                          activeElement.sectionId,
                                          activeElement.columnId,
                                          activeElement.elementId,
                                          { style: { ...element.style, backgroundColor: e.target.value } },
                                        )
                                      }
                                      className="ml-2 flex-1"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-600">Company ID</label>
                                  <Input
                                    value={element.companyId || ""}
                                    onChange={(e) =>
                                      updateElement(
                                        activeElement.sectionId,
                                        activeElement.columnId,
                                        activeElement.elementId,
                                        { companyId: e.target.value },
                                      )
                                    }
                                    className="mt-1"
                                    placeholder="e.g., 6791d6ad94210ae8d23f93ae"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-600">Full URL (Advanced)</label>
                                  <Textarea
                                    value={element.href || ""}
                                    onChange={(e) =>
                                      updateElement(
                                        activeElement.sectionId,
                                        activeElement.columnId,
                                        activeElement.elementId,
                                        { href: e.target.value },
                                      )
                                    }
                                    className="mt-1 text-xs"
                                    rows={3}
                                  />
                                </div>
                              </div>
                            ) : null}

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-gray-600">Text Color</label>
                                <div className="flex items-center mt-1">
                                  <input
                                    type="color"
                                    value={element.style.color}
                                    onChange={(e) =>
                                      updateElement(
                                        activeElement.sectionId,
                                        activeElement.columnId,
                                        activeElement.elementId,
                                        { style: { ...element.style, color: e.target.value } },
                                      )
                                    }
                                    className="w-10 h-10 rounded border"
                                  />
                                  <Input
                                    type="text"
                                    value={element.style.color}
                                    onChange={(e) =>
                                      updateElement(
                                        activeElement.sectionId,
                                        activeElement.columnId,
                                        activeElement.elementId,
                                        { style: { ...element.style, color: e.target.value } },
                                      )
                                    }
                                    className="ml-2 flex-1"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-sm text-gray-600">Font Size</label>
                                <Input
                                  type="text"
                                  value={element.style.fontSize}
                                  onChange={(e) =>
                                    updateElement(
                                      activeElement.sectionId,
                                      activeElement.columnId,
                                      activeElement.elementId,
                                      { style: { ...element.style, fontSize: e.target.value } },
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-sm text-gray-600">Line Height</label>
                              <Input
                                type="text"
                                value={element.style.lineHeight || "1.5"}
                                onChange={(e) =>
                                  updateElement(
                                    activeElement.sectionId,
                                    activeElement.columnId,
                                    activeElement.elementId,
                                    { style: { ...element.style, lineHeight: e.target.value } },
                                  )
                                }
                                className="mt-1"
                                placeholder="1.5"
                              />
                            </div>

                            <div>
                              <label className="text-sm text-gray-600">Text Alignment</label>
                              <div className="flex space-x-2 mt-1">
                                <Button
                                  variant={element.style.textAlign === "left" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() =>
                                    updateElement(
                                      activeElement.sectionId,
                                      activeElement.columnId,
                                      activeElement.elementId,
                                      { style: { ...element.style, textAlign: "left" } },
                                    )
                                  }
                                >
                                  <AlignLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant={element.style.textAlign === "center" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() =>
                                    updateElement(
                                      activeElement.sectionId,
                                      activeElement.columnId,
                                      activeElement.elementId,
                                      { style: { ...element.style, textAlign: "center" } },
                                    )
                                  }
                                >
                                  <AlignCenter className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant={element.style.textAlign === "right" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() =>
                                    updateElement(
                                      activeElement.sectionId,
                                      activeElement.columnId,
                                      activeElement.elementId,
                                      { style: { ...element.style, textAlign: "right" } },
                                    )
                                  }
                                >
                                  <AlignRight className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm text-gray-600">Font Weight</label>
                              <div className="flex space-x-2 mt-1">
                                <Button
                                  variant={element.style.fontWeight === "normal" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() =>
                                    updateElement(
                                      activeElement.sectionId,
                                      activeElement.columnId,
                                      activeElement.elementId,
                                      { style: { ...element.style, fontWeight: "normal" } },
                                    )
                                  }
                                >
                                  Normal
                                </Button>
                                <Button
                                  variant={element.style.fontWeight === "bold" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() =>
                                    updateElement(
                                      activeElement.sectionId,
                                      activeElement.columnId,
                                      activeElement.elementId,
                                      { style: { ...element.style, fontWeight: "bold" } },
                                    )
                                  }
                                >
                                  Bold
                                </Button>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm text-gray-600">Padding</label>
                              <Input
                                type="text"
                                value={element.style.padding}
                                onChange={(e) =>
                                  updateElement(
                                    activeElement.sectionId,
                                    activeElement.columnId,
                                    activeElement.elementId,
                                    { style: { ...element.style, padding: e.target.value } },
                                  )
                                }
                                className="mt-1"
                                placeholder="10px"
                              />
                            </div>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                removeElement(activeElement.sectionId, activeElement.columnId, activeElement.elementId)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Remove Element
                            </Button>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  {activeSection === null && activeElement === null && (
                    <div className="text-center py-8 text-gray-500">
                      Select a section or element to edit its properties
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Preview</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyHtml}>
                      <Copy className="w-4 h-4 mr-1" /> Copy HTML
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadHtml}>
                      <Download className="w-4 h-4 mr-1" /> Download
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md bg-gray-50 p-4 overflow-auto" style={{ minHeight: "500px" }}>
                  <div className="mx-auto" style={{ maxWidth: "600px" }}>
                    <div ref={previewRef}>
                      {sections.map((section, index) => (
                        <div key={section.id} className="mb-6">
                          <div className="flex items-center justify-between mb-1 section-controls ui-control">
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 text-gray-400 hover:text-gray-600 ui-control"
                                onClick={() => moveSection(section.id, "up")}
                                disabled={index === 0}
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 text-gray-400 hover:text-gray-600 ui-control"
                                onClick={() => moveSection(section.id, "down")}
                                disabled={index === sections.length - 1}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-transparent p-1 ui-control"
                              onClick={() => removeSection(section.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <EmailSection
                            section={section}
                            onDrop={handleDrop}
                            onClick={() => setActiveSection(section.id)}
                            onElementClick={(columnId, elementId) => {
                              setActiveSection(section.id)
                              setActiveElement({ sectionId: section.id, columnId, elementId })
                            }}
                            onElementRemove={removeElement}
                            onSectionRemove={removeSection}
                            onColumnClick={(sectionId, columnId) => {
                              setActiveSection(sectionId)
                              setActiveColumn(columnId)
                            }}
                            isActive={activeSection === section.id}
                            activeColumnId={activeColumn}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-4 ui-control">
                      <Button onClick={addSection} className="ui-control">
                        <Plus className="w-4 h-4 mr-1" /> Add Section
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-white border-t p-4 mt-8">
  <div className="container mx-auto text-center">
    <p className="text-gray-600">© {new Date().getFullYear()} Emojot. All rights reserved.</p>
  </div>
</footer>


        {/* Variables Modal */}
        <Modal
          title="Email Template Variables"
          isOpen={showVariablesModal}
          onClose={() => setShowVariablesModal(false)}
        >
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Use these variables in your email templates. Click on a variable to copy it to your clipboard.
            </p>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {Object.entries(
                emailVariables.reduce(
                  (acc, variable) => {
                    if (!acc[variable.category]) {
                      acc[variable.category] = []
                    }
                    acc[variable.category].push(variable)
                    return acc
                  },
                  {} as Record<string, typeof emailVariables>,
                ),
              ).map(([category, variables]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-md font-medium mb-3">{category}</h3>
                  <div className="space-y-3">
                    {variables.map((variable) => (
                      <div
                        key={variable.name}
                        className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(variable.name)
                          alert(`Copied ${variable.name} to clipboard!`)
                        }}
                      >
                        <div className="flex flex-col">
                          <code className="font-mono text-sm mb-2">{variable.name}</code>
                          <span className="text-xs text-gray-500">{variable.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        {/* Instructions Modal */}
        <Modal
          title="Email Template Creator Instructions"
          isOpen={showInstructionsModal}
          onClose={() => setShowInstructionsModal(false)}
        >
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Getting Started</h3>
              <p>The email template creator is divided into two main sections:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Left Panel:</strong> Contains elements you can drag and drop, and properties you can edit
                </li>
                <li>
                  <strong>Right Panel:</strong> Shows a preview of your email template
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Working with Sections</h3>
              <p>Your email is divided into horizontal sections (like header, body, footer):</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click the "Add Section" button to add a new section</li>
                <li>Click on a section to select it and edit its properties</li>
                <li>Use the up/down arrows to reorder sections</li>
                <li>Remove a section by clicking the trash icon on the section</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Working with Columns</h3>
              <p>Each section can be divided into columns:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Select a section, then use the "Split into..." dropdown to divide it into columns</li>
                <li>Click on a column to select it for editing</li>
                <li>Use "Merge Columns" to combine all columns back into one</li>
                <li>Columns are visually separated by dashed lines</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Adding Elements</h3>
              <p>Drag and drop elements from the Elements tab into your sections:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Text:</strong> For short text like headings
                </li>
                <li>
                  <strong>Text Area:</strong> For longer paragraphs
                </li>
                <li>
                  <strong>Image:</strong> For logos and pictures
                </li>
                <li>
                  <strong>Button:</strong> For call-to-action buttons
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Editing Elements</h3>
              <p>Click on any element to edit its properties:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Change text content, color, size, alignment, and font weight</li>
                <li>Adjust line height for better readability</li>
                <li>For images, set the URL and adjust width and height</li>
                <li>For buttons, set the text, button color, and customize the URL</li>
                <li>Click the X button on an element to remove it</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Button Company ID</h3>
              <p>When editing a button, you can set the Company ID:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The Company ID is used in the button URL to direct users to the correct company dashboard</li>
                <li>Enter your company's unique identifier in the "Company ID" field</li>
                <li>The system will automatically update the full URL with your Company ID</li>
                <li>You can also edit the full URL directly in the "Full URL (Advanced)" field</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Using Variables</h3>
              <p>Variables allow your email to display dynamic content:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click the "Variables List" button to see all available variables</li>
                <li>Click on a variable to copy it to your clipboard</li>
                <li>Paste the variable into any text or text area element</li>
                <li>
                  Common variables include <code>$client_name$</code>, <code>$incident_number$</code>, etc.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Finalizing Your Template</h3>
              <p>When your template is ready:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click "Copy HTML" to copy the HTML code to your clipboard</li>
                <li>Click "Download" to save the HTML file to your computer</li>
              </ul>
            </div>
          </div>
        </Modal>
      </div>
    </DndProvider>
  )
}

