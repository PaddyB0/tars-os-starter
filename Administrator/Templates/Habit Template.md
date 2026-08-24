---
# <%* const _uid = crypto.randomUUID(); const _name = await tp.system.prompt("Habit name", "New Habit"); if (_name) { await tp.file.rename(_name); } %>
fileClass: habit
UID: <% _uid %>
Status: paused
Priority: Medium
Cadence: weekly
TargetCount: 1
DaysOfWeek: []
DurationMin: 30
CatchUpPolicy: skip
CalendarVisibility: private
Description:
created: <% tp.file.creation_date("YYYY-MM-DD") %>
modified: <% tp.date.now("YYYY-MM-DDTHH:mm:ssZ") %>
tags:
  - habit
---

## Purpose

## Notes
