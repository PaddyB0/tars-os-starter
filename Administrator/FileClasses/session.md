---
modified: 2026-07-15T15:20:42-06:00
fields:
  - name: Task
    type: File
    options:
      dvQueryString: dv.pages('#task')
    path: ""
    id: wsTNa1
  - name: Meeting
    type: File
    options:
      dvQueryString: dv.pages('#meeting')
    path: ""
    id: wsMet1
  - name: Project
    type: File
    options:
      dvQueryString: dv.pages('#project')
    path: ""
    id: wsPNa1
  - name: Company
    type: File
    options:
      dvQueryString: dv.pages('#crm_company')
    path: ""
    id: wsCom1
  - name: ReportingBucket
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Client Delivery
        "2": Internal Operations
        "3": TARS / OS
    path: ""
    id: wsRBk1
  - name: HoursType
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Billable
        "2": Non-billable
    path: ""
    id: wsHrs1
  - name: ActivityType
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Meeting
        "2": Build
        "3": Admin
    path: ""
    id: wsSTy1
  - name: Audience
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": External
        "2": Internal
    path: ""
    id: wsAud1
  - name: StartTime
    type: DateTime
    options:
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: wsStr1
  - name: EndTime
    type: DateTime
    options:
      dateFormat: YYYY-MM-DD HH:mm
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: wsEnd1
  - name: DurationMin
    type: Number
    options: {}
    path: ""
    id: wsDur1
  - name: ReclaimEventID
    type: Input
    options: {}
    path: ""
    id: wsEvt1
version: "2.83"
limit: 20
mapWithTag: false
icon: clock-fading
tagNames:
  - session
filesPaths:
  - Work Sessions
bookmarksGroups:
excludes:
fieldsOrder:
  - wsTNa1
  - wsMet1
  - wsPNa1
  - wsCom1
  - wsRBk1
  - wsHrs1
  - wsSTy1
  - wsAud1
  - wsStr1
  - wsEnd1
  - wsDur1
  - wsEvt1
savedViews: []
favoriteView:
---
