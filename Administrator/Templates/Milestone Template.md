---
# <%* const _name = await tp.system.prompt("Milestone name", "New Milestone"); const _projects = app.vault.getMarkdownFiles().filter(f => f.path.startsWith("Projects/")); const _project = await tp.system.suggester(f => f.basename, _projects, true, "Link to project"); if (_project && _name) { await tp.file.rename(`${_project.basename} - MS - ${_name}`); } %>
fileClass: milestone
Project: "[[<% _project?.basename ?? "" %>]]"
Description:
created: <% tp.file.creation_date("YYYY-MM-DD") %>
modified: <% tp.date.now("YYYY-MM-DDTHH:mm:ssZ") %>
tags:
  - milestone
---

# <% _name %>
