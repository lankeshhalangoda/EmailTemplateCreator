import type { Variable } from "./types"

export const emailVariables: Variable[] = [
  // First image variables
  {
    name: "$incident_newVal$",
    description: "This will hold a new value when someone change the incident property value one to another",
    category: "Incident",
  },
  {
    name: "$incident_oldVal$",
    description: "This will hold a old value when someone change the incident property value one to another",
    category: "Incident",
  },
  { name: "$incident_updatedField$", description: "Field Name which is updated", category: "Incident" },
  { name: "$incident_name$", description: "Name of the incident", category: "Incident" },
  { name: "$workflow_id$", description: "Unique workflow identifier", category: "Workflow" },
  {
    name: "$emoSignature_<key>$",
    description: "If you want to show emo signature data in a template this placeholder can be used",
    category: "Signature",
  },
  {
    name: "$incident_customFields_<fieldId>$",
    description: "This can be use to show custom field value in the template",
    category: "Custom Fields",
  },
  { name: "$incident_comment_status_current$", description: "Current status comment", category: "Comment" },
  {
    name: "$incident_comment_status_<statusId>$",
    description: "This can be used to append comment based on the status",
    category: "Comment",
  },
  { name: "$incident_lastComment$", description: "Last comment of the incident", category: "Comment" },
  { name: "$emoSignature_Hospital$", description: "Add emo signature data", category: "Signature" },

  // Second image variables
  { name: "$incident_assigneeName$", description: "Current assignee name", category: "Assignee" },
  { name: "$incident_previousAssigneeName$", description: "Previous assignee name", category: "Assignee" },
  { name: "$incident_previousAssigneeEmail$", description: "Previous assignee email", category: "Assignee" },
  { name: "$incident_updatedByName$", description: "Name of the person who updated the incident", category: "Update" },
  {
    name: "$incident_updatedByEmail$",
    description: "Email of the person who updated the incident",
    category: "Update",
  },
  { name: "$incident_id$", description: "Unique identifier used by the system", category: "Incident" },
  { name: "$incident_companyId$", description: "Company Id belong to incident", category: "Incident" },
  { name: "$incident_number$", description: "Human readable incident number (123)", category: "Incident" },
  { name: "$incident_created_date$", description: "Incident created date", category: "Incident" },
  { name: "$incident_description$", description: "Description of the incident", category: "Incident" },
  { name: "$incident_type$", description: "Type of the incident", category: "Incident" },
  { name: "$incident_status$", description: "Status of the incident", category: "Incident" },
  { name: "$incident_priority$", description: "Priority of the incident", category: "Incident" },
  { name: "$client_name$", description: "Name of the person who created the incident", category: "Client" },
  { name: "$client_email$", description: "Email of the person who created the incident", category: "Client" },
  { name: "$client_telephone$", description: "Telephone of the person who created the incident", category: "Client" },

  // Third image variables
  { name: "$incidentURL$", description: "Append Edit URL to Incident", category: "URL" },
  { name: "showFileUrl", description: "Show file URL", category: "URL" },
  { name: '"objectListPlaceholder": true,', description: "Object list placeholder", category: "Other" },
]

export const getVariablesByCategory = () => {
  const categories: Record<string, Variable[]> = {}

  emailVariables.forEach((variable) => {
    if (!categories[variable.category]) {
      categories[variable.category] = []
    }
    categories[variable.category].push(variable)
  })

  return categories
}

