import { type Section, ElementType } from "./types"

export const initialSections: Section[] = [
  {
    id: 0,
    backgroundColor: "#ffffff",
    columns: [
      {
        id: 0,
        width: 100,
        elements: [
          {
            id: 1,
            type: ElementType.IMAGE,
            content: "https://storage.emojot.com/pictures/generalImages/67761761cb917201e680c031-skin2.png",
            style: {
              color: "#000000",
              fontSize: "16px",
              fontWeight: "normal",
              textAlign: "left",
              padding: "10px",
              width: "auto",
              height: "100px",
            },
          },
        ],
      },
    ],
  },
  {
    id: 1,
    backgroundColor: "#ffffff",
    columns: [
      {
        id: 0,
        width: 100,
        elements: [
          {
            id: 1,
            type: ElementType.TEXT,
            content: "Hi Admin,",
            style: {
              color: "#000000",
              fontSize: "18px",
              fontWeight: "bold",
              textAlign: "left",
              padding: "10px",
              lineHeight: "1.5",
            },
          },
        ],
      },
    ],
  },
  {
    id: 2,
    backgroundColor: "#ffffff",
    columns: [
      {
        id: 0,
        width: 100,
        elements: [
          {
            id: 1,
            type: ElementType.TEXTAREA,
            content:
              "A new complaint has been created. Please review it by clicking the button below.\n\nClient: $client_name$\n\nTicket ID: $incident_number$\n\nLocation: $emoSignature_Location$\n\nCategory: $incident_customFields_category$\n\nComment: $incident_customFields_customerComment$",
            style: {
              color: "#000000",
              fontSize: "16px",
              fontWeight: "normal",
              textAlign: "left",
              padding: "10px",
              lineHeight: "1.5",
            },
          },
        ],
      },
    ],
  },
  {
    id: 3,
    backgroundColor: "#ffffff",
    columns: [
      {
        id: 0,
        width: 100,
        elements: [
          {
            id: 1,
            type: ElementType.BUTTON,
            content: "Click here to review",
            href: "https://emojot.com/emojotDashboard/samlsso?redirectPage=reports/incidentManagement/incidentEdit.jsp&workflowID=$workflow_id$&incidentID=$incident_id$&trimOut=true&companyID=6791d6ad94210ae8d23f93ae&unmask=true",
            companyId: "6791d6ad94210ae8d23f93ae",
            style: {
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "center",
              padding: "10px",
              backgroundColor: "#0c7bbf",
              lineHeight: "1.5",
            },
          },
        ],
      },
    ],
  },
  {
    id: 4,
    backgroundColor: "#0c7bbf",
    columns: [
      {
        id: 0,
        width: 100,
        elements: [
          {
            id: 1,
            type: ElementType.TEXT,
            content: `© ${new Date().getFullYear()} Emojot. All rights reserved.`,
            style: {
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "normal",
              textAlign: "center",
              padding: "10px",
              lineHeight: "1.5",
            },
          },
        ],
      },
    ],
  },
]

