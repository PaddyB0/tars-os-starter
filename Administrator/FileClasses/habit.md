---
modified: 2026-08-03T13:56:23-06:00
fields:
  - name: UID
    type: Input
    options: {}
    path: ""
    id: HbtUID
  - name: Status
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": active
        "2": paused
        "3": retired
    path: ""
    id: HbtSta
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
    id: HbtPri
  - name: Cadence
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": daily
        "2": weekly
    path: ""
    id: HbtCad
  - name: TargetCount
    type: Number
    options: {}
    path: ""
    id: HbtCnt
  - name: DaysOfWeek
    type: Multi
    options:
      sourceType: ValuesList
      valuesList:
        "1": monday
        "2": tuesday
        "3": wednesday
        "4": thursday
        "5": friday
        "6": saturday
        "7": sunday
    path: ""
    id: HbtDay
  - name: DurationMin
    type: Number
    options: {}
    path: ""
    id: HbtDur
  - name: EarliestTime
    type: Input
    options: {}
    path: ""
    id: HbtEar
  - name: PreferredTime
    type: Input
    options: {}
    path: ""
    id: HbtPre
  - name: LatestTime
    type: Input
    options: {}
    path: ""
    id: HbtLat
  - name: SchedulingPolicy
    type: File
    options:
      dvQueryString: dv.pages('#scheduling_policy')
    path: ""
    id: HbtPol
  - name: CatchUpPolicy
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": skip
        "2": rollover-once
        "3": catch-up-capped
    path: ""
    id: HbtCUp
  - name: CalendarVisibility
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": default
        "2": private
    path: ""
    id: HbtVis
  - name: StartDate
    type: Date
    options:
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: HbtStr
  - name: EndDate
    type: Date
    options:
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: HbtEnd
  - name: Description
    type: Input
    options: {}
    path: ""
    id: HbtDsc
version: "1.0"
limit: 20
mapWithTag: true
icon: repeat-2
tagNames:
  - habit
filesPaths:
  - Habits
bookmarksGroups:
excludes:
extends:
savedViews: []
favoriteView:
fieldsOrder:
  - HbtUID
  - HbtSta
  - HbtPri
  - HbtCad
  - HbtCnt
  - HbtDay
  - HbtDur
  - HbtEar
  - HbtPre
  - HbtLat
  - HbtPol
  - HbtCUp
  - HbtVis
  - HbtStr
  - HbtEnd
  - HbtDsc
---
