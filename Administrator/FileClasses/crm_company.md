---
fields:
  - name: Type
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Company
        "2": Contact
    path: ""
    id: crmTyp
  - name: Industry
    type: Multi
    options: {}
    path: ""
    id: crmInd
  - name: SubIndustry
    type: Multi
    options: {}
    path: ""
    id: crmSub
  - name: BillingAddress
    type: Input
    options: {}
    path: ""
    id: crmBil
  - name: sf.Url
    type: Input
    options: {}
    path: ""
    id: crmSfU
  - name: Timezone
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": EST
        "2": PST
        "3": MST
        "4": CDT
    path: ""
    id: jOpyGC
  - name: Project
    type: File
    options:
      dvQueryString: dv.pages('#project')
    path: ""
    id: IJcRgc
  - name: ContactName
    type: MultiFile
    options:
      dvQueryString: dv.pages('#crm_contact')
    path: ""
    id: XsN61S
  - name: GongTitleAliases
    type: Multi
    options: {}
    path: ""
    id: crmGtA
  - name: DossierUpdated
    type: Date
    options:
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: crmDsU
version: "2.31"
limit: 20
mapWithTag: true
icon: users-2
tagNames:
  - crm_company
filesPaths:
  - CRM/Clients
bookmarksGroups:
excludes:
extends:
savedViews: []
favoriteView:
fieldsOrder:
  - crmTyp
  - crmInd
  - crmSub
  - crmBil
  - crmSfU
  - jOpyGC
  - IJcRgc
  - XsN61S
  - crmGtA
  - crmDsU
modified: 2026-08-14T14:58:00-06:00
---
