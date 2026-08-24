---
modified: 2026-08-14T21:34:40-06:00
fields:
  - name: Status
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": ⚫ BACKLOG
        "2": ⚪ TO DO
        "3": 🔵 IN PROGRESS
        "4": 🟣 HUMAN REVIEW
        "5": 🟠 REWORK
        "6": 🟢 MERGING
        "7": 🟢 COMPLETE
        "8": ⚫ CANCELED
        "9": ⚫ DUPLICATE
    path: ""
    id: bivHya
  - name: Priority
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Low
        "2": Medium
        "3": High
        "4": Critical
    path: ""
    id: rucFi4
  - name: Phase
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Kick-Off
        "2": Change Planning
        "3": Workspace Configuration
        "4": Model Builds
        "5": Dashboard Design
        "6": Training + Enablement
    path: ""
    id: SDrnNa
  - name: Project
    type: File
    options:
      dvQueryString: dv.pages('#project')
    path: ""
    id: GfCKwc
  - name: Milestone
    type: File
    options:
      dvQueryString: dv.pages('#milestone')
    path: ""
    id: Mlstn1
  - name: Parent
    type: File
    options:
      dvQueryString: dv.pages('#task').where(p => p.file.path != dv.current().file.path)
    path: ""
    id: PrNt01
  - name: BlockedBy
    type: MultiFile
    options:
      dvQueryString: dv.pages('#task')
    path: ""
    id: BlkBy1
  - name: Meeting
    type: File
    options:
      dvQueryString: dv.pages('#meeting')
    path: ""
    id: MtgLnk
  - name: StartDate
    type: DateTime
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: til3sq
  - name: DueDate
    type: DateTime
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: NwD7TV
  - name: Visibility
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": client facing
        "2": internal
    path: ""
    id: e9dEhN
  - name: Sessions
    type: File
    options:
      dvQueryString: dv.pages('#session')
    path: ""
    id: 5dx3XR
  - name: Company
    type: File
    options:
      dvQueryString: dv.pages('#crm_company')
    path: ""
    id: hiBFHM
  - name: Contact
    type: File
    options:
      dvQueryString: dv.pages('#crm_contact')
    path: ""
    id: j3OnRi
  - name: Estimate
    type: Number
    options: {}
    path: ""
    id: Estm01
  - name: Assignee
    type: File
    options:
      dvQueryString: dv.pages('#crm_contact')
    path: ""
    id: Asgn01
  - name: Executor
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Patrick
        "2": Code-Mac
        "3": Code-Win
        "4": Code-Work
        "5": Cowork
    path: ""
    id: ExctR1
  - name: SyncToReclaim
    type: Boolean
    options: {}
    path: ""
    id: RcSync
  - name: ReclaimTaskID
    type: Input
    options: {}
    path: ""
    id: RcTskI
  - name: UID
    type: Input
    options: {}
    path: ""
    id: TskUID
  - name: AutoSchedule
    type: Boolean
    options: {}
    path: ""
    id: TskAut
  - name: ScheduleMode
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": flexible
        "2": fixed
        "3": manual
    path: ""
    id: TskMod
  - name: MinBlockMin
    type: Number
    options: {}
    path: ""
    id: TskMin
  - name: MaxBlockMin
    type: Number
    options: {}
    path: ""
    id: TskMax
  - name: SchedulingPolicy
    type: File
    options:
      dvQueryString: dv.pages('#scheduling_policy')
    path: ""
    id: TskPol
  - name: Energy
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": deep
        "2": shallow
        "3": any
    path: ""
    id: TskEng
  - name: Repeat
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": daily
        "2": weekly
        "3": monthly
        "4": yearly
    path: ""
    id: RptSel
  - name: RepeatUntil
    type: Date
    options:
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: RptTil
  - name: Description
    type: Input
    options: {}
    path: ""
    id: Desc01
  - name: Completed_At
    type: Formula
    options:
      autoUpdate: false
      formula: 'current.Status === "🟢 COMPLETE" ? (current.Completed_At ? current.Completed_At : moment().format("YYYY-MM-DD HH:mm")) : null'
    path: ""
    id: 7p2gBP
version: "2.80"
limit: 20
mapWithTag: true
icon: square-check
tagNames:
  - task
filesPaths:
bookmarksGroups:
excludes:
extends:
savedViews:
  - name: TaskProperties
    children: []
    sorters: []
    filters:
      - id: task____file
        name: file
        query: ""
      - id: task____Status
        name: Status
        query: ⚪ TO DO
      - id: task____Priority
        name: Priority
        query: Medium
      - id: task____Phase
        name: Phase
        query: __existing__
      - id: task____Visibility
        name: Visibility
        query: __existing__
      - id: task____DueDate
        name: DueDate
        query: ""
      - id: task____StartDate
        name: StartDate
        query: ""
      - id: task____Contact
        name: Contact
        query: ""
      - id: task____Company
        name: Company
        query: ""
      - id: task____Sessions
        name: Sessions
        query: ""
      - id: task____Project
        name: Project
        query: ""
      - id: task____Completed_At
        name: Completed_At
        query: ""
    columns:
      - id: task____file
        name: file
        hidden: false
        position: 0
      - id: task____Status
        name: Status
        hidden: false
        position: 1
      - id: task____Priority
        name: Priority
        hidden: false
        position: 2
      - id: task____Phase
        name: Phase
        hidden: false
        position: 3
      - id: task____Visibility
        name: Visibility
        hidden: false
        position: 4
      - id: task____DueDate
        name: DueDate
        hidden: false
        position: 5
      - id: task____StartDate
        name: StartDate
        hidden: false
        position: 6
      - id: task____Contact
        name: Contact
        hidden: false
        position: 7
      - id: task____Company
        name: Company
        hidden: false
        position: 8
      - id: task____Sessions
        name: Sessions
        hidden: false
        position: 9
      - id: task____Project
        name: Project
        hidden: false
        position: 10
      - id: task____Completed_At
        name: Completed_At
        hidden: false
        position: 11
favoriteView:
fieldsOrder:
  - bivHya
  - rucFi4
  - SDrnNa
  - e9dEhN
  - NwD7TV
  - til3sq
  - j3OnRi
  - hiBFHM
  - 5dx3XR
  - GfCKwc
  - Mlstn1
  - PrNt01
  - BlkBy1
  - MtgLnk
  - Estm01
  - Asgn01
  - ExctR1
  - RcSync
  - RcTskI
  - TskUID
  - TskAut
  - TskMod
  - TskMin
  - TskMax
  - TskPol
  - TskEng
  - RptSel
  - RptTil
  - Desc01
  - 7p2gBP
---
