---
fileClass: crm_contacts
tags:
  - crm_contact
Type: Contact
contact.recordtype:
contact.title:
contact.email:
Company:
modified: 2026-06-30T17:42:05-06:00
---
<%*
const _name = await tp.system.prompt("Contact name", "New Contact");
if (_name) { await tp.file.rename(_name); }
-%>
# <% tp.file.title %>

> [!contact-info]+ Contact Information
> | | |
> |---|---|
> | **Name**<br>`= this.file.name` | **Type**<br>`INPUT[inlineSelect(option(Company), option(Contact)):Type]` |
> | **Contact Record Type**<br>`INPUT[inlineSelect(option(Decision Maker), option(Champion), option(Contact)):["contact.recordtype"]]` | **Title**<br>`INPUT[inlineSelect(option(CFO), option(Controller), option(VP Finance), option(FP&A Manager), option(Analyst)):["contact.title"]]` |
> | **Email**<br>`INPUT[text:["contact.email"]]` | **Timezone**<br>`INPUT[inlineList:Timezone]` |

## Profile

## Working notes

## Open threads

## Timeline
