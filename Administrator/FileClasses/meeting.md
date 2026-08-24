---
modified: 2026-08-07T15:53:17-06:00
limit: 20
mapWithTag: true
icon: audio-lines
tagNames:
  - meeting
filesPaths:
  - Meetings
bookmarksGroups:
excludes:
extends:
savedViews: []
favoriteView:
fieldsOrder:
  - Y5e3ib
  - MtRB01
  - I3Xp6w
  - fytyRS
  - MtCU01
  - MtGI01
  - MtGT01
  - MtGR01
  - MtGD01
  - MtCP01
  - MtCE01
  - MtCT01
  - MtPC01
  - MtST01
  - MtET01
  - MtIA01
version: "2.15"
fields:
  - name: Company
    type: File
    options:
      dvQueryString: dv.pages('#crm_company')
    path: ""
    id: fytyRS
  - name: Contacts
    type: MultiFile
    options:
      dvQueryString: dv.pages('#crm_contact')
    path: ""
    id: I3Xp6w
  - name: Project
    type: File
    options:
      dvQueryString: dv.pages('#project')
    path: ""
    id: Y5e3ib
  - name: ReportingBucket
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Client Delivery
        "2": Internal Operations
        "3": TARS / OS
    path: ""
    id: MtRB01
  - name: CallUrl
    type: Input
    options: {}
    path: ""
    id: MtCU01
  - name: GongId
    type: Input
    options: {}
    path: ""
    id: MtGI01
  - name: GongTitle
    type: Input
    options: {}
    path: ""
    id: MtGT01
  - name: GongReceivedAt
    type: DateTime
    options:
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: MtGR01
  - name: GongDurationMin
    type: Number
    options: {}
    path: ""
    id: MtGD01
  - name: CalendarProvider
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": reclaim
        "2": google
        "3": outlook
    path: ""
    id: MtCP01
  - name: CalendarEventID
    type: Input
    options: {}
    path: ""
    id: MtCE01
  - name: CallType
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": internal call
        "2": external call
    path: ""
    id: MtCT01
  - name: Passcode
    type: Input
    options: {}
    path: ""
    id: MtPC01
  - name: StartTime
    type: DateTime
    options:
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: MtST01
  - name: EndTime
    type: DateTime
    options:
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: MtET01
  - name: IngestedAt
    type: DateTime
    options:
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: MtIA01
---
