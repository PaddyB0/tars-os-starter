---
modified: 2026-07-28T12:00:00-06:00
fields:
  - name: Project
    type: File
    options:
      dvQueryString: dv.pages('#project')
    path: ""
    id: MsPrj1
  - name: TargetDate
    type: Date
    options:
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: MsDate
  - name: Description
    type: Input
    options: {}
    path: ""
    id: MsDesc
  - name: Completed_At
    type: DateTime
    options:
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: MsDone
version: "1.0"
limit: 20
mapWithTag: true
icon: diamond
tagNames:
  - milestone
filesPaths:
  - Milestones
bookmarksGroups:
excludes:
extends:
savedViews: []
favoriteView:
fieldsOrder:
  - MsPrj1
  - MsDate
  - MsDesc
  - MsDone
---
