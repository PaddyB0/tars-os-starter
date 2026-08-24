---
fileClass: project
tags:
  - project
Status: ⚪ planned
Type: Premium Success
Company:
Contacts:
ScopeCategory:
Scope_hrs:
HubIcon:
HubColor:
StartTime: <% tp.date.now("YYYY-MM-DD HH:mm") %>
sf.ProjectName:
sf.NotetoSETeam:
created: <% tp.file.creation_date("YYYY-MM-DD") %>
modified: <% tp.date.now("YYYY-MM-DDTHH:mm:ssZ") %>
---
<%*
const _name = await tp.system.prompt("Project name", "New Project");
if (_name) { await tp.file.rename(_name); }
-%>
# <% tp.file.title %>

## Overview


## Tasks
```base
filters:
  and:
    - file.inFolder("Tasks")
    - note.Project == this.file
views:
  - type: table
    name: tasks
    order:
      - file.name
      - note.Status
      - note.Priority
      - note.DueDate
  - type: table
    name: View

```
