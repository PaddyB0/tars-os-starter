---
modified: 2026-07-27T16:46:00-06:00
fields:
  - name: Status
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": 🟠 backlog
        "2": ⚪ planned
        "3": 🔵 active
        "4": 🔴 at risk
        "5": 🟢 complete
    path: ""
    id: s5JzgI
  - name: Type
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Premium Success
        "2": CS Hours
    path: ""
    id: Z23Rff
  - name: Company
    type: File
    options:
      dvQueryString: dv.pages('#crm_company')
    path: ""
    id: j5KdrO
  - name: Contacts
    type: MultiFile
    options:
      dvQueryString: dv.pages('#crm_contact')
    path: ""
    id: zPDO6E
  - name: ScopeCategory
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": 40+ hrs
        "2": 26-39 hrs
        "3": 11-25 hrs
        "4": 0-10 hrs
    path: ""
    id: Eg3M0v
  - name: Scope_hrs
    type: Number
    options: {}
    path: ""
    id: KJTGYU
  - name: HubIcon
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": rocket
        "2": folder-kanban
        "3": briefcase-business
        "4": chart-no-axes-column
        "5": building-2
        "6": target
        "7": sparkles
        "8": wrench
    path: ""
    id: HubIcn
  - name: HubColor
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": blue
        "2": green
        "3": purple
        "4": cyan
        "5": orange
        "6": pink
        "7": yellow
        "8": red
    path: ""
    id: HubClr
  - name: BonusAssignedAt
    type: Date
    options:
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: BonAsn
  - name: BonusLiveAt
    type: Date
    options:
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: BonLiv
  - name: StartTime
    type: DateTime
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: QjUGaO
  - name: EndTime
    type: DateTime
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: ZO2Q5g
  - name: Completed_at
    type: Formula
    options:
      autoUpdate: false
    path: ""
    id: OBPNDg
  - name: sf.ProjectName
    type: Input
    options: {}
    path: ""
    id: Dqimnv
  - name: sf.NotetoSETeam
    type: Input
    options: {}
    path: ""
    id: SfNote1
version: "2.27"
limit: 20
mapWithTag: true
icon: rocket
tagNames:
  - project
filesPaths:
  - Projects
bookmarksGroups:
excludes:
extends:
savedViews: []
favoriteView:
fieldsOrder:
  - HubClr
  - HubIcn
  - SfNote1
  - Dqimnv
  - OBPNDg
  - ZO2Q5g
  - QjUGaO
  - BonLiv
  - BonAsn
  - KJTGYU
  - Eg3M0v
  - zPDO6E
  - j5KdrO
  - Z23Rff
  - s5JzgI
---
