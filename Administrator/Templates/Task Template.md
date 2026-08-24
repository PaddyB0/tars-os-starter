---
# <%* const _uid = crypto.randomUUID(); const _name = await tp.system.prompt("Task name", "New Task"); if (_name) { await tp.file.rename(_name); } const _projects = app.vault.getMarkdownFiles().filter(f => f.path.startsWith("Projects/")); let _projLink = ""; if (_projects.length) { const _pick = await tp.system.suggester(f => f.basename, _projects, false, "Link to project (Esc = none)"); if (_pick) { _projLink = `"[[${_pick.basename}]]"`; } } %>
fileClass: task
UID: <% _uid %>
Status: ⚪ TO DO
Priority: Medium
Phase: Kick-Off
Visibility: client facing
Project: <% _projLink %>
Milestone:
Parent:
BlockedBy: []
Meeting:
Company:
Contact:
Assignee:
Executor:
StartDate: <% tp.date.now("YYYY-MM-DD HH:mm") %>
Estimate:
Description:
Sessions:
Repeat:
ReclaimTaskID:
AutoSchedule:
ScheduleMode: manual
MinBlockMin:
MaxBlockMin:
SchedulingPolicy:
Energy:
created: <% tp.file.creation_date("YYYY-MM-DD") %>
modified: 2026-07-30T20:00:00-06:00
cssclasses:
  - tars-task-note
tags:
  - task
SyncToReclaim:
---

### Description

### Progress Notes

### Time tracking

![[Work Sessions.base#By Task]]
