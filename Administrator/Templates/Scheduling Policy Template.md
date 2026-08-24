---
# <%* const _uid = crypto.randomUUID(); const _name = await tp.system.prompt("Scheduling policy name", "Scheduling Policy - Default Workweek"); if (_name) { await tp.file.rename(_name); } %>
fileClass: scheduling_policy
UID: <% _uid %>
Timezone: America/Edmonton
MondayWindow: 08:30-17:00
TuesdayWindow: 08:30-17:00
WednesdayWindow: 08:30-17:00
ThursdayWindow: 08:30-17:00
FridayWindow: 08:30-16:00
MeetingWindow: 09:00-16:00
# Optional DeepWorkWindow, ShallowWorkWindow, and NormalHoursWindow use HH:mm-HH:mm.
# Omit an unused preference key; a present blank value is invalid.
DefaultTaskMinBlockMin: 30
DefaultTaskMaxBlockMin: 120
DefaultHabitDurationMin: 30
DailyCapacityMin: 420
WeeklyCapacityMin: 2100
MeetingPrepMin: 10
TravelBufferMin: 0
DecompressionMin: 10
WorkBreakMin: 5
SoftFreezeHours: 24
HardLockHours: 2
TargetCalendar: TARS Schedule
DefaultVisibility: private
ApplyMode: assisted
Description: Default workweek scheduling policy
created: <% tp.file.creation_date("YYYY-MM-DD") %>
modified: <% tp.date.now("YYYY-MM-DDTHH:mm:ssZ") %>
tags:
  - scheduling_policy
---

## Operating notes
