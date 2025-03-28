export enum ElementType {
  TEXT = "text",
  TEXTAREA = "textarea",
  IMAGE = "image",
  BUTTON = "button",
  VARIABLE = "variable",
}

export interface ElementStyle {
  color: string
  fontSize: string
  fontWeight: string
  textAlign: string
  padding: string
  width?: string
  height?: string
  backgroundColor?: string
  lineHeight?: string
}

export interface Element {
  id: number
  type: ElementType
  content: string
  style: ElementStyle
  href?: string
  companyId?: string
}

export interface Column {
  id: number
  elements: Element[]
  width: number
}

export interface Section {
  id: number
  backgroundColor: string
  columns: Column[]
}

export interface Variable {
  name: string
  description: string
  category: string
}

