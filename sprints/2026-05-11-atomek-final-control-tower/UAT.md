# User Acceptance Tests

## UAT 1 — Start useful mission

Given Tytus tray is connected and Atomek opens  
When user sees the landing screen  
Then first action is clearly `Start team mission`  
And user sees live counts for local agents, pods, shared folders, app skills, AIL routes  
And no unexplained tiny controls dominate the first screen.

## UAT 2 — Repo repair team

Given user opens a repo/folder  
When user selects `Repo Repair Team` and starts mission  
Then Atomek creates complete mission folder  
And assigns implementer/reviewer roles from available local agents  
And creates tasks  
And local agent run writes transcript under `runs/`  
And patch-like output appears in approval inbox.

## UAT 3 — Pod critique

Given pod agents are ready  
When user assigns `Ask pod for critique` to a task  
Then Atomek shows pod cost/unit info  
And dispatches through same-origin host/tray bridge  
And saves pod transcript under `runs/`  
And timeline shows pod output.

## UAT 4 — Shared folder team desk

Given a shared folder is bound  
When user attaches it to mission  
Then Atomek shows local path, bucket label, and provisioned pods  
And writes shared-folder usage into `RESOURCES.md` / `MISSION.json`  
And user understands this is where agents exchange files.

## UAT 5 — App skill handoff

Given JULI3TA is installed/available  
When user creates a creative task and sends it to JULI3TA  
Then Atomek opens/dispatches JULI3TA with mission context  
And records output artifact/handoff path in mission folder.

## UAT 6 — Approval gate

Given any agent proposes file edits  
When output contains unified diff/replacement  
Then Atomek stores proposal  
And shows approval card  
And user can preview/apply/reject  
And audit log records decision.

## UAT 7 — Resume mission

Given a mission from yesterday exists  
When user opens Atomek and clicks resume  
Then Mission Board reconstructs goal, resources, tasks, runs, outputs, approvals from mission folder/host API.

## UAT 8 — Responsive sanity

Given Tytus window is resized to screenshot-like sizes  
When user navigates Team Mission, Mission Board, Resource Setup, Chat, Editor  
Then panels do not crush each other  
And chat remains selectable/copyable  
And code blocks remain copyable.
