---
limit: 20
mapWithTag: true
icon: user-2
tagNames:
  - crm_contact
filesPaths:
  - CRM/Contacts
bookmarksGroups:
excludes:
  - Industry
  - SubIndustry
  - BillingAddress
  - sf.Url
  - Project
  - ContactName
extends: crm_company
savedViews: []
favoriteView:
fieldsOrder:
  - R3KRYz
  - crmTtl
  - k0y9lY
  - crmCmp
version: "2.13"
modified: 2026-07-02T14:25:13-06:00
fields:
  - name: contact.email
    type: Input
    options: {}
    path: ""
    id: k0y9lY
  - name: contact.title
    type: Input
    options: {}
    path: ""
    id: crmTtl
  - name: contact.recordtype
    type: Select
    options:
      sourceType: ValuesList
      valuesList:
        "1": Decision Maker
        "2": Champion
        "3": Contact
    path: ""
    id: R3KRYz
  - name: Company
    type: File
    options:
      dvQueryString: dv.pages('#crm_company')
    path: ""
    id: crmCmp
---
