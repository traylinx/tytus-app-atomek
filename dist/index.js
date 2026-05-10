const __tytusWorkbenchCss=":root{--workbench-bg: #1e1e1e;--workbench-side: #181818;--workbench-panel: #252526;--workbench-panel-2: #1f1f1f;--workbench-border: #2d2d30;--workbench-border-strong: #3c3c3c;--workbench-text: #cccccc;--workbench-muted: #858585;--workbench-blue: #007acc;--workbench-blue-2: #3794ff;--workbench-purple: #7c4dff;--workbench-input: #3c3c3c}.workbench-workbench{width:100%;height:100%;min-height:0;display:grid;grid-template-columns:48px minmax(0,var(--workbench-primary-width, 300px)) minmax(360px,1fr) minmax(0,var(--workbench-secondary-width, 520px));grid-template-rows:minmax(0,1fr) 22px;color:var(--workbench-text);background:var(--workbench-bg);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:13px;overflow:hidden}.workbench-workbench.no-primary{grid-template-columns:48px 0 minmax(360px,1fr) minmax(0,var(--workbench-secondary-width, 430px))}.workbench-workbench.no-secondary{grid-template-columns:48px minmax(0,var(--workbench-primary-width, 300px)) minmax(360px,1fr) 0}.workbench-workbench.no-primary .workbench-statusbar{grid-column:3 / 5}.workbench-workbench.no-primary.no-secondary .workbench-statusbar{grid-column:3 / 4}button{font:inherit}.workbench-activity-bar{grid-row:1 / 3;background:#181818;border-right:1px solid var(--workbench-border);display:flex;flex-direction:column;align-items:center;padding:8px 0;gap:4px}.workbench-activity-spacer{flex:1}.workbench-activity-button{width:48px;height:46px;border:0;background:transparent;color:#858585;display:grid;place-items:center;cursor:pointer;position:relative}.workbench-activity-button:hover,.workbench-activity-button.active{color:#fff}.workbench-activity-button.active:before{content:\"\";position:absolute;left:0;top:6px;bottom:6px;width:2px;background:var(--workbench-blue)}.workbench-primary-region{grid-column:2 / 3;grid-row:1 / 2;min-width:0;min-height:0;position:relative;display:grid}.workbench-primary-region .workbench-sidebar{height:100%}.workbench-primary-resizer{position:absolute;right:-4px;top:0;bottom:0;width:7px;cursor:col-resize;z-index:5}.workbench-primary-resizer:hover{background:var(--workbench-blue)}.workbench-sidebar{background:var(--workbench-panel);border-right:1px solid var(--workbench-border);min-width:0;overflow:hidden;display:flex;flex-direction:column}.workbench-sidebar-title{height:35px;display:flex;align-items:center;padding:0 16px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#bbb}.workbench-sidebar-scroll{overflow:auto;padding:0 12px 16px}.workbench-section-title{margin:12px 0 6px;color:#bbb;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}.workbench-muted{color:var(--workbench-muted)}.workbench-button-blue{width:100%;height:31px;border:0;border-radius:2px;background:#0e639c;color:#fff;cursor:pointer;margin:4px 0}.workbench-button-blue:hover{background:#17b}.workbench-button-subtle{height:28px;border:1px solid var(--workbench-border-strong);border-radius:2px;background:#2d2d2d;color:var(--workbench-text);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 10px}.workbench-button-subtle:hover{background:#373737}.workbench-button-subtle.full{width:100%;margin:4px 0}.workbench-sidebar-actions{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:6px 0 8px}.workbench-input{width:100%;height:30px;border:1px solid var(--workbench-border-strong);border-radius:2px;background:var(--workbench-input);color:var(--workbench-text);padding:0 9px;outline:none;box-sizing:border-box}.workbench-input:focus{border-color:var(--workbench-blue)}.workbench-file-row,.workbench-tree-row,.workbench-folder-row{width:100%;min-height:24px;border:0;border-radius:2px;background:transparent;color:var(--workbench-text);display:flex;align-items:center;gap:6px;padding:3px 6px 3px calc(6px + (var(--workbench-depth, 0) * 12px));text-align:left;cursor:pointer}.workbench-folder-row{width:100%;border:0;background:transparent;cursor:pointer;color:#c9c9c9;font-weight:550}.workbench-file-row:hover,.workbench-tree-row:hover,.workbench-folder-row:hover{background:#2a2d2e}.workbench-file-row.active,.workbench-tree-row.active{background:#37373d;color:#fff}.workbench-row-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-row-meta{margin-left:auto;color:var(--workbench-muted);font-size:11px}.workbench-chevron-collapsed{transform:rotate(-90deg)}.workbench-search-group{margin:4px 0 10px}.workbench-search-hit{width:calc(100% - 18px);min-height:23px;margin-left:18px;border:0;border-radius:3px;background:transparent;color:var(--workbench-text);display:grid;grid-template-columns:32px minmax(0,1fr);gap:7px;align-items:center;padding:3px 6px;text-align:left;cursor:pointer}.workbench-search-hit:hover{background:#2a2d2e}.workbench-search-hit span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-search-line{color:var(--workbench-muted);font-variant-numeric:tabular-nums;text-align:right}.workbench-search-more{margin:2px 0 0 56px;color:var(--workbench-muted);font-size:11px}.workbench-breadcrumb{height:24px;border-bottom:1px solid var(--workbench-border);background:#1e1e1e;color:var(--workbench-muted);display:flex;align-items:center;gap:6px;padding:0 12px;min-width:0;overflow:hidden;font-size:12px}.workbench-breadcrumb-part{display:inline-flex;align-items:center;gap:6px;min-width:0;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-breadcrumb-sep{color:#666}.workbench-editor-area{grid-column:3 / 4;grid-row:1 / 2;min-width:0;min-height:0;display:grid;grid-template-rows:35px 1fr;background:var(--workbench-bg)}.workbench-command-center{height:35px;border:0;border-bottom:1px solid var(--workbench-border);display:grid;place-items:center;color:var(--workbench-muted);font-size:12px;background:#1b1b1c;cursor:pointer}.workbench-command-center:hover{color:#d4d4d4;background:#202022}.workbench-editor-stack{min-height:0;display:grid;grid-template-rows:35px 24px minmax(0,1fr)}.workbench-workbench.has-bottom-panel .workbench-editor-stack{grid-template-rows:35px 24px minmax(0,1fr) 172px}.workbench-editor-stack:has(.workbench-ai-dirty-banner){grid-template-rows:35px 24px auto minmax(0,1fr)}.workbench-workbench.has-bottom-panel .workbench-editor-stack:has(.workbench-ai-dirty-banner){grid-template-rows:35px 24px auto minmax(0,1fr) 172px}.workbench-tabs{height:35px;border-bottom:1px solid var(--workbench-border);display:flex;align-items:stretch;min-width:0;overflow:hidden;background:#252526}.workbench-tab{min-width:120px;max-width:240px;border:0;border-right:1px solid var(--workbench-border);border-top:1px solid transparent;background:#2d2d2d;color:var(--workbench-text);display:flex;align-items:center;gap:7px;padding:0 9px;cursor:pointer}.workbench-tab.active{background:var(--workbench-bg);border-top-color:var(--workbench-blue);color:#fff}.workbench-tab-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-tab-close{margin-left:auto;border:0;color:inherit;background:transparent;width:18px;height:18px;border-radius:3px;display:grid;place-items:center;cursor:pointer}.workbench-tab-close:hover{background:#444}.workbench-dirty-dot{color:#fff;margin-right:6px}.workbench-tab-save{margin-left:auto;height:18px;padding:0 7px;border-radius:5px;border:1px solid var(--border-subtle, #3a3a40);background:#7c4dff29;color:#d9ccff;display:none;align-items:center;font-size:11px}.workbench-tab.active .workbench-tab-save,.workbench-tab:hover .workbench-tab-save{display:inline-flex}.workbench-tab:has(.workbench-tab-save) .workbench-tab-close{margin-left:2px}.workbench-editor-content{min-height:0;position:relative}.workbench-no-editor{height:100%;display:grid;place-content:center;gap:12px;justify-items:center;color:var(--workbench-muted);background:var(--workbench-bg)}.workbench-no-editor p{margin:0}.workbench-welcome{position:relative;height:100%;overflow:auto;padding:clamp(28px,7vh,92px) clamp(24px,6vw,88px);box-sizing:border-box;background:var(--workbench-bg);color:var(--workbench-text)}.workbench-welcome-grid{width:min(100%,980px);margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(24px,5vw,80px);align-items:start}.workbench-welcome h1{margin:0;font-weight:400;font-size:34px;color:#d4d4d4}.workbench-welcome h2{margin:28px 0 12px;font-size:20px;font-weight:600;color:#d4d4d4}.workbench-welcome-subtitle{color:#a7a7a7;font-size:16px;margin-top:2px}.workbench-start-link{display:flex;align-items:center;gap:8px;border:0;background:transparent;color:var(--workbench-blue-2);padding:5px 0;cursor:pointer;text-align:left}.workbench-start-link:hover{text-decoration:underline}.workbench-walkthrough-card{min-height:54px;border:1px solid transparent;border-radius:4px;background:#2d2d2d;color:var(--workbench-text);margin:8px 0;padding:10px 14px;box-sizing:border-box}.workbench-walkthrough-card strong{display:block;color:#d4d4d4;margin-bottom:4px}.workbench-welcome-checkbox{position:absolute;left:50%;bottom:34px;transform:translate(-50%);display:flex;align-items:center;gap:8px;color:#bdbdbd;white-space:nowrap}.workbench-secondary{grid-column:4 / 5;grid-row:1 / 2;min-width:0;min-height:0;background:var(--workbench-side);border-left:1px solid var(--workbench-border);display:grid;grid-template-rows:35px minmax(0,1fr);position:relative}.workbench-secondary-resizer{position:absolute;left:-4px;top:0;bottom:0;width:7px;cursor:col-resize;z-index:4}.workbench-secondary-resizer:hover{background:var(--workbench-blue)}.workbench-secondary-tabs{display:flex;align-items:end;justify-content:space-between;border-bottom:1px solid var(--workbench-border);padding-left:12px;padding-right:8px}.workbench-secondary-tab-group{display:flex;align-items:end}.workbench-secondary-tab{height:34px;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--workbench-muted);font-size:11px;font-weight:700;letter-spacing:.04em;cursor:pointer;padding:0 10px}.workbench-secondary-tab.active{color:#fff;border-bottom-color:var(--workbench-blue)}.workbench-secondary-actions{display:flex;align-items:center;gap:2px;height:34px}.workbench-secondary-actions button{width:26px;height:26px;border:0;border-radius:3px;color:var(--workbench-muted);background:transparent;display:grid;place-items:center;cursor:pointer}.workbench-secondary-actions button:hover{background:#2d2d2d;color:#fff}.workbench-chat-empty{height:100%;display:grid;place-items:center;text-align:center;padding:24px;box-sizing:border-box;color:#bdbdbd}.workbench-chat-empty svg{color:#cfcfcf;margin-bottom:16px}.workbench-chat-empty h3{margin:0 0 8px;font-size:15px;color:var(--workbench-text)}.workbench-chat-empty p{margin:4px auto;max-width:260px;line-height:1.45}.workbench-chat-empty-link{color:var(--workbench-blue-2)}.workbench-chat-wrap{min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto}.workbench-chat-threadbar{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:6px;padding:10px 12px 0;background:var(--workbench-side)}.workbench-chat-threadbar select,.workbench-chat-threadbar button{height:26px;min-width:0;border:1px solid var(--workbench-border-strong);border-radius:5px;background:#252526;color:var(--workbench-text);font-size:11px}.workbench-chat-threadbar select{padding:0 7px}.workbench-chat-threadbar button{padding:0 8px;cursor:pointer}.workbench-chat-threadbar button:disabled,.workbench-chat-threadbar select:disabled{opacity:.5;cursor:not-allowed}.workbench-chat-transcript{overflow:auto;padding:12px;min-height:0;user-select:text;-webkit-user-select:text}.workbench-chat-message{border:1px solid var(--workbench-border-strong);background:#252526;border-radius:4px;padding:12px;margin-bottom:10px;line-height:1.45;user-select:text;-webkit-user-select:text}.workbench-chat-message.user{border-color:#315f8a}.workbench-chat-message-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.06)}.workbench-chat-message-actions button{height:26px;border:1px solid rgba(255,255,255,.08);border-radius:999px;background:#ffffff09;color:var(--text-secondary, #b9b9c1);cursor:pointer;display:inline-flex;align-items:center;gap:5px;padding:0 9px;font-size:11px;font-weight:600;line-height:1}.workbench-chat-message-actions button:hover:not(:disabled){background:#ffffff12;border-color:var(--border-focus, rgba(124, 77, 255, .55));color:#fff}.workbench-chat-message-actions button:disabled{cursor:not-allowed;opacity:.42}.workbench-chat-message-actions button.regen{color:#f2d2ec;border-color:#d85cae4d;background:#d85cae14}.workbench-chat-message-actions button.regen:hover:not(:disabled){border-color:#eb72bda6;background:#d85cae29}.workbench-rich-body{margin-top:6px;color:var(--workbench-text);user-select:text;-webkit-user-select:text;cursor:text}.workbench-rich-markdown{user-select:text;-webkit-user-select:text}.workbench-rich-markdown>:first-child{margin-top:0}.workbench-rich-markdown>:last-child{margin-bottom:0}.workbench-rich-markdown p{margin:0 0 9px}.workbench-rich-markdown ul,.workbench-rich-markdown ol{margin:7px 0 10px 18px;padding:0}.workbench-rich-markdown li{margin:3px 0}.workbench-rich-markdown h1,.workbench-rich-markdown h2,.workbench-rich-markdown h3{margin:12px 0 7px;color:#f2f2f4;line-height:1.2}.workbench-rich-markdown h1{font-size:18px}.workbench-rich-markdown h2{font-size:16px}.workbench-rich-markdown h3{font-size:14px}.workbench-rich-markdown a{color:var(--workbench-blue-2)}.workbench-rich-markdown code{border:1px solid rgba(255,255,255,.08);border-radius:4px;background:#00000040;color:#e7d8ff;padding:1px 4px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,monospace;font-size:.94em;user-select:text;-webkit-user-select:text}.workbench-rich-code{overflow:hidden;margin:10px 0 12px;border:1px solid rgba(255,255,255,.09);border-radius:8px;background:#171719;user-select:text;-webkit-user-select:text}.workbench-rich-code-head{min-height:30px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 8px 0 10px;border-bottom:1px solid rgba(255,255,255,.07);background:#232326}.workbench-rich-code-head span{color:var(--workbench-muted);font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;user-select:text;-webkit-user-select:text}.workbench-rich-code-head button{height:22px;display:inline-flex;align-items:center;gap:4px;border:1px solid rgba(255,255,255,.08);border-radius:999px;background:#ffffff0a;color:#d6d6dc;cursor:pointer;font-size:11px;user-select:none;-webkit-user-select:none}.workbench-rich-code-head button:hover{border-color:#7c4dff8c;background:#7c4dff29;color:#fff}.workbench-rich-code pre{margin:0;padding:12px;overflow:auto;color:#e6e6ea;background:#171719;font-size:12px;line-height:1.5;user-select:text;-webkit-user-select:text;cursor:text}.workbench-rich-code code{padding:0;border:0;background:transparent;color:inherit;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,monospace;white-space:pre;user-select:text;-webkit-user-select:text;cursor:text}.workbench-chat-composer{padding:0 12px 12px;border-top:1px solid var(--workbench-border);background:var(--workbench-side)}.workbench-chat-tip{margin:10px 0 6px;padding:7px 9px;border:1px solid var(--workbench-border-strong);border-radius:3px 3px 0 0;color:var(--workbench-muted);font-size:12px;background:#252526;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:8px}.workbench-chat-tip span{color:var(--workbench-blue-2);font-weight:700}.workbench-chat-tip strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--workbench-text);font-weight:600}.workbench-chat-tip em{color:var(--workbench-muted);font-style:normal}.workbench-chat-box{border:1px solid #3c3c3c;border-radius:2px;background:#1e1e1e;box-shadow:0 12px 28px #0003}.workbench-chat-attachments{min-height:28px;display:flex;align-items:center;gap:6px;padding:5px 8px 0}.workbench-chat-attachments button,.workbench-chat-send,.workbench-chat-mode{border:0;border-radius:3px;background:#2d2d2d;color:var(--workbench-text);cursor:pointer}.workbench-chat-attachments button{width:24px;height:24px;display:grid;place-items:center}.workbench-chat-chip{max-width:270px;display:inline-flex;align-items:center;gap:5px;padding:3px 7px;border-radius:3px;background:#2a2d2e;color:#cfcfcf;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-chat-chip-button{height:23px;border:1px solid var(--border-subtle, #34343a)!important;border-radius:999px!important;background:#24272a!important;color:#d7d7d7!important;padding:0 9px;width:auto!important;font-size:11px}.workbench-chat-chip-button:hover:not(:disabled){border-color:var(--border-focus, rgba(124, 77, 255, .55))!important;background:#2e3338!important}.workbench-chat-chip-button:disabled{cursor:not-allowed;opacity:.45}.workbench-chat-textarea{width:100%;min-height:92px;max-height:220px;resize:vertical;border:0;outline:none;background:transparent;color:var(--workbench-text);padding:7px 10px;box-sizing:border-box;font:inherit;line-height:1.45}.workbench-chat-toolbar{height:32px;display:grid;grid-template-columns:auto auto 1fr auto;align-items:center;gap:6px;padding:0 8px 8px}.workbench-chat-mode{height:24px;padding:0 8px;display:inline-flex;align-items:center;gap:4px;color:#cfcfcf}.workbench-chat-send{width:28px;height:26px;display:grid;place-items:center;background:#2d2d2d;color:#fff}.workbench-chat-send:disabled{cursor:not-allowed;opacity:.5}.workbench-chat-send.stop{background:#b64a4a}.workbench-settings-tab{height:100%;min-height:0;overflow:auto;background:var(--workbench-bg);color:var(--workbench-text)}.workbench-settings-page{width:min(100%,980px);min-height:100%;margin:0 auto;display:flex;flex-direction:column;overflow:hidden;border-left:1px solid var(--workbench-border);border-right:1px solid var(--workbench-border);background:var(--workbench-panel)}.workbench-settings-header{height:48px;min-height:48px;display:flex;align-items:center;gap:9px;padding:0 16px;color:var(--workbench-text);border-bottom:1px solid var(--workbench-border);background:var(--workbench-side)}.workbench-settings-header svg{color:var(--workbench-blue-2)}.workbench-settings-header button{margin-left:auto;width:28px;height:28px;border:0;border-radius:4px;background:transparent;color:var(--workbench-muted);cursor:pointer;display:grid;place-items:center}.workbench-settings-header button:hover{background:#2d2d2d;color:#fff}.workbench-settings-body{overflow:visible;padding:clamp(14px,2.4vw,24px);display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}.workbench-settings-section{border:1px solid var(--workbench-border);border-radius:8px;background:#202020;padding:14px}.workbench-settings-section h3{margin:0 0 6px;font-size:13px;color:var(--workbench-text)}.workbench-settings-section p{margin:0 0 14px;color:var(--workbench-muted);font-size:12px;line-height:1.45}.workbench-settings-label{display:grid;gap:6px;margin-top:12px;font-size:11px;font-weight:700;color:#bbb;text-transform:uppercase;letter-spacing:.04em}.workbench-settings-label select,.workbench-settings-label input{height:32px;border:1px solid var(--workbench-border-strong);border-radius:5px;background:#1b1b1b;color:var(--workbench-text);padding:0 10px;outline:none;font:inherit;text-transform:none;letter-spacing:normal}.workbench-settings-label input{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}.workbench-settings-label select:focus,.workbench-settings-label input:focus{border-color:var(--workbench-blue)}.workbench-settings-note{margin-top:12px;padding:9px 10px;border:1px solid var(--workbench-border);border-radius:6px;background:#252526;color:var(--workbench-muted);font-size:12px}.workbench-settings-footer{min-height:48px;display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:0 16px;border-top:1px solid var(--workbench-border);background:var(--workbench-side)}.workbench-settings-footer button{height:30px;border:1px solid var(--workbench-border-strong);border-radius:5px;background:#2d2d2d;color:var(--workbench-text);cursor:pointer;padding:0 12px}.workbench-settings-footer button:hover{background:#383838;color:#fff}.workbench-panel-list{overflow:auto;padding:12px}.workbench-panel-list.compact{padding:0}.workbench-output-card{border:1px solid var(--workbench-border-strong);background:#252526;border-radius:4px;padding:12px;margin-bottom:10px;user-select:text;-webkit-user-select:text}.workbench-output-head{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px}.workbench-output-head strong{flex:1 1 160px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-output-head span{color:var(--workbench-muted);font-size:11px}.workbench-output-head button{height:22px;border:1px solid var(--border-subtle, #34343a);border-radius:6px;background:transparent;color:var(--workbench-muted);cursor:pointer;font-size:11px}.workbench-output-head button:hover{color:var(--workbench-text);background:var(--tytus-hover, #313131)}.workbench-output-head .workbench-output-edit-cta{border-color:#7c4dffb3;color:#fff;background:#7c4dff2e}.workbench-bottom-panel{min-height:0;border-top:1px solid var(--workbench-border);background:var(--workbench-bg);display:grid;grid-template-rows:32px minmax(0,1fr)}.workbench-bottom-tabs{height:32px;display:grid;grid-template-columns:repeat(3,auto) 1fr auto;align-items:end;gap:14px;padding:0 10px;border-bottom:1px solid var(--workbench-border);background:var(--bg-titlebar, #202022)}.workbench-bottom-tabs button{height:31px;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--workbench-muted);font-size:11px;font-weight:700;letter-spacing:.04em;cursor:pointer}.workbench-bottom-tabs button.active{color:#fff;border-bottom-color:var(--workbench-blue)}.workbench-bottom-tabs button:last-child{width:26px;border-radius:4px;display:grid;place-items:center}.workbench-bottom-tabs button:last-child:hover{background:var(--tytus-hover, #313131);color:#fff}.workbench-bottom-body{min-height:0;overflow:auto;padding:12px}.workbench-terminal-placeholder{margin:10px 0 0;padding:10px 12px;border:1px solid var(--workbench-border-strong);border-radius:7px;background:#101010;color:#d7d7d7}.workbench-command-overlay{position:absolute;inset:0;z-index:30;background:#0000002e;display:flex;align-items:flex-start;justify-content:center;padding-top:18px}.workbench-command-palette{width:min(640px,calc(100% - 80px));border:1px solid #454545;border-radius:8px;background:#252526;box-shadow:0 18px 44px #00000073;overflow:hidden}.workbench-command-input{width:100%;height:38px;border:0;border-bottom:1px solid var(--workbench-border);outline:none;background:#1f1f1f;color:var(--workbench-text);padding:0 12px;box-sizing:border-box;font:inherit}.workbench-command-list{max-height:360px;overflow:auto;padding:6px}.workbench-command-item{width:100%;min-height:42px;border:0;border-radius:4px;background:transparent;color:var(--workbench-text);display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:7px 10px;text-align:left;cursor:pointer}.workbench-command-item:hover{background:#094771}.workbench-command-item:disabled{cursor:not-allowed;opacity:.45}.workbench-command-item small{color:var(--workbench-muted);font-size:11px}.workbench-edit-review-overlay{position:absolute;inset:0;z-index:40;background:#0000007a;display:grid;place-items:center;padding:24px}.workbench-edit-review{width:min(1180px,calc(100vw - 80px));height:min(760px,calc(100vh - 100px));border:1px solid var(--workbench-border-strong);border-radius:10px;background:#1e1e1e;box-shadow:0 24px 64px #0000008c;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto;overflow:hidden}.workbench-edit-review.workspace{width:min(980px,calc(100vw - 80px))}.workbench-edit-review-head{height:48px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 14px;border-bottom:1px solid var(--workbench-border);background:var(--bg-titlebar, #202022)}.workbench-edit-review-head div{min-width:0;display:flex;flex-direction:column;gap:2px}.workbench-edit-review-head strong{color:var(--workbench-text)}.workbench-edit-review-head span{max-width:720px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--workbench-muted);font-size:12px}.workbench-edit-review-head button{width:30px;height:30px;border:0;border-radius:6px;background:transparent;color:var(--workbench-muted);display:grid;place-items:center;cursor:pointer}.workbench-edit-review-head button:hover{background:var(--tytus-hover, #313131);color:#fff}.workbench-edit-review-meta{min-height:34px;display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:7px 14px;border-bottom:1px solid var(--workbench-border);color:var(--workbench-muted);font-size:12px}.workbench-edit-review-meta span{border:1px solid var(--border-subtle, #34343a);border-radius:999px;padding:3px 8px;background:#242424}.workbench-edit-review-grid{min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1px;background:var(--workbench-border)}.workbench-edit-review-pane{min-width:0;min-height:0;display:grid;grid-template-rows:32px minmax(0,1fr);background:#1e1e1e}.workbench-edit-review-pane h4{margin:0;padding:8px 12px;border-bottom:1px solid var(--workbench-border);color:var(--workbench-muted);font-size:11px;letter-spacing:.05em;text-transform:uppercase}.workbench-edit-review-pane.proposed h4{color:var(--workbench-blue-2)}.workbench-edit-review-pane pre{margin:0;padding:12px;overflow:auto;white-space:pre;color:#d7d7d7;font-family:var(--mono, \"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace);font-size:12px;line-height:1.45}.workbench-workspace-patch-list{min-height:0;overflow:auto;padding:12px}.workbench-workspace-patch-card{border:1px solid var(--workbench-border-strong);border-radius:8px;background:#252526;margin-bottom:10px;overflow:hidden}.workbench-workspace-patch-card.skipped{border-color:#ffbe5c59}.workbench-workspace-patch-card header{min-height:34px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;padding:8px 10px;border-bottom:1px solid var(--workbench-border)}.workbench-workspace-patch-card header strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-workspace-patch-card header span{color:var(--workbench-muted);font-size:11px}.workbench-workspace-patch-card pre{max-height:260px;margin:0;padding:10px;overflow:auto;color:#d7d7d7;white-space:pre;font-family:var(--mono, \"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace);font-size:11px;line-height:1.45}.workbench-edit-review-actions{height:52px;display:flex;justify-content:flex-end;align-items:center;gap:8px;padding:0 14px;border-top:1px solid var(--workbench-border);background:var(--bg-titlebar, #202022)}.workbench-button-primary{height:30px;border:0;border-radius:7px;background:var(--workbench-blue);color:#fff;padding:0 12px;cursor:pointer}.workbench-button-primary:hover{filter:brightness(1.08)}.workbench-ai-dirty-banner{display:flex;align-items:center;gap:8px;min-height:32px;padding:0 10px;border-bottom:1px solid rgba(255,184,77,.35);background:#ffb84d1f;color:#ffd28a;font-size:12px}.workbench-ai-dirty-banner span{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-ai-dirty-banner button{height:22px;border:1px solid rgba(255,210,138,.55);border-radius:5px;background:#ffffff0d;color:#ffd28a;cursor:pointer}.workbench-statusbar{grid-column:3 / 5;grid-row:2 / 3;height:22px;background:var(--workbench-blue);color:#fff;display:flex;align-items:center;gap:12px;padding:0 10px;font-size:12px;min-width:0}.workbench-status-spacer{flex:1}.workbench-problems-panel{height:152px;border-top:1px solid var(--workbench-border);background:var(--workbench-bg);display:grid;grid-template-rows:30px 1fr}.workbench-panel-tabs{display:flex;gap:18px;align-items:center;padding:0 12px;color:var(--workbench-muted);font-size:11px;font-weight:700}.workbench-panel-tabs span:first-child{color:#fff;border-bottom:1px solid var(--workbench-blue);height:29px;display:flex;align-items:center}.workbench-panel-body{padding:12px;color:var(--workbench-muted)}.workbench-empty-pane{padding:14px;color:var(--workbench-muted)}.workbench-extension-card{border:1px solid var(--workbench-border-strong);background:#252526;padding:12px;margin-bottom:8px}.workbench-extension-card strong{display:block;margin-bottom:4px}.workbench-inline-error{border:1px solid rgba(244,115,115,.35);background:#f473731f;color:#ffb4b4;padding:9px 10px;margin:8px 0;font-size:12px}.workbench-computer-hero{display:flex;gap:10px;border:1px solid var(--workbench-border-strong);background:#252526;padding:12px;margin-bottom:8px}.workbench-computer-hero strong{display:block;margin-bottom:4px}.workbench-computer-refresh{width:100%;display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px}.workbench-computer-list{display:grid;gap:8px;margin:8px 0 14px}.workbench-computer-explainer{border:1px solid rgba(86,156,214,.24);background:#569cd612;color:var(--workbench-muted);display:grid;gap:6px;padding:9px 10px;margin:10px 0 12px;font-size:11px;line-height:1.4}.workbench-computer-explainer strong{color:var(--workbench-text);font-size:12px}.workbench-computer-explainer b{color:var(--workbench-text);font-weight:700}.workbench-computer-explainer code{color:#d7ba7d;background:#0003;border:1px solid rgba(255,255,255,.08);padding:0 4px}.workbench-computer-list.compact{gap:5px}.workbench-computer-context-card{border:1px solid rgba(124,77,255,.28);background:#7c4dff14;border-radius:var(--tytus-radius-sm, 8px);padding:9px 10px;display:grid;gap:4px;font-size:12px;min-width:0}.workbench-computer-context-card.mission{border-color:#569cd65c;background:linear-gradient(135deg,#569cd61f,#7c4dff14)}.workbench-computer-context-card strong,.workbench-computer-context-card span{overflow:hidden;text-overflow:ellipsis}.workbench-computer-context-card span{color:var(--workbench-muted);font-size:11px}.workbench-computer-presets{display:grid;grid-template-columns:1fr;gap:6px;margin-bottom:8px}.workbench-computer-presets .workbench-button-subtle{justify-content:flex-start;text-align:left}.workbench-computer-actions{display:grid;grid-template-columns:1fr;gap:6px}.workbench-computer-actions .workbench-button-subtle{justify-content:center}.workbench-computer-job-prompt{width:100%;min-height:92px;box-sizing:border-box;resize:vertical;background:var(--bg-input, #242426);color:var(--workbench-text);border:1px solid var(--border-subtle, #35353b);padding:8px;font:inherit;font-size:12px}.workbench-computer-job-log{max-height:180px;overflow:auto;white-space:pre-wrap;word-break:break-word;background:#111;border:1px solid var(--workbench-border);color:var(--workbench-muted);padding:8px;font-size:11px}.workbench-computer-card{border:1px solid var(--border-subtle, #34343a);background:var(--bg-elevated, #2b2b2d);color:var(--workbench-text);padding:10px;display:grid;gap:8px}.workbench-computer-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.workbench-computer-card-head strong,.workbench-computer-card-head span{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis}.workbench-computer-card-head span{color:var(--workbench-muted);font-size:11px;margin-top:2px}.workbench-computer-pill{flex:0 0 auto;border:1px solid var(--workbench-border-strong);color:var(--workbench-muted);border-radius:999px;padding:2px 7px;font-size:10px;text-transform:uppercase;letter-spacing:.04em}.workbench-computer-pill.available,.workbench-computer-pill.ready{color:#9af0b4;border-color:#9af0b459;background:#9af0b414}.workbench-computer-pill.degraded,.workbench-computer-pill.needs-setup,.workbench-computer-pill.needs_setup{color:#ffd48a;border-color:#ffd48a59;background:#ffd48a14}.workbench-computer-pill.missing{color:#ff9e9e;border-color:#ff9e9e59;background:#ff9e9e14}.workbench-resource-warnings{display:grid;gap:4px;margin:6px 0 12px}.workbench-resource-warnings span{color:#ffd48a;font-size:11px;border:1px solid rgba(255,212,138,.22);background:#ffd48a12;padding:5px 7px}.workbench-resource-row{min-width:0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;border:1px solid rgba(255,255,255,.07);background:#ffffff06;padding:7px 8px}.workbench-resource-row strong,.workbench-resource-row span{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-resource-row div>span{color:var(--workbench-muted);font-size:10px;margin-top:2px}.workbench-resource-row-actions{display:flex;align-items:center;justify-content:flex-end;gap:4px;min-width:0}.workbench-resource-row-actions .workbench-button-subtle{min-height:24px;padding:2px 7px;font-size:10px}.workbench-mission-list,.workbench-task-graph{display:grid;gap:6px;margin-bottom:12px}.workbench-mission-row,.workbench-task-card{width:100%;min-width:0;border:1px solid rgba(255,255,255,.08);background:#ffffff09;color:var(--workbench-text);border-radius:8px;padding:8px;text-align:left;cursor:pointer}.workbench-mission-row:hover,.workbench-task-card:hover,.workbench-mission-row.active{border-color:#7c4dff73;background:#7c4dff1f}.workbench-mission-row strong,.workbench-mission-row span,.workbench-task-card strong,.workbench-task-card em{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-mission-row span,.workbench-task-card em{color:var(--workbench-muted);font-size:10px;margin-top:2px;font-style:normal}.workbench-task-card{display:grid;grid-template-columns:22px minmax(0,1fr);column-gap:8px;align-items:center}.workbench-task-card>span{width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:#7c4dff2e;color:#d9ccff;font-size:11px;font-weight:800}.workbench-task-card em{grid-column:2}.workbench-computer-triggers{display:flex;flex-wrap:wrap;gap:4px}.workbench-computer-triggers span{border:1px solid var(--workbench-border);color:var(--workbench-muted);padding:2px 6px;font-size:10px}.workbench-extension-row{width:100%;min-height:58px;border:1px solid var(--border-subtle, #34343a);border-radius:8px;background:var(--bg-elevated, #2b2b2d);color:var(--workbench-text);display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;gap:10px;padding:9px 10px;margin-bottom:8px;box-sizing:border-box}.workbench-extension-row strong,.workbench-extension-row span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-extension-row span{color:var(--workbench-muted);font-size:12px;margin-top:2px}.workbench-extension-row em{color:var(--workbench-muted);font-size:11px;font-style:normal}.workbench-badge{display:inline-flex;align-items:center;border-radius:10px;background:#333;color:#aaa;padding:2px 8px;font-size:11px}@media(max-width:980px){.workbench-workbench{grid-template-columns:48px 260px minmax(0,1fr) 0}.workbench-secondary{display:none}.workbench-statusbar{grid-column:3 / 4}}.workbench-workbench{grid-template-columns:48px var(--workbench-primary-width, 300px) minmax(0,1fr) var(--workbench-secondary-width, 520px);--tytus-radius-sm: 7px;--tytus-radius-md: 10px;--tytus-surface: var(--bg-window, #1f1f1f);--tytus-surface-2: var(--bg-panel, #252526);--tytus-hover: var(--bg-hover, #313131);--tytus-accent: var(--accent-primary, #7c4dff);--tytus-accent-hover: var(--accent-primary-hover, #9068ff)}.workbench-workbench.no-primary{grid-template-columns:48px 0 minmax(0,1fr) var(--workbench-secondary-width, 460px)}.workbench-workbench.no-secondary{grid-template-columns:48px var(--workbench-primary-width, 300px) minmax(0,1fr)}.workbench-workbench.no-primary.no-secondary{grid-template-columns:48px 0 minmax(0,1fr)}.workbench-workbench.no-secondary .workbench-statusbar{grid-column:3 / 4}.workbench-button-blue,.workbench-button-subtle,.workbench-input,.workbench-file-row,.workbench-tree-row,.workbench-folder-row,.workbench-walkthrough-card,.workbench-output-card,.workbench-chat-message,.workbench-chat-tip,.workbench-chat-box,.workbench-extension-card,.workbench-extension-row{border-radius:var(--tytus-radius-sm)}.workbench-button-blue{background:linear-gradient(135deg,var(--tytus-accent),#d85cae);box-shadow:0 8px 22px #7c4dff2e;font-weight:650}.workbench-button-blue:hover{background:linear-gradient(135deg,var(--tytus-accent-hover),#eb72bd)}.workbench-button-subtle,.workbench-chat-attachments button,.workbench-chat-mode,.workbench-secondary-actions button,.workbench-tab-close{border:1px solid var(--border-subtle, #34343a);background:var(--bg-elevated, #2b2b2d)}.workbench-button-subtle:hover,.workbench-chat-attachments button:hover,.workbench-chat-mode:hover,.workbench-secondary-actions button:hover{background:var(--tytus-hover);border-color:var(--border-focus, rgba(124, 77, 255, .55))}.workbench-input,.workbench-chat-textarea{background:var(--bg-input, #242426);border-color:var(--border-subtle, #35353b)}.workbench-input:focus,.workbench-chat-box:focus-within{border-color:var(--tytus-accent);box-shadow:0 0 0 1px #7c4dff73,0 0 0 4px #7c4dff1a}.workbench-editor-action{width:34px;height:28px;align-self:center;margin-right:6px;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--workbench-muted);display:grid;place-items:center;cursor:pointer}.workbench-editor-action:hover,.workbench-editor-action.active{color:#fff;background:var(--bg-hover, #313131);border-color:var(--border-subtle, #3a3a40)}.workbench-editor-single,.workbench-editor-split{width:100%;height:100%;min-height:0}.workbench-editor-single{display:grid;grid-template-columns:minmax(0,1fr)}.workbench-editor-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,42%)}.workbench-editor-pane{min-width:0;min-height:0;height:100%}.workbench-markdown-preview{min-width:0;min-height:0;border-left:1px solid var(--workbench-border);background:var(--bg-window, #1f1f1f);display:grid;grid-template-rows:30px minmax(0,1fr)}.workbench-preview-title{height:30px;display:flex;align-items:center;gap:6px;padding:0 10px;color:var(--text-secondary, #aaa);font-size:12px;border-bottom:1px solid var(--border-subtle, #333);background:var(--bg-titlebar, #242426)}.workbench-preview-body{overflow:auto;padding:20px 26px 32px;color:var(--text-primary, #ddd)}.workbench-preview-body h1,.workbench-preview-body h2,.workbench-preview-body h3{color:var(--text-primary, #eee)}.workbench-preview-body p,.workbench-preview-body li{line-height:1.65}.workbench-secondary-tabs{background:var(--bg-titlebar, #202022)}.workbench-primary-resizer:hover,.workbench-secondary-resizer:hover{background:var(--tytus-accent)}.workbench-chat-composer{padding:0 12px 12px}.workbench-chat-tip{border-radius:var(--tytus-radius-sm) var(--tytus-radius-sm) 0 0}.workbench-chat-box{border-radius:0 0 var(--tytus-radius-md) var(--tytus-radius-md)}.workbench-chat-send{width:34px;height:30px;border-radius:10px;background:var(--bg-elevated, #2b2b2d);color:var(--text-secondary, #c9c9d0);border:1px solid var(--border-subtle, #34343a);box-shadow:none;transition:transform .12s ease,background .12s ease,border-color .12s ease,box-shadow .12s ease}.workbench-chat-send.ready{background:linear-gradient(135deg,#7c4dff2e,#d85cae24);color:#fff;border-color:#d85cae75;box-shadow:0 0 0 1px #7c4dff2e,0 8px 18px #0003}.workbench-chat-send.ready:hover{transform:translateY(-1px);background:linear-gradient(135deg,#7c4dff3d,#d85cae38);box-shadow:0 0 0 1px #d85cae47,0 10px 22px #0000003d}.workbench-chat-send.stop{background:linear-gradient(135deg,#b64a4a,#ef6f6f);border-color:#ffffff1a}@media(max-width:1200px){.workbench-editor-split{grid-template-columns:minmax(0,1fr)}.workbench-markdown-preview{display:none}}.workbench-chat-context-select{height:24px;border:1px solid var(--workbench-border-strong);border-radius:999px;background:#1f1f1f;color:var(--workbench-text);font-size:11px;padding:0 8px;outline:none}.workbench-chat-chip.muted{color:var(--workbench-muted)}.workbench-chat-chip.warn{color:#f6c177;border:1px solid rgba(246,193,119,.35)}.workbench-chat-chip small{color:#f6c177;font-size:10px;margin-left:4px}.workbench-chat-chip-open,.workbench-chat-chip-remove{width:auto!important;height:auto!important;border:0!important;background:transparent!important;color:inherit!important;padding:0!important;display:inline-flex!important;align-items:center;cursor:pointer}.workbench-chat-chip-remove{margin-left:4px;opacity:.75}.workbench-chat-chip-open:hover,.workbench-chat-chip-remove:hover{opacity:1;color:#fff!important}.workbench-chat-jump{position:sticky;bottom:8px;display:block;margin:8px auto 0;height:26px;border:1px solid var(--workbench-border-strong);border-radius:999px;background:#2d2d30;color:var(--workbench-text);font-size:11px;padding:0 12px;cursor:pointer;box-shadow:0 6px 16px #00000047}.workbench-chat-jump:hover{background:#3a3a3d;color:#fff}.workbench-chat-generate-patch{margin:6px 8px 0;min-height:28px;border:1px solid rgba(124,77,255,.7);border-radius:7px;background:#7c4dff29;color:#fff;cursor:pointer;font-size:12px}.workbench-chat-generate-patch:hover:not(:disabled){background:#7c4dff42}.workbench-chat-generate-patch:disabled{opacity:.55;cursor:not-allowed}.workbench-chat-toolbar.compact{grid-template-columns:minmax(0,auto) 1fr auto}.workbench-chat-route-summary{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--workbench-muted);font-size:11px}.workbench-manual-check-panel{display:flex;flex-direction:column;gap:12px;padding:12px}.workbench-manual-check-head,.workbench-check-actions,.workbench-check-add-row{display:flex;align-items:center;gap:8px}.workbench-manual-check-head small{color:var(--workbench-muted, #8b949e)}.workbench-manual-check-grid{display:grid;grid-template-columns:minmax(260px,1fr) minmax(320px,1.3fr);gap:12px}.workbench-manual-check-grid section,.workbench-check-results{display:flex;flex-direction:column;gap:8px}.workbench-check-command-list{display:flex;flex-direction:column;gap:6px;max-height:160px;overflow:auto}.workbench-check-command-list button{display:flex;justify-content:space-between;gap:8px;text-align:left}.workbench-check-command-list button.active{outline:1px solid var(--workbench-accent, #6aa6ff)}.workbench-check-add-row input,.workbench-manual-check-grid textarea,.workbench-manual-check-grid select{width:100%}.workbench-check-status{border-radius:999px;padding:2px 8px;font-size:11px;text-transform:uppercase}.workbench-check-status.pending{background:#d299222e;color:#d29922}.workbench-check-status.failed{background:#f851492e;color:#ff7b72}.workbench-check-status.passed{background:#3fb9502e;color:#56d364}.workbench-check-results article{border:1px solid var(--workbench-border, #30363d);border-radius:8px;padding:8px}.workbench-check-results pre{max-height:160px;overflow:auto;white-space:pre-wrap}.workbench-workbench{grid-template-columns:48px minmax(0,var(--workbench-primary-width, 300px)) minmax(0,1fr) minmax(320px,var(--workbench-secondary-width, 520px))}.workbench-workbench.no-primary{grid-template-columns:48px 0 minmax(0,1fr) minmax(320px,var(--workbench-secondary-width, 460px))}.workbench-workbench.no-secondary{grid-template-columns:48px minmax(0,var(--workbench-primary-width, 300px)) minmax(0,1fr) 0}.workbench-workbench.no-primary.no-secondary{grid-template-columns:48px 0 minmax(0,1fr) 0}.workbench-primary-region,.workbench-main,.workbench-secondary,.workbench-chat-wrap,.workbench-chat-transcript,.workbench-chat-message,.workbench-rich-body,.workbench-rich-markdown,.workbench-editor-stack,.workbench-editor-pane{min-width:0}.workbench-secondary{overflow:hidden}.workbench-secondary-tab-group{min-width:0;overflow:hidden}.workbench-secondary-tab{min-width:0;overflow:hidden;text-overflow:ellipsis}.workbench-chat-threadbar{min-width:0}.workbench-chat-threadbar select{width:100%}.workbench-chat-message{overflow:hidden;max-width:100%;box-sizing:border-box}.workbench-rich-body,.workbench-rich-markdown{max-width:100%;overflow-wrap:anywhere}.workbench-rich-markdown table{display:block;max-width:100%;overflow:auto;border-collapse:collapse;margin:10px 0 12px;white-space:normal}.workbench-rich-markdown th,.workbench-rich-markdown td{border:1px solid rgba(255,255,255,.1);padding:6px 8px;vertical-align:top;min-width:120px}.workbench-rich-markdown th{color:#f0f0f3;background:#ffffff0d}.workbench-rich-code,.workbench-rich-code pre{max-width:100%}.workbench-file-row,.workbench-tree-row,.workbench-folder-row{min-width:0}.workbench-file-row svg,.workbench-tree-row svg,.workbench-folder-row svg{flex:0 0 auto}.workbench-row-text{min-width:0;display:grid;gap:1px;line-height:1.2}.workbench-row-name,.workbench-row-detail{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-row-detail{color:var(--workbench-muted);font-size:10px}.workbench-agent-dock{min-width:0;min-height:0;height:100%;display:flex;flex-direction:column;background:var(--workbench-side);overflow:hidden}.workbench-agent-dock-scroll{min-height:0;overflow:auto;padding:12px}.workbench-agent-run{margin:10px 0 12px;border:1px solid var(--border-subtle, #34343a);border-radius:var(--tytus-radius-sm, 7px);background:#0000002e;overflow:hidden}.workbench-agent-run header{min-height:34px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 8px;border-bottom:1px solid rgba(255,255,255,.07);background:#ffffff09}.workbench-agent-run header>div{min-width:0;display:grid;gap:2px}.workbench-agent-run header strong,.workbench-agent-run header span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-agent-run header span{color:var(--workbench-muted);font-size:11px;text-transform:uppercase;letter-spacing:.04em}.workbench-agent-primary-action{border-color:#7c4dff66!important;background:linear-gradient(135deg,#7c4dff33,#d85cae1f)!important;color:#f5efff!important;font-weight:650}.workbench-computer-actions{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px}.workbench-computer-card,.workbench-computer-context-card,.workbench-computer-hero,.workbench-computer-job-prompt,.workbench-computer-job-log{max-width:100%;box-sizing:border-box}.workbench-computer-job-log{max-height:280px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere}@media(max-width:1180px){.workbench-workbench{grid-template-columns:48px minmax(0,min(260px,var(--workbench-primary-width, 260px))) minmax(0,1fr) minmax(300px,min(42vw,var(--workbench-secondary-width, 420px)))}}@media(max-width:980px){.workbench-workbench{grid-template-columns:48px minmax(0,240px) minmax(0,1fr) 0}.workbench-secondary{display:none}.workbench-statusbar{grid-column:3 / 4}}@media(max-width:760px){.workbench-workbench,.workbench-workbench.no-primary,.workbench-workbench.no-secondary,.workbench-workbench.no-primary.no-secondary{grid-template-columns:48px 0 minmax(0,1fr) 0}.workbench-primary-region,.workbench-secondary{display:none}.workbench-statusbar{grid-column:3 / 4}}.workbench-control-home{padding:clamp(20px,3vw,34px);overflow:auto}.workbench-control-hero-main{border:1px solid rgba(124,77,255,.28);background:linear-gradient(135deg,#7c4dff29,#569cd614,#00000014);border-radius:14px;padding:clamp(18px,3vw,28px);margin-bottom:18px;max-width:1180px}.workbench-control-kicker{color:#b79cff;font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px}.workbench-control-hero-main h1{font-size:clamp(34px,5vw,58px);line-height:.98;margin:0 0 12px;font-weight:800;color:#f3f3f4}.workbench-control-hero-main p{max-width:860px;color:var(--workbench-muted);font-size:15px;line-height:1.55;margin:0 0 18px}.workbench-control-goal-row{display:grid;grid-template-columns:minmax(0,1fr) 190px;gap:12px;align-items:stretch}.workbench-control-goal-row textarea{width:100%;box-sizing:border-box;resize:vertical;min-height:96px;color:var(--workbench-text);background:#00000038;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:12px;font:inherit}.workbench-control-hero-actions{display:grid;gap:8px}.workbench-control-success{margin-top:10px;color:#9af0b4;font-size:12px}.workbench-control-success code{color:#d7ba7d}.workbench-control-grid{display:grid;grid-template-columns:repeat(2,minmax(260px,1fr));gap:12px;max-width:1180px}.workbench-control-card{border:1px solid var(--workbench-border-strong);background:#252526eb;border-radius:12px;padding:14px;min-width:0}.workbench-control-card.wide{grid-column:1 / -1}.workbench-control-card header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.workbench-control-card header strong{color:var(--workbench-text)}.workbench-control-card header span{color:var(--workbench-muted);font-size:12px}.workbench-control-metrics{display:grid;grid-template-columns:repeat(5,minmax(110px,1fr));gap:8px}.workbench-control-metric{border:1px solid rgba(255,255,255,.08);background:#ffffff09;border-radius:10px;padding:10px;min-width:0}.workbench-control-metric strong{display:block;color:#f3f3f4;font-size:24px}.workbench-control-metric span,.workbench-control-metric em{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-control-metric span{color:var(--workbench-text);font-size:12px;font-weight:700}.workbench-control-metric em{color:var(--workbench-muted);font-size:11px;font-style:normal}.workbench-control-preset{width:100%;text-align:left;color:var(--workbench-text);background:#ffffff0a;border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:10px;margin-bottom:8px;cursor:pointer}.workbench-control-preset small{display:block;color:var(--workbench-muted);font-size:10px;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-control-preset:hover{border-color:#7c4dff73;background:#7c4dff1f}.workbench-control-recent{display:grid;gap:6px;margin-top:12px}.workbench-control-recent span{color:var(--workbench-muted);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.workbench-control-recent button{color:#8cbcff;background:transparent;border:0;padding:0;text-align:left;cursor:pointer}.workbench-control-resource-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.workbench-control-resource{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;border:1px solid rgba(255,255,255,.08);background:#ffffff06;border-radius:8px;padding:9px 10px;min-width:0}.workbench-control-resource strong,.workbench-control-resource span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.workbench-control-resource div>span{color:var(--workbench-muted);font-size:11px;margin-top:2px}.workbench-control-loop{display:grid;grid-template-columns:repeat(5,minmax(120px,1fr));gap:8px;list-style:none;padding:0;margin:0}.workbench-control-loop li{border:1px solid rgba(86,156,214,.2);background:#569cd60f;border-radius:10px;padding:10px}.workbench-control-loop b,.workbench-control-loop span{display:block}.workbench-control-loop span{color:var(--workbench-muted);font-size:11px;margin-top:4px}.workbench-control-loop code{color:#d7ba7d}.workbench-task-graph.home{grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:0}@media(max-width:1100px){.workbench-control-goal-row,.workbench-control-grid,.workbench-control-resource-list,.workbench-task-graph.home{grid-template-columns:1fr}.workbench-control-metrics,.workbench-control-loop{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:720px){.workbench-control-metrics,.workbench-control-loop{grid-template-columns:1fr}}.monaco-aria-container{position:absolute;left:-999em}::-ms-clear{display:none}.monaco-editor .editor-widget input{color:inherit}.monaco-editor{position:relative;overflow:visible;-webkit-text-size-adjust:100%;color:var(--vscode-editor-foreground);background-color:var(--vscode-editor-background);overflow-wrap:initial}.monaco-editor-background{background-color:var(--vscode-editor-background)}.monaco-editor .rangeHighlight{background-color:var(--vscode-editor-rangeHighlightBackground);box-sizing:border-box;border:1px solid var(--vscode-editor-rangeHighlightBorder)}.monaco-editor.hc-black .rangeHighlight,.monaco-editor.hc-light .rangeHighlight{border-style:dotted}.monaco-editor .symbolHighlight{background-color:var(--vscode-editor-symbolHighlightBackground);box-sizing:border-box;border:1px solid var(--vscode-editor-symbolHighlightBorder)}.monaco-editor.hc-black .symbolHighlight,.monaco-editor.hc-light .symbolHighlight{border-style:dotted}.monaco-editor .editorCanvas{position:absolute;width:100%;height:100%;z-index:0;pointer-events:none}.monaco-editor .overflow-guard{position:relative;overflow:hidden}.monaco-editor .view-overlays{position:absolute;top:0}.monaco-editor .view-overlays>div,.monaco-editor .margin-view-overlays>div{position:absolute;width:100%}.monaco-editor .squiggly-error{border-bottom:4px double var(--vscode-editorError-border)}.monaco-editor .squiggly-error:before{display:block;content:\"\";width:100%;height:100%;background:var(--vscode-editorError-background)}.monaco-editor .squiggly-warning{border-bottom:4px double var(--vscode-editorWarning-border)}.monaco-editor .squiggly-warning:before{display:block;content:\"\";width:100%;height:100%;background:var(--vscode-editorWarning-background)}.monaco-editor .squiggly-info{border-bottom:4px double var(--vscode-editorInfo-border)}.monaco-editor .squiggly-info:before{display:block;content:\"\";width:100%;height:100%;background:var(--vscode-editorInfo-background)}.monaco-editor .squiggly-hint{border-bottom:2px dotted var(--vscode-editorHint-border)}.monaco-editor.showUnused .squiggly-unnecessary{border-bottom:2px dashed var(--vscode-editorUnnecessaryCode-border)}.monaco-editor.showDeprecated .squiggly-inline-deprecated{text-decoration:line-through;text-decoration-color:var(--vscode-editor-foreground, inherit)}.monaco-scrollable-element>.scrollbar>.scra{cursor:pointer;font-size:11px!important}.monaco-scrollable-element>.visible{opacity:1;background:#0000;transition:opacity .1s linear;z-index:11}.monaco-scrollable-element>.invisible{opacity:0;pointer-events:none}.monaco-scrollable-element>.invisible.fade{transition:opacity .8s linear}.monaco-scrollable-element>.shadow{position:absolute;display:none}.monaco-scrollable-element>.shadow.top{display:block;top:0;left:3px;height:3px;width:100%;box-shadow:var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset}.monaco-scrollable-element>.shadow.left{display:block;top:3px;left:0;height:100%;width:3px;box-shadow:var(--vscode-scrollbar-shadow) 6px 0 6px -6px inset}.monaco-scrollable-element>.shadow.top-left-corner{display:block;top:0;left:0;height:3px;width:3px}.monaco-scrollable-element>.shadow.top.left{box-shadow:var(--vscode-scrollbar-shadow) 6px 0 6px -6px inset}.monaco-scrollable-element>.scrollbar{background:var(--vscode-scrollbar-background)}.monaco-scrollable-element>.scrollbar>.slider{background:var(--vscode-scrollbarSlider-background)}.monaco-scrollable-element>.scrollbar>.slider:hover{background:var(--vscode-scrollbarSlider-hoverBackground)}.monaco-scrollable-element>.scrollbar>.slider.active{background:var(--vscode-scrollbarSlider-activeBackground)}.monaco-editor .blockDecorations-container{position:absolute;top:0;pointer-events:none}.monaco-editor .blockDecorations-block{position:absolute;box-sizing:border-box}.monaco-editor .view-overlays .current-line,.monaco-editor .margin-view-overlays .current-line{display:block;position:absolute;left:0;top:0;box-sizing:border-box;height:100%}.monaco-editor .margin-view-overlays .current-line.current-line-margin.current-line-margin-both{border-right:0}.monaco-editor .lines-content .cdr{position:absolute;height:100%}.monaco-editor .glyph-margin{position:absolute;top:0}.monaco-editor .glyph-margin-widgets .cgmr{position:absolute;display:flex;align-items:center;justify-content:center}.monaco-editor .glyph-margin-widgets .cgmr.codicon-modifier-spin:before{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.monaco-editor .lines-content .core-guide{position:absolute;box-sizing:border-box;height:100%}.monaco-editor .margin-view-overlays .line-numbers{bottom:0;font-variant-numeric:tabular-nums;position:absolute;text-align:right;display:inline-block;vertical-align:middle;box-sizing:border-box;cursor:default}.monaco-editor .relative-current-line-number{text-align:left;display:inline-block;width:100%}.monaco-editor .margin-view-overlays .line-numbers.lh-odd{margin-top:1px}.monaco-editor .line-numbers{color:var(--vscode-editorLineNumber-foreground)}.monaco-editor .line-numbers.active-line-number{color:var(--vscode-editorLineNumber-activeForeground)}.monaco-mouse-cursor-text{cursor:text}.mtkcontrol{color:#fff!important;background:#960000!important}.mtkoverflow{background-color:var(--vscode-button-background, var(--vscode-editor-background));color:var(--vscode-button-foreground, var(--vscode-editor-foreground));border-width:1px;border-style:solid;border-color:var(--vscode-contrastBorder);border-radius:2px;padding:4px;cursor:pointer}.mtkoverflow:hover{background-color:var(--vscode-button-hoverBackground)}.monaco-editor.no-user-select .lines-content,.monaco-editor.no-user-select .view-line,.monaco-editor.no-user-select .view-lines{user-select:none;-webkit-user-select:none}.monaco-editor.mac .lines-content:hover,.monaco-editor.mac .view-line:hover,.monaco-editor.mac .view-lines:hover{user-select:text;-webkit-user-select:text;-ms-user-select:text}.monaco-editor.enable-user-select{user-select:initial;-webkit-user-select:initial}.monaco-editor .view-lines{white-space:nowrap}.monaco-editor .view-line{box-sizing:border-box;position:absolute;width:100%}.monaco-editor .lines-content>.view-lines>.view-line>span{top:0;bottom:0;position:absolute}.monaco-editor .mtkw{color:var(--vscode-editorWhitespace-foreground)!important}.monaco-editor .mtkz{display:inline-block;color:var(--vscode-editorWhitespace-foreground)!important}.monaco-editor .lines-decorations{position:absolute;top:0;background:#fff}.monaco-editor .margin-view-overlays .cldr{position:absolute;height:100%}.monaco-editor .margin{background-color:var(--vscode-editorGutter-background)}.monaco-editor .margin-view-overlays .cmdr{position:absolute;left:0;width:100%;height:100%}.monaco-editor .minimap.slider-mouseover .minimap-slider{opacity:0;transition:opacity .1s linear}.monaco-editor .minimap.slider-mouseover:hover .minimap-slider,.monaco-editor .minimap.slider-mouseover .minimap-slider.active{opacity:1}.monaco-editor .minimap-slider .minimap-slider-horizontal{background:var(--vscode-minimapSlider-background)}.monaco-editor .minimap-slider:hover .minimap-slider-horizontal{background:var(--vscode-minimapSlider-hoverBackground)}.monaco-editor .minimap-slider.active .minimap-slider-horizontal{background:var(--vscode-minimapSlider-activeBackground)}.monaco-editor .minimap-shadow-visible{box-shadow:var(--vscode-scrollbar-shadow) -6px 0 6px -6px inset}.monaco-editor .minimap-shadow-hidden{position:absolute;width:0}.monaco-editor .minimap-shadow-visible{position:absolute;left:-6px;width:6px;pointer-events:none}.monaco-editor.no-minimap-shadow .minimap-shadow-visible{position:absolute;left:-1px;width:1px}.minimap.minimap-autohide-mouseover,.minimap.minimap-autohide-scroll{opacity:0;transition:opacity .5s}.minimap.minimap-autohide-scroll{pointer-events:none}.minimap.minimap-autohide-mouseover:hover,.minimap.minimap-autohide-scroll.active{opacity:1;pointer-events:auto}.monaco-editor .minimap{z-index:5}.monaco-editor .overlayWidgets{position:absolute;top:0;left:0}.monaco-editor .view-ruler{position:absolute;top:0;box-shadow:1px 0 0 0 var(--vscode-editorRuler-foreground) inset}.monaco-editor .scroll-decoration{position:absolute;top:0;left:0;height:6px;box-shadow:var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset}.monaco-editor .lines-content .cslr{position:absolute}.monaco-editor .focused .selected-text{background-color:var(--vscode-editor-selectionBackground)}.monaco-editor .selected-text{background-color:var(--vscode-editor-inactiveSelectionBackground)}.monaco-editor .top-left-radius{border-top-left-radius:3px}.monaco-editor .bottom-left-radius{border-bottom-left-radius:3px}.monaco-editor .top-right-radius{border-top-right-radius:3px}.monaco-editor .bottom-right-radius{border-bottom-right-radius:3px}.monaco-editor.hc-black .top-left-radius{border-top-left-radius:0}.monaco-editor.hc-black .bottom-left-radius{border-bottom-left-radius:0}.monaco-editor.hc-black .top-right-radius{border-top-right-radius:0}.monaco-editor.hc-black .bottom-right-radius{border-bottom-right-radius:0}.monaco-editor.hc-light .top-left-radius{border-top-left-radius:0}.monaco-editor.hc-light .bottom-left-radius{border-bottom-left-radius:0}.monaco-editor.hc-light .top-right-radius{border-top-right-radius:0}.monaco-editor.hc-light .bottom-right-radius{border-bottom-right-radius:0}.monaco-editor .cursors-layer{position:absolute;top:0}.monaco-editor .cursors-layer>.cursor{position:absolute;overflow:hidden;box-sizing:border-box}.monaco-editor .cursors-layer.cursor-smooth-caret-animation>.cursor{transition:all 80ms}.monaco-editor .cursors-layer.cursor-block-outline-style>.cursor{background:transparent!important;border-style:solid;border-width:1px}.monaco-editor .cursors-layer.cursor-underline-style>.cursor{border-bottom-width:2px;border-bottom-style:solid;background:transparent!important}.monaco-editor .cursors-layer.cursor-underline-thin-style>.cursor{border-bottom-width:1px;border-bottom-style:solid;background:transparent!important}@keyframes monaco-cursor-smooth{0%,20%{opacity:1}60%,to{opacity:0}}@keyframes monaco-cursor-phase{0%,20%{opacity:1}90%,to{opacity:0}}@keyframes monaco-cursor-expand{0%,20%{transform:scaleY(1)}80%,to{transform:scaleY(0)}}.cursor-smooth{animation:monaco-cursor-smooth .5s ease-in-out 0s 20 alternate}.cursor-phase{animation:monaco-cursor-phase .5s ease-in-out 0s 20 alternate}.cursor-expand>.cursor{animation:monaco-cursor-expand .5s ease-in-out 0s 20 alternate}.monaco-editor .mwh{position:absolute;color:var(--vscode-editorWhitespace-foreground)!important}.monaco-editor .monaco-decoration-css-rule-extractor{visibility:hidden;pointer-events:none}.monaco-editor .inputarea{min-width:0;min-height:0;margin:0;padding:0;position:absolute;outline:none!important;resize:none;border:none;overflow:hidden;color:transparent;background-color:transparent;z-index:-10}.monaco-editor .inputarea.ime-input{z-index:10;caret-color:var(--vscode-editorCursor-foreground);color:var(--vscode-editor-foreground)}.monaco-editor .native-edit-context{margin:0;padding:0;position:absolute;overflow-y:scroll;scrollbar-width:none;z-index:-10;white-space:pre-wrap}.monaco-editor .ime-text-area{min-width:0;min-height:0;margin:0;padding:0;position:absolute;outline:none!important;resize:none;border:none;overflow:hidden;color:transparent;background-color:transparent;z-index:-10}.monaco-editor .edit-context-composition-none{background-color:transparent;border-bottom:none}.monaco-editor :not(.hc-black,.hc-light) .edit-context-composition-secondary{border-bottom:1px solid var(--vscode-editor-compositionBorder)}.monaco-editor :not(.hc-black,.hc-light) .edit-context-composition-primary{border-bottom:2px solid var(--vscode-editor-compositionBorder)}.monaco-editor :is(.hc-black,.hc-light) .edit-context-composition-secondary{border:1px solid var(--vscode-editor-compositionBorder)}.monaco-editor :is(.hc-black,.hc-light) .edit-context-composition-primary{border:2px solid var(--vscode-editor-compositionBorder)}.monaco-editor .margin-view-overlays .gpu-mark{position:absolute;top:0;bottom:0;left:0;width:100%;display:inline-block;border-left:solid 2px var(--vscode-editorWarning-foreground);opacity:.2;transition:background-color .1s linear}.monaco-editor .margin-view-overlays .gpu-mark:hover{background-color:var(--vscode-editorWarning-foreground)}.monaco-select-box{width:100%;cursor:pointer;border-radius:2px}.monaco-select-box-dropdown-container{font-size:13px;font-weight:400;text-transform:none}.monaco-action-bar .action-item.select-container{cursor:default}.monaco-action-bar .action-item .monaco-select-box{cursor:pointer;min-width:100px;min-height:18px;padding:2px 23px 2px 8px}.mac .monaco-action-bar .action-item .monaco-select-box{font-size:11px;border-radius:3px;min-height:24px}.monaco-list{position:relative;height:100%;width:100%;white-space:nowrap}.monaco-list.mouse-support{user-select:none;-webkit-user-select:none}.monaco-list>.monaco-scrollable-element{height:100%}.monaco-list-rows{position:relative;width:100%;height:100%}.monaco-list.horizontal-scrolling .monaco-list-rows{width:auto;min-width:100%}.monaco-list-row{position:absolute;box-sizing:border-box;overflow:hidden;width:100%}.monaco-list.mouse-support .monaco-list-row{cursor:pointer;touch-action:none}.monaco-list .monaco-scrollable-element>.scrollbar.vertical,.monaco-pane-view>.monaco-split-view2.vertical>.monaco-scrollable-element>.scrollbar.vertical{z-index:14}.monaco-list-row.scrolling{display:none!important}.monaco-list.element-focused,.monaco-list.selection-single,.monaco-list.selection-multiple{outline:0!important}.monaco-list-type-filter-message{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;padding:40px 1em 1em;text-align:center;white-space:normal;opacity:.7;pointer-events:none}.monaco-list-type-filter-message:empty{display:none}.monaco-drag-image{display:inline-block;padding:1px 7px;border-radius:10px;font-size:12px;position:absolute;z-index:1000;background-color:var(--vscode-list-activeSelectionBackground);color:var(--vscode-list-activeSelectionForeground);outline:1px solid var(--vscode-list-focusOutline);outline-offset:-1px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.monaco-select-box-dropdown-padding{--dropdown-padding-top: 1px;--dropdown-padding-bottom: 1px}.hc-black .monaco-select-box-dropdown-padding,.hc-light .monaco-select-box-dropdown-padding{--dropdown-padding-top: 3px;--dropdown-padding-bottom: 4px}.monaco-select-box-dropdown-container{display:none;box-sizing:border-box}.monaco-select-box-dropdown-container>.select-box-details-pane>.select-box-description-markdown *{margin:0}.monaco-select-box-dropdown-container>.select-box-details-pane>.select-box-description-markdown a:focus{outline:1px solid -webkit-focus-ring-color;outline-offset:-1px}.monaco-select-box-dropdown-container>.select-box-details-pane>.select-box-description-markdown code{line-height:15px;font-family:var(--monaco-monospace-font)}.monaco-select-box-dropdown-container.visible{display:flex;flex-direction:column;text-align:left;width:1px;overflow:hidden;border-bottom-left-radius:3px;border-bottom-right-radius:3px}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container{flex:0 0 auto;align-self:flex-start;padding-top:var(--dropdown-padding-top);padding-bottom:var(--dropdown-padding-bottom);padding-left:1px;padding-right:1px;width:100%;overflow:hidden;box-sizing:border-box}.monaco-select-box-dropdown-container>.select-box-details-pane{padding:5px}.hc-black .monaco-select-box-dropdown-container>.select-box-dropdown-list-container{padding-top:var(--dropdown-padding-top);padding-bottom:var(--dropdown-padding-bottom)}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container .monaco-list .monaco-list-row{cursor:pointer}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container .monaco-list .monaco-list-row>.option-text{text-overflow:ellipsis;overflow:hidden;padding-left:3.5px;white-space:nowrap;float:left}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container .monaco-list .monaco-list-row>.option-detail{text-overflow:ellipsis;overflow:hidden;padding-left:3.5px;white-space:nowrap;float:left;opacity:.7}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container .monaco-list .monaco-list-row>.option-decorator-right{text-overflow:ellipsis;overflow:hidden;padding-right:10px;white-space:nowrap;float:right}.monaco-select-box-dropdown-container>.select-box-dropdown-list-container .monaco-list .monaco-list-row>.visually-hidden{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}.monaco-select-box-dropdown-container>.select-box-dropdown-container-width-control{flex:1 1 auto;align-self:flex-start;opacity:0}.monaco-select-box-dropdown-container>.select-box-dropdown-container-width-control>.width-control-div{overflow:hidden;max-height:0px}.monaco-select-box-dropdown-container>.select-box-dropdown-container-width-control>.width-control-div>.option-text-width-control{padding-left:4px;padding-right:8px;white-space:nowrap}.monaco-action-bar{white-space:nowrap;height:100%}.monaco-action-bar .actions-container{display:flex;margin:0 auto;padding:0;height:100%;width:100%;align-items:center}.monaco-action-bar.vertical .actions-container{display:inline-block}.monaco-action-bar .action-item{display:block;align-items:center;justify-content:center;cursor:pointer;position:relative}.monaco-action-bar .action-item.disabled{cursor:default}.monaco-action-bar .action-item .icon,.monaco-action-bar .action-item .codicon{display:block}.monaco-action-bar .action-item .codicon{display:flex;align-items:center;width:16px;height:16px}.monaco-action-bar .action-label{display:flex;font-size:11px;padding:3px;border-radius:5px}.monaco-action-bar .action-item.disabled .action-label:not(.icon),.monaco-action-bar .action-item.disabled .action-label:not(.icon):before,.monaco-action-bar .action-item.disabled .action-label:not(.icon):hover{color:var(--vscode-disabledForeground)}.monaco-action-bar .action-item.disabled .action-label.icon,.monaco-action-bar .action-item.disabled .action-label.icon:before,.monaco-action-bar .action-item.disabled .action-label.icon:hover{opacity:.6}.monaco-action-bar.vertical{text-align:left}.monaco-action-bar.vertical .action-item{display:block}.monaco-action-bar.vertical .action-label.separator{display:block;border-bottom:1px solid var(--vscode-disabledForeground);padding-top:1px;margin-left:.8em;margin-right:.8em}.monaco-action-bar .action-item .action-label.separator{width:1px;height:16px;margin:5px 4px!important;cursor:default;min-width:1px;padding:0;background-color:var(--vscode-disabledForeground)}.secondary-actions .monaco-action-bar .action-label{margin-left:6px}.monaco-action-bar .action-item.select-container{overflow:hidden;flex:1;max-width:170px;min-width:60px;display:flex;align-items:center;justify-content:center;margin-right:10px}.monaco-action-bar .action-item.action-dropdown-item{display:flex}.monaco-action-bar .action-item.action-dropdown-item>.action-dropdown-item-separator{display:flex;align-items:center;cursor:default}.monaco-action-bar .action-item.action-dropdown-item>.action-dropdown-item-separator>div{width:1px}.monaco-diff-editor .diff-review{position:absolute}.monaco-component.diff-review{user-select:none;-webkit-user-select:none;z-index:99;.diff-review-line-number{text-align:right;display:inline-block;color:var(--vscode-editorLineNumber-foreground)}.diff-review-summary{padding-left:10px}.diff-review-shadow{position:absolute;box-shadow:var(--vscode-scrollbar-shadow) 0 -6px 6px -6px inset}.diff-review-row{white-space:pre}.diff-review-table{display:table;min-width:100%}.diff-review-row{display:table-row;width:100%}.diff-review-spacer{display:inline-block;width:10px;vertical-align:middle}.diff-review-spacer>.codicon{font-size:9px!important}.diff-review-actions{display:inline-block;position:absolute;right:10px;top:2px;z-index:100}.diff-review-actions .action-label{width:16px;height:16px;margin:2px 0}.revertButton{cursor:pointer}.action-label{background:var(--vscode-editorActionList-background)}}:root{--vscode-sash-size: 4px;--vscode-sash-hover-size: 4px}.monaco-sash{position:absolute;z-index:35;touch-action:none}.monaco-sash.disabled{pointer-events:none}.monaco-sash.mac.vertical{cursor:col-resize}.monaco-sash.vertical.minimum{cursor:e-resize}.monaco-sash.vertical.maximum{cursor:w-resize}.monaco-sash.mac.horizontal{cursor:row-resize}.monaco-sash.horizontal.minimum{cursor:s-resize}.monaco-sash.horizontal.maximum{cursor:n-resize}.monaco-sash.disabled{cursor:default!important;pointer-events:none!important}.monaco-sash.vertical{cursor:ew-resize;top:0;width:var(--vscode-sash-size);height:100%}.monaco-sash.horizontal{cursor:ns-resize;left:0;width:100%;height:var(--vscode-sash-size)}.monaco-sash:not(.disabled)>.orthogonal-drag-handle{content:\" \";height:calc(var(--vscode-sash-size) * 2);width:calc(var(--vscode-sash-size) * 2);z-index:100;display:block;cursor:all-scroll;position:absolute}.monaco-sash.horizontal.orthogonal-edge-north:not(.disabled)>.orthogonal-drag-handle.start,.monaco-sash.horizontal.orthogonal-edge-south:not(.disabled)>.orthogonal-drag-handle.end{cursor:nwse-resize}.monaco-sash.horizontal.orthogonal-edge-north:not(.disabled)>.orthogonal-drag-handle.end,.monaco-sash.horizontal.orthogonal-edge-south:not(.disabled)>.orthogonal-drag-handle.start{cursor:nesw-resize}.monaco-sash.vertical>.orthogonal-drag-handle.start{left:calc(var(--vscode-sash-size) * -.5);top:calc(var(--vscode-sash-size) * -1)}.monaco-sash.vertical>.orthogonal-drag-handle.end{left:calc(var(--vscode-sash-size) * -.5);bottom:calc(var(--vscode-sash-size) * -1)}.monaco-sash.horizontal>.orthogonal-drag-handle.start{top:calc(var(--vscode-sash-size) * -.5);left:calc(var(--vscode-sash-size) * -1)}.monaco-sash.horizontal>.orthogonal-drag-handle.end{top:calc(var(--vscode-sash-size) * -.5);right:calc(var(--vscode-sash-size) * -1)}.monaco-sash:before{content:\"\";pointer-events:none;position:absolute;width:100%;height:100%;background:transparent}.monaco-enable-motion .monaco-sash:before{transition:background-color .1s ease-out}.monaco-sash.hover:before,.monaco-sash.active:before{background:var(--vscode-sash-hoverBorder)}.monaco-sash.vertical:before{width:var(--vscode-sash-hover-size);left:calc(50% - (var(--vscode-sash-hover-size) / 2))}.monaco-sash.horizontal:before{height:var(--vscode-sash-hover-size);top:calc(50% - (var(--vscode-sash-hover-size) / 2))}.pointer-events-disabled{pointer-events:none!important}.monaco-sash.debug{background:#0ff}.monaco-sash.debug.disabled{background:#0ff3}.monaco-sash.debug:not(.disabled)>.orthogonal-drag-handle{background:red}.monaco-dropdown{height:100%;padding:0}.monaco-dropdown>.dropdown-label{cursor:pointer;height:100%;display:flex;align-items:center;justify-content:center}.monaco-dropdown>.dropdown-label>.action-label.disabled{cursor:default}.monaco-dropdown-with-primary{display:flex!important;flex-direction:row;border-radius:5px}.monaco-dropdown-with-primary>.action-container>.action-label{margin-right:0}.monaco-dropdown-with-primary>.dropdown-action-container>.monaco-dropdown>.dropdown-label .codicon[class*=codicon-]{font-size:12px;padding-left:0;padding-right:0;line-height:16px;margin-left:-3px}.monaco-dropdown-with-primary>.dropdown-action-container>.monaco-dropdown>.dropdown-label>.action-label{display:block;background-size:16px;background-position:center center;background-repeat:no-repeat}.monaco-toolbar{height:100%}.monaco-toolbar .toolbar-toggle-more{display:inline-block;padding:0}.monaco-toolbar.responsive{.monaco-action-bar>.actions-container>.action-item{flex-shrink:1;min-width:20px}}.monaco-action-bar .action-item.menu-entry .action-label.icon{width:16px;height:16px;background-repeat:no-repeat;background-position:50%;background-size:16px}.monaco-action-bar .action-item.menu-entry.text-only .action-label{color:var(--vscode-descriptionForeground);overflow:hidden;border-radius:2px}.monaco-action-bar .action-item.menu-entry.text-only.use-comma:not(:last-of-type) .action-label:after{content:\", \"}.monaco-action-bar .action-item.menu-entry.text-only+.action-item:not(.text-only)>.monaco-dropdown .action-label{color:var(--vscode-descriptionForeground)}.monaco-dropdown-with-default{display:flex!important;flex-direction:row;border-radius:5px}.monaco-dropdown-with-default>.action-container>.action-label{margin-right:0}.monaco-dropdown-with-default>.action-container.menu-entry>.action-label.icon{width:16px;height:16px;background-repeat:no-repeat;background-position:50%;background-size:16px}.monaco-dropdown-with-default:hover{background-color:var(--vscode-toolbar-hoverBackground)}.monaco-dropdown-with-default>.dropdown-action-container>.monaco-dropdown>.dropdown-label .codicon[class*=codicon-]{font-size:12px;padding-left:0;padding-right:0;line-height:16px;margin-left:-3px}.monaco-dropdown-with-default>.dropdown-action-container>.monaco-dropdown>.dropdown-label>.action-label{display:block;background-size:16px;background-position:center center;background-repeat:no-repeat}.monaco-editor .diff-hidden-lines-widget{width:100%}.monaco-editor .diff-hidden-lines{height:0px;transform:translateY(-10px);font-size:13px;line-height:14px}.monaco-editor .diff-hidden-lines:not(.dragging) .top:hover,.monaco-editor .diff-hidden-lines:not(.dragging) .bottom:hover,.monaco-editor .diff-hidden-lines .top.dragging,.monaco-editor .diff-hidden-lines .bottom.dragging{background-color:var(--vscode-focusBorder)}.monaco-editor .diff-hidden-lines .top,.monaco-editor .diff-hidden-lines .bottom{transition:background-color .1s ease-out;height:4px;background-color:transparent;background-clip:padding-box;border-bottom:2px solid transparent;border-top:4px solid transparent}.monaco-editor.draggingUnchangedRegion.canMoveTop:not(.canMoveBottom) *,.monaco-editor .diff-hidden-lines .top.canMoveTop:not(.canMoveBottom),.monaco-editor .diff-hidden-lines .bottom.canMoveTop:not(.canMoveBottom){cursor:n-resize!important}.monaco-editor.draggingUnchangedRegion:not(.canMoveTop).canMoveBottom *,.monaco-editor .diff-hidden-lines .top:not(.canMoveTop).canMoveBottom,.monaco-editor .diff-hidden-lines .bottom:not(.canMoveTop).canMoveBottom{cursor:s-resize!important}.monaco-editor.draggingUnchangedRegion.canMoveTop.canMoveBottom *,.monaco-editor .diff-hidden-lines .top.canMoveTop.canMoveBottom,.monaco-editor .diff-hidden-lines .bottom.canMoveTop.canMoveBottom{cursor:ns-resize!important}.monaco-editor .diff-hidden-lines .top{transform:translateY(4px)}.monaco-editor .diff-hidden-lines .bottom{transform:translateY(-6px)}.monaco-editor .diff-unchanged-lines{background:var(--vscode-diffEditor-unchangedCodeBackground)}.monaco-editor .noModificationsOverlay{z-index:1;background:var(--vscode-editor-background);display:flex;justify-content:center;align-items:center}.monaco-editor .diff-hidden-lines .center{background:var(--vscode-diffEditor-unchangedRegionBackground);color:var(--vscode-diffEditor-unchangedRegionForeground);overflow:hidden;display:block;text-overflow:ellipsis;white-space:nowrap;height:24px;box-shadow:inset 0 -5px 5px -7px var(--vscode-diffEditor-unchangedRegionShadow),inset 0 5px 5px -7px var(--vscode-diffEditor-unchangedRegionShadow)}.monaco-editor .diff-hidden-lines .center span.codicon{vertical-align:middle}.monaco-editor .diff-hidden-lines .center a:hover .codicon{cursor:pointer;color:var(--vscode-editorLink-activeForeground)!important}.monaco-editor .diff-hidden-lines div.breadcrumb-item{cursor:pointer}.monaco-editor .diff-hidden-lines div.breadcrumb-item:hover{color:var(--vscode-editorLink-activeForeground)}.monaco-editor .movedOriginal,.monaco-editor .movedModified{border:2px solid var(--vscode-diffEditor-move-border)}.monaco-editor .movedOriginal.currentMove,.monaco-editor .movedModified.currentMove{border:2px solid var(--vscode-diffEditor-moveActive-border)}.monaco-diff-editor .moved-blocks-lines path.currentMove{stroke:var(--vscode-diffEditor-moveActive-border)}.monaco-diff-editor .moved-blocks-lines path{pointer-events:visiblestroke}.monaco-diff-editor .moved-blocks-lines .arrow{fill:var(--vscode-diffEditor-move-border)}.monaco-diff-editor .moved-blocks-lines .arrow.currentMove{fill:var(--vscode-diffEditor-moveActive-border)}.monaco-diff-editor .moved-blocks-lines .arrow-rectangle{fill:var(--vscode-editor-background)}.monaco-diff-editor .moved-blocks-lines{position:absolute;pointer-events:none}.monaco-diff-editor .moved-blocks-lines path{fill:none;stroke:var(--vscode-diffEditor-move-border);stroke-width:2}.monaco-editor .char-delete.diff-range-empty{margin-left:-1px;border-left:solid var(--vscode-diffEditor-removedTextBackground) 3px}.monaco-editor .char-insert.diff-range-empty{border-left:solid var(--vscode-diffEditor-insertedTextBackground) 3px}.monaco-editor .fold-unchanged{cursor:pointer}.monaco-diff-editor .diff-moved-code-block{display:flex;justify-content:flex-end;margin-top:-4px}.monaco-diff-editor .diff-moved-code-block .action-bar .action-label.codicon{width:12px;height:12px;font-size:12px}.monaco-diff-editor .diffOverview{z-index:9}.monaco-diff-editor .diffOverview .diffViewport{z-index:10}.monaco-diff-editor.vs .diffOverview{background:#00000008}.monaco-diff-editor.vs-dark .diffOverview{background:#ffffff03}.monaco-scrollable-element.modified-in-monaco-diff-editor.vs .scrollbar,.monaco-scrollable-element.modified-in-monaco-diff-editor.vs-dark .scrollbar{background:#0000}.monaco-scrollable-element.modified-in-monaco-diff-editor.hc-black .scrollbar,.monaco-scrollable-element.modified-in-monaco-diff-editor.hc-light .scrollbar{background:none}.monaco-scrollable-element.modified-in-monaco-diff-editor .slider{z-index:10}.modified-in-monaco-diff-editor .slider.active{background:#ababab66}.modified-in-monaco-diff-editor.hc-black .slider.active,.modified-in-monaco-diff-editor.hc-light .slider.active{background:none}.monaco-editor .insert-sign,.monaco-diff-editor .insert-sign,.monaco-editor .delete-sign,.monaco-diff-editor .delete-sign{font-size:11px!important;opacity:.7!important;display:flex!important;align-items:center}.monaco-editor.hc-black .insert-sign,.monaco-diff-editor.hc-black .insert-sign,.monaco-editor.hc-black .delete-sign,.monaco-diff-editor.hc-black .delete-sign,.monaco-editor.hc-light .insert-sign,.monaco-diff-editor.hc-light .insert-sign,.monaco-editor.hc-light .delete-sign,.monaco-diff-editor.hc-light .delete-sign{opacity:1}.monaco-editor .inline-deleted-margin-view-zone,.monaco-editor .inline-added-margin-view-zone{text-align:right}.monaco-editor .arrow-revert-change{z-index:10;position:absolute}.monaco-editor .arrow-revert-change:hover{cursor:pointer}.monaco-editor .view-zones .view-lines .view-line span{display:inline-block}.monaco-editor .margin-view-zones .lightbulb-glyph:hover{cursor:pointer}.monaco-editor .char-insert,.monaco-diff-editor .char-insert{background-color:var(--vscode-diffEditor-insertedTextBackground)}.monaco-editor .line-insert,.monaco-diff-editor .line-insert{background-color:var(--vscode-diffEditor-insertedLineBackground, var(--vscode-diffEditor-insertedTextBackground))}.monaco-editor .line-insert,.monaco-editor .char-insert{box-sizing:border-box;border:1px solid var(--vscode-diffEditor-insertedTextBorder)}.monaco-editor.hc-black .line-insert,.monaco-editor.hc-light .line-insert,.monaco-editor.hc-black .char-insert,.monaco-editor.hc-light .char-insert{border-style:dashed}.monaco-editor .line-delete,.monaco-editor .char-delete{box-sizing:border-box;border:1px solid var(--vscode-diffEditor-removedTextBorder)}.monaco-editor.hc-black .line-delete,.monaco-editor.hc-light .line-delete,.monaco-editor.hc-black .char-delete,.monaco-editor.hc-light .char-delete{border-style:dashed}.monaco-editor .inline-added-margin-view-zone,.monaco-editor .gutter-insert,.monaco-diff-editor .gutter-insert{background-color:var(--vscode-diffEditorGutter-insertedLineBackground, var(--vscode-diffEditor-insertedLineBackground), var(--vscode-diffEditor-insertedTextBackground))}.monaco-editor .char-delete,.monaco-diff-editor .char-delete,.monaco-editor .inline-deleted-text{background-color:var(--vscode-diffEditor-removedTextBackground)}.monaco-editor .inline-deleted-text{text-decoration:line-through}.monaco-editor .line-delete,.monaco-diff-editor .line-delete{background-color:var(--vscode-diffEditor-removedLineBackground, var(--vscode-diffEditor-removedTextBackground))}.monaco-editor .inline-deleted-margin-view-zone,.monaco-editor .gutter-delete,.monaco-diff-editor .gutter-delete{background-color:var(--vscode-diffEditorGutter-removedLineBackground, var(--vscode-diffEditor-removedLineBackground), var(--vscode-diffEditor-removedTextBackground))}.monaco-diff-editor.side-by-side .editor.modified{box-shadow:-6px 0 5px -5px var(--vscode-scrollbar-shadow);border-left:1px solid var(--vscode-diffEditor-border)}.monaco-diff-editor.side-by-side .editor.original{box-shadow:6px 0 5px -5px var(--vscode-scrollbar-shadow);border-right:1px solid var(--vscode-diffEditor-border)}.monaco-diff-editor .diffViewport{background:var(--vscode-scrollbarSlider-background)}.monaco-diff-editor .diffViewport:hover{background:var(--vscode-scrollbarSlider-hoverBackground)}.monaco-diff-editor .diffViewport:active{background:var(--vscode-scrollbarSlider-activeBackground)}.monaco-editor .diagonal-fill{background-image:linear-gradient(-45deg,var(--vscode-diffEditor-diagonalFill) 12.5%,#0000 12.5%,#0000 50%,var(--vscode-diffEditor-diagonalFill) 50%,var(--vscode-diffEditor-diagonalFill) 62.5%,#0000 62.5%,#0000 100%);background-size:8px 8px}.monaco-diff-editor .gutter{position:relative;overflow:hidden;flex-shrink:0;flex-grow:0;>div{position:absolute}.gutterItem{opacity:0;transition:opacity .7s;&.showAlways{opacity:1;transition:none}&.noTransition{transition:none}}&:hover .gutterItem{opacity:1;transition:opacity .1s ease-in-out}.gutterItem{.background{position:absolute;height:100%;left:50%;width:1px;border-left:2px var(--vscode-menu-separatorBackground) solid}.buttons{position:absolute;width:100%;display:flex;justify-content:center;align-items:center;.monaco-toolbar{height:fit-content;.monaco-action-bar{line-height:1;.actions-container{width:fit-content;border-radius:4px;background:var(--vscode-editorGutter-itemBackground);.action-item{&:hover{background:var(--vscode-toolbar-hoverBackground)}.action-label{color:var(--vscode-editorGutter-itemGlyphForeground);padding:1px 2px}}}}}}}}.monaco-diff-editor .diff-hidden-lines-compact{display:flex;height:11px;.line-left,.line-right{height:1px;border-top:1px solid;border-color:var(--vscode-editorCodeLens-foreground);opacity:.5;margin:auto;width:100%}.line-left{width:20px}.text{color:var(--vscode-editorCodeLens-foreground);text-wrap:nowrap;font-size:11px;line-height:11px;margin:0 4px}}.monaco-editor .line-delete-selectable{user-select:text!important;-webkit-user-select:text!important;z-index:1!important}.line-delete-selectable .view-line{user-select:text!important;-webkit-user-select:text!important}.monaco-editor .selection-anchor{background-color:#007acc;width:2px!important}.monaco-editor .bracket-match{box-sizing:border-box;background-color:var(--vscode-editorBracketMatch-background);border:1px solid var(--vscode-editorBracketMatch-border)}.inline-editor-progress-decoration{display:inline-block;width:1em;height:1em}.inline-progress-widget{display:flex!important;justify-content:center;align-items:center}.inline-progress-widget .icon{font-size:80%!important}.inline-progress-widget:hover .icon{font-size:90%!important;animation:none}.inline-progress-widget:hover .icon:before{content:var(--vscode-icon-x-content);font-family:var(--vscode-icon-x-font-family)}.monaco-editor .monaco-editor-overlaymessage{padding-bottom:8px;z-index:10000}.monaco-editor .monaco-editor-overlaymessage.below{padding-bottom:0;padding-top:8px;z-index:10000}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.monaco-editor .monaco-editor-overlaymessage.fadeIn{animation:fadeIn .15s ease-out}@keyframes fadeOut{0%{opacity:1}to{opacity:0}}.monaco-editor .monaco-editor-overlaymessage.fadeOut{animation:fadeOut .1s ease-out}.monaco-editor .monaco-editor-overlaymessage .message{padding:2px 4px;color:var(--vscode-editorHoverWidget-foreground);background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-inputValidation-infoBorder);border-radius:3px}.monaco-editor .monaco-editor-overlaymessage .message p{margin-block:0px}.monaco-editor .monaco-editor-overlaymessage .message a{color:var(--vscode-textLink-foreground)}.monaco-editor .monaco-editor-overlaymessage .message a:hover{color:var(--vscode-textLink-activeForeground)}.monaco-editor.hc-black .monaco-editor-overlaymessage .message,.monaco-editor.hc-light .monaco-editor-overlaymessage .message{border-width:2px}.monaco-editor .monaco-editor-overlaymessage .anchor{width:0!important;height:0!important;border-color:transparent;border-style:solid;z-index:1000;border-width:8px;position:absolute;left:2px}.monaco-editor .monaco-editor-overlaymessage .anchor.top{border-bottom-color:var(--vscode-inputValidation-infoBorder)}.monaco-editor .monaco-editor-overlaymessage .anchor.below{border-top-color:var(--vscode-inputValidation-infoBorder)}.monaco-editor .monaco-editor-overlaymessage:not(.below) .anchor.top,.monaco-editor .monaco-editor-overlaymessage.below .anchor.below{display:none}.monaco-editor .monaco-editor-overlaymessage.below .anchor.top{display:inherit;top:-8px}.monaco-text-button{box-sizing:border-box;display:flex;width:100%;padding:4px;border-radius:2px;text-align:center;cursor:pointer;justify-content:center;align-items:center;border:1px solid var(--vscode-button-border, transparent);line-height:18px}.monaco-text-button:focus{outline-offset:2px!important}.monaco-text-button:hover{text-decoration:none!important}.monaco-button.disabled:focus,.monaco-button.disabled{opacity:.4!important;cursor:default}.monaco-text-button .codicon{margin:0 .2em;color:inherit!important}.monaco-text-button.monaco-text-button-with-short-label{flex-direction:row;flex-wrap:wrap;padding:0 4px;overflow:hidden;height:28px}.monaco-text-button.monaco-text-button-with-short-label>.monaco-button-label{flex-basis:100%}.monaco-text-button.monaco-text-button-with-short-label>.monaco-button-label-short{flex-grow:1;width:0;overflow:hidden}.monaco-text-button.monaco-text-button-with-short-label>.monaco-button-label,.monaco-text-button.monaco-text-button-with-short-label>.monaco-button-label-short{display:flex;justify-content:center;align-items:center;font-weight:400;font-style:inherit;padding:4px 0}.monaco-button-dropdown{display:flex;cursor:pointer}.monaco-button-dropdown.disabled{cursor:default}.monaco-button-dropdown>.monaco-button:focus{outline-offset:-1px!important}.monaco-button-dropdown.disabled>.monaco-button.disabled,.monaco-button-dropdown.disabled>.monaco-button.disabled:focus,.monaco-button-dropdown.disabled>.monaco-button-dropdown-separator{opacity:.4!important}.monaco-button-dropdown>.monaco-button.monaco-text-button{border-right-width:0!important}.monaco-button-dropdown .monaco-button-dropdown-separator{padding:4px 0;cursor:default}.monaco-button-dropdown .monaco-button-dropdown-separator>div{height:100%;width:1px}.monaco-button-dropdown>.monaco-button.monaco-dropdown-button{border:1px solid var(--vscode-button-border, transparent);border-left-width:0!important;border-radius:0 2px 2px 0;display:flex;align-items:center}.monaco-button-dropdown>.monaco-button.monaco-text-button{border-radius:2px 0 0 2px}.monaco-description-button{display:flex;flex-direction:column;align-items:center;margin:4px 5px}.monaco-description-button .monaco-button-description{font-style:italic;font-size:11px;padding:4px 20px}.monaco-description-button .monaco-button-label,.monaco-description-button .monaco-button-description{display:flex;justify-content:center;align-items:center}.monaco-description-button .monaco-button-label>.codicon,.monaco-description-button .monaco-button-description>.codicon{margin:0 .2em;color:inherit!important}.monaco-button.default-colors,.monaco-button-dropdown.default-colors>.monaco-button{color:var(--vscode-button-foreground);background-color:var(--vscode-button-background)}.monaco-button.default-colors:hover,.monaco-button-dropdown.default-colors>.monaco-button:hover{background-color:var(--vscode-button-hoverBackground)}.monaco-button.default-colors.secondary,.monaco-button-dropdown.default-colors>.monaco-button.secondary{color:var(--vscode-button-secondaryForeground);background-color:var(--vscode-button-secondaryBackground)}.monaco-button.default-colors.secondary:hover,.monaco-button-dropdown.default-colors>.monaco-button.secondary:hover{background-color:var(--vscode-button-secondaryHoverBackground)}.monaco-button-dropdown.default-colors .monaco-button-dropdown-separator{background-color:var(--vscode-button-background);border-top:1px solid var(--vscode-button-border);border-bottom:1px solid var(--vscode-button-border)}.monaco-button-dropdown.default-colors .monaco-button.secondary+.monaco-button-dropdown-separator{background-color:var(--vscode-button-secondaryBackground)}.monaco-button-dropdown.default-colors .monaco-button-dropdown-separator>div{background-color:var(--vscode-button-separator)}.action-widget{font-size:13px;min-width:100px;max-width:80vw;z-index:40;display:block;width:100%;border:1px solid var(--vscode-menu-border)!important;border-radius:5px;background-color:var(--vscode-menu-background);color:var(--vscode-menu-foreground);padding:4px;box-shadow:0 2px 8px var(--vscode-widget-shadow)}.context-view-block{position:fixed;cursor:initial;left:0;top:0;width:100%;height:100%;z-index:-1}.context-view-pointerBlock{position:fixed;cursor:initial;left:0;top:0;width:100%;height:100%;z-index:2}.action-widget .monaco-list{user-select:none;-webkit-user-select:none;border:none!important;border-width:0!important}.action-widget .monaco-list:focus:before{outline:0!important}.action-widget .monaco-list .monaco-scrollable-element{overflow:visible}.action-widget .monaco-list .monaco-list-row{padding:0 4px;white-space:nowrap;cursor:pointer;touch-action:none;width:100%;border-radius:3px}.action-widget .monaco-list .monaco-list-row.action.focused:not(.option-disabled){background-color:var(--vscode-list-activeSelectionBackground)!important;color:var(--vscode-list-activeSelectionForeground);outline:1px solid var(--vscode-menu-selectionBorder, transparent);outline-offset:-1px}.action-widget .monaco-list-row.group-header{color:var(--vscode-descriptionForeground)!important;font-weight:600;font-size:13px}.action-widget .monaco-list-row.group-header:not(:first-of-type){margin-top:2px}.action-widget .monaco-scrollable-element .monaco-list-rows .monaco-list-row.separator{border-top:1px solid var(--vscode-editorHoverWidget-border);color:var(--vscode-descriptionForeground);font-size:12px;padding:0;margin:4px 0 0;cursor:default;user-select:none;border-radius:0}.action-widget .monaco-scrollable-element .monaco-list-rows .monaco-list-row.separator.focused{outline:0 solid;background-color:transparent;border-radius:0}.action-widget .monaco-list-row.separator:first-of-type{border-top:none;margin-top:0}.action-widget .monaco-list .group-header,.action-widget .monaco-list .option-disabled,.action-widget .monaco-list .option-disabled:before,.action-widget .monaco-list .option-disabled .focused,.action-widget .monaco-list .option-disabled .focused:before{cursor:default!important;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;background-color:transparent!important;outline:0 solid!important}.action-widget .monaco-list-row.action{display:flex;gap:4px;align-items:center}.action-widget .monaco-list-row.action.option-disabled,.action-widget .monaco-list:focus .monaco-list-row.focused.action.option-disabled,.action-widget .monaco-list-row.action.option-disabled .codicon,.action-widget .monaco-list:not(.drop-target):not(.dragging) .monaco-list-row:hover:not(.selected):not(.focused).option-disabled{color:var(--vscode-disabledForeground)}.action-widget .monaco-list-row.action:not(.option-disabled) .codicon{color:inherit}.action-widget .monaco-list-row.action .title{flex:1;overflow:hidden;text-overflow:ellipsis}.action-widget .monaco-list-row.action .monaco-keybinding>.monaco-keybinding-key{background-color:var(--vscode-keybindingLabel-background);color:var(--vscode-keybindingLabel-foreground);border-style:solid;border-width:1px;border-radius:3px;border-color:var(--vscode-keybindingLabel-border);border-bottom-color:var(--vscode-keybindingLabel-bottomBorder);box-shadow:inset 0 -1px 0 var(--vscode-widget-shadow)}.action-widget .action-widget-action-bar{background-color:var(--vscode-menu-background);border-top:1px solid var(--vscode-menu-border);margin-top:2px}.action-widget .action-widget-action-bar:before{display:block;content:\"\";width:100%}.action-widget .action-widget-action-bar .actions-container{padding:4px 8px 2px 24px}.action-widget-action-bar .action-label{color:var(--vscode-textLink-activeForeground);font-size:13px;line-height:22px;padding:0;pointer-events:all}.action-widget-action-bar .action-item{margin-right:16px;pointer-events:none}.action-widget-action-bar .action-label:hover{background-color:transparent!important}.monaco-action-bar .actions-container.highlight-toggled .action-label.checked{background:var(--vscode-actionBar-toggledBackground)!important}.action-widget .monaco-list .monaco-list-row .description{opacity:.7;margin-left:.5em}.monaco-keybinding{display:flex;align-items:center;line-height:10px}.monaco-keybinding>.monaco-keybinding-key{display:inline-block;border-style:solid;border-width:1px;border-radius:3px;vertical-align:middle;font-size:11px;padding:3px 5px;margin:0 2px}.monaco-keybinding>.monaco-keybinding-key:first-child{margin-left:0}.monaco-keybinding>.monaco-keybinding-key:last-child{margin-right:0}.monaco-keybinding>.monaco-keybinding-key-separator{display:inline-block}.monaco-keybinding>.monaco-keybinding-key-chord-separator{width:6px}.post-edit-widget{box-shadow:0 0 8px 2px var(--vscode-widget-shadow);border:1px solid var(--vscode-widget-border, transparent);border-radius:4px;color:var(--vscode-button-foreground);background-color:var(--vscode-button-background);overflow:hidden}.post-edit-widget .monaco-button{padding:2px;border:none;border-radius:0}.post-edit-widget .monaco-button:hover{background-color:var(--vscode-button-hoverBackground)!important}.post-edit-widget .monaco-button .codicon{margin:0}@font-face{font-family:codicon;font-display:block;src:url(data:font/ttf;base64,AAEAAAALAIAAAwAwR1NVQiCLJXoAAAE4AAAAVE9TLzI3UEsvAAABjAAAAGBjbWFwdCJY8AAACfwAAB5QZ2x5ZpdPvvsAACxYAAGRYGhlYWRYkqBSAAAA4AAAADZoaGVhAlYDLwAAALwAAAAkaG10eFs1/+YAAAHsAAAIEGxvY2EPPKwaAAAoTAAABAptYXhwAx0BiAAAARgAAAAgbmFtZZP7uU8AAb24AAAB+HBvc3RPbs8TAAG/sAAAHMQAAQAAASwAAAAAASz/+v/+AS4AAQAAAAAAAAAAAAAAAAAAAgQAAQAAAAEAAD/d1LtfDzz1AAsBLAAAAAB8JbCAAAAAAHwlsID/+v/8AS4BLQAAAAgAAgAAAAAAAAABAAACBAF8AA8AAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKADAAPgACREZMVAAObGF0bgAaAAQAAAAAAAAAAQAAAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAQBKwGQAAUAAAC+ANIAAAAqAL4A0gAAAJAADgBNAAACAAUDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFBmRWQAwOpg8QMBLAAAABsBRwAEAAAAAQAAAAAAAAAAAAAAAAACAAAAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEs//8BLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEs//8BLP//ASz//wEsAAABLAAAASz//wEs//8BLP//ASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEs//8BLP//ASz//wEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASz//AEsAAABLP//ASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABIAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLP//ASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABIAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASAAAAEsAAABLAAAASD/+gEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEgAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABIAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABIAAAASwAAAEsAAABIAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEs//8BLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEs//8BLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEs//8BLAAAASwAAAEsAAABLAAAASz//wEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAASwAAAEsAAABLAAAAAAABQAAAAMAAAAsAAAABAAABaQAAQAAAAAEngADAAEAAAAsAAMACgAABaQABARyAAAAEgAQAAMAAuqI6ozqx+rJ6wnrTuxx8QP//wAA6mDqiuqP6snqzOsL61DxAf//AAAAAAAAAAAAAAAAAAAAAAABABIAYgBmANYA1gFQAdYEGAAAAAMBHAF8AXcA1gFmAckBUwDKAToBqQBXAfkBlAGfAZ4AqgA7AV0AnQDzASgARgHHAI0AGAH0ALUAnwFzAUsBQQFCAd4A7ADBAN4B1QG2AKMBxQGvAPsBvAGwAb4BxAHAAbkA4QG1AcIAAgAFAAYACwAMAA0ADgAPABAAEQATABwAHgAfACAAcABxAHIAcwB2AHcAIwAkACUAJgAoACsAMAAxADIAMwA0ADUANwA4ADkAOgBBAD4AQgBDAEQARQBHAEgATABOAFAAVABoAGoAawBsAHsAfQB/AIIAhgCIAIkAigCLAIwAjgCPAJAAkQCSAJMAlQCWAJgAmQCeAKAApACoAKkArACtAK4ArwCwALEAsgC0ALYAuAC6ALsAvAC9AL4AwADDAMQAxQDGAMsAzADPANoA2wDfAOMA5wDoAOsA7QDuAO8A8AD3APgA+QD6APsA/AD9AQEBGQEdAR4BIAEjASQBJQEmASoBKwEwATIBMwE5ATsBPAE9AT8BRAFFAUgBSgFNAU4BVgCGAVoBWwFcAV4BXwFhAWIBZAFlAWoBawFsAW0BbgFvAXEBcgF0AXYBeQF6AX0AlwF/AYABgQGCAYMBiwGMAY0BjgGPAZMBmQGaAZsBnQGhAaMBpgGnAagBqgGrAbEBsgGzAbQBtwC1AbgBugG9Ab8BwQHDAcsBzAHWAdgB2gHcAd0B3wHgAeEB4gHjAecB6QHqAesB7gE9Ae8B8QHzAfoB+wH8ACUB/gICAgMAuAEfASEBIgB0AHUAhAA/AIUAeAG5AIMAhwCBAG8AKQAqATQApQCrAOkB6AABABkAegEYAUwBhgHGAVgA3AGYAZcBUAGsAVkBaABuAfAASQE2AKYA5AEpAUcBaQAvAVcBTwA8AD0AUQHIAewB5gHkAeUA0QGEAYcBRgCAAf8CAQIAAc4BzwHRAdIB0wHUAc0AEgBmAVIAtwH4AH4A9QEEAQMBAgBaAFkAWAAWAPYA0ADTAG0AfAGJAL8AewAXAOUA5gFVACEAIgEnABUB7QFDARcBBQEGAQwBCQELAQ4BDwESARUBFgEIAQcBygDxAWcAogAHAAgACQAKARQBDQERAB0A6gEvASwAQAAbABoAVgDUANUBkABVAZYBpQD0ATgB2QHbAE0BogDCAfUANgFUAT4BNwF1AGUBGwF+AaQAlwCUAa4BnADZANcA2AH3AfYASgGIAYUAZwDd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AADrcQAAAeIAAOtyAADrcgAAAeMAAOtzAADrcwAAAecAAOt0AADrdAAAAekAAOt1AADrdQAAAeoAAOt2AADrdgAAAesAAOt3AADrdwAAAe4AAOt4AADreAAAAT0AAOt5AADreQAAAe8AAOt6AADregAAAfEAAOt7AADrewAAAfMAAOt8AADrfAAAAfoAAOt9AADrfQAAAfsAAOt+AADrfgAAAfwAAOt/AADrfwAAACUAAOuAAADrgAAAAf4AAOuBAADrgQAAAgIAAOuCAADrggAAAgMAAOuDAADrgwAAALgAAOuEAADrhAAAAR8AAOuFAADrhQAAASEAAOuGAADrhgAAASIAAOuHAADrhwAAAHQAAOuIAADriAAAAHUAAOuJAADriQAAAIQAAOuKAADrigAAAD8AAOuLAADriwAAAIUAAOuMAADrjAAAAHgAAOuNAADrjQAAAbkAAOuOAADrjgAAAIMAAOuPAADrjwAAAIcAAOuQAADrkAAAAIEAAOuRAADrkQAAAG8AAOuSAADrkgAAACkAAOuTAADrkwAAACoAAOuUAADrlAAAATQAAOuVAADrlQAAAKUAAOuWAADrlgAAAKsAAOuXAADrlwAAAOkAAOuYAADrmAAAAegAAOuZAADrmQAAAAEAAOuaAADrmgAAABkAAOubAADrmwAAAHoAAOucAADrnAAAARgAAOudAADrnQAAAUwAAOueAADrngAAAYYAAOufAADrnwAAAcYAAOugAADroAAAAVgAAOuhAADroQAAANwAAOuiAADrogAAAZgAAOujAADrowAAAZcAAOukAADrpAAAAVAAAOulAADrpQAAAawAAOumAADrpgAAAVkAAOunAADrpwAAAWgAAOuoAADrqAAAAG4AAOupAADrqQAAAfAAAOuqAADrqgAAAEkAAOurAADrqwAAATYAAOusAADrrAAAAKYAAOutAADrrQAAAOQAAOuuAADrrgAAASkAAOuvAADrrwAAAUcAAOuwAADrsAAAAWkAAOuxAADrsQAAAC8AAOuyAADrsgAAAVcAAOuzAADrswAAAU8AAOu0AADrtAAAADwAAOu1AADrtQAAAD0AAOu2AADrtgAAAFEAAOu3AADrtwAAAcgAAOu4AADruAAAAewAAOu5AADruQAAAeYAAOu6AADrugAAAeQAAOu7AADruwAAAeUAAOu8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AQxjb2RpY29uUmVndWxhcmNvZGljb25jb2RpY29uVmVyc2lvbiAxLjE1Y29kaWNvblRoZSBpY29uIGZvbnQgZm9yIFZpc3VhbCBTdHVkaW8gQ29kZWh0dHA6Ly9mb250ZWxsby5jb20AYwBvAGQAaQBjAG8AbgBSAGUAZwB1AGwAYQByAGMAbwBkAGkAYwBvAG4AYwBvAGQAaQBjAG8AbgBWAGUAcgBzAGkAbwBuACAAMQAuADEANQBjAG8AZABpAGMAbwBuAFQAaABlACAAaQBjAG8AbgAgAGYAbwBuAHQAIABmAG8AcgAgAFYAaQBzAHUAYQBsACAAUwB0AHUAZABpAG8AIABDAG8AZABlAGgAdAB0AHAAOgAvAC8AZgBvAG4AdABlAGwAbABvAC4AYwBvAG0AAgAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIEAQIBAwEEAQUBBgEHAQgBCQEKAQsBDAENAQ4BDwEQAREBEgETARQBFQEWARcBGAEZARoBGwEcAR0BHgEfASABIQEiASMBJAElASYBJwEoASkBKgErASwBLQEuAS8BMAExATIBMwE0ATUBNgE3ATgBOQE6ATsBPAE9AT4BPwFAAUEBQgFDAUQBRQFGAUcBSAFJAUoBSwFMAU0BTgFPAVABUQFSAVMBVAFVAVYBVwFYAVkBWgFbAVwBXQFeAV8BYAFhAWIBYwFkAWUBZgFnAWgBaQFqAWsBbAFtAW4BbwFwAXEBcgFzAXQBdQF2AXcBeAF5AXoBewF8AX0BfgF/AYABgQGCAYMBhAGFAYYBhwGIAYkBigGLAYwBjQGOAY8BkAGRAZIBkwGUAZUBlgGXAZgBmQGaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcUBxgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTAdQB1QHWAdcB2AHZAdoB2wHcAd0B3gHfAeAB4QHiAeMB5AHlAeYB5wHoAekB6gHrAewB7QHuAe8B8AHxAfIB8wH0AfUB9gH3AfgB+QH6AfsB/AH9Af4B/wIAAgECAgIDAgQCBQIGAgcCCAIJAgoCCwIMAg0CDgIPAhACEQISAhMCFAIVAhYCFwIYAhkCGgIbAhwCHQIeAh8CIAIhAiICIwIkAiUCJgInAigCKQIqAisCLAItAi4CLwIwAjECMgIzAjQCNQI2AjcCOAI5AjoCOwI8Aj0CPgI/AkACQQJCAkMCRAJFAkYCRwJIAkkCSgJLAkwCTQJOAk8CUAJRAlICUwJUAlUCVgJXAlgCWQJaAlsCXAJdAl4CXwJgAmECYgJjAmQCZQJmAmcCaAJpAmoCawJsAm0CbgJvAnACcQJyAnMCdAJ1AnYCdwJ4AnkCegJ7AnwCfQJ+An8CgAKBAoICgwKEAoUChgKHAogCiQKKAosCjAKNAo4CjwKQApECkgKTApQClQKWApcCmAKZApoCmwKcAp0CngKfAqACoQKiAqMCpAKlAqYCpwKoAqkCqgKrAqwCrQKuAq8CsAKxArICswK0ArUCtgK3ArgCuQK6ArsCvAK9Ar4CvwLAAsECwgLDAsQCxQLGAscCyALJAsoCywLMAs0CzgLPAtAC0QLSAtMC1ALVAtYC1wLYAtkC2gLbAtwC3QLeAt8C4ALhAuIC4wLkAuUC5gLnAugC6QLqAusC7ALtAu4C7wLwAvEC8gLzAvQC9QL2AvcC+AL5AvoC+wL8Av0C/gL/AwADAQMCAwMDBAMFAAdhY2NvdW50FGFjdGl2YXRlLWJyZWFrcG9pbnRzA2FkZAVhZ2VudAdhcmNoaXZlCmFycm93LWJvdGgRYXJyb3ctY2lyY2xlLWRvd24RYXJyb3ctY2lyY2xlLWxlZnQSYXJyb3ctY2lyY2xlLXJpZ2h0D2Fycm93LWNpcmNsZS11cAphcnJvdy1kb3duCmFycm93LWxlZnQLYXJyb3ctcmlnaHQQYXJyb3ctc21hbGwtZG93bhBhcnJvdy1zbWFsbC1sZWZ0EWFycm93LXNtYWxsLXJpZ2h0DmFycm93LXNtYWxsLXVwCmFycm93LXN3YXAIYXJyb3ctdXAGYXR0YWNoDGF6dXJlLWRldm9wcwVhenVyZQtiZWFrZXItc3RvcAZiZWFrZXIIYmVsbC1kb3QOYmVsbC1zbGFzaC1kb3QKYmVsbC1zbGFzaARiZWxsBWJsYW5rBGJvbGQEYm9vawhib29rbWFyawticmFja2V0LWRvdA1icmFja2V0LWVycm9yCWJyaWVmY2FzZQlicm9hZGNhc3QHYnJvd3NlcgNidWcFYnVpbGQIY2FsZW5kYXINY2FsbC1pbmNvbWluZw1jYWxsLW91dGdvaW5nDmNhc2Utc2Vuc2l0aXZlEmNoYXQtc3BhcmtsZS1lcnJvchRjaGF0LXNwYXJrbGUtd2FybmluZwxjaGF0LXNwYXJrbGUJY2hlY2stYWxsBWNoZWNrCWNoZWNrbGlzdAxjaGV2cm9uLWRvd24MY2hldnJvbi1sZWZ0DWNoZXZyb24tcmlnaHQKY2hldnJvbi11cARjaGlwDGNocm9tZS1jbG9zZQ9jaHJvbWUtbWF4aW1pemUPY2hyb21lLW1pbmltaXplDmNocm9tZS1yZXN0b3JlDWNpcmNsZS1maWxsZWQTY2lyY2xlLWxhcmdlLWZpbGxlZAxjaXJjbGUtbGFyZ2UMY2lyY2xlLXNsYXNoE2NpcmNsZS1zbWFsbC1maWxsZWQMY2lyY2xlLXNtYWxsBmNpcmNsZQ1jaXJjdWl0LWJvYXJkCWNsZWFyLWFsbAZjbGlwcHkJY2xvc2UtYWxsBWNsb3NlDmNsb3VkLWRvd25sb2FkDGNsb3VkLXVwbG9hZAVjbG91ZAhjb2RlLW9zcwtjb2RlLXJldmlldwRjb2RlBmNvZmZlZQxjb2xsYXBzZS1hbGwKY29sbGVjdGlvbgpjb2xvci1tb2RlB2NvbWJpbmUYY29tbWVudC1kaXNjdXNzaW9uLXF1b3RlGmNvbW1lbnQtZGlzY3Vzc2lvbi1zcGFya2xlEmNvbW1lbnQtZGlzY3Vzc2lvbg1jb21tZW50LWRyYWZ0EmNvbW1lbnQtdW5yZXNvbHZlZAdjb21tZW50DmNvbXBhc3MtYWN0aXZlC2NvbXBhc3MtZG90B2NvbXBhc3MPY29waWxvdC1ibG9ja2VkDWNvcGlsb3QtZXJyb3ITY29waWxvdC1pbi1wcm9ncmVzcw1jb3BpbG90LWxhcmdlFWNvcGlsb3Qtbm90LWNvbm5lY3RlZA5jb3BpbG90LXNub296ZQ9jb3BpbG90LXN1Y2Nlc3MTY29waWxvdC11bmF2YWlsYWJsZRVjb3BpbG90LXdhcm5pbmctbGFyZ2UPY29waWxvdC13YXJuaW5nB2NvcGlsb3QEY29weQhjb3ZlcmFnZQtjcmVkaXQtY2FyZAZjdXJzb3IEZGFzaAlkYXNoYm9hcmQIZGF0YWJhc2UJZGVidWctYWxsD2RlYnVnLWFsdC1zbWFsbAlkZWJ1Zy1hbHQnZGVidWctYnJlYWtwb2ludC1jb25kaXRpb25hbC11bnZlcmlmaWVkHGRlYnVnLWJyZWFrcG9pbnQtY29uZGl0aW9uYWwgZGVidWctYnJlYWtwb2ludC1kYXRhLXVudmVyaWZpZWQVZGVidWctYnJlYWtwb2ludC1kYXRhJGRlYnVnLWJyZWFrcG9pbnQtZnVuY3Rpb24tdW52ZXJpZmllZBlkZWJ1Zy1icmVha3BvaW50LWZ1bmN0aW9uH2RlYnVnLWJyZWFrcG9pbnQtbG9nLXVudmVyaWZpZWQUZGVidWctYnJlYWtwb2ludC1sb2ccZGVidWctYnJlYWtwb2ludC11bnN1cHBvcnRlZA9kZWJ1Zy1jb25uZWN0ZWQNZGVidWctY29uc29sZRRkZWJ1Zy1jb250aW51ZS1zbWFsbA5kZWJ1Zy1jb3ZlcmFnZRBkZWJ1Zy1kaXNjb25uZWN0EmRlYnVnLWxpbmUtYnktbGluZQtkZWJ1Zy1wYXVzZQtkZWJ1Zy1yZXJ1bhNkZWJ1Zy1yZXN0YXJ0LWZyYW1lDWRlYnVnLXJlc3RhcnQWZGVidWctcmV2ZXJzZS1jb250aW51ZRdkZWJ1Zy1zdGFja2ZyYW1lLWFjdGl2ZRBkZWJ1Zy1zdGFja2ZyYW1lC2RlYnVnLXN0YXJ0D2RlYnVnLXN0ZXAtYmFjaw9kZWJ1Zy1zdGVwLWludG8OZGVidWctc3RlcC1vdXQPZGVidWctc3RlcC1vdmVyCmRlYnVnLXN0b3AFZGVidWcQZGVza3RvcC1kb3dubG9hZBNkZXZpY2UtY2FtZXJhLXZpZGVvDWRldmljZS1jYW1lcmENZGV2aWNlLW1vYmlsZQpkaWZmLWFkZGVkDGRpZmYtaWdub3JlZA1kaWZmLW1vZGlmaWVkDWRpZmYtbXVsdGlwbGUMZGlmZi1yZW1vdmVkDGRpZmYtcmVuYW1lZAtkaWZmLXNpbmdsZQRkaWZmB2Rpc2NhcmQJZWRpdC1jb2RlDGVkaXQtc2Vzc2lvbgxlZGl0LXNwYXJrbGUEZWRpdA1lZGl0b3ItbGF5b3V0CGVsbGlwc2lzDGVtcHR5LXdpbmRvdwZlcmFzZXILZXJyb3Itc21hbGwFZXJyb3IHZXhjbHVkZQpleHBhbmQtYWxsBmV4cG9ydBBleHRlbnNpb25zLWxhcmdlCmV4dGVuc2lvbnMKZXllLWNsb3NlZANleWUIZmVlZGJhY2sLZmlsZS1iaW5hcnkJZmlsZS1jb2RlCmZpbGUtbWVkaWEIZmlsZS1wZGYOZmlsZS1zdWJtb2R1bGUWZmlsZS1zeW1saW5rLWRpcmVjdG9yeRFmaWxlLXN5bWxpbmstZmlsZQlmaWxlLXRleHQIZmlsZS16aXAEZmlsZQVmaWxlcw1maWx0ZXItZmlsbGVkBmZpbHRlcgRmbGFnBWZsYW1lCWZvbGQtZG93bgdmb2xkLXVwBGZvbGQNZm9sZGVyLWFjdGl2ZQ5mb2xkZXItbGlicmFyeQ1mb2xkZXItb3BlbmVkBmZvbGRlcgRnYW1lBGdlYXIEZ2lmdAtnaXN0LXNlY3JldARnaXN0EmdpdC1icmFuY2gtY2hhbmdlcxRnaXQtYnJhbmNoLWNvbmZsaWN0cxlnaXQtYnJhbmNoLXN0YWdlZC1jaGFuZ2VzCmdpdC1icmFuY2gKZ2l0LWNvbW1pdAtnaXQtY29tcGFyZQlnaXQtZmV0Y2gIZ2l0LWxlbnMJZ2l0LW1lcmdlF2dpdC1wdWxsLXJlcXVlc3QtY2xvc2VkF2dpdC1wdWxsLXJlcXVlc3QtY3JlYXRlFWdpdC1wdWxsLXJlcXVlc3QtZG9uZRZnaXQtcHVsbC1yZXF1ZXN0LWRyYWZ0HmdpdC1wdWxsLXJlcXVlc3QtZ28tdG8tY2hhbmdlcxxnaXQtcHVsbC1yZXF1ZXN0LW5ldy1jaGFuZ2VzEGdpdC1wdWxsLXJlcXVlc3QPZ2l0LXN0YXNoLWFwcGx5DWdpdC1zdGFzaC1wb3AJZ2l0LXN0YXNoDWdpdGh1Yi1hY3Rpb24KZ2l0aHViLWFsdA9naXRodWItaW52ZXJ0ZWQOZ2l0aHViLXByb2plY3QGZ2l0aHViBWdsb2JlFWdvLXRvLWVkaXRpbmctc2Vzc2lvbgpnby10by1maWxlDGdvLXRvLXNlYXJjaAdncmFiYmVyCmdyYXBoLWxlZnQKZ3JhcGgtbGluZQ1ncmFwaC1zY2F0dGVyBWdyYXBoB2dyaXBwZXIRZ3JvdXAtYnktcmVmLXR5cGUMaGVhcnQtZmlsbGVkBWhlYXJ0B2hpc3RvcnkEaG9tZQ9ob3Jpem9udGFsLXJ1bGUFaHVib3QFaW5ib3gGaW5kZW50CmluZGV4LXplcm8EaW5mbwZpbnNlcnQHaW5zcGVjdAtpc3N1ZS1kcmFmdA5pc3N1ZS1yZW9wZW5lZAZpc3N1ZXMGaXRhbGljBmplcnNleQRqc29uDmtlYmFiLXZlcnRpY2FsA2tleRJrZXlib2FyZC10YWItYWJvdmUSa2V5Ym9hcmQtdGFiLWJlbG93DGtleWJvYXJkLXRhYgNsYXcNbGF5ZXJzLWFjdGl2ZQpsYXllcnMtZG90BmxheWVycxdsYXlvdXQtYWN0aXZpdHliYXItbGVmdBhsYXlvdXQtYWN0aXZpdHliYXItcmlnaHQPbGF5b3V0LWNlbnRlcmVkDmxheW91dC1tZW51YmFyE2xheW91dC1wYW5lbC1jZW50ZXIRbGF5b3V0LXBhbmVsLWRvY2sUbGF5b3V0LXBhbmVsLWp1c3RpZnkRbGF5b3V0LXBhbmVsLWxlZnQQbGF5b3V0LXBhbmVsLW9mZhJsYXlvdXQtcGFuZWwtcmlnaHQMbGF5b3V0LXBhbmVsGGxheW91dC1zaWRlYmFyLWxlZnQtZG9jaxdsYXlvdXQtc2lkZWJhci1sZWZ0LW9mZhNsYXlvdXQtc2lkZWJhci1sZWZ0GWxheW91dC1zaWRlYmFyLXJpZ2h0LWRvY2sYbGF5b3V0LXNpZGViYXItcmlnaHQtb2ZmFGxheW91dC1zaWRlYmFyLXJpZ2h0EGxheW91dC1zdGF0dXNiYXIGbGF5b3V0B2xpYnJhcnkRbGlnaHRidWxiLWF1dG9maXgPbGlnaHRidWxiLWVtcHR5EWxpZ2h0YnVsYi1zcGFya2xlCWxpZ2h0YnVsYg1saW5rLWV4dGVybmFsBGxpbmsJbGlzdC1mbGF0DGxpc3Qtb3JkZXJlZA5saXN0LXNlbGVjdGlvbglsaXN0LXRyZWUObGlzdC11bm9yZGVyZWQKbGl2ZS1zaGFyZQdsb2FkaW5nCGxvY2F0aW9uCmxvY2stc21hbGwEbG9jawZtYWduZXQJbWFpbC1yZWFkBG1haWwKbWFwLWZpbGxlZBNtYXAtdmVydGljYWwtZmlsbGVkDG1hcC12ZXJ0aWNhbANtYXAIbWFya2Rvd24DbWNwCW1lZ2FwaG9uZQdtZW50aW9uBG1lbnUKbWVyZ2UtaW50bwVtZXJnZQptaWMtZmlsbGVkA21pYwltaWxlc3RvbmUGbWlycm9yDG1vcnRhci1ib2FyZARtb3ZlEG11bHRpcGxlLXdpbmRvd3MFbXVzaWMEbXV0ZQ5uZXctY29sbGVjdGlvbghuZXctZmlsZQpuZXctZm9sZGVyB25ld2xpbmUKbm8tbmV3bGluZQRub3RlEW5vdGVib29rLXRlbXBsYXRlCG5vdGVib29rCG9jdG9mYWNlD29wZW4taW4tcHJvZHVjdAxvcGVuLXByZXZpZXcMb3JnYW5pemF0aW9uBm91dHB1dAdwYWNrYWdlCHBhaW50Y2FuC3Bhc3MtZmlsbGVkBHBhc3MKcGVyY2VudGFnZQpwZXJzb24tYWRkBnBlcnNvbgVwaWFubwlwaWUtY2hhcnQDcGluDHBpbm5lZC1kaXJ0eQZwaW5uZWQLcGxheS1jaXJjbGUEcGx1Zw1wcmVzZXJ2ZS1jYXNlB3ByZXZpZXcQcHJpbWl0aXZlLXNxdWFyZQdwcm9qZWN0BXB1bHNlBnB5dGhvbghxdWVzdGlvbgVxdW90ZQZxdW90ZXMLcmFkaW8tdG93ZXIJcmVhY3Rpb25zC3JlY29yZC1rZXlzDHJlY29yZC1zbWFsbAZyZWNvcmQEcmVkbwpyZWZlcmVuY2VzB3JlZnJlc2gFcmVnZXgPcmVtb3RlLWV4cGxvcmVyBnJlbW90ZQZyZW1vdmUGcmVuYW1lC3JlcGxhY2UtYWxsB3JlcGxhY2UFcmVwbHkKcmVwby1jbG9uZQpyZXBvLWZldGNoD3JlcG8tZm9yY2UtcHVzaAtyZXBvLWZvcmtlZAtyZXBvLXBpbm5lZAlyZXBvLXB1bGwJcmVwby1wdXNoDXJlcG8tc2VsZWN0ZWQEcmVwbwZyZXBvcnQFcm9ib3QGcm9ja2V0EnJvb3QtZm9sZGVyLW9wZW5lZAtyb290LWZvbGRlcgNyc3MEcnVieQlydW4tYWJvdmUQcnVuLWFsbC1jb3ZlcmFnZQdydW4tYWxsCXJ1bi1iZWxvdwxydW4tY292ZXJhZ2UKcnVuLWVycm9ycw1ydW4td2l0aC1kZXBzCHNhdmUtYWxsB3NhdmUtYXMEc2F2ZQtzY3JlZW4tZnVsbA1zY3JlZW4tbm9ybWFsDHNlYXJjaC1mdXp6eQxzZWFyY2gtbGFyZ2UOc2VhcmNoLXNwYXJrbGULc2VhcmNoLXN0b3AGc2VhcmNoFHNlbmQtdG8tcmVtb3RlLWFnZW50BHNlbmQSc2VydmVyLWVudmlyb25tZW50DnNlcnZlci1wcm9jZXNzBnNlcnZlcg1zZXR0aW5ncy1nZWFyCHNldHRpbmdzBXNoYXJlBnNoaWVsZAdzaWduLWluCHNpZ24tb3V0BHNraXAGc21pbGV5BXNuYWtlD3NvcnQtcHJlY2VkZW5jZQ5zcGFya2xlLWZpbGxlZAdzcGFya2xlEHNwbGl0LWhvcml6b250YWwOc3BsaXQtdmVydGljYWwIc3F1aXJyZWwKc3Rhci1lbXB0eQlzdGFyLWZ1bGwJc3Rhci1oYWxmC3N0b3AtY2lyY2xlDXN0cmlrZXRocm91Z2gNc3Vycm91bmQtd2l0aAxzeW1ib2wtYXJyYXkOc3ltYm9sLWJvb2xlYW4Mc3ltYm9sLWNsYXNzDHN5bWJvbC1jb2xvcg9zeW1ib2wtY29uc3RhbnQSc3ltYm9sLWVudW0tbWVtYmVyC3N5bWJvbC1lbnVtDHN5bWJvbC1ldmVudAxzeW1ib2wtZmllbGQQc3ltYm9sLWludGVyZmFjZQpzeW1ib2wta2V5DnN5bWJvbC1rZXl3b3JkE3N5bWJvbC1tZXRob2QtYXJyb3cNc3ltYm9sLW1ldGhvZAtzeW1ib2wtbWlzYw5zeW1ib2wtbnVtZXJpYw9zeW1ib2wtb3BlcmF0b3IQc3ltYm9sLXBhcmFtZXRlcg9zeW1ib2wtcHJvcGVydHkMc3ltYm9sLXJ1bGVyDnN5bWJvbC1zbmlwcGV0EHN5bWJvbC1zdHJ1Y3R1cmUPc3ltYm9sLXZhcmlhYmxlDHN5bmMtaWdub3JlZARzeW5jBXRhYmxlA3RhZwZ0YXJnZXQIdGFza2xpc3QJdGVsZXNjb3BlDXRlcm1pbmFsLWJhc2gMdGVybWluYWwtY21kD3Rlcm1pbmFsLWRlYmlhbhF0ZXJtaW5hbC1naXQtYmFzaA50ZXJtaW5hbC1saW51eBN0ZXJtaW5hbC1wb3dlcnNoZWxsDXRlcm1pbmFsLXRtdXgPdGVybWluYWwtdWJ1bnR1CHRlcm1pbmFsCXRleHQtc2l6ZQh0aGlua2luZwp0aHJlZS1iYXJzEXRodW1ic2Rvd24tZmlsbGVkCnRodW1ic2Rvd24PdGh1bWJzdXAtZmlsbGVkCHRodW1ic3VwBXRvb2xzBXRyYXNoDXRyaWFuZ2xlLWRvd24NdHJpYW5nbGUtbGVmdA50cmlhbmdsZS1yaWdodAt0cmlhbmdsZS11cAd0d2l0dGVyEnR5cGUtaGllcmFyY2h5LXN1YhR0eXBlLWhpZXJhcmNoeS1zdXBlcg50eXBlLWhpZXJhcmNoeQZ1bmZvbGQTdW5ncm91cC1ieS1yZWYtdHlwZQZ1bmxvY2sGdW5tdXRlCnVudmVyaWZpZWQOdmFyaWFibGUtZ3JvdXAPdmVyaWZpZWQtZmlsbGVkCHZlcmlmaWVkCXZtLWFjdGl2ZQp2bS1jb25uZWN0CnZtLW91dGxpbmUKdm0tcGVuZGluZwp2bS1ydW5uaW5nAnZtAnZyD3ZzY29kZS1pbnNpZGVycwZ2c2NvZGUEd2FuZAd3YXJuaW5nBXdhdGNoCndoaXRlc3BhY2UKd2hvbGUtd29yZA13aW5kb3ctYWN0aXZlCXdvcmQtd3JhcBF3b3Jrc3BhY2UtdHJ1c3RlZBF3b3Jrc3BhY2UtdW5rbm93bhN3b3Jrc3BhY2UtdW50cnVzdGVkB3pvb20taW4Iem9vbS1vdXQAAA==) format(\"truetype\")}.codicon[class*=codicon-]{font: 16px/1 codicon;display:inline-block;text-decoration:none;text-rendering:auto;text-align:center;text-transform:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;user-select:none;-webkit-user-select:none}.codicon-wrench-subaction{opacity:.5}@keyframes codicon-spin{to{transform:rotate(360deg)}}.codicon-sync.codicon-modifier-spin,.codicon-loading.codicon-modifier-spin,.codicon-gear.codicon-modifier-spin,.codicon-notebook-state-executing.codicon-modifier-spin{animation:codicon-spin 1.5s steps(30) infinite}.codicon-modifier-disabled{opacity:.4}.codicon-loading,.codicon-tree-item-loading:before{animation-duration:1s!important;animation-timing-function:cubic-bezier(.53,.21,.29,.67)!important}.monaco-editor .codicon.codicon-symbol-array,.monaco-workbench .codicon.codicon-symbol-array{color:var(--vscode-symbolIcon-arrayForeground)}.monaco-editor .codicon.codicon-symbol-boolean,.monaco-workbench .codicon.codicon-symbol-boolean{color:var(--vscode-symbolIcon-booleanForeground)}.monaco-editor .codicon.codicon-symbol-class,.monaco-workbench .codicon.codicon-symbol-class{color:var(--vscode-symbolIcon-classForeground)}.monaco-editor .codicon.codicon-symbol-method,.monaco-workbench .codicon.codicon-symbol-method{color:var(--vscode-symbolIcon-methodForeground)}.monaco-editor .codicon.codicon-symbol-color,.monaco-workbench .codicon.codicon-symbol-color{color:var(--vscode-symbolIcon-colorForeground)}.monaco-editor .codicon.codicon-symbol-constant,.monaco-workbench .codicon.codicon-symbol-constant{color:var(--vscode-symbolIcon-constantForeground)}.monaco-editor .codicon.codicon-symbol-constructor,.monaco-workbench .codicon.codicon-symbol-constructor{color:var(--vscode-symbolIcon-constructorForeground)}.monaco-editor .codicon.codicon-symbol-value,.monaco-workbench .codicon.codicon-symbol-value,.monaco-editor .codicon.codicon-symbol-enum,.monaco-workbench .codicon.codicon-symbol-enum{color:var(--vscode-symbolIcon-enumeratorForeground)}.monaco-editor .codicon.codicon-symbol-enum-member,.monaco-workbench .codicon.codicon-symbol-enum-member{color:var(--vscode-symbolIcon-enumeratorMemberForeground)}.monaco-editor .codicon.codicon-symbol-event,.monaco-workbench .codicon.codicon-symbol-event{color:var(--vscode-symbolIcon-eventForeground)}.monaco-editor .codicon.codicon-symbol-field,.monaco-workbench .codicon.codicon-symbol-field{color:var(--vscode-symbolIcon-fieldForeground)}.monaco-editor .codicon.codicon-symbol-file,.monaco-workbench .codicon.codicon-symbol-file{color:var(--vscode-symbolIcon-fileForeground)}.monaco-editor .codicon.codicon-symbol-folder,.monaco-workbench .codicon.codicon-symbol-folder{color:var(--vscode-symbolIcon-folderForeground)}.monaco-editor .codicon.codicon-symbol-function,.monaco-workbench .codicon.codicon-symbol-function{color:var(--vscode-symbolIcon-functionForeground)}.monaco-editor .codicon.codicon-symbol-interface,.monaco-workbench .codicon.codicon-symbol-interface{color:var(--vscode-symbolIcon-interfaceForeground)}.monaco-editor .codicon.codicon-symbol-key,.monaco-workbench .codicon.codicon-symbol-key{color:var(--vscode-symbolIcon-keyForeground)}.monaco-editor .codicon.codicon-symbol-keyword,.monaco-workbench .codicon.codicon-symbol-keyword{color:var(--vscode-symbolIcon-keywordForeground)}.monaco-editor .codicon.codicon-symbol-module,.monaco-workbench .codicon.codicon-symbol-module{color:var(--vscode-symbolIcon-moduleForeground)}.monaco-editor .codicon.codicon-symbol-namespace,.monaco-workbench .codicon.codicon-symbol-namespace{color:var(--vscode-symbolIcon-namespaceForeground)}.monaco-editor .codicon.codicon-symbol-null,.monaco-workbench .codicon.codicon-symbol-null{color:var(--vscode-symbolIcon-nullForeground)}.monaco-editor .codicon.codicon-symbol-number,.monaco-workbench .codicon.codicon-symbol-number{color:var(--vscode-symbolIcon-numberForeground)}.monaco-editor .codicon.codicon-symbol-object,.monaco-workbench .codicon.codicon-symbol-object{color:var(--vscode-symbolIcon-objectForeground)}.monaco-editor .codicon.codicon-symbol-operator,.monaco-workbench .codicon.codicon-symbol-operator{color:var(--vscode-symbolIcon-operatorForeground)}.monaco-editor .codicon.codicon-symbol-package,.monaco-workbench .codicon.codicon-symbol-package{color:var(--vscode-symbolIcon-packageForeground)}.monaco-editor .codicon.codicon-symbol-property,.monaco-workbench .codicon.codicon-symbol-property{color:var(--vscode-symbolIcon-propertyForeground)}.monaco-editor .codicon.codicon-symbol-reference,.monaco-workbench .codicon.codicon-symbol-reference{color:var(--vscode-symbolIcon-referenceForeground)}.monaco-editor .codicon.codicon-symbol-snippet,.monaco-workbench .codicon.codicon-symbol-snippet{color:var(--vscode-symbolIcon-snippetForeground)}.monaco-editor .codicon.codicon-symbol-string,.monaco-workbench .codicon.codicon-symbol-string{color:var(--vscode-symbolIcon-stringForeground)}.monaco-editor .codicon.codicon-symbol-struct,.monaco-workbench .codicon.codicon-symbol-struct{color:var(--vscode-symbolIcon-structForeground)}.monaco-editor .codicon.codicon-symbol-text,.monaco-workbench .codicon.codicon-symbol-text{color:var(--vscode-symbolIcon-textForeground)}.monaco-editor .codicon.codicon-symbol-type-parameter,.monaco-workbench .codicon.codicon-symbol-type-parameter{color:var(--vscode-symbolIcon-typeParameterForeground)}.monaco-editor .codicon.codicon-symbol-unit,.monaco-workbench .codicon.codicon-symbol-unit{color:var(--vscode-symbolIcon-unitForeground)}.monaco-editor .codicon.codicon-symbol-variable,.monaco-workbench .codicon.codicon-symbol-variable{color:var(--vscode-symbolIcon-variableForeground)}.monaco-editor .lightBulbWidget{display:flex;align-items:center;justify-content:center}.monaco-editor .lightBulbWidget:hover{cursor:pointer}.monaco-editor .lightBulbWidget.codicon-light-bulb,.monaco-editor .lightBulbWidget.codicon-lightbulb-sparkle{color:var(--vscode-editorLightBulb-foreground)}.monaco-editor .lightBulbWidget.codicon-lightbulb-autofix,.monaco-editor .lightBulbWidget.codicon-lightbulb-sparkle-autofix{color:var(--vscode-editorLightBulbAutoFix-foreground, var(--vscode-editorLightBulb-foreground))}.monaco-editor .lightBulbWidget.codicon-sparkle-filled{color:var(--vscode-editorLightBulbAi-foreground, var(--vscode-icon-foreground))}.monaco-editor .lightBulbWidget:before{position:relative;z-index:2}.monaco-editor .lightBulbWidget:after{position:absolute;top:0;left:0;content:\"\";display:block;width:100%;height:100%;opacity:.3;z-index:1}.monaco-editor .glyph-margin-widgets .cgmr[class*=codicon-gutter-lightbulb]{display:block;cursor:pointer}.monaco-editor .glyph-margin-widgets .cgmr.codicon-gutter-lightbulb,.monaco-editor .glyph-margin-widgets .cgmr.codicon-gutter-lightbulb-sparkle{color:var(--vscode-editorLightBulb-foreground)}.monaco-editor .glyph-margin-widgets .cgmr.codicon-gutter-lightbulb-auto-fix,.monaco-editor .glyph-margin-widgets .cgmr.codicon-gutter-lightbulb-aifix-auto-fix{color:var(--vscode-editorLightBulbAutoFix-foreground, var(--vscode-editorLightBulb-foreground))}.monaco-editor .glyph-margin-widgets .cgmr.codicon-gutter-lightbulb-sparkle-filled{color:var(--vscode-editorLightBulbAi-foreground, var(--vscode-icon-foreground))}.monaco-editor .codelens-decoration{overflow:hidden;display:inline-flex!important;align-items:center;text-overflow:ellipsis;white-space:nowrap;color:var(--vscode-editorCodeLens-foreground);line-height:var(--vscode-editorCodeLens-lineHeight);font-size:var(--vscode-editorCodeLens-fontSize);padding-right:calc(var(--vscode-editorCodeLens-fontSize)*.5);font-feature-settings:var(--vscode-editorCodeLens-fontFeatureSettings);font-family:var(--vscode-editorCodeLens-fontFamily),var(--vscode-editorCodeLens-fontFamilyDefault)}.monaco-editor .codelens-decoration>span,.monaco-editor .codelens-decoration>a{user-select:none;-webkit-user-select:none;white-space:nowrap;vertical-align:sub;display:inline-flex;align-items:center}.monaco-editor .codelens-decoration>a{text-decoration:none}.monaco-editor .codelens-decoration>a:hover{cursor:pointer;color:var(--vscode-editorLink-activeForeground)!important}.monaco-editor .codelens-decoration>a:hover .codicon{color:var(--vscode-editorLink-activeForeground)!important}.monaco-editor .codelens-decoration .codicon[class*=codicon-]{vertical-align:middle;color:currentColor!important;color:var(--vscode-editorCodeLens-foreground);line-height:var(--vscode-editorCodeLens-lineHeight);font-size:var(--vscode-editorCodeLens-fontSize)}.monaco-editor .codelens-decoration>a:hover .codicon:before{cursor:pointer}@keyframes fadein{0%{opacity:0}to{opacity:1}}.monaco-editor .codelens-decoration.fadein{animation:fadein .1s linear}.monaco-editor .inlineSuggestionsHints{padding:4px;.warningMessage p{margin:0}}.monaco-editor .inlineSuggestionsHints.withBorder{z-index:39;color:var(--vscode-editorHoverWidget-foreground);background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border)}.monaco-editor .inlineSuggestionsHints a,.monaco-editor .inlineSuggestionsHints a:hover{color:var(--vscode-foreground)!important}.monaco-editor .inlineSuggestionsHints .keybinding{display:flex;margin-left:4px;opacity:.6}.monaco-editor .inlineSuggestionsHints .keybinding .monaco-keybinding-key{font-size:8px;padding:2px 3px}.monaco-editor .inlineSuggestionsHints .availableSuggestionCount a{display:flex;min-width:19px;justify-content:center}.monaco-editor .inlineSuggestionStatusBarItemLabel{margin-right:2px}.monaco-hover{cursor:default;position:absolute;overflow:hidden;user-select:text;-webkit-user-select:text;box-sizing:border-box;line-height:1.5em;white-space:var(--vscode-hover-whiteSpace, normal)}.monaco-hover.fade-in{animation:fadein .1s linear}.monaco-hover.hidden{display:none}.monaco-hover a:hover:not(.disabled){cursor:pointer}.monaco-hover .hover-contents:not(.html-hover-contents){padding:4px 8px}.monaco-hover .markdown-hover>.hover-contents:not(.code-hover-contents){max-width:var(--vscode-hover-maxWidth, 500px);word-wrap:break-word}.monaco-hover .markdown-hover>.hover-contents:not(.code-hover-contents) hr{min-width:100%}.monaco-hover p,.monaco-hover .code,.monaco-hover ul,.monaco-hover h1,.monaco-hover h2,.monaco-hover h3,.monaco-hover h4,.monaco-hover h5,.monaco-hover h6{margin:8px 0}.monaco-hover h1,.monaco-hover h2,.monaco-hover h3,.monaco-hover h4,.monaco-hover h5,.monaco-hover h6{line-height:1.1}.monaco-hover code{font-family:var(--monaco-monospace-font)}.monaco-hover hr{box-sizing:border-box;border-left:0px;border-right:0px;margin:4px -8px -4px;height:1px}.monaco-hover p:first-child,.monaco-hover .code:first-child,.monaco-hover ul:first-child{margin-top:0}.monaco-hover p:last-child,.monaco-hover .code:last-child,.monaco-hover ul:last-child{margin-bottom:0}.monaco-hover ul,.monaco-hover ol{padding-left:20px}.monaco-hover li>p{margin-bottom:0}.monaco-hover li>ul{margin-top:0}.monaco-hover code{border-radius:3px;padding:0 .4em}.monaco-hover .monaco-tokenized-source{white-space:var(--vscode-hover-sourceWhiteSpace, pre-wrap)}.monaco-hover .hover-row.status-bar{font-size:12px;line-height:22px}.monaco-hover .hover-row.status-bar .info{font-style:italic;padding:0 8px}.monaco-hover .hover-row.status-bar .actions{display:flex;padding:0 8px;width:100%}.monaco-hover .hover-row.status-bar .actions .action-container{margin-right:16px;cursor:pointer;overflow:hidden;text-wrap:nowrap;text-overflow:ellipsis}.monaco-hover .hover-row.status-bar .actions .action-container .action .icon{padding-right:4px;vertical-align:middle}.monaco-hover .hover-row.status-bar .actions .action-container a{color:var(--vscode-textLink-foreground);text-decoration:var(--text-link-decoration)}.monaco-hover .hover-row.status-bar .actions .action-container a .icon.codicon{color:var(--vscode-textLink-foreground)}.monaco-hover .markdown-hover .hover-contents .codicon{color:inherit;font-size:inherit;vertical-align:middle}.monaco-hover .hover-contents a.code-link:hover,.monaco-hover .hover-contents a.code-link{color:inherit}.monaco-hover .hover-contents a.code-link:before{content:\"(\"}.monaco-hover .hover-contents a.code-link:after{content:\")\"}.monaco-hover .hover-contents a.code-link>span{text-decoration:underline;border-bottom:1px solid transparent;text-underline-position:under;color:var(--vscode-textLink-foreground)}.monaco-hover .hover-contents a.code-link>span:hover{color:var(--vscode-textLink-activeForeground)}.monaco-hover .markdown-hover .hover-contents:not(.code-hover-contents):not(.html-hover-contents) p:last-child [style*=background-color]{margin-bottom:4px;display:inline-block}.monaco-hover .markdown-hover .hover-contents:not(.code-hover-contents):not(.html-hover-contents) span.codicon{margin-bottom:2px}.monaco-hover-content .action-container a{-webkit-user-select:none;user-select:none}.monaco-hover-content .action-container.disabled{pointer-events:none;opacity:.4;cursor:default}.monaco-hover .action-container,.monaco-hover .action,.monaco-hover button,.monaco-hover .monaco-button,.monaco-hover .monaco-text-button,.monaco-hover [role=button]{-webkit-user-select:none;user-select:none}.monaco-custom-toggle{margin-left:2px;float:left;cursor:pointer;overflow:hidden;width:20px;height:20px;border-radius:3px;border:1px solid transparent;padding:1px;box-sizing:border-box;user-select:none;-webkit-user-select:none}.monaco-custom-toggle:hover{background-color:var(--vscode-inputOption-hoverBackground)}.hc-black .monaco-custom-toggle:hover,.hc-light .monaco-custom-toggle:hover{border:1px dashed var(--vscode-focusBorder)}.hc-black .monaco-custom-toggle,.hc-light .monaco-custom-toggle,.hc-black .monaco-custom-toggle:hover,.hc-light .monaco-custom-toggle:hover{background:none}.monaco-custom-toggle.monaco-checkbox{height:18px;width:18px;border:1px solid transparent;border-radius:3px;margin-right:9px;margin-left:0;padding:0;opacity:1;background-size:16px!important}.monaco-action-bar .checkbox-action-item{display:flex;align-items:center;border-radius:2px;padding-right:2px}.monaco-action-bar .checkbox-action-item:hover{background-color:var(--vscode-toolbar-hoverBackground)}.monaco-action-bar .checkbox-action-item>.monaco-custom-toggle.monaco-checkbox{margin-right:4px}.monaco-action-bar .checkbox-action-item>.checkbox-label{font-size:12px}.monaco-editor .find-widget{position:absolute;z-index:35;height:33px;overflow:hidden;line-height:19px;transition:transform .2s linear;padding:0 4px;box-sizing:border-box;transform:translateY(calc(-100% - 10px));box-shadow:0 0 8px 2px var(--vscode-widget-shadow);color:var(--vscode-editorWidget-foreground);border-left:1px solid var(--vscode-widget-border);border-right:1px solid var(--vscode-widget-border);border-bottom:1px solid var(--vscode-widget-border);border-bottom-left-radius:4px;border-bottom-right-radius:4px;background-color:var(--vscode-editorWidget-background)}.monaco-reduce-motion .monaco-editor .find-widget{transition:transform 0ms linear}.monaco-editor .find-widget textarea{margin:0}.monaco-editor .find-widget.hiddenEditor{display:none}.monaco-editor .find-widget.replaceToggled>.replace-part{display:flex}.monaco-editor .find-widget.visible{transform:translateY(0)}.monaco-editor .find-widget .monaco-inputbox.synthetic-focus{outline:1px solid -webkit-focus-ring-color;outline-offset:-1px;outline-color:var(--vscode-focusBorder)}.monaco-editor .find-widget .monaco-inputbox .input{background-color:transparent;min-height:0}.monaco-editor .find-widget .monaco-findInput .input{font-size:13px}.monaco-editor .find-widget>.find-part,.monaco-editor .find-widget>.replace-part{margin:3px 25px 0 17px;font-size:12px;display:flex}.monaco-editor .find-widget>.find-part .monaco-inputbox,.monaco-editor .find-widget>.replace-part .monaco-inputbox{min-height:25px}.monaco-editor .find-widget>.replace-part .monaco-inputbox>.ibwrapper>.mirror{padding-right:22px}.monaco-editor .find-widget>.find-part .monaco-inputbox>.ibwrapper>.input,.monaco-editor .find-widget>.find-part .monaco-inputbox>.ibwrapper>.mirror,.monaco-editor .find-widget>.replace-part .monaco-inputbox>.ibwrapper>.input,.monaco-editor .find-widget>.replace-part .monaco-inputbox>.ibwrapper>.mirror{padding-top:2px;padding-bottom:2px}.monaco-editor .find-widget>.find-part .find-actions{height:25px;display:flex;align-items:center}.monaco-editor .find-widget>.replace-part .replace-actions{height:25px;display:flex;align-items:center}.monaco-editor .find-widget .monaco-findInput{vertical-align:middle;display:flex;flex:1}.monaco-editor .find-widget .monaco-findInput .monaco-scrollable-element{width:100%}.monaco-editor .find-widget .monaco-findInput .monaco-scrollable-element .scrollbar.vertical{opacity:0}.monaco-editor .find-widget .matchesCount{display:flex;flex:initial;margin:0 0 0 3px;padding:2px 0 0 2px;height:25px;vertical-align:middle;box-sizing:border-box;text-align:center;line-height:23px}.monaco-editor .find-widget .button{width:16px;height:16px;padding:3px;border-radius:5px;flex:initial;margin-left:3px;background-position:center center;background-repeat:no-repeat;cursor:pointer;display:flex;align-items:center;justify-content:center}.monaco-editor .find-widget .codicon-find-selection{width:22px;height:22px;padding:3px;border-radius:5px}.monaco-editor .find-widget .button.left{margin-left:0;margin-right:3px}.monaco-editor .find-widget .button.wide{width:auto;padding:1px 6px;top:-1px}.monaco-editor .find-widget .button.toggle{position:absolute;top:0;left:3px;width:18px;height:100%;border-radius:0;box-sizing:border-box}.monaco-editor .find-widget .button.toggle.disabled{display:none}.monaco-editor .find-widget .disabled{color:var(--vscode-disabledForeground);cursor:default}.monaco-editor .find-widget>.replace-part{display:none}.monaco-editor .find-widget>.replace-part>.monaco-findInput{position:relative;display:flex;vertical-align:middle;flex:auto;flex-grow:0;flex-shrink:0}.monaco-editor .find-widget>.replace-part>.monaco-findInput>.controls{position:absolute;top:3px;right:2px}.monaco-editor .find-widget.reduced-find-widget .matchesCount{display:none}.monaco-editor .find-widget.narrow-find-widget{max-width:257px!important}.monaco-editor .find-widget.collapsed-find-widget{max-width:170px!important}.monaco-editor .find-widget.collapsed-find-widget .button.previous,.monaco-editor .find-widget.collapsed-find-widget .button.next,.monaco-editor .find-widget.collapsed-find-widget .button.replace,.monaco-editor .find-widget.collapsed-find-widget .button.replace-all,.monaco-editor .find-widget.collapsed-find-widget>.find-part .monaco-findInput .controls{display:none}.monaco-editor .find-widget.no-results .matchesCount{color:var(--vscode-errorForeground)}.monaco-editor .findMatch{animation-duration:0;animation-name:inherit!important;background-color:var(--vscode-editor-findMatchHighlightBackground)}.monaco-editor .currentFindMatch{background-color:var(--vscode-editor-findMatchBackground);border:2px solid var(--vscode-editor-findMatchBorder);padding:1px;box-sizing:border-box}.monaco-editor .findScope{background-color:var(--vscode-editor-findRangeHighlightBackground)}.monaco-editor .find-widget .monaco-sash{left:0!important;background-color:var(--vscode-editorWidget-resizeBorder, var(--vscode-editorWidget-border))}.monaco-editor.hc-black .find-widget .button:before{position:relative;top:1px;left:2px}.monaco-editor .find-widget .button:not(.disabled):hover,.monaco-editor .find-widget .codicon-find-selection:hover{background-color:var(--vscode-toolbar-hoverBackground)!important}.monaco-editor.findMatch{background-color:var(--vscode-editor-findMatchHighlightBackground)}.monaco-editor.currentFindMatch{background-color:var(--vscode-editor-findMatchBackground)}.monaco-editor.findScope{background-color:var(--vscode-editor-findRangeHighlightBackground)}.monaco-editor.findMatch{background-color:var(--vscode-editorWidget-background)}.monaco-editor .find-widget>.button.codicon-widget-close{position:absolute;top:5px;right:4px}.monaco-inputbox{position:relative;display:block;padding:0;box-sizing:border-box;border-radius:2px;font-size:inherit}.monaco-inputbox>.ibwrapper>.input,.monaco-inputbox>.ibwrapper>.mirror{padding:4px 6px}.monaco-inputbox>.ibwrapper{position:relative;width:100%}.monaco-inputbox>.ibwrapper>.input{display:inline-block;box-sizing:border-box;width:100%;height:100%;line-height:inherit;border:none;font-family:inherit;font-size:inherit;resize:none;color:inherit}.monaco-inputbox>.ibwrapper>input{text-overflow:ellipsis}.monaco-inputbox>.ibwrapper>textarea.input{display:block;scrollbar-width:none;outline:none}.monaco-inputbox>.ibwrapper>textarea.input::-webkit-scrollbar{display:none}.monaco-inputbox>.ibwrapper>textarea.input.empty{white-space:nowrap}.monaco-inputbox>.ibwrapper>.mirror{position:absolute;display:inline-block;width:100%;top:0;left:0;box-sizing:border-box;white-space:pre-wrap;visibility:hidden;word-wrap:break-word}.monaco-inputbox-container{text-align:right}.monaco-inputbox-container .monaco-inputbox-message{display:inline-block;overflow:hidden;text-align:left;width:100%;box-sizing:border-box;padding:.4em;font-size:12px;line-height:17px;margin-top:-1px;word-wrap:break-word}.monaco-inputbox .monaco-action-bar{position:absolute;right:2px;top:4px}.monaco-inputbox .monaco-action-bar .action-item{margin-left:2px}.monaco-inputbox .monaco-action-bar .action-item .codicon{background-repeat:no-repeat;width:16px;height:16px}.monaco-findInput{position:relative}.monaco-findInput .monaco-inputbox{font-size:13px;width:100%}.monaco-findInput>.controls{position:absolute;top:3px;right:2px}.vs .monaco-findInput.disabled{background-color:#e1e1e1}.vs-dark .monaco-findInput.disabled{background-color:#333}.monaco-findInput.highlight-0 .controls,.hc-light .monaco-findInput.highlight-0 .controls{animation:monaco-findInput-highlight-0 .1s linear 0s}.monaco-findInput.highlight-1 .controls,.hc-light .monaco-findInput.highlight-1 .controls{animation:monaco-findInput-highlight-1 .1s linear 0s}.hc-black .monaco-findInput.highlight-0 .controls,.vs-dark .monaco-findInput.highlight-0 .controls{animation:monaco-findInput-highlight-dark-0 .1s linear 0s}.hc-black .monaco-findInput.highlight-1 .controls,.vs-dark .monaco-findInput.highlight-1 .controls{animation:monaco-findInput-highlight-dark-1 .1s linear 0s}@keyframes monaco-findInput-highlight-0{0%{background:#fdff00cc}to{background:transparent}}@keyframes monaco-findInput-highlight-1{0%{background:#fdff00cc}99%{background:transparent}}@keyframes monaco-findInput-highlight-dark-0{0%{background:#ffffff70}to{background:transparent}}@keyframes monaco-findInput-highlight-dark-1{0%{background:#ffffff70}99%{background:transparent}}.colorpicker-widget{height:190px;user-select:none;-webkit-user-select:none}.colorpicker-color-decoration,.hc-light .colorpicker-color-decoration{border:solid .1em #000;box-sizing:border-box;margin:.1em .2em 0;width:.8em;height:.8em;line-height:.8em;display:inline-block;cursor:pointer}.hc-black .colorpicker-color-decoration,.vs-dark .colorpicker-color-decoration{border:solid .1em #eee}.colorpicker-header{display:flex;height:24px;position:relative;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=);background-size:9px 9px;image-rendering:pixelated}.colorpicker-header .picked-color{width:240px;display:flex;align-items:center;justify-content:center;line-height:24px;cursor:pointer;color:#fff;flex:1;white-space:nowrap;overflow:hidden}.colorpicker-header .picked-color .picked-color-presentation{white-space:nowrap;margin-left:5px;margin-right:5px}.colorpicker-header .picked-color .codicon{color:inherit;font-size:14px}.colorpicker-header .picked-color.light{color:#000}.colorpicker-header .original-color{width:74px;z-index:inherit;cursor:pointer}.standalone-colorpicker{color:var(--vscode-editorHoverWidget-foreground);background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border)}.colorpicker-header.standalone-colorpicker{border-bottom:none}.colorpicker-header .close-button{cursor:pointer;background-color:var(--vscode-editorHoverWidget-background);border-left:1px solid var(--vscode-editorHoverWidget-border)}.colorpicker-header .close-button-inner-div{width:100%;height:100%;text-align:center}.colorpicker-header .close-button-inner-div:hover{background-color:var(--vscode-toolbar-hoverBackground)}.colorpicker-header .close-icon{padding:3px}.colorpicker-body{display:flex;padding:8px;position:relative}.colorpicker-body .saturation-wrap{overflow:hidden;height:150px;position:relative;min-width:220px;flex:1}.colorpicker-body .saturation-box{height:150px;position:absolute}.colorpicker-body .saturation-selection{width:9px;height:9px;margin:-5px 0 0 -5px;border:1px solid rgb(255,255,255);border-radius:100%;box-shadow:0 0 2px #000c;position:absolute}.colorpicker-body .strip{width:25px;height:150px}.colorpicker-body .standalone-strip{width:25px;height:122px}.colorpicker-body .hue-strip{position:relative;margin-left:8px;cursor:grab;background:linear-gradient(to bottom,red,#ff0 17%,#0f0 33%,#0ff,#00f 67%,#f0f 83%,red)}.colorpicker-body .opacity-strip{position:relative;margin-left:8px;cursor:grab;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII=);background-size:9px 9px;image-rendering:pixelated}.colorpicker-body .strip.grabbing{cursor:grabbing}.colorpicker-body .slider{position:absolute;top:0;left:-2px;width:calc(100% + 4px);height:4px;box-sizing:border-box;border:1px solid rgba(255,255,255,.71);box-shadow:0 0 1px #000000d9}.colorpicker-body .strip .overlay{height:150px;pointer-events:none}.colorpicker-body .standalone-strip .standalone-overlay{height:122px;pointer-events:none}.standalone-colorpicker-body{display:block;border:1px solid transparent;border-bottom:1px solid var(--vscode-editorHoverWidget-border);overflow:hidden}.colorpicker-body .insert-button{position:absolute;height:20px;width:58px;padding:0;right:8px;bottom:8px;background:var(--vscode-button-background);color:var(--vscode-button-foreground);border-radius:2px;border:none;cursor:pointer}.colorpicker-body .insert-button:hover{background:var(--vscode-button-hoverBackground)}.monaco-editor .peekview-widget .head{box-sizing:border-box;display:flex;justify-content:space-between;flex-wrap:nowrap}.monaco-editor .peekview-widget .head .peekview-title{display:flex;align-items:baseline;font-size:13px;margin-left:20px;min-width:0;text-overflow:ellipsis;overflow:hidden}.monaco-editor .peekview-widget .head .peekview-title.clickable{cursor:pointer}.monaco-editor .peekview-widget .head .peekview-title .dirname:not(:empty){font-size:.9em;margin-left:.5em}.monaco-editor .peekview-widget .head .peekview-title .meta{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.monaco-editor .peekview-widget .head .peekview-title .dirname,.monaco-editor .peekview-widget .head .peekview-title .filename{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.monaco-editor .peekview-widget .head .peekview-title .meta:not(:empty):before{content:\"-\";padding:0 .3em}.monaco-editor .peekview-widget .head .peekview-actions{flex:1;text-align:right;padding-right:2px}.monaco-editor .peekview-widget .head .peekview-actions>.monaco-action-bar{display:inline-block}.monaco-editor .peekview-widget .head .peekview-actions>.monaco-action-bar,.monaco-editor .peekview-widget .head .peekview-actions>.monaco-action-bar>.actions-container{height:100%}.monaco-editor .peekview-widget>.body{border-top:1px solid;position:relative}.monaco-editor .peekview-widget .head .peekview-title .codicon{margin-right:4px;align-self:center}.monaco-editor .peekview-widget .monaco-list .monaco-list-row.focused .codicon{color:inherit!important}.monaco-editor .zone-widget{position:absolute;z-index:10}.monaco-editor .zone-widget .zone-widget-container{border-top-style:solid;border-bottom-style:solid;border-top-width:0;border-bottom-width:0;position:relative}.monaco-split-view2{position:relative;width:100%;height:100%}.monaco-split-view2>.sash-container{position:absolute;width:100%;height:100%;pointer-events:none}.monaco-split-view2>.sash-container>.monaco-sash{pointer-events:initial}.monaco-split-view2>.monaco-scrollable-element{width:100%;height:100%}.monaco-split-view2>.monaco-scrollable-element>.split-view-container{width:100%;height:100%;white-space:nowrap;position:relative}.monaco-split-view2>.monaco-scrollable-element>.split-view-container>.split-view-view{white-space:initial;position:absolute}.monaco-split-view2>.monaco-scrollable-element>.split-view-container>.split-view-view:not(.visible){display:none}.monaco-split-view2.vertical>.monaco-scrollable-element>.split-view-container>.split-view-view{width:100%}.monaco-split-view2.horizontal>.monaco-scrollable-element>.split-view-container>.split-view-view{height:100%}.monaco-split-view2.separator-border>.monaco-scrollable-element>.split-view-container>.split-view-view:not(:first-child):before{content:\" \";position:absolute;top:0;left:0;z-index:5;pointer-events:none;background-color:var(--separator-border)}.monaco-split-view2.separator-border.horizontal>.monaco-scrollable-element>.split-view-container>.split-view-view:not(:first-child):before{height:100%;width:1px}.monaco-split-view2.separator-border.vertical>.monaco-scrollable-element>.split-view-container>.split-view-view:not(:first-child):before{height:1px;width:100%}.monaco-table{display:flex;flex-direction:column;position:relative;height:100%;width:100%;white-space:nowrap;overflow:hidden}.monaco-table>.monaco-split-view2{border-bottom:1px solid transparent}.monaco-table>.monaco-list{flex:1}.monaco-table-tr{display:flex;height:100%}.monaco-table-th{width:100%;height:100%;font-weight:700;overflow:hidden;text-overflow:ellipsis}.monaco-table-th,.monaco-table-td{box-sizing:border-box;flex-shrink:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.monaco-table>.monaco-split-view2 .monaco-sash.vertical:before{content:\"\";position:absolute;left:calc(var(--vscode-sash-size) / 2);width:0;border-left:1px solid transparent}.monaco-enable-motion .monaco-table>.monaco-split-view2,.monaco-enable-motion .monaco-table>.monaco-split-view2 .monaco-sash.vertical:before{transition:border-color .2s ease-out}.monaco-tl-row{display:flex;height:100%;align-items:center;position:relative}.monaco-tl-row.disabled{cursor:default}.monaco-tl-indent{height:100%;position:absolute;top:0;left:16px;pointer-events:none}.hide-arrows .monaco-tl-indent{left:12px}.monaco-tl-indent>.indent-guide{display:inline-block;box-sizing:border-box;height:100%;border-left:1px solid transparent;opacity:0}.monaco-enable-motion .monaco-tl-indent>.indent-guide{transition:opacity .1s linear}.monaco-tl-twistie,.monaco-tl-contents{height:100%}.monaco-tl-twistie{font-size:10px;text-align:right;padding-right:6px;flex-shrink:0;width:16px;display:flex!important;align-items:center;justify-content:center;transform:translate(3px)}.monaco-tl-contents{flex:1;overflow:hidden}.monaco-tl-twistie:before{border-radius:20px}.monaco-tl-twistie.collapsed:before{transform:rotate(-90deg)}.monaco-tl-twistie.codicon-tree-item-loading:before{animation:codicon-spin 1.25s steps(30) infinite}.monaco-tree-type-filter{position:absolute;top:0;right:0;display:flex;padding:3px;max-width:200px;z-index:100;margin:0 10px 0 6px;border:1px solid var(--vscode-widget-border);border-bottom-left-radius:4px;border-bottom-right-radius:4px}.monaco-enable-motion .monaco-tree-type-filter{transition:top .3s}.monaco-tree-type-filter.disabled{top:-40px!important}.monaco-tree-type-filter-input{flex:1}.monaco-tree-type-filter-input .monaco-inputbox{height:23px}.monaco-tree-type-filter-input .monaco-inputbox>.ibwrapper>.input,.monaco-tree-type-filter-input .monaco-inputbox>.ibwrapper>.mirror{padding:2px 4px}.monaco-tree-type-filter-input .monaco-findInput>.controls{top:2px}.monaco-tree-type-filter-actionbar{margin-left:4px}.monaco-tree-type-filter-actionbar .monaco-action-bar .action-label{padding:2px}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container{position:absolute;top:0;left:0;width:100%;height:0;z-index:13;background-color:var(--vscode-sideBar-background)}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container .monaco-tree-sticky-row.monaco-list-row{position:absolute;width:100%;opacity:1!important;overflow:hidden;background-color:var(--vscode-sideBar-background)}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container .monaco-tree-sticky-row:hover{background-color:var(--vscode-list-hoverBackground)!important;cursor:pointer}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container.empty,.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container.empty .monaco-tree-sticky-container-shadow{display:none}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container .monaco-tree-sticky-container-shadow{position:absolute;bottom:-3px;left:0;height:0px;width:100%}.monaco-list .monaco-scrollable-element .monaco-tree-sticky-container[tabindex=\"0\"]:focus{outline:none}.monaco-editor .zone-widget .zone-widget-container.reference-zone-widget{border-top-width:1px;border-bottom-width:1px}.monaco-editor .reference-zone-widget .inline{display:inline-block;vertical-align:top}.monaco-editor .reference-zone-widget .messages{height:100%;width:100%;text-align:center;padding:3em 0}.monaco-editor .reference-zone-widget .ref-tree{line-height:23px;background-color:var(--vscode-peekViewResult-background);color:var(--vscode-peekViewResult-lineForeground)}.monaco-editor .reference-zone-widget .ref-tree .reference{text-overflow:ellipsis;overflow:hidden}.monaco-editor .reference-zone-widget .ref-tree .reference-file{display:inline-flex;width:100%;height:100%;color:var(--vscode-peekViewResult-fileForeground)}.monaco-editor .reference-zone-widget .ref-tree .monaco-list:focus .selected .reference-file{color:inherit!important}.monaco-editor .reference-zone-widget .ref-tree .monaco-list:focus .monaco-list-rows>.monaco-list-row.selected:not(.highlighted){background-color:var(--vscode-peekViewResult-selectionBackground);color:var(--vscode-peekViewResult-selectionForeground)!important}.monaco-editor .reference-zone-widget .ref-tree .reference-file .count{margin-right:12px;margin-left:auto}.monaco-editor .reference-zone-widget .ref-tree .referenceMatch .highlight{color:var(--vscode-peekViewResult-fileForeground)!important;background-color:var(--vscode-peekViewResult-matchHighlightBackground)!important}.monaco-editor .reference-zone-widget .preview .reference-decoration{background-color:var(--vscode-peekViewEditor-matchHighlightBackground);border:2px solid var(--vscode-peekViewEditor-matchHighlightBorder);box-sizing:border-box}.monaco-editor .reference-zone-widget .preview .monaco-editor .monaco-editor-background,.monaco-editor .reference-zone-widget .preview .monaco-editor .inputarea.ime-input{background-color:var(--vscode-peekViewEditor-background)}.monaco-editor .reference-zone-widget .preview .monaco-editor .margin{background-color:var(--vscode-peekViewEditorGutter-background)}.monaco-editor.hc-black .reference-zone-widget .ref-tree .reference-file,.monaco-editor.hc-light .reference-zone-widget .ref-tree .reference-file{font-weight:700}.monaco-editor.hc-black .reference-zone-widget .ref-tree .referenceMatch .highlight,.monaco-editor.hc-light .reference-zone-widget .ref-tree .referenceMatch .highlight{border:1px dotted var(--vscode-contrastActiveBorder, transparent);box-sizing:border-box}.monaco-count-badge{padding:3px 5px;border-radius:11px;font-size:11px;min-width:18px;min-height:18px;line-height:11px;font-weight:400;text-align:center;display:inline-block;box-sizing:border-box}.monaco-count-badge.long{padding:2px 3px;border-radius:2px;min-height:auto;line-height:normal}.monaco-icon-label{display:flex;overflow:hidden;text-overflow:ellipsis}.monaco-icon-label:before{background-size:16px;background-position:left center;background-repeat:no-repeat;padding-right:6px;width:16px;height:22px;line-height:inherit!important;display:inline-block;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;vertical-align:top;flex-shrink:0}.monaco-icon-label-iconpath{width:16px;height:22px;margin-right:6px;display:flex}.monaco-icon-label-container.disabled{color:var(--vscode-disabledForeground)}.monaco-icon-label>.monaco-icon-label-container{min-width:0;overflow:hidden;text-overflow:ellipsis;flex:1}.monaco-icon-label>.monaco-icon-label-container>.monaco-icon-name-container>.label-name{color:inherit;white-space:pre}.monaco-icon-label>.monaco-icon-label-container>.monaco-icon-name-container>.label-name>.label-separator{margin:0 2px;opacity:.5}.monaco-icon-label>.monaco-icon-label-container>.monaco-icon-suffix-container>.label-suffix{opacity:.7;white-space:pre}.monaco-icon-label>.monaco-icon-label-container>.monaco-icon-description-container>.label-description{opacity:.7;margin-left:.5em;font-size:.9em;white-space:pre}.monaco-icon-label.nowrap>.monaco-icon-label-container>.monaco-icon-description-container>.label-description{white-space:nowrap}.vs .monaco-icon-label>.monaco-icon-label-container>.monaco-icon-description-container>.label-description{opacity:.95}.monaco-icon-label.bold>.monaco-icon-label-container>.monaco-icon-name-container>.label-name,.monaco-icon-label.bold>.monaco-icon-label-container>.monaco-icon-description-container>.label-description{font-weight:700}.monaco-icon-label.italic>.monaco-icon-label-container>.monaco-icon-name-container>.label-name,.monaco-icon-label.italic>.monaco-icon-label-container>.monaco-icon-description-container>.label-description{font-style:italic}.monaco-icon-label.deprecated{text-decoration:line-through;opacity:.66}.monaco-icon-label.strikethrough>.monaco-icon-label-container>.monaco-icon-name-container>.label-name,.monaco-icon-label.strikethrough>.monaco-icon-label-container>.monaco-icon-description-container>.label-description{text-decoration:line-through}.monaco-icon-label:after{opacity:.75;font-size:90%;font-weight:600;margin:auto 16px 0 5px;text-align:center}.monaco-list:focus .selected .monaco-icon-label,.monaco-list:focus .selected .monaco-icon-label:after{color:inherit!important}.monaco-list-row.focused.selected .label-description,.monaco-list-row.selected .label-description{opacity:.8}.monaco-editor .peekview-widget .head .peekview-title .severity-icon{display:inline-block;vertical-align:text-top;margin-right:4px}.monaco-editor .marker-widget{text-overflow:ellipsis;white-space:nowrap}.monaco-editor .marker-widget>.stale{opacity:.6;font-style:italic}.monaco-editor .marker-widget .title{display:inline-block;padding-right:5px}.monaco-editor .marker-widget .descriptioncontainer{position:absolute;white-space:pre;user-select:text;-webkit-user-select:text;padding:8px 12px 0 20px}.monaco-editor .marker-widget .descriptioncontainer .message{display:flex;flex-direction:column}.monaco-editor .marker-widget .descriptioncontainer .message .details{padding-left:6px}.monaco-editor .marker-widget .descriptioncontainer .message .source,.monaco-editor .marker-widget .descriptioncontainer .message span.code{opacity:.6}.monaco-editor .marker-widget .descriptioncontainer .message a.code-link{opacity:.6;color:inherit}.monaco-editor .marker-widget .descriptioncontainer .message a.code-link:before{content:\"(\"}.monaco-editor .marker-widget .descriptioncontainer .message a.code-link:after{content:\")\"}.monaco-editor .marker-widget .descriptioncontainer .message a.code-link>span{text-decoration:underline;border-bottom:1px solid transparent;text-underline-position:under;color:var(--vscode-textLink-activeForeground)}.monaco-editor .marker-widget .descriptioncontainer .filename{cursor:pointer;color:var(--vscode-textLink-activeForeground)}.monaco-editor .zone-widget .codicon.codicon-error,.markers-panel .marker-icon.error,.markers-panel .marker-icon .codicon.codicon-error,.text-search-provider-messages .providerMessage .codicon.codicon-error,.extensions-viewlet>.extensions .codicon.codicon-error,.extension-editor .codicon.codicon-error,.chat-attached-context-attachment .codicon.codicon-error{color:var(--vscode-problemsErrorIcon-foreground)}.monaco-editor .zone-widget .codicon.codicon-warning,.markers-panel .marker-icon.warning,.markers-panel .marker-icon .codicon.codicon-warning,.text-search-provider-messages .providerMessage .codicon.codicon-warning,.extensions-viewlet>.extensions .codicon.codicon-warning,.extension-editor .codicon.codicon-warning,.preferences-editor .codicon.codicon-warning{color:var(--vscode-problemsWarningIcon-foreground)}.monaco-editor .zone-widget .codicon.codicon-info,.markers-panel .marker-icon.info,.markers-panel .marker-icon .codicon.codicon-info,.text-search-provider-messages .providerMessage .codicon.codicon-info,.extensions-viewlet>.extensions .codicon.codicon-info,.extension-editor .codicon.codicon-info{color:var(--vscode-problemsInfoIcon-foreground)}.monaco-editor .hoverHighlight{background-color:var(--vscode-editor-hoverHighlightBackground)}.monaco-editor .monaco-resizable-hover{border:1px solid var(--vscode-editorHoverWidget-border);border-radius:3px;box-sizing:content-box}.monaco-editor .monaco-resizable-hover>.monaco-hover{border:none;border-radius:none}.monaco-editor .monaco-hover{border:1px solid var(--vscode-editorHoverWidget-border);border-radius:3px;color:var(--vscode-editorHoverWidget-foreground);background-color:var(--vscode-editorHoverWidget-background)}.monaco-editor .monaco-hover a{color:var(--vscode-textLink-foreground)}.monaco-editor .monaco-hover a:hover{color:var(--vscode-textLink-activeForeground)}.monaco-editor .monaco-hover .hover-row{display:flex}.monaco-editor .monaco-hover .hover-row.hover-row-with-copy{position:relative;padding-right:20px}.monaco-editor .monaco-hover .hover-row .hover-row-contents{min-width:0;display:flex;flex-direction:column}.monaco-editor .monaco-hover .hover-row .verbosity-actions{border-right:1px solid var(--vscode-editorHoverWidget-border);width:22px;overflow-y:clip}.monaco-editor .monaco-hover .hover-row .verbosity-actions-inner{display:flex;flex-direction:column;padding-left:5px;padding-right:5px;justify-content:flex-end;position:relative}.monaco-editor .monaco-hover .hover-row .verbosity-actions-inner .codicon{cursor:pointer;font-size:11px}.monaco-editor .monaco-hover .hover-row .verbosity-actions-inner .codicon.enabled{color:var(--vscode-textLink-foreground)}.monaco-editor .monaco-hover .hover-row .verbosity-actions-inner .codicon.disabled{opacity:.6}.monaco-editor .monaco-hover .hover-row .actions{background-color:var(--vscode-editorHoverWidget-statusBarBackground)}.monaco-editor .monaco-hover code{background-color:var(--vscode-textCodeBlock-background)}.monaco-editor .monaco-hover .hover-copy-button{position:absolute;top:4px;right:4px;padding:2px 4px;border-radius:3px;display:flex;align-items:center;justify-content:center;opacity:0}.monaco-editor .monaco-hover .hover-row-with-copy:hover .hover-copy-button,.monaco-editor .monaco-hover .hover-row-with-copy:focus-within .hover-copy-button{opacity:1}.monaco-editor .monaco-hover .hover-copy-button:hover{background-color:var(--vscode-toolbar-hoverBackground);cursor:pointer}.monaco-editor .monaco-hover .hover-copy-button:focus{outline:1px solid var(--vscode-focusBorder);outline-offset:-1px}.monaco-editor .monaco-hover .hover-copy-button .codicon{font-size:16px;color:var(--vscode-foreground)}.monaco-editor.vs .dnd-target,.monaco-editor.hc-light .dnd-target{border-right:2px dotted black;color:#fff}.monaco-editor.vs-dark .dnd-target{border-right:2px dotted #AEAFAD;color:#51504f}.monaco-editor.hc-black .dnd-target{border-right:2px dotted #fff;color:#000}.monaco-editor.mouse-default .view-lines,.monaco-editor.vs-dark.mac.mouse-default .view-lines,.monaco-editor.hc-black.mac.mouse-default .view-lines,.monaco-editor.hc-light.mac.mouse-default .view-lines{cursor:default}.monaco-editor.mouse-copy .view-lines,.monaco-editor.vs-dark.mac.mouse-copy .view-lines,.monaco-editor.hc-black.mac.mouse-copy .view-lines,.monaco-editor.hc-light.mac.mouse-copy .view-lines{cursor:copy}.monaco-editor .findOptionsWidget{background-color:var(--vscode-editorWidget-background);color:var(--vscode-editorWidget-foreground);box-shadow:0 0 8px 2px var(--vscode-widget-shadow);border:2px solid var(--vscode-contrastBorder)}.monaco-editor .margin-view-overlays .codicon-folding-manual-collapsed,.monaco-editor .margin-view-overlays .codicon-folding-manual-expanded,.monaco-editor .margin-view-overlays .codicon-folding-expanded,.monaco-editor .margin-view-overlays .codicon-folding-collapsed{cursor:pointer;opacity:0;transition:opacity .5s;display:flex;align-items:center;justify-content:center;font-size:140%;margin-left:2px}.monaco-reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-manual-collapsed,.monaco-reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-manual-expanded,.monaco-reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-expanded,.monaco-reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-collapsed{transition:initial}.monaco-editor .margin-view-overlays:hover .codicon,.monaco-editor .margin-view-overlays .codicon.codicon-folding-collapsed,.monaco-editor .margin-view-overlays .codicon.codicon-folding-manual-collapsed,.monaco-editor .margin-view-overlays .codicon.alwaysShowFoldIcons{opacity:1}.monaco-editor .inline-folded:after{color:var(--vscode-editor-foldPlaceholderForeground);margin:.1em .2em 0;content:\"⋯\";display:inline;line-height:1em;cursor:pointer}.monaco-editor .folded-background{background-color:var(--vscode-editor-foldBackground)}.monaco-editor .cldr.codicon.codicon-folding-expanded,.monaco-editor .cldr.codicon.codicon-folding-collapsed,.monaco-editor .cldr.codicon.codicon-folding-manual-expanded,.monaco-editor .cldr.codicon.codicon-folding-manual-collapsed{color:var(--vscode-editorGutter-foldingControlForeground)!important}.monaco-editor .snippet-placeholder{min-width:2px;outline-style:solid;outline-width:1px;background-color:var(--vscode-editor-snippetTabstopHighlightBackground, transparent);outline-color:var(--vscode-editor-snippetTabstopHighlightBorder, transparent)}.monaco-editor .finish-snippet-placeholder{outline-style:solid;outline-width:1px;background-color:var(--vscode-editor-snippetFinalTabstopHighlightBackground, transparent);outline-color:var(--vscode-editor-snippetFinalTabstopHighlightBorder, transparent)}.monaco-editor .suggest-widget{width:430px;z-index:40;display:flex;flex-direction:column;border-radius:3px}.monaco-editor .suggest-widget.message{flex-direction:row;align-items:center}.monaco-editor .suggest-widget,.monaco-editor .suggest-details{flex:0 1 auto;width:100%;border-style:solid;border-width:1px;border-color:var(--vscode-editorSuggestWidget-border);background-color:var(--vscode-editorSuggestWidget-background)}.monaco-editor.hc-black .suggest-widget,.monaco-editor.hc-black .suggest-details,.monaco-editor.hc-light .suggest-widget,.monaco-editor.hc-light .suggest-details{border-width:2px}.monaco-editor .suggest-widget .suggest-status-bar{box-sizing:border-box;display:none;flex-flow:row nowrap;justify-content:space-between;width:100%;font-size:80%;padding:0 4px;border-top:1px solid var(--vscode-editorSuggestWidget-border);overflow:hidden}.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar{display:flex}.monaco-editor .suggest-widget .suggest-status-bar .left{padding-right:8px}.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-label{color:var(--vscode-editorSuggestWidgetStatus-foreground)}.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-item:not(:last-of-type) .action-label{margin-right:0}.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-item:not(:last-of-type) .action-label:after{content:\", \";margin-right:.3em}.monaco-editor .suggest-widget.with-status-bar .monaco-list .monaco-list-row>.contents>.main>.right>.readMore,.monaco-editor .suggest-widget.with-status-bar .monaco-list .monaco-list-row.focused.string-label>.contents>.main>.right>.readMore{display:none}.monaco-editor .suggest-widget.with-status-bar:not(.docs-side) .monaco-list .monaco-list-row:hover>.contents>.main>.right.can-expand-details>.details-label{width:100%}.monaco-editor .suggest-widget>.message{padding-left:22px}.monaco-editor .suggest-widget>.tree{height:100%;width:100%}.monaco-editor .suggest-widget .monaco-list{user-select:none;-webkit-user-select:none}.monaco-editor .suggest-widget .monaco-list .monaco-list-row{display:flex;-mox-box-sizing:border-box;box-sizing:border-box;padding-right:10px;background-repeat:no-repeat;background-position:2px 2px;white-space:nowrap;cursor:pointer;touch-action:none}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused{color:var(--vscode-editorSuggestWidget-selectedForeground)}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused .codicon{color:var(--vscode-editorSuggestWidget-selectedIconForeground)}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents{flex:1;height:100%;overflow:hidden;padding-left:2px}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main{display:flex;overflow:hidden;text-overflow:ellipsis;white-space:pre;justify-content:space-between}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.left,.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right{display:flex}.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.focused)>.contents>.main .monaco-icon-label{color:var(--vscode-editorSuggestWidget-foreground)}.monaco-editor .suggest-widget:not(.frozen) .monaco-highlighted-label .highlight{font-weight:700}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main .monaco-highlighted-label .highlight{color:var(--vscode-editorSuggestWidget-highlightForeground)}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused>.contents>.main .monaco-highlighted-label .highlight{color:var(--vscode-editorSuggestWidget-focusHighlightForeground)}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.header>.codicon-close,.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.readMore:before{color:inherit;opacity:1;font-size:14px;cursor:pointer}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.header>.codicon-close{position:absolute;top:6px;right:2px}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.header>.codicon-close:hover,.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.readMore:hover{opacity:1}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.details-label{opacity:.7}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.left>.signature-label{overflow:hidden;text-overflow:ellipsis;opacity:.6}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.left>.qualifier-label{margin-left:12px;opacity:.4;font-size:85%;line-height:initial;text-overflow:ellipsis;overflow:hidden;align-self:center}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.details-label{font-size:85%;margin-left:1.1em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.details-label>.monaco-tokenized-source{display:inline}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.details-label{display:none}.monaco-editor .suggest-widget:not(.shows-details) .monaco-list .monaco-list-row.focused>.contents>.main>.right>.details-label{display:inline}.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.string-label)>.contents>.main>.right>.details-label,.monaco-editor .suggest-widget.docs-side .monaco-list .monaco-list-row.focused:not(.string-label)>.contents>.main>.right>.details-label{display:inline}.monaco-editor .suggest-widget:not(.docs-side) .monaco-list .monaco-list-row.focused:hover>.contents>.main>.right.can-expand-details>.details-label{width:calc(100% - 26px)}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.left{flex-shrink:1;flex-grow:1;overflow:hidden}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.left>.monaco-icon-label{flex-shrink:0}.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.string-label)>.contents>.main>.left>.monaco-icon-label{max-width:100%}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.string-label>.contents>.main>.left>.monaco-icon-label{flex-shrink:1}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right{overflow:hidden;flex-shrink:4;max-width:70%}.monaco-editor .suggest-widget .monaco-list .monaco-list-row>.contents>.main>.right>.readMore{display:inline-block;position:absolute;right:10px;width:18px;height:18px;visibility:hidden}.monaco-editor .suggest-widget.docs-side .monaco-list .monaco-list-row>.contents>.main>.right>.readMore{display:none!important}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.string-label>.contents>.main>.right>.readMore{display:none}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused.string-label>.contents>.main>.right>.readMore{display:inline-block}.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused:hover>.contents>.main>.right>.readMore{visibility:visible}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label.deprecated{opacity:.66;text-decoration:unset}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label.deprecated>.monaco-icon-label-container>.monaco-icon-name-container{text-decoration:line-through}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label:before{height:100%}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon{display:block;height:16px;width:16px;margin-left:2px;background-repeat:no-repeat;background-size:80%;background-position:center}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon.hide{display:none}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .suggest-icon{display:flex;align-items:center;margin-right:4px}.monaco-editor .suggest-widget.no-icons .monaco-list .monaco-list-row .icon,.monaco-editor .suggest-widget.no-icons .monaco-list .monaco-list-row .suggest-icon:before{display:none}.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon.customcolor .colorspan{margin:0 0 0 .3em;border:.1em solid #000;width:.7em;height:.7em;display:inline-block}.monaco-editor .suggest-details-container{z-index:41}.monaco-editor .suggest-details{display:flex;flex-direction:column;cursor:default;color:var(--vscode-editorSuggestWidget-foreground)}.monaco-editor .suggest-details:focus{border-color:var(--vscode-focusBorder)}.monaco-editor .suggest-details a{color:var(--vscode-textLink-foreground)}.monaco-editor .suggest-details a:hover{color:var(--vscode-textLink-activeForeground)}.monaco-editor .suggest-details code{background-color:var(--vscode-textCodeBlock-background)}.monaco-editor .suggest-details.no-docs{display:none}.monaco-editor .suggest-details>.monaco-scrollable-element{flex:1}.monaco-editor .suggest-details>.monaco-scrollable-element>.body{box-sizing:border-box;height:100%;width:100%}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.header>.type{flex:2;overflow:hidden;text-overflow:ellipsis;opacity:.7;white-space:pre;margin:0 24px 0 0;padding:4px 0 4px 5px}.monaco-editor .suggest-details.detail-and-doc>.monaco-scrollable-element>.body>.header>.type{padding-bottom:12px}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.header>.type.auto-wrap{white-space:normal;word-break:break-all}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs{margin:0;padding:4px 5px;white-space:pre-wrap}.monaco-editor .suggest-details.no-type>.monaco-scrollable-element>.body>.docs{margin-right:24px;overflow:hidden}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs{padding:0;white-space:initial;min-height:calc(1rem + 8px)}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs>div,.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs>span:not(:empty){padding:4px 5px}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs>div>p:first-child{margin-top:0}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs>div>p:last-child{margin-bottom:0}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs .monaco-tokenized-source{white-space:pre}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs .code{white-space:pre-wrap;word-wrap:break-word}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>.docs.markdown-docs .codicon{vertical-align:sub}.monaco-editor .suggest-details>.monaco-scrollable-element>.body>p:empty{display:none}.monaco-editor .suggest-details code{border-radius:3px;padding:0 .4em}.monaco-editor .suggest-details ul,.monaco-editor .suggest-details ol{padding-left:20px}.monaco-editor .suggest-details p code{font-family:var(--monaco-monospace-font)}.monaco-editor .suggest-preview-additional-widget{white-space:nowrap}.monaco-editor .suggest-preview-additional-widget .content-spacer{color:transparent;white-space:pre}.monaco-editor .suggest-preview-additional-widget .button{display:inline-block;cursor:pointer;text-decoration:underline;text-underline-position:under}.monaco-editor .ghost-text-hidden{opacity:0;font-size:0}.monaco-editor .ghost-text-decoration,.monaco-editor .suggest-preview-text .ghost-text{font-style:italic}.monaco-editor .suggest-preview-text.clickable .view-line{z-index:1}.monaco-editor .ghost-text-decoration.clickable,.monaco-editor .ghost-text-decoration-preview.clickable,.monaco-editor .suggest-preview-text.clickable .ghost-text{cursor:pointer}.monaco-editor .inline-completion-text-to-replace{text-decoration:underline;text-underline-position:under}.monaco-editor .ghost-text-decoration,.monaco-editor .ghost-text-decoration-preview,.monaco-editor .suggest-preview-text .ghost-text{&.syntax-highlighted{opacity:.7}&:not(.syntax-highlighted){color:var(--vscode-editorGhostText-foreground)}background-color:var(--vscode-editorGhostText-background);border:1px solid var(--vscode-editorGhostText-border)}.monaco-editor .ghost-text-decoration.warning,.monaco-editor .ghost-text-decoration-preview.warning,.monaco-editor .suggest-preview-text .ghost-text.warning{background:var(--monaco-editor-warning-decoration) repeat-x bottom left;border-bottom:4px double var(--vscode-editorWarning-border)}.ghost-text-view-warning-widget-icon{.codicon{color:var(--vscode-editorWarning-foreground)!important}}.monaco-editor{.edits-fadeout-decoration{opacity:var(--animation-opacity, 1);background-color:var(--vscode-inlineEdit-modifiedChangedTextBackground)}}.monaco-editor .sticky-widget{overflow:hidden;border-bottom:1px solid var(--vscode-editorStickyScroll-border);width:100%;box-shadow:var(--vscode-editorStickyScroll-shadow) 0 4px 2px -2px;z-index:4;right:initial!important;margin-left:\"0px\"}.monaco-editor .sticky-widget .sticky-widget-line-numbers{float:left;background-color:var(--vscode-editorStickyScrollGutter-background)}.monaco-editor .sticky-widget.peek .sticky-widget-line-numbers{background-color:var(--vscode-peekViewEditorStickyScrollGutter-background)}.monaco-editor .sticky-widget .sticky-widget-lines-scrollable{display:inline-block;position:absolute;overflow:hidden;width:var(--vscode-editorStickyScroll-scrollableWidth);background-color:var(--vscode-editorStickyScroll-background)}.monaco-editor .sticky-widget.peek .sticky-widget-lines-scrollable{background-color:var(--vscode-peekViewEditorStickyScroll-background)}.monaco-editor .sticky-widget .sticky-widget-lines{position:absolute;background-color:inherit}.monaco-editor .sticky-widget .sticky-line-number,.monaco-editor .sticky-widget .sticky-line-content{color:var(--vscode-editorLineNumber-foreground);white-space:nowrap;display:inline-block;position:absolute;background-color:inherit}.monaco-editor .sticky-widget .sticky-line-number .codicon-folding-expanded,.monaco-editor .sticky-widget .sticky-line-number .codicon-folding-collapsed{float:right;transition:var(--vscode-editorStickyScroll-foldingOpacityTransition);position:absolute;margin-left:2px}.monaco-editor .sticky-widget .sticky-line-content{width:var(--vscode-editorStickyScroll-scrollableWidth);background-color:inherit;white-space:nowrap}.monaco-editor .sticky-widget .sticky-line-number-inner{display:inline-block;text-align:right}.monaco-editor .sticky-widget .sticky-line-content:hover{background-color:var(--vscode-editorStickyScrollHover-background);cursor:pointer}.monaco-editor{.inline-edits-view-indicator{display:flex;z-index:34;height:20px;color:var(--vscode-inlineEdit-gutterIndicator-primaryForeground);background-color:var(--vscode-inlineEdit-gutterIndicator-background);border:1px solid var(--vscode-inlineEdit-gutterIndicator-primaryBorder);border-radius:3px;align-items:center;padding:2px 10px 2px 2px;margin:0 4px;opacity:0;&.contained{transition:opacity .2s ease-in-out;transition-delay:.4s}&.visible{opacity:1}&.top{opacity:1;.icon{transform:rotate(90deg)}}&.bottom{opacity:1;.icon{transform:rotate(-90deg)}}.icon{display:flex;align-items:center;margin:0 2px;transform:none;transition:transform .2s ease-in-out;.codicon{color:var(--vscode-inlineEdit-gutterIndicator-primaryForeground)}}.label{margin:0 2px;display:flex;justify-content:center;width:100%}}.inline-edits-view .editorContainer{.preview .monaco-editor{.view-overlays .current-line-exact,.current-line-margin{border:none}}.inline-edits-view-zone.diagonal-fill{opacity:.5}}.strike-through{text-decoration:line-through}.inlineCompletions-line-insert{background:var(--vscode-inlineEdit-modifiedChangedLineBackground)}.inlineCompletions-line-delete{background:var(--vscode-inlineEdit-originalChangedLineBackground)}.inlineCompletions-char-insert{background:var(--vscode-inlineEdit-modifiedChangedTextBackground);cursor:pointer}.inlineCompletions-char-delete{background:var(--vscode-inlineEdit-originalChangedTextBackground)}.inlineCompletions-char-delete.diff-range-empty{margin-left:-1px;border-left:solid var(--vscode-inlineEdit-originalChangedTextBackground) 3px}.inlineCompletions-char-insert.diff-range-empty{border-left:solid var(--vscode-inlineEdit-modifiedChangedTextBackground) 3px}.inlineCompletions-char-delete.single-line-inline{border:1px solid var(--vscode-editorHoverWidget-border);margin:-2px 0 0 -2px}.inlineCompletions-char-insert.single-line-inline{border-top:1px solid var(--vscode-inlineEdit-modifiedBorder);border-bottom:1px solid var(--vscode-inlineEdit-modifiedBorder)}.inlineCompletions-char-insert.single-line-inline.start{border-top-left-radius:4px;border-bottom-left-radius:4px;border-left:1px solid var(--vscode-inlineEdit-modifiedBorder)}.inlineCompletions-char-insert.single-line-inline.end{border-top-right-radius:4px;border-bottom-right-radius:4px;border-right:1px solid var(--vscode-inlineEdit-modifiedBorder)}.inlineCompletions-char-delete.single-line-inline.empty,.inlineCompletions-char-insert.single-line-inline.empty{display:none}.inlineCompletions.strike-through{text-decoration-thickness:1px}.inlineCompletions-modified-bubble{background:var(--vscode-inlineEdit-modifiedChangedTextBackground)}.inlineCompletions-original-bubble{background:var(--vscode-inlineEdit-originalChangedTextBackground)}.inlineCompletions-modified-bubble,.inlineCompletions-original-bubble{pointer-events:none;display:inline-block}.inline-edit.ghost-text,.inline-edit.ghost-text-decoration,.inline-edit.ghost-text-decoration-preview,.inline-edit.suggest-preview-text .ghost-text{&.syntax-highlighted{opacity:1!important}font-style:normal!important}.inline-edit.modified-background.ghost-text,.inline-edit.modified-background.ghost-text-decoration,.inline-edit.modified-background.ghost-text-decoration-preview,.inline-edit.modified-background.suggest-preview-text .ghost-text{background:var(--vscode-inlineEdit-modifiedChangedTextBackground)!important;display:inline-block!important}.inlineCompletions-original-lines{background:var(--vscode-editor-background)}}.monaco-menu-option{color:var(--vscode-editorActionList-foreground);font-size:13px;padding:0 4px;line-height:28px;display:flex;gap:4px;align-items:center;border-radius:3px;cursor:pointer;.monaco-keybinding-key{font-size:13px;opacity:.7}&.active{background:var(--vscode-editorActionList-focusBackground);color:var(--vscode-editorActionList-focusForeground);outline:1px solid var(--vscode-menu-selectionBorder, transparent);outline-offset:-1px;.monaco-keybinding-key{color:var(--vscode-editorActionList-focusForeground)}}}.monaco-editor .goto-definition-link{text-decoration:underline;cursor:pointer;color:var(--vscode-editorLink-activeForeground)!important}.monaco-editor.vs .valueSetReplacement{outline:solid 2px var(--vscode-editorBracketMatch-border)}.monaco-editor .linked-editing-decoration{background-color:var(--vscode-editor-linkedEditingBackground);min-width:1px}.monaco-editor .detected-link,.monaco-editor .detected-link-active{text-decoration:underline;text-underline-position:under}.monaco-editor .detected-link-active{cursor:pointer;color:var(--vscode-editorLink-activeForeground)!important}.monaco-editor{.scroll-editor-on-middle-click-dot{cursor:all-scroll;position:absolute;z-index:1;background-color:var(--vscode-editor-foreground, white);border:1px solid var(--vscode-editor-background, black);opacity:.5;width:5px;height:5px;border-radius:50%;transform:translate(-50%,-50%);&.hidden{display:none}}&.scroll-editor-on-middle-click-editor *{cursor:all-scroll}}.monaco-editor .focused .selectionHighlight{background-color:var(--vscode-editor-selectionHighlightBackground);box-sizing:border-box;border:1px solid var(--vscode-editor-selectionHighlightBorder)}.monaco-editor.hc-black .focused .selectionHighlight,.monaco-editor.hc-light .focused .selectionHighlight{border-style:dotted}.monaco-editor .wordHighlight{background-color:var(--vscode-editor-wordHighlightBackground);box-sizing:border-box;border:1px solid var(--vscode-editor-wordHighlightBorder)}.monaco-editor.hc-black .wordHighlight,.monaco-editor.hc-light .wordHighlight{border-style:dotted}.monaco-editor .wordHighlightStrong{background-color:var(--vscode-editor-wordHighlightStrongBackground);box-sizing:border-box;border:1px solid var(--vscode-editor-wordHighlightStrongBorder)}.monaco-editor.hc-black .wordHighlightStrong,.monaco-editor.hc-light .wordHighlightStrong{border-style:dotted}.monaco-editor .wordHighlightText{background-color:var(--vscode-editor-wordHighlightTextBackground);box-sizing:border-box;border:1px solid var(--vscode-editor-wordHighlightTextBorder)}.monaco-editor.hc-black .wordHighlightText,.monaco-editor.hc-light .wordHighlightText{border-style:dotted}.monaco-editor .parameter-hints-widget{z-index:39;display:flex;flex-direction:column;line-height:1.5em;cursor:default;color:var(--vscode-editorHoverWidget-foreground);background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border)}.hc-black .monaco-editor .parameter-hints-widget,.hc-light .monaco-editor .parameter-hints-widget{border-width:2px}.monaco-editor .parameter-hints-widget>.phwrapper{max-width:440px;display:flex;flex-direction:row}.monaco-editor .parameter-hints-widget.multiple{min-height:3.3em;padding:0}.monaco-editor .parameter-hints-widget.multiple .body:before{content:\"\";display:block;height:100%;position:absolute;opacity:.5;border-left:1px solid var(--vscode-editorHoverWidget-border)}.monaco-editor .parameter-hints-widget p,.monaco-editor .parameter-hints-widget ul{margin:8px 0}.monaco-editor .parameter-hints-widget .monaco-scrollable-element,.monaco-editor .parameter-hints-widget .body{display:flex;flex:1;flex-direction:column;min-height:100%}.monaco-editor .parameter-hints-widget .signature{padding:4px 5px;position:relative}.monaco-editor .parameter-hints-widget .signature.has-docs:after{content:\"\";display:block;position:absolute;left:0;width:100%;padding-top:4px;opacity:.5;border-bottom:1px solid var(--vscode-editorHoverWidget-border)}.monaco-editor .parameter-hints-widget .code{font-family:var(--vscode-parameterHintsWidget-editorFontFamily),var(--vscode-parameterHintsWidget-editorFontFamilyDefault)}.monaco-editor .parameter-hints-widget .docs{padding:0 10px 0 5px;white-space:pre-wrap}.monaco-editor .parameter-hints-widget .docs.empty{display:none}.monaco-editor .parameter-hints-widget .docs a{color:var(--vscode-textLink-foreground)}.monaco-editor .parameter-hints-widget .docs a:hover{color:var(--vscode-textLink-activeForeground);cursor:pointer}.monaco-editor .parameter-hints-widget .docs .markdown-docs{white-space:initial}.monaco-editor .parameter-hints-widget .docs code{font-family:var(--monaco-monospace-font);border-radius:3px;padding:0 .4em;background-color:var(--vscode-textCodeBlock-background)}.monaco-editor .parameter-hints-widget .docs .monaco-tokenized-source,.monaco-editor .parameter-hints-widget .docs .code{white-space:pre-wrap}.monaco-editor .parameter-hints-widget .controls{display:none;flex-direction:column;align-items:center;min-width:22px;justify-content:flex-end}.monaco-editor .parameter-hints-widget.multiple .controls{display:flex;padding:0 2px}.monaco-editor .parameter-hints-widget.multiple .button{width:16px;height:16px;background-repeat:no-repeat;cursor:pointer}.monaco-editor .parameter-hints-widget .button.previous{bottom:24px}.monaco-editor .parameter-hints-widget .overloads{text-align:center;height:12px;line-height:12px;font-family:var(--monaco-monospace-font)}.monaco-editor .parameter-hints-widget .signature .parameter.active{color:var(--vscode-editorHoverWidget-highlightForeground);font-weight:700}.monaco-editor .parameter-hints-widget .documentation-parameter>.parameter{font-weight:700;margin-right:.5em}.monaco-editor{.editorPlaceholder{top:0;position:absolute;overflow:hidden;text-overflow:ellipsis;text-wrap:nowrap;pointer-events:none;color:var(--vscode-editor-placeholder-foreground)}}.monaco-editor .rename-box{z-index:100;color:inherit;border-radius:4px}.monaco-editor .rename-box.preview{padding:4px 4px 0}.monaco-editor .rename-box .rename-input-with-button{padding:3px;border-radius:2px;width:calc(100% - 8px)}.monaco-editor .rename-box .rename-input{width:calc(100% - 8px);padding:0}.monaco-editor .rename-box .rename-input:focus{outline:none}.monaco-editor .rename-box .rename-suggestions-button{display:flex;align-items:center;padding:3px;background-color:transparent;border:none;border-radius:5px;cursor:pointer}.monaco-editor .rename-box .rename-suggestions-button:hover{background-color:var(--vscode-toolbar-hoverBackground)}.monaco-editor .rename-box .rename-candidate-list-container .monaco-list-row{border-radius:2px}.monaco-editor .rename-box .rename-label{display:none;opacity:.8}.monaco-editor .rename-box.preview .rename-label{display:inherit}.monaco-editor .unicode-highlight{border:1px solid var(--vscode-editorUnicodeHighlight-border);background-color:var(--vscode-editorUnicodeHighlight-background);box-sizing:border-box}.editor-banner{box-sizing:border-box;cursor:default;width:100%;font-size:12px;display:flex;overflow:visible;height:26px;background:var(--vscode-banner-background)}.editor-banner .icon-container{display:flex;flex-shrink:0;align-items:center;padding:0 6px 0 10px}.editor-banner .icon-container.custom-icon{background-repeat:no-repeat;background-position:center center;background-size:16px;width:16px;padding:0;margin:0 6px 0 10px}.editor-banner .message-container{display:flex;align-items:center;line-height:26px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.editor-banner .message-container p{margin-block-start:0;margin-block-end:0}.editor-banner .message-actions-container{flex-grow:1;flex-shrink:0;line-height:26px;margin:0 4px}.editor-banner .message-actions-container a.monaco-button{width:inherit;margin:2px 8px;padding:0 12px}.editor-banner .message-actions-container a{padding:3px;margin-left:12px;text-decoration:underline}.editor-banner .action-container{padding:0 10px 0 6px}.editor-banner{background-color:var(--vscode-banner-background)}.editor-banner,.editor-banner .action-container .codicon,.editor-banner .message-actions-container .monaco-link{color:var(--vscode-banner-foreground)}.editor-banner .icon-container .codicon{color:var(--vscode-banner-iconForeground)}.monaco-link{color:var(--vscode-textLink-foreground)}.monaco-link:hover{color:var(--vscode-textLink-activeForeground)}.floating-menu-overlay-widget{padding:0;color:var(--vscode-button-foreground);background-color:var(--vscode-button-background);border-radius:2px;border:1px solid var(--vscode-contrastBorder);display:flex;align-items:center;z-index:10;box-shadow:0 2px 8px var(--vscode-widget-shadow);overflow:hidden;.action-item>.action-label{padding:5px;font-size:12px;border-radius:2px}.action-item>.action-label.codicon{color:var(--vscode-button-foreground)}.action-item>.action-label.codicon:not(.separator){padding-top:6px;padding-bottom:6px}.action-item:first-child>.action-label{padding-left:7px}.action-item:last-child>.action-label{padding-right:7px}.action-item .action-label.separator{background-color:var(--vscode-menu-separatorBackground)}}.monaco-editor .iPadShowKeyboard{width:58px;min-width:0;height:36px;min-height:0;margin:0;padding:0;position:absolute;resize:none;overflow:hidden;background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==) center center no-repeat;border:4px solid #F6F6F6;border-radius:4px}.monaco-editor.vs-dark .iPadShowKeyboard{background:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==) center center no-repeat;border:4px solid #252526}.monaco-editor .tokens-inspect-widget{z-index:50;user-select:text;-webkit-user-select:text;padding:10px;color:var(--vscode-editorHoverWidget-foreground);background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border)}.monaco-editor.hc-black .tokens-inspect-widget,.monaco-editor.hc-light .tokens-inspect-widget{border-width:2px}.monaco-editor .tokens-inspect-widget .tokens-inspect-separator{height:1px;border:0;background-color:var(--vscode-editorHoverWidget-border)}.monaco-editor .tokens-inspect-widget .tm-token{font-family:var(--monaco-monospace-font)}.monaco-editor .tokens-inspect-widget .tm-token-length{font-weight:400;font-size:60%;float:right}.monaco-editor .tokens-inspect-widget .tm-metadata-table{width:100%}.monaco-editor .tokens-inspect-widget .tm-metadata-value{font-family:var(--monaco-monospace-font);text-align:right}.monaco-editor .tokens-inspect-widget .tm-token-type{font-family:var(--monaco-monospace-font)}.monaco-editor{font-family:-apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,HelveticaNeue-Light,system-ui,Ubuntu,Droid Sans,sans-serif;--monaco-monospace-font: \"SF Mono\", Monaco, Menlo, Consolas, \"Ubuntu Mono\", \"Liberation Mono\", \"DejaVu Sans Mono\", \"Courier New\", monospace}.monaco-menu .monaco-action-bar.vertical .action-item .action-menu-item:focus .action-label{stroke-width:1.2px}.monaco-editor.vs-dark .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label,.monaco-editor.hc-black .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label,.monaco-editor.hc-light .monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .action-label{stroke-width:1.2px}.monaco-hover p{margin:0}.monaco-aria-container{position:absolute!important;top:0;height:1px;width:1px;margin:-1px;overflow:hidden;padding:0;clip:rect(1px,1px,1px,1px);clip-path:inset(50%)}.monaco-editor .synthetic-focus,.monaco-diff-editor .synthetic-focus,.monaco-editor [tabindex=\"0\"]:focus,.monaco-diff-editor [tabindex=\"0\"]:focus,.monaco-editor [tabindex=\"-1\"]:focus,.monaco-diff-editor [tabindex=\"-1\"]:focus,.monaco-editor button:focus,.monaco-diff-editor button:focus,.monaco-editor input[type=button]:focus,.monaco-diff-editor input[type=button]:focus,.monaco-editor input[type=checkbox]:focus,.monaco-diff-editor input[type=checkbox]:focus,.monaco-editor input[type=search]:focus,.monaco-diff-editor input[type=search]:focus,.monaco-editor input[type=text]:focus,.monaco-diff-editor input[type=text]:focus,.monaco-editor select:focus,.monaco-diff-editor select:focus,.monaco-editor textarea:focus,.monaco-diff-editor textarea:focus{outline-width:1px;outline-style:solid;outline-offset:-1px;outline-color:var(--vscode-focusBorder);opacity:1}.monaco-hover.workbench-hover{position:relative;font-size:13px;line-height:19px;z-index:40;overflow:hidden;max-width:700px;background:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border);border-radius:5px;color:var(--vscode-editorHoverWidget-foreground);box-shadow:0 2px 8px var(--vscode-widget-shadow)}.monaco-hover.workbench-hover .monaco-action-bar .action-item .codicon{width:13px;height:13px}.monaco-hover.workbench-hover hr{border-bottom:none}.monaco-hover.workbench-hover.compact{font-size:12px}.monaco-hover.workbench-hover.compact .monaco-action-bar .action-item .codicon{width:12px;height:12px}.monaco-hover.workbench-hover.compact .hover-contents{padding:2px 8px}.workbench-hover-container.locked .monaco-hover.workbench-hover{outline:1px solid var(--vscode-editorHoverWidget-border)}.workbench-hover-container:focus-within.locked .monaco-hover.workbench-hover{outline-color:var(--vscode-focusBorder)}.workbench-hover-pointer{position:absolute;z-index:41;pointer-events:none}.workbench-hover-pointer:after{content:\"\";position:absolute;width:5px;height:5px;background-color:var(--vscode-editorHoverWidget-background);border-right:1px solid var(--vscode-editorHoverWidget-border);border-bottom:1px solid var(--vscode-editorHoverWidget-border)}.workbench-hover-container:not(:focus-within).locked .workbench-hover-pointer:after{width:4px;height:4px;border-right-width:2px;border-bottom-width:2px}.workbench-hover-container:focus-within .workbench-hover-pointer:after{border-right:1px solid var(--vscode-focusBorder);border-bottom:1px solid var(--vscode-focusBorder)}.workbench-hover-pointer.left{left:-3px}.workbench-hover-pointer.right{right:3px}.workbench-hover-pointer.top{top:-3px}.workbench-hover-pointer.bottom{bottom:3px}.workbench-hover-pointer.left:after{transform:rotate(135deg)}.workbench-hover-pointer.right:after{transform:rotate(315deg)}.workbench-hover-pointer.top:after{transform:rotate(225deg)}.workbench-hover-pointer.bottom:after{transform:rotate(45deg)}.monaco-hover.workbench-hover a{color:var(--vscode-textLink-foreground)}.monaco-hover.workbench-hover a:focus{outline:1px solid;outline-offset:-1px;text-decoration:underline;outline-color:var(--vscode-focusBorder)}.monaco-hover.workbench-hover a.codicon:focus,.monaco-hover.workbench-hover a.monaco-button:focus{text-decoration:none}.monaco-hover.workbench-hover a:hover,.monaco-hover.workbench-hover a:active{color:var(--vscode-textLink-activeForeground)}.monaco-hover.workbench-hover code{background:var(--vscode-textCodeBlock-background)}.monaco-hover.workbench-hover .hover-row .actions{background:var(--vscode-editorHoverWidget-statusBarBackground)}.monaco-hover.workbench-hover.right-aligned{left:1px}.monaco-hover.workbench-hover.right-aligned .hover-row.status-bar .actions{flex-direction:row-reverse}.monaco-hover.workbench-hover.right-aligned .hover-row.status-bar .actions .action-container{margin-right:0;margin-left:16px}.context-view{position:absolute}.context-view.fixed{all:initial;font-family:inherit;font-size:13px;position:fixed;color:inherit}.quick-input-widget{font-size:13px}.quick-input-widget .monaco-highlighted-label .highlight{color:#0066bf}.vs .quick-input-widget .monaco-list-row.focused .monaco-highlighted-label .highlight{color:#9dddff}.vs-dark .quick-input-widget .monaco-highlighted-label .highlight{color:#0097fb}.hc-black .quick-input-widget .monaco-highlighted-label .highlight{color:#f38518}.hc-light .quick-input-widget .monaco-highlighted-label .highlight{color:#0f4a85}.monaco-keybinding>.monaco-keybinding-key{background-color:#ddd6;border:solid 1px rgba(204,204,204,.4);border-bottom-color:#bbb6;box-shadow:inset 0 -1px #bbb6;color:#555}.hc-black .monaco-keybinding>.monaco-keybinding-key{background-color:transparent;border:solid 1px rgb(111,195,223);box-shadow:none;color:#fff}.hc-light .monaco-keybinding>.monaco-keybinding-key{background-color:transparent;border:solid 1px #0F4A85;box-shadow:none;color:#292929}.vs-dark .monaco-keybinding>.monaco-keybinding-key{background-color:#8080802b;border:solid 1px rgba(51,51,51,.6);border-bottom-color:#4449;box-shadow:inset 0 -1px #4449;color:#ccc}.quick-input-widget{position:absolute;width:600px;z-index:2550;left:50%;-webkit-app-region:no-drag;border-radius:6px}.quick-input-titlebar{cursor:grab;display:flex;align-items:center;border-top-right-radius:5px;border-top-left-radius:5px}.quick-input-left-action-bar{display:flex;margin-left:4px;flex:1}.quick-input-inline-action-bar>.actions-container>.action-item:first-child{margin-left:5px}.quick-input-inline-action-bar>.actions-container>.action-item{margin-top:2px}.quick-input-title{cursor:grab;padding:3px 0;text-align:center;text-overflow:ellipsis;overflow:hidden}.quick-input-right-action-bar{display:flex;margin-right:4px;flex:1}.quick-input-right-action-bar>.actions-container{justify-content:flex-end}.quick-input-right-action-bar>.actions-container>.action-item{margin-left:4px}.quick-input-titlebar .monaco-action-bar .action-label.codicon{background-position:center;background-repeat:no-repeat;padding:2px}.quick-input-description{margin:6px 6px 6px 11px}.quick-input-header .quick-input-description{margin:4px 2px;flex:1}.quick-input-header{cursor:grab;display:flex;padding:6px 6px 2px}.quick-input-widget.hidden-input .quick-input-header{padding:0;margin-bottom:0}.quick-input-and-message{display:flex;flex-direction:column;flex-grow:1;min-width:0;position:relative}.quick-input-check-all{align-self:center;margin:0}.quick-input-widget .quick-input-header .monaco-checkbox{margin-top:6px}.quick-input-filter{flex-grow:1;display:flex;position:relative}.quick-input-box{flex-grow:1}.quick-input-widget.show-checkboxes .quick-input-box,.quick-input-widget.show-checkboxes .quick-input-message{margin-left:5px}.quick-input-visible-count{position:absolute;left:-10000px}.quick-input-count{align-self:center;position:absolute;right:4px;display:flex;align-items:center}.quick-input-count .monaco-count-badge{vertical-align:middle;padding:2px 4px;border-radius:2px;min-height:auto;line-height:normal}.quick-input-action{margin-left:6px}.quick-input-action .monaco-text-button{font-size:11px;padding:0 6px;display:flex;height:25px;align-items:center}.quick-input-message{margin-top:-1px;padding:5px;overflow-wrap:break-word}.quick-input-message>.codicon{margin:0 .2em;vertical-align:text-bottom}.quick-input-message a{color:inherit}.quick-input-progress.monaco-progress-container{position:relative}.quick-input-list{line-height:22px}.quick-input-widget.hidden-input .quick-input-list{margin-top:4px;padding-bottom:4px}.quick-input-list .monaco-list{overflow:hidden;max-height:440px;padding-bottom:5px}.quick-input-list .monaco-scrollable-element{padding:0 6px}.quick-input-list .quick-input-list-entry{box-sizing:border-box;overflow:hidden;display:flex;padding:0 6px}.quick-input-list .quick-input-list-entry.quick-input-list-separator-border{border-top-width:1px;border-top-style:solid}.quick-input-list .monaco-list-row{border-radius:3px}.quick-input-list .monaco-list-row[data-index=\"0\"] .quick-input-list-entry.quick-input-list-separator-border{border-top-style:none}.quick-input-list .quick-input-list-label{overflow:hidden;display:flex;height:100%;flex:1}.quick-input-widget .monaco-checkbox{margin-right:0}.quick-input-widget .quick-input-list .monaco-checkbox,.quick-input-widget .quick-input-tree .monaco-checkbox{margin-top:4px}.quick-input-list .quick-input-list-icon{background-size:16px;background-position:left center;background-repeat:no-repeat;padding-right:6px;width:16px;height:22px;display:flex;align-items:center;justify-content:center}.quick-input-list .quick-input-list-rows{overflow:hidden;text-overflow:ellipsis;display:flex;flex-direction:column;height:100%;flex:1;margin-left:5px}.quick-input-list .quick-input-list-rows>.quick-input-list-row{display:flex;align-items:center}.quick-input-list .quick-input-list-rows>.quick-input-list-row .monaco-icon-label,.quick-input-list .quick-input-list-rows>.quick-input-list-row .monaco-icon-label .monaco-icon-label-container>.monaco-icon-name-container{flex:1}.quick-input-list .quick-input-list-rows>.quick-input-list-row .codicon[class*=codicon-]{vertical-align:text-bottom}.quick-input-list .quick-input-list-rows .monaco-highlighted-label>span{opacity:1}.quick-input-list .quick-input-list-entry .quick-input-list-entry-keybinding{margin-right:8px}.quick-input-list .quick-input-list-label-meta{opacity:.7;line-height:normal;text-overflow:ellipsis;overflow:hidden}.quick-input-list .monaco-list .monaco-list-row .monaco-highlighted-label .highlight{font-weight:700;background-color:unset;color:var(--vscode-list-highlightForeground)!important}.quick-input-list .monaco-list .monaco-list-row.focused .monaco-highlighted-label .highlight{color:var(--vscode-list-focusHighlightForeground)!important}.quick-input-list .quick-input-list-entry .quick-input-list-separator{margin-right:4px}.quick-input-list .quick-input-list-entry-action-bar{display:flex;flex:0;overflow:visible}.quick-input-list .quick-input-list-entry-action-bar .action-label{display:none}.quick-input-list .quick-input-list-entry-action-bar .action-label.codicon{margin-right:4px;padding:2px}.quick-input-list .quick-input-list-entry-action-bar{margin-top:1px}.quick-input-list .quick-input-list-entry-action-bar{margin-right:4px}.quick-input-list .quick-input-list-entry .quick-input-list-entry-action-bar .action-label.always-visible,.quick-input-list .quick-input-list-entry:hover .quick-input-list-entry-action-bar .action-label,.quick-input-list .quick-input-list-entry.focus-inside .quick-input-list-entry-action-bar .action-label,.quick-input-list .monaco-list-row.focused .quick-input-list-entry-action-bar .action-label,.quick-input-list .monaco-list-row.passive-focused .quick-input-list-entry-action-bar .action-label{display:flex}.quick-input-list>.monaco-list:focus .monaco-list-row.focused{outline:1px solid var(--vscode-list-focusOutline)!important;outline-offset:-1px}.quick-input-list>.monaco-list:focus .monaco-list-row.focused .quick-input-list-entry.quick-input-list-separator-border{border-color:transparent}.quick-input-list .monaco-list-row.focused .monaco-keybinding-key,.quick-input-list .monaco-list-row.focused .quick-input-list-entry .quick-input-list-separator{color:inherit}.quick-input-list .monaco-list-row.focused .monaco-keybinding-key{background:none}.quick-input-list .quick-input-list-separator-as-item{padding:4px 6px;font-size:12px}.quick-input-list .quick-input-list-separator-as-item .label-name{font-weight:600}.quick-input-list .quick-input-list-separator-as-item .label-description{opacity:1!important}.quick-input-list .monaco-tree-sticky-row .quick-input-list-entry.quick-input-list-separator-as-item.quick-input-list-separator-border{border-top-style:none}.quick-input-list .monaco-tree-sticky-row{padding:0 5px}.quick-input-list .monaco-tl-twistie{display:none!important}.quick-input-tree .monaco-list{overflow:hidden;max-height:440px;padding-bottom:5px}.quick-input-tree .quick-input-tree-entry{box-sizing:border-box;overflow:hidden;display:flex;padding:0 6px}.quick-input-tree .quick-input-tree-label{overflow:hidden;display:flex;height:100%;flex:1}.quick-input-tree .quick-input-tree-icon{background-size:16px;background-position:left center;background-repeat:no-repeat;padding-right:6px;width:16px;height:22px;display:flex;align-items:center;justify-content:center}.quick-input-tree .quick-input-tree-rows{overflow:hidden;text-overflow:ellipsis;display:flex;flex-direction:column;height:100%;flex:1;margin-left:5px}.quick-input-tree .quick-input-tree-rows>.quick-input-tree-row{display:flex;align-items:center}.quick-input-tree .quick-input-tree-rows>.quick-input-tree-row .monaco-icon-label,.quick-input-tree .quick-input-tree-rows>.quick-input-tree-row .monaco-icon-label .monaco-icon-label-container>.monaco-icon-name-container{flex:1}.quick-input-tree .quick-input-tree-rows>.quick-input-tree-row .codicon[class*=codicon-]{vertical-align:text-bottom}.quick-input-tree .quick-input-tree-rows .monaco-highlighted-label>span{opacity:1}.quick-input-tree .quick-input-tree-entry-action-bar{display:flex;flex:0;overflow:visible}.quick-input-tree .quick-input-tree-entry-action-bar .action-label{display:none}.quick-input-tree .quick-input-tree-entry-action-bar .action-label.codicon{margin-right:4px;padding:2px}.quick-input-tree .quick-input-tree-entry-action-bar{margin-top:1px}.quick-input-tree .quick-input-tree-entry-action-bar{margin-right:4px}.quick-input-tree .quick-input-tree-entry .quick-input-tree-entry-action-bar .action-label.always-visible,.quick-input-tree .quick-input-tree-entry:hover .quick-input-tree-entry-action-bar .action-label,.quick-input-tree .quick-input-tree-entry.focus-inside .quick-input-tree-entry-action-bar .action-label,.quick-input-tree .monaco-list-row.focused .quick-input-tree-entry-action-bar .action-label,.quick-input-tree .monaco-list-row.passive-focused .quick-input-tree-entry-action-bar .action-label{display:flex}.quick-input-tree>.monaco-list:focus .monaco-list-row.focused{outline:1px solid var(--vscode-list-focusOutline)!important;outline-offset:-1px}.monaco-progress-container{width:100%;height:2px;overflow:hidden}.monaco-progress-container .progress-bit{width:2%;height:2px;position:absolute;left:0;display:none}.monaco-progress-container.active .progress-bit{display:inherit}.monaco-progress-container.discrete .progress-bit{left:0;transition:width .1s linear}.monaco-progress-container.discrete.done .progress-bit{width:100%}.monaco-progress-container.infinite .progress-bit{animation-name:progress;animation-duration:4s;animation-iteration-count:infinite;transform:translateZ(0);animation-timing-function:linear}.monaco-progress-container.infinite.infinite-long-running .progress-bit{animation-timing-function:steps(100)}@keyframes progress{0%{transform:translate(0) scaleX(1)}50%{transform:translate(2500%) scaleX(3)}to{transform:translate(4900%) scaleX(1)}}.monaco-editor .rendered-markdown kbd{background-color:var(--vscode-keybindingLabel-background);color:var(--vscode-keybindingLabel-foreground);border-style:solid;border-width:1px;border-radius:3px;border-color:var(--vscode-keybindingLabel-border);border-bottom-color:var(--vscode-keybindingLabel-bottomBorder);box-shadow:inset 0 -1px 0 var(--vscode-widget-shadow);vertical-align:middle;padding:1px 3px}.rendered-markdown li:has(input[type=checkbox]){list-style-type:none}.monaco-component.multiDiffEditor{background:var(--vscode-multiDiffEditor-background);position:relative;height:100%;width:100%;overflow-y:hidden;>div{position:absolute;top:0;left:0;height:100%;width:100%;&.placeholder{visibility:hidden;&.visible{visibility:visible}display:grid;place-items:center;place-content:center}}.active{--vscode-multiDiffEditor-border: var(--vscode-focusBorder)}.multiDiffEntry{display:flex;flex-direction:column;flex:1;overflow:hidden;.collapse-button{margin:0 5px;cursor:pointer;a{display:block}}.header{z-index:1000;background:var(--vscode-editor-background);&:not(.collapsed) .header-content{border-bottom:1px solid var(--vscode-sideBarSectionHeader-border)}.header-content{margin:8px 0 0;padding:4px 5px;border-top:1px solid var(--vscode-multiDiffEditor-border);display:flex;align-items:center;color:var(--vscode-foreground);background:var(--vscode-multiDiffEditor-headerBackground);&.shadow{box-shadow:var(--vscode-scrollbar-shadow) 0 6px 6px -6px}.file-path{display:flex;flex:1;min-width:0;.title{font-size:14px;line-height:22px;&.original{flex:1;min-width:0;text-overflow:ellipsis}}.status{font-weight:600;opacity:.75;margin:0 10px;line-height:22px}}.actions{padding:0 8px}}}.editorParent{flex:1;display:flex;flex-direction:column;border-bottom:1px solid var(--vscode-multiDiffEditor-border);overflow:hidden}.editorContainer{flex:1}}}\n";if(typeof document!=="undefined"&&!document.getElementById("tytus-workbench-css")){const s=document.createElement("style");s.id="tytus-workbench-css";s.textContent=__tytusWorkbenchCss;document.head.appendChild(s);}
import { jsxs as l, jsx as a, Fragment as De } from "react/jsx-runtime";
import { forwardRef as Ln, createElement as Ft, useState as v, useRef as ze, useCallback as y, useEffect as Q, lazy as Xa, useMemo as re, Suspense as Ya } from "react";
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qa = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Za = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (t, n, o) => o ? o.toUpperCase() : n.toLowerCase()
), fn = (e) => {
  const t = Za(e);
  return t.charAt(0).toUpperCase() + t.slice(1);
}, On = (...e) => e.filter((t, n, o) => !!t && t.trim() !== "" && o.indexOf(t) === n).join(" ").trim(), eo = (e) => {
  for (const t in e)
    if (t.startsWith("aria-") || t === "role" || t === "title")
      return !0;
};
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var to = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const no = Ln(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: n = 2,
    absoluteStrokeWidth: o,
    className: r = "",
    children: i,
    iconNode: s,
    ...d
  }, p) => Ft(
    "svg",
    {
      ref: p,
      ...to,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: o ? Number(n) * 24 / Number(t) : n,
      className: On("lucide", r),
      ...!i && !eo(d) && { "aria-hidden": "true" },
      ...d
    },
    [
      ...s.map(([f, b]) => Ft(f, b)),
      ...Array.isArray(i) ? i : [i]
    ]
  )
);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const W = (e, t) => {
  const n = Ln(
    ({ className: o, ...r }, i) => Ft(no, {
      ref: i,
      iconNode: t,
      className: On(
        `lucide-${Qa(fn(e))}`,
        `lucide-${e}`,
        o
      ),
      ...r
    })
  );
  return n.displayName = fn(e), n;
};
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ao = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
], Ut = W("bot", ao);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const oo = [
  ["path", { d: "M12 20v-9", key: "1qisl0" }],
  ["path", { d: "M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z", key: "uouzyp" }],
  ["path", { d: "M14.12 3.88 16 2", key: "qol33r" }],
  ["path", { d: "M21 21a4 4 0 0 0-3.81-4", key: "1b0z45" }],
  ["path", { d: "M21 5a4 4 0 0 1-3.55 3.97", key: "5cxbf6" }],
  ["path", { d: "M22 13h-4", key: "1jl80f" }],
  ["path", { d: "M3 21a4 4 0 0 1 3.81-4", key: "1fjd4g" }],
  ["path", { d: "M3 5a4 4 0 0 0 3.55 3.97", key: "1d7oge" }],
  ["path", { d: "M6 13H2", key: "82j7cp" }],
  ["path", { d: "m8 2 1.88 1.88", key: "fmnt4t" }],
  ["path", { d: "M9 7.13V6a3 3 0 1 1 6 0v1.13", key: "1vgav8" }]
], En = W("bug", oo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ro = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], io = W("check", ro);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const so = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], ht = W("chevron-down", so);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const co = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
  ["path", { d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662", key: "154egf" }]
], lo = W("circle-user", co);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ho = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
], jt = W("copy", ho);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uo = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
], mo = W("ellipsis", uo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const po = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
], Vt = W("eye", po);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const fo = [
  [
    "path",
    {
      d: "M4 12.15V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-3.35",
      key: "1wthlu"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "m5 16-3 3 3 3", key: "331omg" }],
  ["path", { d: "m9 22 3-3-3-3", key: "lsp7cz" }]
], Rn = W("file-code-corner", fo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bo = [
  [
    "path",
    {
      d: "M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35",
      key: "17jvcc"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M14 19h6", key: "bvotb8" }],
  ["path", { d: "M17 16v6", key: "18yu1i" }]
], qt = W("file-plus-corner", bo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const go = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["circle", { cx: "11.5", cy: "14.5", r: "2.5", key: "1bq0ko" }],
  ["path", { d: "M13.3 16.3 15 18", key: "2quom7" }]
], ut = W("file-search", go);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ko = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }]
], Fn = W("file", ko);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wo = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
], Kt = W("folder-open", wo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yo = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
], jn = W("folder", yo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vo = [
  ["line", { x1: "6", x2: "6", y1: "3", y2: "15", key: "17qcm7" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M18 9a9 9 0 0 1-9 9", key: "n2h4wq" }]
], Dn = W("git-branch", vo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Co = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ],
  ["path", { d: "M7 11h10", key: "1twpyw" }],
  ["path", { d: "M7 15h6", key: "d9of3u" }],
  ["path", { d: "M7 7h8", key: "af5zfr" }]
], $o = W("message-square-text", Co);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xo = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
], No = W("panel-right", xo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ao = [
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
      key: "1miecu"
    }
  ]
], bn = W("paperclip", Ao);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const So = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], Io = W("plus", So);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mo = [
  ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "14sxne" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16", key: "1hlbsb" }],
  ["path", { d: "M16 16h5v5", key: "ccwih5" }]
], Xe = W("refresh-ccw", Mo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Po = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
], To = W("search", Po);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lo = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
], Oo = W("send", Lo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eo = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
], Ro = W("settings", Eo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fo = [
  ["path", { d: "M10 5H3", key: "1qgfaw" }],
  ["path", { d: "M12 19H3", key: "yhmn1j" }],
  ["path", { d: "M14 3v4", key: "1sua03" }],
  ["path", { d: "M16 17v4", key: "1q0r14" }],
  ["path", { d: "M21 12h-9", key: "1o4lsq" }],
  ["path", { d: "M21 19h-5", key: "1rlt1p" }],
  ["path", { d: "M21 5h-7", key: "1oszz2" }],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M8 12H3", key: "a7s4jb" }]
], zn = W("sliders-horizontal", Fo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jo = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
], Do = W("square", jo);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zo = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], we = W("x", zo), _o = {
  md: "markdown",
  markdown: "markdown",
  json: "json",
  jsonc: "json",
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  css: "css",
  scss: "css",
  less: "css",
  html: "html",
  htm: "html",
  xml: "xml",
  svg: "xml",
  yml: "yaml",
  yaml: "yaml",
  py: "python",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  csv: "csv",
  txt: "text",
  log: "text"
};
function _n(e) {
  const t = e.split(".").pop()?.toLowerCase() ?? "";
  return _o[t] ?? "text";
}
function Hn(e) {
  return {
    markdown: "Markdown",
    json: "JSON",
    typescript: "TypeScript",
    javascript: "JavaScript",
    css: "CSS",
    html: "HTML",
    xml: "XML",
    yaml: "YAML",
    python: "Python",
    shell: "Shell",
    csv: "CSV",
    text: "Plain Text"
  }[e];
}
function Bn(e, t) {
  if (t > 15e5) return !1;
  const n = e.split(".").pop()?.toLowerCase() ?? "";
  return !(/* @__PURE__ */ new Set(["png", "jpg", "jpeg", "gif", "webp", "avif", "mp3", "wav", "flac", "mp4", "mov", "zip", "gz", "tar", "pdf", "dmg", "sqlite", "db"])).has(n);
}
const Ho = /* @__PURE__ */ new Set([".git", "node_modules", "dist", "build", ".next", ".turbo", "coverage", ".cache"]);
function Bo() {
  const e = Gt();
  return !!(e?.showOpenFilePicker && e.showDirectoryPicker);
}
async function Wo() {
  const e = Gt()?.showOpenFilePicker;
  if (!e) return Vn(!1);
  const t = await e({ multiple: !0 }), n = await Promise.all(t.map((o) => Wn(o, o.name, "local-file")));
  return Jt(n.filter(Boolean));
}
async function Uo() {
  const e = Gt()?.showDirectoryPicker;
  if (!e)
    return { name: "Browser fallback folder", files: await Vn(!0) };
  const t = await e({ mode: "readwrite" }), n = [];
  return await Un(t, t.name, n, 0, 320), { name: t.name, handle: t, files: Jt(n) };
}
function Gt() {
  const e = window;
  if (typeof e.showOpenFilePicker == "function" && typeof e.showDirectoryPicker == "function")
    return e;
  try {
    const t = window.top;
    if (t && t !== e && typeof t.showOpenFilePicker == "function" && typeof t.showDirectoryPicker == "function")
      return t;
  } catch {
  }
  return null;
}
async function Wn(e, t, n) {
  const o = await e.getFile();
  if (!Bn(t, o.size)) return null;
  const r = await o.text();
  return {
    id: qn(t),
    name: e.name,
    path: t,
    language: _n(t),
    content: r,
    dirty: !1,
    handle: e,
    size: o.size,
    source: n
  };
}
async function Un(e, t, n, o, r) {
  if (!(n.length >= r || o > 8))
    for await (const i of e.values()) {
      if (n.length >= r) break;
      if (i.kind === "directory") {
        if (Ho.has(i.name)) continue;
        await Un(i, `${t}/${i.name}`, n, o + 1, r);
        continue;
      }
      const s = i, d = await Wn(s, `${t}/${s.name}`, "local-folder");
      d && n.push(d);
    }
}
function Vn(e) {
  return new Promise((t) => {
    const n = document.createElement("input");
    n.type = "file", n.multiple = !0, n.style.display = "none", e && n.setAttribute("webkitdirectory", ""), n.onchange = async () => {
      const o = Array.from(n.files ?? []), r = await Promise.all(o.map(async (i) => {
        const s = i.webkitRelativePath || i.name;
        return Bn(s, i.size) ? {
          id: qn(s),
          name: i.name,
          path: s,
          language: _n(s),
          content: await i.text(),
          dirty: !1,
          size: i.size,
          source: e ? "local-folder" : "local-file"
        } : null;
      }));
      n.remove(), t(Jt(r.filter(Boolean)));
    }, document.body.append(n), n.click();
  });
}
async function Mt(e) {
  if (!e.handle?.createWritable)
    return Vo(e), { ...e, dirty: !1 };
  const t = await e.handle.createWritable();
  return await t.write(e.content), await t.close(), { ...e, dirty: !1 };
}
function Vo(e) {
  const t = new Blob([e.content], { type: "text/plain;charset=utf-8" }), n = URL.createObjectURL(t), o = document.createElement("a");
  o.href = n, o.download = e.name, o.click(), URL.revokeObjectURL(n);
}
function qn(e) {
  let t = 0;
  for (let n = 0; n < e.length; n += 1) t = t * 31 + e.charCodeAt(n) | 0;
  return `${e.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Math.abs(t)}`;
}
function Jt(e) {
  return [...e].sort((t, n) => t.path.localeCompare(n.path));
}
function Kn(e) {
  let t = e;
  return t = t.replace(/</g, "&lt;").replace(/>/g, "&gt;"), t = t.replace(/```(\w*)\n([\s\S]*?)```/g, (n, o, r) => `<pre style="background:var(--bg-code);padding:16px;border-radius:8px;overflow:auto;margin:12px 0"><code style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text-primary)">${r.trim()}</code></pre>`), t = t.replace(/`([^`]+)`/g, `<code style="background:rgba(124,77,255,0.1);padding:2px 6px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:12px">$1</code>`), t = t.replace(/^###### (.*$)/gim, '<h6 style="font-size:13px;font-weight:600;margin:12px 0;color:var(--text-primary)">$1</h6>'), t = t.replace(/^##### (.*$)/gim, '<h5 style="font-size:14px;font-weight:600;margin:12px 0;color:var(--text-primary)">$1</h5>'), t = t.replace(/^#### (.*$)/gim, '<h4 style="font-size:16px;font-weight:600;margin:14px 0;color:var(--text-primary)">$1</h4>'), t = t.replace(/^### (.*$)/gim, '<h3 style="font-size:20px;font-weight:600;margin:16px 0;color:var(--text-primary)">$1</h3>'), t = t.replace(/^## (.*$)/gim, '<h2 style="font-size:24px;font-weight:600;margin:20px 0;padding-bottom:8px;border-bottom:1px solid var(--border-default);color:var(--text-primary)">$1</h2>'), t = t.replace(/^# (.*$)/gim, '<h1 style="font-size:32px;font-weight:700;margin:24px 0;padding-bottom:8px;border-bottom:2px solid var(--border-default);color:var(--text-primary)">$1</h1>'), t = t.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>"), t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"), t = t.replace(/\*(.+?)\*/g, "<em>$1</em>"), t = t.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>"), t = t.replace(/__(.+?)__/g, "<strong>$1</strong>"), t = t.replace(/_(.+?)_/g, "<em>$1</em>"), t = t.replace(/~~(.+?)~~/g, "<del>$1</del>"), t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--accent-primary);text-decoration:none" target="_blank" rel="noopener">$1</a>'), t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:12px 0" />'), t = t.replace(/^&gt; (.*$)/gim, '<blockquote style="border-left:4px solid var(--accent-primary);padding-left:16px;margin:12px 0;color:var(--text-secondary)">$1</blockquote>'), t = t.replace(/^---+$/gim, '<hr style="border:none;border-top:1px solid var(--border-default);margin:24px 0" />'), t = t.replace(/^\*\*\*+$/gim, '<hr style="border:none;border-top:1px solid var(--border-default);margin:24px 0" />'), t = t.replace(/^- \[x\] (.*$)/gim, '<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="color:var(--accent-success)">&#9745;</span><span>$1</span></div>'), t = t.replace(/^- \[ \] (.*$)/gim, '<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span>&#9744;</span><span>$1</span></div>'), t = t.replace(/^(\d+\.\s.*(?:\n\d+\.\s.*)*)/gm, (n) => `<ol style="padding-left:24px;margin:12px 0">${n.split(`
`).map(
    (r) => `<li style="margin:4px 0">${r.replace(/^\d+\.\s/, "")}</li>`
  ).join("")}</ol>`), t = t.replace(/^([-*]\s.*(?:\n[-*]\s.*)*)/gm, (n) => `<ul style="padding-left:24px;margin:12px 0">${n.split(`
`).map(
    (r) => `<li style="margin:4px 0">${r.replace(/^[-*]\s/, "")}</li>`
  ).join("")}</ul>`), t = t.replace(/\|(.+)\|\n\|[-:\|\s]+\|\n((?:\|.+\|\n?)+)/g, (n, o, r) => {
    const i = o.split("|").filter(Boolean).map((d) => `<th style="padding:8px 12px;background:var(--bg-titlebar);font-weight:600;font-size:13px;border:1px solid var(--border-default)">${d.trim()}</th>`).join(""), s = r.trim().split(`
`).map((d) => `<tr>${d.split("|").filter(Boolean).map(
      (f, b) => `<td style="padding:8px 12px;border:1px solid var(--border-default);font-size:13px;background:${b % 2 === 0 ? "transparent" : "var(--bg-hover)"};color:var(--text-primary)">${f.trim()}</td>`
    ).join("")}</tr>`).join("");
    return `<table style="border-collapse:collapse;margin:16px 0;width:100%;border:1px solid var(--border-default)"><thead><tr>${i}</tr></thead><tbody>${s}</tbody></table>`;
  }), t = t.replace(/^(?!<[a-z])(.+)$/gim, '<p style="line-height:1.6;margin:12px 0;color:var(--text-primary)">$1</p>'), t = t.replace(/\n+/g, `
`), t;
}
const Fe = "atomek:default", qo = 3e3, Xt = "tytus.atomek.threadTitleOverrides", gn = {
  available: !1,
  source: "none",
  label: "Tytus AI unavailable",
  reason: "host.ai is not available in this Tytus build."
}, Ge = (e) => e.role !== "user" && e.role !== "assistant" ? null : {
  id: e.id,
  role: e.role,
  body: e.body,
  status: e.status,
  gatewayLabel: e.gatewayLabel ?? void 0,
  error: e.error ?? void 0,
  createdAt: e.createdAt
}, Ko = (e, t = qo) => e.length <= t ? e : `${e.slice(0, t)}

[...clipped ${e.length - t} chars...]`, kn = (e, t) => {
  const n = e.split(`
`).map((o) => o.replace(/^#+\s*/, "").trim()).find(Boolean);
  return n ? n.length > 80 ? `${n.slice(0, 77)}...` : n : t;
}, Go = (e) => ["briefing", "action-list", "quiz", "plan", "storyboard", "report", "local-draft", "markdown", "memory"].includes(e) ? e : "report", wn = (e) => ({
  id: e.id,
  title: e.title,
  kind: Go(e.kind),
  body: e.body,
  createdAt: e.createdAt,
  source: "ai"
}), Jo = (e) => e.length === 0 ? null : {
  kind: "workspace",
  title: "Relevant Atomek memory",
  text: e.map((t, n) => [
    `Memory ${n + 1}: ${t.title}`,
    Ko(t.body, 900)
  ].join(`
`)).join(`

---

`)
}, Yt = () => {
  try {
    const e = localStorage.getItem(Xt);
    if (!e) return {};
    const t = JSON.parse(e);
    return !t || typeof t != "object" ? {} : Object.fromEntries(
      Object.entries(t).filter(([, n]) => typeof n == "string" && n.trim()).map(([n, o]) => [n, String(o)])
    );
  } catch {
    return {};
  }
}, Xo = (e, t) => {
  try {
    const n = Yt();
    n[e] = t, localStorage.setItem(Xt, JSON.stringify(n));
  } catch {
  }
}, Yo = (e) => {
  try {
    const t = Yt();
    delete t[e], localStorage.setItem(Xt, JSON.stringify(t));
  } catch {
  }
}, yn = (e) => {
  const t = Yt();
  return e.map((n) => t[n.id] ? { ...n, title: t[n.id] } : n);
};
function Qo({ host: e, requestContext: t, chatSettings: n, setStatus: o }) {
  const r = e.ai, [i, s] = v(null), [d, p] = v([]), [f, b] = v([]), [h, w] = v([]), [I, T] = v([]), [B, q] = v(gn), [U, J] = v(!1), Z = ze(!0), P = ze(null), H = y(async () => {
    if (!r) {
      q(gn);
      return;
    }
    try {
      q(await r.status());
    } catch ($) {
      q({
        available: !1,
        source: "none",
        label: "Tytus AI unavailable",
        reason: $ instanceof Error ? $.message : String($)
      });
    }
  }, [r]), ee = y(async ($) => {
    if (r)
      try {
        const N = await r.listArtifacts({ threadId: $ });
        if (!Z.current) return;
        w(N.map(wn));
      } catch (N) {
        o(`AI artifacts unavailable: ${N instanceof Error ? N.message : String(N)}`);
      }
  }, [r, o]), _ = y(async ($) => {
    if (r)
      try {
        const N = await r.listMessages($);
        if (!Z.current) return;
        const L = d.find((j) => j.id === $) ?? null;
        L && s(L), b(N.map(Ge).filter(Boolean)), T([]), await ee($);
      } catch (N) {
        o(`Load chat failed: ${N instanceof Error ? N.message : String(N)}`);
      }
  }, [r, ee, o, d]), X = y(async () => {
    if (r)
      try {
        const $ = yn(await r.listThreads({ workspaceKey: Fe, status: "active" })), N = $[0] ?? await r.createThread({ workspaceKey: Fe, title: "Atomek chat" });
        if (!Z.current) return;
        p($[0] ? $ : [N]), s(N);
        const L = await r.listMessages(N.id);
        if (!Z.current) return;
        b(L.map(Ge).filter(Boolean)), await ee(N.id);
      } catch ($) {
        o(`AI chat unavailable: ${$ instanceof Error ? $.message : String($)}`);
      }
  }, [r, ee, o]);
  Q(() => (Z.current = !0, H(), X(), () => {
    Z.current = !1;
  }), [X, H]);
  const oe = y(async () => {
    if (!r) return null;
    if (i) return i;
    const $ = await r.createThread({ workspaceKey: Fe, title: "Atomek chat" });
    return Z.current && (s($), p((N) => [$, ...N.filter((L) => L.id !== $.id)])), $;
  }, [r, i]), ye = y(async () => {
    if (!r) return;
    const $ = await r.createThread({ workspaceKey: Fe, title: "Atomek chat" });
    s($), p((N) => [$, ...N.filter((L) => L.id !== $.id)]), b([]), w([]), T([]), o("New AI chat created");
  }, [r, o]), g = y(async ($, N) => {
    if (!r) return;
    const L = N.trim();
    if (L)
      try {
        const j = r.updateThread, te = d.find((ne) => ne.id === $) ?? i, V = typeof j == "function" ? await j({ threadId: $, title: L }) : { ...te ?? await oe(), id: $, title: L, updatedAt: Date.now() };
        typeof j != "function" && Xo($, L), p((ne) => ne.map((ve) => ve.id === V.id ? V : ve)), s((ne) => ne?.id === V.id ? V : ne), o(typeof j == "function" ? `Renamed chat: ${V.title}` : `Renamed chat locally: ${V.title}`);
      } catch (j) {
        o(`Rename chat failed: ${j instanceof Error ? j.message : String(j)}`);
      }
  }, [r, oe, o, i, d]), R = y(async ($) => {
    if (r)
      try {
        await r.deleteThread($), Yo($);
        const N = d.filter((L) => L.id !== $);
        if (p(N), i?.id === $) {
          const L = N[0] ?? await r.createThread({ workspaceKey: Fe, title: "Atomek chat" });
          s(L), p((te) => te.some((V) => V.id === L.id) ? te : [L, ...te]);
          const j = await r.listMessages(L.id);
          b(j.map(Ge).filter(Boolean)), await ee(L.id);
        }
        o("Deleted AI chat");
      } catch (N) {
        o(`Delete chat failed: ${N instanceof Error ? N.message : String(N)}`);
      }
  }, [r, ee, o, i?.id, d]), K = y(async ($) => {
    if (!r) return null;
    try {
      const N = await oe();
      if (!N) return null;
      const L = await r.createArtifact({
        threadId: N.id,
        messageId: $.messageId ?? null,
        title: $.title?.trim() || kn($.body, "Atomek artifact"),
        kind: $.kind ?? "markdown",
        body: $.body
      }), j = wn(L);
      return w((te) => [j, ...te.filter((V) => V.id !== j.id)]), o(`Saved AI artifact: ${j.title}`), j;
    } catch (N) {
      return o(`Save artifact failed: ${N instanceof Error ? N.message : String(N)}`), null;
    }
  }, [r, oe, o]), le = y(async ($) => {
    if (r)
      try {
        await r.deleteArtifact($), w((N) => N.filter((L) => L.id !== $)), o("Deleted AI artifact");
      } catch (N) {
        o(`Delete artifact failed: ${N instanceof Error ? N.message : String(N)}`);
      }
  }, [r, o]), Y = y(async ($) => {
    if (!r) return null;
    try {
      const N = await r.writeMemory({
        title: $.title?.trim() || kn($.body, "Atomek memory"),
        body: $.body,
        metadata: {
          source: "atomek",
          messageId: $.messageId ?? null
        }
      });
      return T((L) => [N, ...L.filter((j) => j.id !== N.id)].slice(0, 5)), o(`Remembered: ${N.title}`), N;
    } catch (N) {
      return o(`Remember failed: ${N instanceof Error ? N.message : String(N)}`), null;
    }
  }, [r, o]), de = y(async ($) => {
    if (!r) return [];
    const N = await r.searchMemory({ query: $, limit: 5 });
    return Z.current && T(N), N;
  }, [r]), be = y(async ($, N = {}) => {
    const L = $.trim();
    if (!L || !r) return null;
    J(!0);
    let j = null;
    const te = new AbortController();
    P.current = te;
    try {
      const V = await oe();
      if (!V) return null;
      const ne = await de(L).catch(() => []), ve = Jo(ne), Ae = N.requestContext ?? t, Te = ve ? [...Ae, ve] : [...Ae];
      let m = null;
      for await (const A of r.sendMessage({
        threadId: V.id,
        body: L,
        gatewayPreference: n.gatewayPreference,
        model: n.model.trim() || void 0,
        context: Te,
        signal: te.signal
      })) {
        if (A.type === "message_created") {
          const E = Ge(A.message);
          if (!E) continue;
          E.role === "assistant" && (m = E.id), b((x) => [...x.filter((F) => F.id !== E.id), E]);
        }
        if (A.type === "token" && (m = A.messageId, b((E) => E.some((x) => x.id === A.messageId) ? E.map(
          (x) => x.id === A.messageId ? { ...x, body: A.body, status: "streaming" } : x
        ) : [...E, {
          id: A.messageId,
          role: "assistant",
          body: A.body,
          status: "streaming",
          createdAt: Date.now()
        }])), A.type === "message_updated" || A.type === "done") {
          const E = Ge(A.message);
          if (!E) continue;
          E.role === "assistant" && (j = E), b((x) => x.map((F) => F.id === E.id ? E : F)), E.gatewayLabel && o(`AI answered via ${E.gatewayLabel}`);
        }
        if (A.type === "run_failed") {
          const E = te.signal.aborted;
          o(E ? "AI response stopped" : `AI failed: ${A.error}`), m && b((x) => x.map((F) => F.id !== m ? F : E ? { ...F, status: "complete", error: void 0, body: F.body || "Stopped by user." } : { ...F, status: "error", error: A.error, body: A.error }));
        }
      }
      const S = yn(await r.listThreads({ workspaceKey: Fe, status: "active" }).catch(() => []));
      return Z.current && S.length > 0 && p(S), H(), j;
    } catch (V) {
      return V instanceof DOMException && V.name === "AbortError" ? (o("AI response stopped"), j) : (o(`AI failed: ${V instanceof Error ? V.message : String(V)}`), null);
    } finally {
      P.current === te && (P.current = null), J(!1);
    }
  }, [r, n.gatewayPreference, n.model, oe, de, H, t, o]), _e = y(() => {
    P.current?.abort(), o("Stopping AI response…");
  }, [o]);
  return {
    aiStatus: B,
    artifacts: h,
    busy: U,
    memoryHits: I,
    messages: f,
    thread: i,
    threads: d,
    askAgent: be,
    createArtifact: K,
    deleteArtifact: le,
    deleteThread: R,
    newChat: ye,
    recall: de,
    remember: Y,
    renameThread: g,
    selectThread: _,
    stopChat: _e
  };
}
const Zo = (e) => `tytus-workbench:///${encodeURI(e.path)}`, er = (e) => {
  let t = 2166136261;
  for (let n = 0; n < e.length; n += 1)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
  return (t >>> 0).toString(16).padStart(8, "0");
}, tr = ({ files: e, openEditorIds: t, activeFileId: n, versions: o, activeSelection: r }) => {
  const i = new Set(t), s = e.map((d) => {
    const p = d.id === n;
    return {
      id: d.id,
      uri: Zo(d),
      path: d.path,
      name: d.name,
      language: d.language,
      version: o[d.id] ?? 1,
      contentHash: er(d.content),
      dirty: d.dirty,
      source: d.source,
      selection: p && r ? r : void 0,
      updatedAt: Date.now(),
      open: i.has(d.id),
      active: p
    };
  });
  return {
    documents: s,
    byId: new Map(s.map((d) => [d.id, d])),
    activeDocumentId: n,
    openDocumentIds: t.filter((d) => s.some((p) => p.id === d))
  };
}, nr = "active-file", ar = (e) => e === "none" ? "No context" : e === "active-selection" ? "Active selection" : e === "active-file" ? "Active file" : e === "open-editors" ? "Open editors" : e === "selected-files" ? "Selected files" : "Indexed project", or = (e, t = "file") => `${t}:${e.id}`, rr = (e, t) => [
  "selection",
  e.id,
  t.startLineNumber,
  t.startColumn,
  t.endLineNumber,
  t.endColumn
].join(":"), st = (e, t, n) => ({
  id: or(e),
  kind: "file",
  label: n ? `${n}: ${e.name}` : e.name,
  fileId: e.id,
  path: e.path,
  version: e.version,
  contentHash: e.contentHash,
  language: e.language,
  dirty: e.dirty,
  includeBody: !0,
  removable: !0,
  implicit: t
}), ir = (e, t, n) => ({
  id: rr(e, t),
  kind: "selection",
  label: `Selection: ${e.name}:${t.startLineNumber}-${t.endLineNumber}`,
  fileId: e.id,
  path: e.path,
  range: t,
  version: e.version,
  contentHash: e.contentHash,
  language: e.language,
  dirty: e.dirty,
  includeBody: !0,
  removable: !0,
  implicit: n
}), sr = (e, t) => {
  const n = new Set(t.removedAttachmentIds), o = e.activeDocumentId ? e.byId.get(e.activeDocumentId) ?? null : null;
  let r = [];
  return t.scope === "active-selection" ? o?.selection ? r = [ir(o, o.selection, !0)] : o && (r = [st(o, !0, "Active file")]) : t.scope === "active-file" ? o && (r = [st(o, !0, "Active file")]) : t.scope === "open-editors" ? r = e.openDocumentIds.map((i) => e.byId.get(i)).filter(Boolean).map((i) => st(i, !0, "Open editor")) : t.scope === "selected-files" && (r = t.selectedFileIds.map((i) => e.byId.get(i)).filter(Boolean).map((i) => st(i, !1, "Selected file"))), cr(r).filter((i) => !n.has(i.id));
}, cr = (e) => {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => t.has(n.id) ? !1 : (t.add(n.id), !0));
}, lr = 4e3, dr = 8e3, hr = 4e3, ur = (e, t) => e.length <= t ? e : `${e.slice(0, t)}

[...clipped ${e.length - t} chars...]`, mr = (e, t, n) => {
  const o = sr(e, n), r = [], i = new Map(t.map((s) => [s.id, s]));
  for (const s of o) {
    if (!s.fileId) continue;
    const d = i.get(s.fileId), p = e.byId.get(s.fileId);
    if (!d || !p || !s.includeBody) continue;
    const f = [
      `Path: ${d.path}`,
      `Language: ${d.language}`,
      `Version: ${p.version}`,
      `Hash: ${p.contentHash}`,
      `Dirty: ${p.dirty ? "yes" : "no"}`,
      s.range ? `Range: ${vn(s.range)}` : null
    ].filter(Boolean).join(`
`), b = s.kind === "selection" && s.range ? pr(d.content, s.range) : d.content, h = s.kind === "selection" ? lr : s.label.startsWith("Open editor") ? hr : dr;
    r.push({
      kind: s.kind === "selection" ? "selection" : "file",
      title: s.kind === "selection" ? `Active selection: ${d.path}` : s.label,
      text: `${f}

${ur(b, h)}`
    });
  }
  return o.length > 0 && r.push({
    kind: "workspace",
    title: "Atomek chat context manifest",
    text: o.map((s, d) => [
      `${d + 1}. ${s.label}`,
      s.path ? `   path: ${s.path}` : null,
      s.range ? `   range: ${vn(s.range)}` : null,
      s.version ? `   version: ${s.version}` : null,
      s.dirty ? "   dirty: yes" : null
    ].filter(Boolean).join(`
`)).join(`
`)
  }), { parts: r, attachments: o };
}, pr = (e, t) => {
  const n = e.split(`
`), o = Math.max(1, t.startLineNumber), r = Math.max(o, t.endLineNumber), i = n.slice(o - 1, r);
  return i.length === 0 ? "" : i.length === 1 ? i[0].slice(Math.max(0, t.startColumn - 1), Math.max(0, t.endColumn - 1)) : (i[0] = i[0].slice(Math.max(0, t.startColumn - 1)), i[i.length - 1] = i[i.length - 1].slice(0, Math.max(0, t.endColumn - 1)), i.join(`
`));
}, vn = (e) => `${e.startLineNumber}:${e.startColumn}-${e.endLineNumber}:${e.endColumn}`, Cn = 75e4, fr = 2800, br = 240, gr = 80, kr = /* @__PURE__ */ new Set([
  ".git",
  ".hg",
  ".svn",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".turbo",
  ".cache",
  ".parcel-cache",
  "node_modules",
  "bower_components",
  "vendor",
  "dist",
  "build",
  "coverage",
  ".vite",
  ".DS_Store"
]), wr = /* @__PURE__ */ new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "avif",
  "ico",
  "bmp",
  "tiff",
  "pdf",
  "zip",
  "gz",
  "tgz",
  "rar",
  "7z",
  "tar",
  "wasm",
  "exe",
  "dll",
  "dylib",
  "so",
  "class",
  "jar",
  "pyc",
  "pyo",
  "woff",
  "woff2",
  "ttf",
  "otf",
  "eot",
  "mp3",
  "mp4",
  "m4a",
  "mov",
  "avi",
  "webm",
  "wav",
  "flac",
  "sqlite",
  "db",
  "lock"
]), Pe = (e) => {
  let t = 2166136261;
  for (let n = 0; n < e.length; n += 1)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
  return (t >>> 0).toString(16).padStart(8, "0");
}, Gn = (e) => Pe(
  e.map((t) => `${t.id}\0${t.path}\0${t.language}\0${t.dirty ? "1" : "0"}\0${Pe(t.content)}`).sort().join("")
), Dt = (e, t = {}) => {
  const n = e.size ?? e.content.length;
  return n === 0 || e.content.length === 0 ? "empty" : n > (t.maxFileBytes ?? Cn) || e.content.length > (t.maxFileBytes ?? Cn) ? "huge" : !t.includeDirty && e.dirty ? null : Nr(e.path) ? "vendor" : Ar(e) ? "binary" : null;
}, $n = (e, t = {}) => {
  const n = Date.now(), o = [], r = [], i = [];
  for (const s of e) {
    const d = s.size ?? s.content.length, p = Dt(s, t);
    if (p) {
      r.push({ fileId: s.id, name: s.name, path: s.path, language: s.language, reason: p, size: d });
      continue;
    }
    const f = Pe(s.content), b = yr(s, f, n, t);
    i.push(...b), o.push({
      fileId: s.id,
      name: s.name,
      path: s.path,
      language: s.language,
      hash: f,
      dirty: s.dirty,
      source: s.source,
      size: d,
      chunkIds: b.map((h) => h.id),
      indexedAt: n
    });
  }
  return vr({
    indexedAt: n,
    signature: Gn(e),
    files: o,
    skipped: r,
    chunks: i,
    byFileId: new Map(o.map((s) => [s.fileId, s])),
    byChunkId: new Map(i.map((s) => [s.id, s]))
  });
}, yr = (e, t = Pe(e.content), n = Date.now(), o = {}) => {
  const r = Math.max(500, o.maxChunkChars ?? fr), i = Math.min(Math.max(0, o.chunkOverlapChars ?? br), Math.floor(r / 2)), s = Math.max(1, o.maxChunksPerFile ?? gr), d = $r(e.content), p = [];
  let f = 0, b = 0;
  for (; f < e.content.length && p.length < s; ) {
    const h = Cr(e.content, f, Math.min(e.content.length, f + r)), w = e.content.slice(f, h).trim();
    if (w.length > 0) {
      const I = xr(d, f, h);
      p.push({
        id: `${e.id}:${t}:${b}:${I.startLineNumber}-${I.endLineNumber}`,
        fileId: e.id,
        path: e.path,
        name: e.name,
        language: e.language,
        hash: t,
        dirty: e.dirty,
        source: e.source,
        size: e.size ?? e.content.length,
        ordinal: b,
        text: w,
        range: I,
        charStart: f,
        charEnd: h,
        indexedAt: n
      }), b += 1;
    }
    if (h >= e.content.length) break;
    f = Math.max(f + 1, h - i);
  }
  return p;
}, vr = (e) => ({
  ...e,
  files: Object.freeze([...e.files]),
  skipped: Object.freeze([...e.skipped]),
  chunks: Object.freeze([...e.chunks])
}), Cr = (e, t, n) => {
  if (n >= e.length) return e.length;
  const o = Math.max(t + 1, n - 500), r = e.lastIndexOf(`
`, n);
  if (r >= o) return r + 1;
  const i = Math.max(e.lastIndexOf(". ", n), e.lastIndexOf("; ", n));
  if (i >= o) return i + 1;
  const s = e.lastIndexOf(" ", n);
  return s >= o ? s + 1 : n;
}, $r = (e) => {
  const t = [0];
  for (let n = 0; n < e.length; n += 1)
    e[n] === `
` && t.push(n + 1);
  return t;
}, xr = (e, t, n) => {
  const o = xn(e, t), r = xn(e, Math.max(t, n - 1));
  return {
    startLineNumber: o + 1,
    startColumn: t - e[o] + 1,
    endLineNumber: r + 1,
    endColumn: n - e[r] + 1
  };
}, xn = (e, t) => {
  let n = 0, o = e.length - 1;
  for (; n <= o; ) {
    const r = Math.floor((n + o) / 2);
    if (e[r] <= t && (r === e.length - 1 || e[r + 1] > t)) return r;
    e[r] > t ? o = r - 1 : n = r + 1;
  }
  return 0;
}, Nr = (e) => e.split(/[\\/]+/).filter(Boolean).some((t) => kr.has(t)), Ar = (e) => {
  const t = e.name.includes(".") ? e.name.split(".").pop()?.toLowerCase() : void 0;
  if (t && wr.has(t) || e.content.includes("\0")) return !0;
  const n = e.content.slice(0, 4096);
  if (!n) return !1;
  let o = 0;
  for (let r = 0; r < n.length; r += 1) {
    const i = n.charCodeAt(r);
    (i < 9 || i > 13 && i < 32) && (o += 1);
  }
  return o / n.length > 0.08;
};
class Sr {
  snapshot;
  options;
  constructor(t = [], n = {}) {
    this.options = { ...n }, this.snapshot = $n(t, this.options);
  }
  getSnapshot() {
    return this.snapshot;
  }
  getOptions() {
    return { ...this.options };
  }
  refresh(t, n = this.options) {
    return this.options = { ...n }, this.snapshot = $n(t, this.options), this.snapshot;
  }
  update(t, n = this.options) {
    return this.refresh(t, n);
  }
  staleReport(t) {
    return Ir(this.snapshot, t, this.options);
  }
  isStale(t) {
    return this.staleReport(t).stale;
  }
}
const je = (e = [], t = {}) => new Sr(e, t), Ir = (e, t, n = {}) => {
  const o = new Map(t.map((d) => [d.id, d])), r = e.byFileId, i = [];
  for (const d of e.files) {
    const p = o.get(d.fileId);
    if (!p) {
      i.push({ fileId: d.fileId, path: d.path, status: "deleted", indexedHash: d.hash });
      continue;
    }
    if (Dt(p, n)) {
      i.push({ fileId: d.fileId, path: p.path, status: "skipped-now", indexedHash: d.hash, currentHash: Pe(p.content) });
      continue;
    }
    const b = Pe(p.content);
    b !== d.hash ? i.push({ fileId: d.fileId, path: p.path, status: "changed", indexedHash: d.hash, currentHash: b }) : p.dirty !== d.dirty && i.push({ fileId: d.fileId, path: p.path, status: "dirty-state-changed", indexedHash: d.hash, currentHash: b });
  }
  for (const d of t)
    !r.has(d.id) && !Dt(d, n) && i.push({ fileId: d.id, path: d.path, status: "new", currentHash: Pe(d.content) });
  const s = e.signature !== Gn(t);
  return { stale: i.length > 0, signatureChanged: s, files: i };
}, Mr = 8, Pr = 12e3, Jn = (e, t, n = {}, o) => {
  const r = Or(t);
  if (r.length === 0) return [];
  const i = new Set(o?.files.map((b) => b.fileId) ?? []), s = e.chunks.filter((b) => n.includeDirty !== !1 || !b.dirty).map((b) => Er(b, r)).filter((b) => b.score >= (n.minScore ?? 1)).sort((b, h) => h.score - b.score || b.chunk.path.localeCompare(h.chunk.path) || b.chunk.ordinal - h.chunk.ordinal), d = [], p = /* @__PURE__ */ new Set();
  let f = n.maxChars ?? Pr;
  for (const b of s) {
    if (d.length >= (n.limit ?? Mr) || f <= 0) break;
    const h = `${b.chunk.fileId}:${b.chunk.ordinal}`;
    if (p.has(h)) continue;
    p.add(h);
    const w = b.chunk.text.length > f ? `${b.chunk.text.slice(0, Math.max(0, f - 28))}
[...context clipped...]` : b.chunk.text;
    d.push(Tr(b, w, i.has(b.chunk.fileId))), f -= w.length;
  }
  return d;
}, Tr = (e, t = e.chunk.text, n = !1) => {
  const { chunk: o, score: r, matchedTerms: i } = e;
  return {
    id: `index-hit:${o.id}`,
    kind: "index-hit",
    label: `${o.path}:${o.range.startLineNumber}-${o.range.endLineNumber}`,
    fileId: o.fileId,
    chunkId: o.id,
    path: o.path,
    range: o.range,
    language: o.language,
    contentHash: o.hash,
    dirty: o.dirty,
    includeBody: !0,
    removable: !0,
    implicit: !1,
    stale: n,
    charCount: t.length,
    text: t,
    snippet: Rr(o.text, i),
    score: r
  };
}, Lr = (e) => [
  `Path: ${e.path}`,
  `Language: ${e.language}`,
  `Range: ${e.range.startLineNumber}:${e.range.startColumn}-${e.range.endLineNumber}:${e.range.endColumn}`,
  `Hash: ${e.contentHash}`,
  e.dirty ? "Dirty: yes" : "Dirty: no",
  e.stale ? "Stale: yes" : null,
  "",
  e.text
].filter((t) => t !== null).join(`
`), Or = (e) => Array.from(new Set(
  e.toLowerCase().split(/[^a-z0-9_.$/-]+/i).map((t) => t.trim()).filter((t) => t.length >= 2)
)), Er = (e, t) => {
  const n = e.text.toLowerCase(), o = e.path.toLowerCase(), r = e.name.toLowerCase(), i = e.language.toLowerCase();
  let s = 0;
  const d = [];
  for (const p of t) {
    const f = Pt(n, p), b = Pt(o, p), h = Pt(r, p), w = i === p ? 1 : 0;
    f + b + h + w !== 0 && (d.push(p), s += Math.min(f, 12), s += b * 4, s += h * 6, s += w * 3, (n.includes(`function ${p}`) || n.includes(`const ${p}`) || n.includes(`class ${p}`) || n.includes(`type ${p}`)) && (s += 3));
  }
  return s += Math.max(0, 2 - e.ordinal * 0.05), { chunk: e, score: s, matchedTerms: d };
}, Pt = (e, t) => {
  let n = 0, o = e.indexOf(t);
  for (; o !== -1; )
    n += 1, o = e.indexOf(t, o + t.length);
  return n;
}, Rr = (e, t) => {
  const n = e.toLowerCase(), o = t.map((p) => n.indexOf(p)).filter((p) => p >= 0).sort((p, f) => p - f)[0] ?? 0, r = Math.max(0, o - 120), i = Math.min(e.length, o + 260), s = r > 0 ? "…" : "", d = i < e.length ? "…" : "";
  return `${s}${e.slice(r, i).replace(/\s+/g, " ").trim()}${d}`;
}, Fr = (e, t = {}) => {
  const { autoRefresh: n = !1, ...o } = t, r = ze(e), i = ze(null);
  i.current || (i.current = je(e, o));
  const [s, d] = v(() => i.current?.getSnapshot() ?? je(e, o).getSnapshot());
  r.current = e;
  const p = y((w = r.current) => {
    const I = (i.current ?? je([], o)).refresh(w, o);
    return d(I), I;
  }, [o.maxFileBytes, o.maxChunkChars, o.chunkOverlapChars, o.maxChunksPerFile, o.includeDirty]), f = y((w = r.current) => {
    const I = (i.current ?? je([], o)).update(w, o);
    return d(I), I;
  }, [p]);
  Q(() => {
    n && p(e);
  }, [n, e, p]);
  const b = (i.current ?? je([], o)).staleReport(e), h = y((w, I = {}) => {
    const T = i.current ?? je([], o);
    return Jn(T.getSnapshot(), w, I, T.staleReport(r.current));
  }, []);
  return { snapshot: s, staleReport: b, isStale: b.stale, refresh: p, update: f, retrieve: h };
}, jr = "tytus.atomek.semanticVector:v1", Xn = "__gateway_default__", Yn = (e) => e?.trim() || Xn, Dr = (e) => {
  const t = Yn(e);
  return t === Xn ? "gateway default" : t;
}, Qn = (e, t, n) => [
  jr,
  encodeURIComponent(e || "unknown-app"),
  encodeURIComponent(t),
  encodeURIComponent(n.id),
  n.hash
].join(":"), Zn = () => {
  try {
    return typeof window < "u" && typeof window.localStorage < "u";
  } catch {
    return !1;
  }
}, zr = (e, t, n) => {
  if (!Zn()) return null;
  try {
    const o = Qn(e, t, n), r = window.localStorage.getItem(o);
    if (!r) return null;
    const i = JSON.parse(r);
    return i.chunkId !== n.id || i.contentHash !== n.hash || i.modelAlias !== t || !Array.isArray(i.vector) || i.vector.some((s) => typeof s != "number" || !Number.isFinite(s)) ? null : {
      key: o,
      appId: e,
      chunkId: n.id,
      contentHash: n.hash,
      modelAlias: t,
      model: typeof i.model == "string" ? i.model : "",
      gatewayLabel: typeof i.gatewayLabel == "string" ? i.gatewayLabel : "",
      dim: i.vector.length,
      vector: i.vector,
      updatedAt: typeof i.updatedAt == "number" ? i.updatedAt : 0
    };
  } catch {
    return null;
  }
}, _r = (e) => {
  if (!Zn()) return null;
  try {
    const t = Qn(e.appId, e.modelAlias, { id: e.chunkId, hash: e.contentHash }), n = { ...e, key: t };
    return window.localStorage.setItem(t, JSON.stringify(n)), n;
  } catch {
    return null;
  }
}, Je = 8, Hr = 12e3, Br = 180, Wr = async (e, t, n, o, r = {}, i, s) => {
  const d = Jn(t, n, { ...r, limit: Math.max(r.limit ?? Je, 16) }, i), p = e.ai;
  if (typeof p?.embedText != "function")
    return { hits: d.slice(0, r.limit ?? Je), mode: "keyword", reason: "Semantic index unavailable — using keyword retrieval.", embeddedChunks: 0 };
  try {
    const f = Yn(o.embeddingModel), b = await p.embedText({
      input: n,
      gatewayPreference: o.gatewayPreference,
      model: o.embeddingModel.trim() || void 0,
      signal: s
    }), h = ea(b.embedding);
    if (!h) throw new Error("host.ai.embedText returned no embedding vector");
    const w = new Map(d.map((P) => [P.chunkId, P])), I = Xr(n), T = /* @__PURE__ */ new Map();
    t.chunks.filter((P) => r.includeDirty !== !1 || !P.dirty).slice(0, Br).forEach((P) => T.set(P.id, P)), d.forEach((P) => {
      const H = t.byChunkId.get(P.chunkId);
      H && T.set(H.id, H);
    });
    const B = Array.from(T.values()), q = [];
    let U = 0;
    for (const P of B) {
      s?.aborted;
      const H = zr(e.appId, f, P) ?? await Vr(p, e.appId, f, P, o, s);
      if (!H) continue;
      H.updatedAt > Date.now() - 1e3 && (U += 1);
      const ee = Gr(h, H.vector);
      if (!Number.isFinite(ee)) continue;
      const X = w.get(P.id)?.score ?? Yr(P, I), oe = Jr(X) * 0.42 + Math.max(0, ee) * 0.58;
      q.push({ chunk: P, keywordScore: X, vectorScore: ee, score: oe, matchedTerms: I.filter((ye) => P.text.toLowerCase().includes(ye)) });
    }
    if (q.length === 0) return { hits: d.slice(0, r.limit ?? Je), mode: "vector-fallback", reason: "Semantic retrieval produced no vectors — using keyword retrieval.", embeddedChunks: U };
    const J = new Set(i?.files.map((P) => P.fileId) ?? []), Z = q.sort((P, H) => H.score - P.score || H.keywordScore - P.keywordScore || P.chunk.path.localeCompare(H.chunk.path) || P.chunk.ordinal - H.chunk.ordinal).slice(0, Math.max(r.limit ?? Je, 1)).map((P) => qr(P, J.has(P.chunk.fileId)));
    return {
      hits: Kr(Z, r.maxChars ?? Hr),
      mode: "hybrid",
      reason: `Hybrid retrieval used ${Dr(o.embeddingModel)} embeddings + keyword ranking.`,
      embeddedChunks: U
    };
  } catch (f) {
    return {
      hits: d.slice(0, r.limit ?? Je),
      mode: "vector-fallback",
      reason: `Semantic retrieval failed (${f instanceof Error ? f.message : String(f)}) — using keyword retrieval.`,
      embeddedChunks: 0
    };
  }
}, Ur = (e) => e.map((t) => ({
  kind: "workspace",
  title: `Indexed project context — ${t.label}`,
  text: Lr(t)
})), Vr = async (e, t, n, o, r, i) => {
  if (typeof e.embedText != "function") return null;
  const s = await e.embedText({
    input: o.text,
    gatewayPreference: r.gatewayPreference,
    model: r.embeddingModel.trim() || void 0,
    signal: i
  }), d = ea(s.embedding);
  return d ? _r({
    appId: t,
    chunkId: o.id,
    contentHash: o.hash,
    modelAlias: n,
    model: s.model ?? "",
    gatewayLabel: s.gatewayLabel ?? "",
    dim: d.length,
    vector: d,
    updatedAt: Date.now()
  }) : null;
}, qr = (e, t = !1) => {
  const n = `${e.chunk.path}:${e.chunk.range.startLineNumber}-${e.chunk.range.endLineNumber}`;
  return {
    id: `index-hit:${e.chunk.id}`,
    kind: "index-hit",
    label: n,
    fileId: e.chunk.fileId,
    chunkId: e.chunk.id,
    path: e.chunk.path,
    range: e.chunk.range,
    language: e.chunk.language,
    contentHash: e.chunk.hash,
    dirty: e.chunk.dirty,
    includeBody: !0,
    removable: !0,
    implicit: !1,
    stale: t,
    charCount: e.chunk.text.length,
    text: e.chunk.text,
    snippet: Qr(e.chunk.text, e.matchedTerms),
    score: e.score,
    keywordScore: e.keywordScore,
    vectorScore: e.vectorScore
  };
}, Kr = (e, t) => {
  let n = t;
  const o = [];
  for (const r of e) {
    if (n <= 0) break;
    const i = r.text.length > n ? `${r.text.slice(0, Math.max(0, n - 28))}
[...context clipped...]` : r.text;
    o.push({ ...r, text: i, charCount: i.length }), n -= i.length;
  }
  return o;
}, ea = (e) => {
  if (!Array.isArray(e) || e.length === 0) return null;
  const t = e.map(Number).filter((n) => Number.isFinite(n));
  return t.length === e.length ? t : null;
}, Gr = (e, t) => {
  const n = Math.min(e.length, t.length);
  if (n === 0) return 0;
  let o = 0, r = 0, i = 0;
  for (let s = 0; s < n; s += 1)
    o += e[s] * t[s], r += e[s] * e[s], i += t[s] * t[s];
  return r === 0 || i === 0 ? 0 : o / (Math.sqrt(r) * Math.sqrt(i));
}, Jr = (e) => Math.min(1, Math.max(0, e / 24)), Xr = (e) => Array.from(new Set(
  e.toLowerCase().split(/[^a-z0-9_.$/-]+/i).map((t) => t.trim()).filter((t) => t.length >= 2)
)), Yr = (e, t) => {
  const n = `${e.path}
${e.name}
${e.language}
${e.text}`.toLowerCase();
  return t.reduce((o, r) => o + (n.includes(r) ? 1 : 0), 0);
}, Qr = (e, t) => {
  const n = e.toLowerCase(), o = t.map((s) => n.indexOf(s)).filter((s) => s >= 0).sort((s, d) => s - d)[0] ?? 0, r = Math.max(0, o - 120), i = Math.min(e.length, o + 260);
  return `${r > 0 ? "…" : ""}${e.slice(r, i).replace(/\s+/g, " ").trim()}${i < e.length ? "…" : ""}`;
}, Zr = /```([^\n`]*)\n([\s\S]*?)```/g, ei = /^@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@/;
function Qt(e) {
  return Array.from(e.matchAll(Zr)).map((t) => ta(t[1] ?? "", ri(t[2] ?? ""))).filter((t) => t.content.trim().length > 0);
}
function ta(e, t) {
  const n = e.trim().split(/[\s,]+/).filter(Boolean), o = {}, r = [];
  for (const i of n) {
    const s = i.match(/^([a-z0-9_-]+)=(.+)$/i);
    s ? o[s[1].toLowerCase()] = si(s[2]) : r.push(i.toLowerCase());
  }
  return { lang: e.trim().toLowerCase(), flags: r, attrs: o, content: t };
}
function pe(e, t) {
  return (typeof e == "string" ? ta(e, "").flags : e.flags).includes(t.toLowerCase());
}
function na(e) {
  return [...Qt(e).filter((o) => pe(o, "diff") || pe(o, "patch")).map((o) => o.content), e].filter((o, r, i) => ti(o) && i.findIndex((s) => s === o) === r);
}
function ti(e) {
  return /^@@\s+-\d+/m.test(e) || /^diff --git\s+/m.test(e) || /^---\s+/m.test(e);
}
function ni(e) {
  const t = aa(e);
  if (!/^@@\s+-\d+/m.test(t)) return [];
  const n = t.split(`
`), o = [];
  if (n.forEach((s, d) => {
    (s.startsWith("diff --git ") || s.startsWith("--- ")) && o.push(d);
  }), o.length === 0) return [{ raw: t, ...Tt(t) }];
  const r = Array.from(new Set(o)).sort((s, d) => s - d), i = [];
  for (let s = 0; s < r.length; s += 1) {
    const d = r[s], f = r.find((h) => h > d && n[h].startsWith("diff --git ")) ?? n.length, b = n.slice(d, f).join(`
`);
    /^@@\s+-\d+/m.test(b) && i.push({ raw: b, ...Tt(b) });
  }
  return i.length > 0 ? i : [{ raw: t, ...Tt(t) }];
}
function Tt(e) {
  const t = e.match(/^diff --git\s+(?:"?a\/(.+?)"?|(\S+))\s+(?:"?b\/(.+?)"?|(\S+))/m), n = e.match(/^---\s+(?:"?a\/(.+?)"?|(\S+))/m), o = e.match(/^\+\+\+\s+(?:"?b\/(.+?)"?|(\S+))/m), r = Ce(t?.[1] || t?.[2] || n?.[1] || n?.[2] || "") || null, i = Ce(t?.[3] || t?.[4] || o?.[1] || o?.[2] || "") || null, s = i && i !== "/dev/null" ? i : r;
  return { path: s && s !== "/dev/null" ? s : null, oldPath: r, newPath: i };
}
function Ce(e) {
  return e.trim().replace(/^['"]|['"]$/g, "").replace(/\\/g, "/").replace(/^[ab]\//, "").replace(/^\.\//, "");
}
function zt(e) {
  return Qt(e).filter((t) => ai(t)).map((t) => ({
    content: ii(t.content),
    label: `replacement block (${t.lang || "plain"})`,
    lang: t.lang,
    path: oi(t),
    attrs: t.attrs
  }));
}
function ai(e) {
  return pe(e, "atomek-replace") || pe(e, "atomek-full") || pe(e, "full-replacement") || pe(e, "full") || pe(e, "replace");
}
function oi(e) {
  const t = e.attrs.path || e.attrs.file || e.attrs.target;
  if (t) return Ce(t);
  const n = e.content.split(`
`).slice(0, 5);
  for (const o of n) {
    const r = o.match(/^\s*(?:\/\/|#|<!--)?\s*(?:atomek-)?(?:path|file)\s*:\s*([^\s>]+)\s*(?:-->)?\s*$/i);
    if (r) return Ce(r[1]);
  }
  return null;
}
function _t(e, t) {
  if (!/^@@\s+-\d+/m.test(t)) return null;
  const n = e.split(`
`), o = aa(t).split(`
`), r = [];
  let i = 0, s = !1;
  for (let d = 0; d < o.length; d += 1) {
    const p = o[d].match(ei);
    if (!p) continue;
    s = !0;
    const f = Number(p[1]), b = Math.max(0, f - 1);
    if (b < i) return null;
    for (r.push(...n.slice(i, b)), i = b, d += 1; d < o.length; d += 1) {
      const h = o[d];
      if (h.startsWith("@@ ")) {
        d -= 1;
        break;
      }
      if (h.startsWith("diff --git ") || h.startsWith("--- ") || h.startsWith("+++ ") || h.startsWith("\\ No newline at end of file")) continue;
      const w = h[0], I = h.slice(1);
      if (w === " ") {
        if (n[i] !== I) return null;
        r.push(I), i += 1;
        continue;
      }
      if (w === "-") {
        if (n[i] !== I) return null;
        i += 1;
        continue;
      }
      if (w === "+") {
        r.push(I);
        continue;
      }
      if (h !== "")
        return null;
    }
  }
  return s ? (r.push(...n.slice(i)), r.join(`
`)) : null;
}
function ri(e) {
  return e.replace(/^\n+/, "").replace(/\n+$/, "");
}
function ii(e) {
  const t = e.split(`
`);
  let n = 0;
  for (; n < Math.min(t.length, 5) && /^\s*(?:\/\/|#|<!--)?\s*(?:atomek-)?(?:path|file|version|hash)\s*:/i.test(t[n]); )
    n += 1;
  return t.slice(n).join(`
`);
}
function aa(e) {
  return e.replace(/\r\n/g, `
`).replace(/\r/g, `
`);
}
function si(e) {
  return e.replace(/^['"]|['"]$/g, "");
}
function ci(e) {
  const { body: t, files: n, sourceTitle: o, activeFile: r = null, versions: i = {} } = e, s = /* @__PURE__ */ new Map(), d = [];
  for (const b of na(t))
    for (const h of ni(b)) {
      if (!h.path) {
        if (r) {
          const T = _t(r.content, h.raw);
          T && T !== r.content && s.set(r.id, ct({
            file: r,
            proposedContent: T,
            sourceTitle: o,
            extractionLabel: "active-file unified diff patch",
            versions: i
          }));
        }
        continue;
      }
      const w = Nn(n, h.path);
      if (!w) {
        d.push(`${h.path}: no opened file`);
        continue;
      }
      const I = _t(w.file.content, h.raw);
      if (!I || I === w.file.content) {
        d.push(`${h.path}: patch did not match or produced no change`);
        continue;
      }
      s.set(w.file.id, ct({
        file: w.file,
        proposedContent: I,
        sourceTitle: o,
        extractionLabel: `workspace diff (${h.path})`,
        versions: i,
        targetPath: h.path,
        match: w
      }));
    }
  for (const b of zt(t)) {
    const h = b.path ? Nn(n, b.path) : r ? { file: r, normalizedPatchPath: Ce(r.path), confidence: "exact" } : null;
    if (!h) {
      d.push(`${b.path ?? "replacement block"}: no opened file`);
      continue;
    }
    if (b.content === h.file.content) {
      d.push(`${h.file.path}: replacement produced no change`);
      continue;
    }
    s.set(h.file.id, ct({
      file: h.file,
      proposedContent: b.content,
      sourceTitle: o,
      extractionLabel: b.label,
      versions: i,
      targetPath: b.path ?? h.file.path,
      match: h
    }));
  }
  const p = zt(t).some((b) => b.path);
  if (s.size === 0 && r && !p) {
    const b = li(t, r);
    b && b.content !== r.content && s.set(r.id, ct({
      file: r,
      proposedContent: b.content,
      sourceTitle: o,
      extractionLabel: b.label,
      versions: i
    }));
  }
  const f = Array.from(s.values());
  return {
    sourceTitle: o,
    edits: f,
    skipped: Array.from(new Set(d)),
    stats: hi(f.map((b) => b.stats)),
    kind: f.length === 0 ? "empty" : f.length === 1 ? "single-file" : "multi-file"
  };
}
function li(e, t) {
  for (const p of na(e)) {
    const f = _t(t.content, p);
    if (f) return { content: f, label: "unified diff patch" };
  }
  const n = Qt(e);
  if (n.length === 0) return null;
  const o = mi(t), r = zt(e)[0];
  if (r) return { content: r.content, label: r.label };
  const i = n.find((p) => o.some((f) => pe(p, f)) && !pe(p, "diff") && !pe(p, "patch"));
  if (i) return { content: i.content, label: `matched ${i.lang || t.language} block` };
  const d = n.filter((p) => !pe(p, "diff") && !pe(p, "patch")).sort((p, f) => f.content.length - p.content.length)[0];
  return d ? { content: d.content, label: `largest fenced block (${d.lang || "plain"})` } : null;
}
function Nn(e, t) {
  const n = Ce(t), o = n.split("/").at(-1) ?? n, r = e.find((d) => Ce(d.path) === n);
  if (r) return { file: r, normalizedPatchPath: n, confidence: "exact" };
  const i = e.find((d) => Ce(d.path).endsWith(`/${n}`));
  if (i) return { file: i, normalizedPatchPath: n, confidence: "suffix" };
  const s = e.find((d) => d.name === o || Ce(d.path).endsWith(`/${o}`));
  return s ? { file: s, normalizedPatchPath: n, confidence: "basename" } : null;
}
function di(e, t) {
  const n = e.split(`
`), o = t.split(`
`), r = Math.max(n.length, o.length);
  let i = 0, s = 0, d = 0;
  for (let p = 0; p < r; p += 1)
    n[p] !== o[p] && (n[p] === void 0 ? i += 1 : o[p] === void 0 ? s += 1 : d += 1);
  return { added: i, removed: s, changed: d };
}
function hi(e) {
  return e.reduce((t, n) => ({
    added: t.added + n.added,
    removed: t.removed + n.removed,
    changed: t.changed + n.changed
  }), { added: 0, removed: 0, changed: 0 });
}
function ui(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n += 1)
    t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
  return (t >>> 0).toString(16).padStart(8, "0");
}
function ct(e) {
  const t = ui(e.file.content);
  return {
    fileId: e.file.id,
    fileName: e.file.name,
    filePath: e.file.path,
    originalContent: e.file.content,
    proposedContent: e.proposedContent,
    sourceTitle: e.sourceTitle,
    extractionLabel: e.extractionLabel,
    stats: di(e.file.content, e.proposedContent),
    base: {
      version: e.versions[e.file.id],
      contentHash: t
    },
    targetPath: e.targetPath,
    match: e.match ? { normalizedPatchPath: e.match.normalizedPatchPath, confidence: e.match.confidence } : void 0,
    conflict: {
      expectedVersion: e.versions[e.file.id],
      currentVersion: e.versions[e.file.id],
      expectedHash: t,
      currentHash: t,
      changedAfterPreview: !1
    }
  };
}
function mi(e) {
  const t = e.name.split(".").pop()?.toLowerCase() ?? "";
  return Array.from(new Set([
    e.language,
    t,
    e.language === "typescript" ? "ts" : "",
    e.language === "javascript" ? "js" : "",
    e.language === "markdown" ? "md" : "",
    e.language === "shell" ? "sh" : "",
    e.language === "yaml" ? "yml" : ""
  ].filter(Boolean)));
}
const mt = (e) => typeof e == "object" && e !== null, pi = (e) => mt(e.ai) ? e.ai : null, fi = (e) => {
  if (!mt(e)) return null;
  const t = e.id;
  return typeof t == "string" && t.trim() ? t : null;
}, bi = (e) => {
  const t = fi(e);
  return !t || !mt(e) ? null : { ...e, id: t };
}, ke = (e) => typeof e == "string" ? /\bembeddings?\b|text-embedding/i.test(e) : Array.isArray(e) ? e.some(ke) : mt(e) ? Object.values(e).some(ke) : !1, gi = async (e, t) => {
  const n = pi(e);
  if (typeof n?.listModels != "function") return [];
  const o = await n.listModels(t);
  return Array.isArray(o) ? o.map(bi).filter((r) => !!r) : [];
}, ki = (e) => (e.embedding ?? e.embeddings ?? e.supportsEmbedding ?? e.supportsEmbeddings) === !0 ? !0 : ke(e.capability) || ke(e.capabilities) || ke(e.modality) || ke(e.modalities) || ke(e.task) || ke(e.tasks) || ke(e.type) || ke(e.kind), oa = (e) => typeof e == "object" && e !== null, wi = (e) => oa(e.ai) ? e.ai : null, ra = (e) => typeof wi(e)?.embedText == "function", yi = async (e, t) => ra(e) ? (await gi(e, t)).filter(ki) : [], vi = (e) => oa(e.ai) ? ra(e) ? null : "host.ai.embedText is not exposed by this Tytus build." : "host.ai is not available in this Tytus build.", Ci = ["typecheck", "test", "lint", "build", "release:check", "verify", "verify:cortex"], $i = [
  ["package-lock.json", "npm"],
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["bun.lockb", "bun"],
  ["bun.lock", "bun"]
];
function xi(e, t) {
  return {
    id: `manual-check-${Date.now()}`,
    reason: t,
    commands: Mi(e),
    results: [],
    createdAt: Date.now()
  };
}
function Ni(e, t) {
  const n = ia(t);
  return !n || e.commands.some((o) => o.command === n) ? e : {
    ...e,
    commands: [
      ...e.commands,
      {
        id: ca(n),
        command: n,
        label: n,
        source: "manual"
      }
    ]
  };
}
function Ai(e, t, n, o) {
  const r = ia(t);
  return r ? {
    ...e,
    results: [
      ...e.results,
      {
        command: r,
        status: n,
        output: o.trim(),
        capturedAt: Date.now()
      }
    ]
  } : e;
}
function Si(e) {
  const t = e.results.length > 0 ? e.results.map((o, r) => [
    `Check ${r + 1}: ${o.command}`,
    `Status: ${o.status}`,
    "Output:",
    Ri(o.output || "(no output pasted)", "text")
  ].join(`
`)).join(`

`) : "No manual check output was captured yet.", n = e.commands.length > 0 ? e.commands.map((o) => `- ${o.command}`).join(`
`) : "- No check command was suggested; user must provide one manually.";
  return [
    "Continue the agentic edit/check loop from a manual check capture.",
    "Do not assume host command execution exists. The user ran or will run checks outside Atomek.",
    "Use only the currently attached workbench context and the pasted output below.",
    "If a fix is needed, return one applicable git-style unified diff in a fenced diff block with paths matching opened files.",
    "Do not write files, do not invoke tools, and do not assume any provider-specific model/tool.",
    "",
    `Manual check reason: ${e.reason}`,
    "",
    "Available manual check commands:",
    n,
    "",
    "Captured manual check results:",
    t
  ].join(`
`);
}
function Ii(e) {
  const t = e.results.at(-1);
  return t ? t.status : "pending";
}
function Mi(e) {
  const t = e.filter((o) => o.name === "package.json" || o.path.endsWith("/package.json")), n = [];
  for (const o of t) {
    const r = Pi(o.content);
    if (!r?.scripts) continue;
    const i = sa(o.path), s = Ti(e, i, r);
    if (!s) continue;
    const d = Object.keys(r.scripts).filter((f) => typeof r.scripts?.[f] == "string"), p = Li(d);
    for (const f of p) {
      const b = `${s} run ${f}`;
      n.push({
        id: ca(`${i}:${b}`),
        command: b,
        label: i ? `${f} (${i})` : f,
        source: "package-script",
        path: o.path
      });
    }
  }
  return Oi(n).slice(0, 6);
}
function Pi(e) {
  try {
    const t = JSON.parse(e);
    return t && typeof t == "object" ? t : null;
  } catch {
    return null;
  }
}
function Ti(e, t, n) {
  if (typeof n.packageManager == "string") {
    const o = n.packageManager.split("@")[0]?.trim();
    if (o) return o;
  }
  for (const [o, r] of $i)
    if (e.some((i) => Ei(i.path) === o && sa(i.path) === t)) return r;
  return null;
}
function Li(e) {
  const t = Ci.filter((o) => e.includes(o)), n = e.filter((o) => !t.includes(o)).filter((o) => /(^|:)(check|typecheck|test|lint|verify|build)(:|$)/i.test(o)).sort((o, r) => o.localeCompare(r));
  return [...t, ...n];
}
function Oi(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((n) => {
    const o = n.command;
    return t.has(o) ? !1 : (t.add(o), !0);
  });
}
function ia(e) {
  return e.trim().replace(/\s+/g, " ");
}
function sa(e) {
  const t = e.lastIndexOf("/");
  return t > 0 ? e.slice(0, t) : "";
}
function Ei(e) {
  const t = e.lastIndexOf("/");
  return t >= 0 ? e.slice(t + 1) : e;
}
function ca(e) {
  let t = 0;
  for (let n = 0; n < e.length; n += 1) t = t * 31 + e.charCodeAt(n) | 0;
  return `check-${Math.abs(t)}`;
}
function Ri(e, t) {
  return `\`\`\`${t}
${e.replace(/\`\`\`/g, "``\\`")}
\`\`\``;
}
const Fi = Xa(() => import("./WorkbenchMonacoEditor-CJhaNTZX.js").then((e) => e.W).then((e) => ({ default: e.WorkbenchMonacoEditor }))), ji = {
  id: "welcome",
  name: "Mission Control",
  path: "Mission Control",
  language: "text",
  content: "",
  dirty: !1,
  source: "sample"
}, la = "tytus.workspace.recent", da = "tytus.workspace.layout", ha = "tytus.atomek.chatAiSettings", ua = "tytus.atomek.currentMission", Ht = "tytus.atomek.currentMissionChanged", dt = {
  gatewayPreference: "auto",
  model: "",
  embeddingModel: ""
}, Di = 48;
function lt(e, t, n) {
  return Math.round(Math.max(t, Math.min(n, e)));
}
function Lt(e) {
  const t = Math.max(e || 1400, 760), n = Math.max(0, t - Di), o = n < 1180, r = o ? 200 : 240, i = o ? 300 : 340, s = o ? 420 : 560, d = Math.max(r, Math.min(o ? 340 : 420, Math.floor(n * 0.28))), p = Math.min(300, d), f = Math.floor(n * (o ? 0.34 : 0.36)), b = n - p - s, h = Math.max(i, Math.min(o ? 500 : 640, f, b));
  return { primaryMin: r, primaryMax: d, secondaryMin: i, secondaryMax: h };
}
function zi(e) {
  const t = [], n = /```([^\n`]*)\n?([\s\S]*?)```/g;
  let o = 0, r = 0, i;
  for (; (i = n.exec(e)) !== null; ) {
    if (i.index > o) {
      const d = e.slice(o, i.index);
      d.trim() && t.push({ type: "markdown", body: d, key: `md-${r}` });
    }
    t.push({
      type: "code",
      language: i[1]?.trim() || "text",
      body: i[2] ?? "",
      key: `code-${r}`
    }), o = i.index + i[0].length, r += 1;
  }
  const s = e.slice(o);
  return (s.trim() || t.length === 0) && t.push({ type: "markdown", body: s, key: `md-${r}` }), t;
}
async function Ze(e) {
  if (!e) return !1;
  try {
    return await navigator.clipboard?.writeText(e), !0;
  } catch {
    const t = document.createElement("textarea");
    t.value = e, t.setAttribute("readonly", "true"), t.style.position = "fixed", t.style.opacity = "0", t.style.pointerEvents = "none", document.body.appendChild(t), t.select();
    const n = document.execCommand("copy");
    return document.body.removeChild(t), n;
  }
}
async function _i() {
  const e = window;
  return typeof e.showDirectoryPicker != "function" ? null : e.showDirectoryPicker({ mode: "readwrite" });
}
async function An(e, t, n) {
  const o = e.getFileHandle;
  if (!o) throw new Error("Selected mission folder is read-only in this browser context");
  const r = await o.call(e, t, { create: !0 });
  if (!r.createWritable) throw new Error(`Cannot write ${t}; File System Access write handle unavailable`);
  const i = await r.createWritable();
  await i.write(n), await i.close();
}
async function Sn(e, t) {
  const n = e.getDirectoryHandle;
  if (!n) throw new Error("Selected mission folder cannot create subfolders in this browser context");
  return n.call(e, t, { create: !0 });
}
function ma(e) {
  const t = e.reduce((n, o) => (n[o.kind] = (n[o.kind] ?? 0) + 1, n), {});
  return Object.entries(t).map(([n, o]) => `${o} ${n}`).join(" · ") || "no resources";
}
function Hi(e) {
  return e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "mission";
}
function Ye(e) {
  const t = "source" in e ? e : {
    missionId: e.missionId,
    title: e.title,
    goal: e.goal,
    rootPath: e.rootPath,
    name: e.rootPath.split("/").pop() || e.missionId,
    source: "tray"
  };
  try {
    localStorage.setItem(ua, JSON.stringify(t)), window.dispatchEvent(new CustomEvent(Ht, { detail: t }));
  } catch {
  }
}
function Bi() {
  try {
    const e = localStorage.getItem(ua);
    if (!e) return null;
    const t = JSON.parse(e);
    return !t.missionId || !t.title ? null : {
      missionId: t.missionId,
      title: t.title,
      goal: t.goal ?? "",
      rootPath: t.rootPath,
      name: t.name ?? t.rootPath?.split("/").pop() ?? t.missionId,
      source: t.source === "browser" ? "browser" : "tray"
    };
  } catch {
    return null;
  }
}
function Wi(e) {
  return {
    missionId: e.missionId,
    title: e.title,
    goal: e.goal,
    rootPath: e.rootPath,
    name: e.rootPath.split("/").pop() || e.missionId,
    source: "tray"
  };
}
function Qe(e, t) {
  const n = t?.resources ?? [], o = n.some((p) => p.kind === "pod-agent" && (p.status === "ready" || p.status === "degraded")), r = n.some((p) => p.kind === "local-cli" && (p.status === "ready" || p.status === "available")), i = n.some((p) => p.kind === "shared-folder" && p.status === "ready"), s = n.some((p) => p.kind === "app-skill" && p.status === "ready"), d = e.trim() || "Coordinate a Tytus mission.";
  return [
    {
      id: "task-plan",
      title: "Plan mission",
      prompt: `Turn this goal into an executable plan: ${d}`,
      resourceHint: o ? "pod-agent or AIL route" : "AIL chat",
      status: "ready",
      expectedOutputs: ["PLAN.md", "risks", "resource choices"]
    },
    {
      id: "task-execute",
      title: "Execute safely",
      prompt: `Use the mission context and selected resources to execute the plan. Goal: ${d}`,
      resourceHint: r ? "local agent" : s ? "app skill" : "chat",
      status: "waiting",
      expectedOutputs: ["transcript", "artifact", "patch proposal"]
    },
    {
      id: "task-handoff",
      title: "Review and hand off",
      prompt: `Review outputs for the mission, summarize decisions, and prepare handoff. Goal: ${d}`,
      resourceHint: i ? "shared folder + reviewer agent" : "reviewer agent",
      status: "waiting",
      expectedOutputs: ["REVIEW.md", "HANDOFF.md", "approval list"]
    }
  ];
}
function pa(e) {
  return [
    "# Mission tasks",
    "",
    ...e.map((t, n) => [
      `## ${n + 1}. ${t.title}`,
      "",
      `- ID: \`${t.id}\``,
      `- Status: ${t.status}`,
      `- Resource hint: ${t.resourceHint}`,
      `- Expected outputs: ${t.expectedOutputs.join(", ")}`,
      "",
      t.prompt,
      ""
    ].join(`
`))
  ].join(`
`);
}
function fa(e) {
  return [
    `# Handoff — ${e.title}`,
    "",
    `- Mission ID: \`${e.missionId}\``,
    `- Root: \`${e.rootPath ?? e.name}\``,
    `- Updated: ${(/* @__PURE__ */ new Date()).toISOString()}`,
    "",
    "## What changed",
    "",
    "- TBD",
    "",
    "## Decisions",
    "",
    "- TBD",
    "",
    "## Open approvals",
    "",
    "- No direct writes without Atomek preview/approval.",
    "",
    "## Next owner",
    "",
    "- Pick the next resource from Control Tower.",
    ""
  ].join(`
`);
}
function Bt(e, t, n, o, r) {
  return [
    `# ${e.title}`,
    "",
    `- Mission ID: \`${e.missionId}\``,
    `- Updated: ${(/* @__PURE__ */ new Date()).toISOString()}`,
    `- Folder: ${e.rootPath ?? e.name}`,
    "",
    "## Goal",
    "",
    e.goal || "(no goal set)",
    "",
    "## Current Atomek context",
    "",
    n ? `- Active file: \`${n.path}\` (${n.language}, ${n.content.length} chars${n.dirty ? ", dirty" : ""})` : "- Active file: none",
    `- Open editors: ${o.length}`,
    "",
    "## Current task",
    "",
    r || "(no task prompt set)",
    "",
    "## Resource graph",
    "",
    t ? `- ${ma(t.resources)}` : "- not loaded",
    ...t?.warnings?.length ? t.warnings.map((i) => `- Warning: ${i.code} — ${i.message}`) : [],
    "",
    "## Rules",
    "",
    "- Agents must not write project files directly.",
    "- Proposed edits must be returned as unified diffs or fenced replacement blocks.",
    "- Atomek previews and approves edits before applying.",
    "- Secrets are never requested or copied into mission context."
  ].join(`
`);
}
function Wt(e) {
  return e ? [
    "# Resources",
    "",
    `Generated: ${e.generatedAt}`,
    "",
    ...e.resources.map((t) => [
      `## ${t.label}`,
      "",
      `- ID: \`${t.id}\``,
      `- Kind: ${t.kind}`,
      `- Status: ${t.status}${t.reason ? ` — ${t.reason}` : ""}`,
      `- Trust: ${t.trustTier}`,
      `- Sandbox: ${t.sandbox}`,
      `- Capabilities: ${t.capabilities.join(", ") || "none"}`,
      t.allowedRoots.length ? `- Allowed roots: ${t.allowedRoots.map((n) => `\`${n}\``).join(", ")}` : "- Allowed roots: none",
      ""
    ].join(`
`)),
    e.warnings.length ? `## Warnings
` : "",
    ...e.warnings.map((t) => `- ${t.code}: ${t.message}${t.resourceId ? ` (${t.resourceId})` : ""}`),
    ""
  ].join(`
`) : `# Resources

Resource graph not loaded yet.
`;
}
function ba(e, t, n) {
  const o = Qe(n || e.goal, t);
  return JSON.stringify({
    schemaVersion: 1,
    missionId: e.missionId,
    title: e.title,
    goal: e.goal,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "active",
    rootPath: e.rootPath ?? e.name,
    resources: (t?.resources ?? []).filter((r) => r.status === "ready").map((r) => ({
      resourceId: r.id,
      pinnedLabel: r.label,
      pinnedKind: r.kind,
      pinnedCapabilities: r.capabilities
    })),
    permissions: {
      fileWrite: "preview-only",
      shellExec: "allowlist-with-approval",
      netEgress: "resource-default",
      secretRead: "never"
    },
    secretsPolicy: {
      deniedGlobs: ["**/.env", "**/.env.*", "**/.ssh/**", "**/*_key*", "**/*secret*", "**/*token*", "**/id_rsa", "**/id_ed25519"],
      deniedPatterns: ["OPENAI_API_KEY\\\\s*=", "sk-[A-Za-z0-9_-]{20,}", "ANTHROPIC_API_KEY\\\\s*="]
    },
    budget: { maxRuntimeMinutes: 30, maxArtifactMb: 25 },
    tasks: o.map((r, i) => ({
      id: r.id,
      title: r.title,
      prompt: r.prompt,
      status: i === 0 ? "ready" : "waiting",
      selectedResourceHint: r.resourceHint,
      dependsOn: i === 0 ? [] : [o[i - 1].id],
      expectedOutputs: r.expectedOutputs,
      approvalGateIds: ["file-write-preview"]
    }))
  }, null, 2);
}
function Ui({ host: e }) {
  const t = ze(null), [n, o] = v(0), r = re(() => $s(), []), [i, s] = v("computer"), [d, p] = v(r.primaryVisible), [f, b] = v(r.primaryWidth), [h, w] = v("chat"), [I, T] = v(r.secondaryVisible), [B, q] = v(r.secondaryWidth), [U, J] = v(!1), [Z, P] = v("problems"), [H, ee] = v(r.markdownPreviewVisible), [_, X] = v(!1), [oe, ye] = v(null), [g, R] = v([]), [K, le] = v([]), [Y, de] = v(null), [be, _e] = v(""), [$, N] = v({ lineNumber: 1, column: 1 }), [L, j] = v(null), [te, V] = v({}), [ne, ve] = v(nr), [Ae, Te] = v([]), [m, S] = v([]), [A, E] = v(null), [x, F] = v(""), [D, ae] = v(!1), [ie, fe] = v(""), [en, et] = v([]), [se, Le] = v(null), [$e, He] = v(null), [tn, nn] = v(!1), [Se, $a] = v(() => xs()), [an, Be] = v(null), [Oe, pt] = v(null), [ft, bt] = v(""), [gt, kt] = v(""), [tt, nt] = v(""), [at, on] = v("failed"), [xa, rn] = v(null), [Na, M] = v("Ready"), [We, Aa] = v(() => Cs()), ue = K.map((c) => g.find((u) => u.id === c)).filter(Boolean), O = Y ? g.find((c) => c.id === Y) ?? null : null, sn = re(() => tr({ files: g, openEditorIds: K, activeFileId: Y, versions: te, activeSelection: L }), [Y, L, te, g, K]), cn = re(() => ({
    scope: ne,
    removedAttachmentIds: Ae,
    selectedFileIds: []
  }), [ne, Ae]), Ue = re(() => mr(sn, g, cn), [cn, sn, g]), xe = Fr(g, { autoRefresh: !0, includeDirty: !0 }), ln = re(() => m.map((c) => ({
    id: c.id,
    kind: "index-hit",
    label: c.label,
    path: c.path,
    fileId: c.fileId,
    range: c.range,
    dirty: c.dirty,
    includeBody: !0,
    removable: !0,
    implicit: !1,
    score: c.score,
    keywordScore: c.keywordScore,
    vectorScore: c.vectorScore,
    snippet: c.snippet
  })), [m]), Sa = re(() => [...Ue.attachments, ...ln], [Ue.attachments, ln]), z = Qo({ host: e, requestContext: Ue.parts, chatSettings: Se, setStatus: M }), Ie = re(
    () => [...z.artifacts, ...en].sort((c, u) => u.createdAt - c.createdAt),
    [z.artifacts, en]
  ), ot = tn && !O, wt = !O && !ot && !_, he = re(() => g.filter((c) => c.dirty), [g]), Ia = re(() => {
    const c = be.trim().toLowerCase();
    return c ? g.filter((u) => u.path.toLowerCase().includes(c)) : g;
  }, [g, be]);
  Q(() => {
    V((c) => {
      const u = {};
      for (const k of g) u[k.id] = c[k.id] ?? 1;
      return u;
    });
  }, [g]), Q(() => {
    Te([]), S([]);
  }, [Y, ne, K]), Q(() => {
    S([]);
  }, [g]);
  const Ma = y((c) => {
    if (c.kind === "index-hit") {
      S((u) => u.filter((k) => k.id !== c.id)), M(`Removed project context: ${c.label}`);
      return;
    }
    Te((u) => u.includes(c.id) ? u : [...u, c.id]), M(`Removed chat context: ${c.label}`);
  }, []), rt = y(() => {
    nn(!0), de(null), X(!0), M("Atomek settings opened");
  }, []), dn = y(() => {
    nn(!1), de((c) => c ?? K.at(-1) ?? null), K.length === 0 && X(!1), M("Atomek settings closed");
  }, [K]), Ee = y((c) => {
    V((u) => ({ ...u, [c]: (u[c] ?? 1) + 1 }));
  }, []), Pa = y((c) => {
    c.preventDefault(), c.currentTarget.setPointerCapture?.(c.pointerId);
    const u = Lt(n), k = c.clientX, C = B, G = (Ke) => {
      const It = C + (k - Ke.clientX);
      q(lt(It, u.secondaryMin, u.secondaryMax));
    }, ge = () => {
      window.removeEventListener("pointermove", G), window.removeEventListener("pointerup", ge);
    };
    window.addEventListener("pointermove", G), window.addEventListener("pointerup", ge);
  }, [B, n]), Ta = y((c) => {
    c.preventDefault(), c.currentTarget.setPointerCapture?.(c.pointerId);
    const u = Lt(n), k = c.clientX, C = f, G = (Ke) => {
      const It = C + (Ke.clientX - k);
      b(lt(It, u.primaryMin, u.primaryMax));
    }, ge = () => {
      window.removeEventListener("pointermove", G), window.removeEventListener("pointerup", ge);
    };
    window.addEventListener("pointermove", G), window.addEventListener("pointerup", ge);
  }, [f, n]), it = y((c) => {
    const u = [c, ...We.filter((k) => k.path !== c.path)].slice(0, 6);
    Aa(u), localStorage.setItem(la, JSON.stringify(u));
  }, [We]), ce = y((c, u) => {
    le((k) => k.includes(c.id) ? k : [...k, c.id]), de(c.id), X(!1), rn(u ?? null), N({ lineNumber: u ?? 1, column: 1 });
  }, []), La = y((c) => {
    if (!c.fileId) return;
    const u = g.find((k) => k.id === c.fileId);
    u && (ce(u, c.range?.startLineNumber ?? 1), M(`Revealed context: ${c.label}`));
  }, [g, ce]), Ve = y(async () => {
    if (Ot(he, "open new files"))
      try {
        const c = await Wo();
        if (c.length === 0) return;
        R((u) => ws(u, c)), c.forEach((u) => it({ name: u.name, path: u.path, at: Date.now() })), ce(c[0]), M(`Opened ${c.length} local file${c.length === 1 ? "" : "s"}`);
      } catch (c) {
        c.name !== "AbortError" && M(`Open file failed: ${c.message}`);
      }
  }, [he, ce, it]), yt = y(async () => {
    if (Ot(he, "open another folder"))
      try {
        const c = await Uo();
        ye(c), R(c.files), le([]), de(null), X(!1), it({ name: c.name, path: c.name, at: Date.now() }), M(`${c.handle ? "Opened local folder" : "Opened browser fallback folder"} ${c.name} (${c.files.length} text files indexed)`);
      } catch (c) {
        c.name !== "AbortError" && M(`Open folder failed: ${c.message}`);
      }
  }, [he, it]), Oa = y((c) => {
    if (!Y) return;
    let u = !1;
    R((k) => k.map((C) => C.id !== Y || C.content === c ? C : (u = !0, { ...C, content: c, dirty: !0 }))), u && Ee(Y);
  }, [Y, Ee]), vt = y(async () => {
    if (O)
      try {
        const c = await Mt(O);
        R((u) => u.map((k) => k.id === c.id ? c : k)), M(`Saved ${c.name}`);
      } catch (c) {
        M(`Save failed: ${c.message}`);
      }
  }, [O]), Ea = y(async (c) => {
    const u = g.find((C) => C.id === c);
    if (!u) return null;
    const k = await Mt(u);
    return R((C) => C.map((G) => G.id === k.id ? k : G)), k;
  }, [g]), hn = y(async () => {
    const c = g.filter((u) => u.dirty);
    if (c.length === 0) {
      M("No dirty files to save");
      return;
    }
    try {
      const u = await Promise.all(c.map((C) => Mt(C))), k = new Map(u.map((C) => [C.id, C]));
      R((C) => C.map((G) => k.get(G.id) ?? G)), Be(null), M(`Saved ${u.length} dirty file${u.length === 1 ? "" : "s"}`);
    } catch (u) {
      M(`Save all failed: ${u.message}`);
    }
  }, [g]), Ct = y((c) => {
    const u = g.find((k) => k.id === c);
    if (u?.dirty && !window.confirm(`${u.name} has unsaved changes. Close without saving?`)) {
      M(`Close canceled — ${u.name} has unsaved changes`);
      return;
    }
    le((k) => {
      const C = k.filter((G) => G !== c);
      return Y === c && (de(C.at(-1) ?? null), j(null)), C;
    });
  }, [Y, g]), Ra = y(() => {
    Ot(he, "close all editors") && (le([]), de(null), rn(null), X(!1), M("Closed all editors"));
  }, [he]), $t = y(() => {
    const c = g.filter((k) => k.name.startsWith("Untitled")).length + 1, u = {
      id: `untitled-${Date.now()}`,
      name: `Untitled-${c}`,
      path: `Untitled-${c}.md`,
      language: "markdown",
      content: `# Untitled
`,
      dirty: !0,
      source: "generated"
    };
    R((k) => [...k, u]), ce(u);
  }, [g, ce]), Ne = y(async (c) => {
    const u = [...Ue.parts];
    if (ne !== "indexed-project")
      return S([]), u;
    const k = await Wr(
      e,
      xe.snapshot,
      c,
      Se,
      { limit: 8, maxChars: 12e3, includeDirty: !0 },
      xe.staleReport
    ), C = k.hits;
    return S(C), C.length === 0 ? (M(xe.snapshot.chunks.length === 0 ? "Project index is empty — open a folder with readable files first" : "Project index found no matching context for this prompt"), u) : (k.mode !== "hybrid" && k.reason ? M(k.reason) : M(`${C.length} project context hit${C.length === 1 ? "" : "s"} · ${k.reason ?? "hybrid retrieval"}`), [
      ...u,
      ...Ur(C)
    ]);
  }, [Ue.parts, ne, Se, e, xe]), xt = y(() => {
    if (!O && ue.length === 0) {
      M("Open a file before asking Atomek to synthesize an AI artifact");
      return;
    }
    const u = [
      `Create a polished Markdown artifact from ${O?.path ?? `${ue.length} open editors`}.`,
      "Use the open editor context already attached by Atomek.",
      "Prefer an actionable structure: summary, key findings, risks, and next steps.",
      "Do not invent missing facts. Do not use provider-specific tools or model assumptions."
    ].join(" ");
    T(!0), w("chat"), M("Asking Atomek to synthesize an AI artifact…"), (async () => {
      const k = await Ne(u), C = await z.askAgent(u, { requestContext: k });
      !C || C.status === "error" || z.createArtifact({
        messageId: C.id,
        title: `AI synthesis — ${O?.name ?? "open workspace"}`,
        kind: "markdown",
        body: C.body
      }).then(() => {
        T(!0), w("outputs"), J(!0), P("output");
      });
    })();
  }, [O, z, Ne, ue.length]), Nt = y((c) => {
    const u = g.find((k) => k.path === c.path || k.name === c.name);
    if (u) {
      ce(u), M(`Opened recent ${u.name}`);
      return;
    }
    M("Browser security requires permission again — use Open File or Open Folder to reopen local content.");
  }, [g, ce]), me = y((c) => {
    T(!0), w("chat"), F(""), (async () => {
      const u = await Ne(c);
      await z.askAgent(c, { requestContext: u });
    })();
  }, [z, Ne]), un = y(async (c) => {
    if (!e.skills?.get) {
      M("Tytus skill registry is not available in this host build");
      return;
    }
    try {
      const u = await e.skills.get(c.id), k = u.body.length > 4500 ? `${u.body.slice(0, 4500)}

[Skill pack clipped by Atomek. Ask for the full pack if needed.]` : u.body, C = [
        `Use Tytus skill "${u.title}" (${u.id}).`,
        `Driver: ${u.driver}. Source: ${u.source}. Status: ${u.status}.`,
        "Follow these instructions only as capability context. Do not execute shell commands unless the user explicitly asks and Tytus host allows it.",
        k
      ].join(`

`);
      F((G) => [G.trim(), C].filter(Boolean).join(`

`)), T(!0), w("chat"), M(`Attached skill ${u.title} to chat input`);
    } catch (u) {
      M(`Failed to attach skill: ${u instanceof Error ? u.message : String(u)}`);
    }
  }, [e.skills]), Fa = y((c) => {
    const u = z.messages.findIndex((C) => C.id === c.id), k = z.messages.slice(0, u < 0 ? void 0 : u).reverse().find((C) => C.role === "user");
    if (!k?.body.trim()) {
      M("No previous user prompt to regenerate from");
      return;
    }
    (async () => {
      const C = await Ne(k.body);
      await z.askAgent(k.body, { requestContext: C });
    })();
  }, [z, Ne]), ja = y((c) => {
    z.createArtifact({
      messageId: c.id,
      title: c.body.split(`
`).find(Boolean)?.replace(/^#+\s*/, "").slice(0, 80) || "Atomek answer",
      kind: "markdown",
      body: c.body
    }).then(() => {
      w("outputs"), J(!0), P("output");
    });
  }, [z]), Da = y((c) => {
    z.remember({
      messageId: c.id,
      title: c.body.split(`
`).find(Boolean)?.replace(/^#+\s*/, "").slice(0, 80) || "Atomek memory",
      body: c.body
    });
  }, [z]), za = y(() => {
    if (!O) {
      M("No active file to save as AI artifact");
      return;
    }
    z.createArtifact({
      title: O.path,
      kind: O.language === "markdown" ? "markdown" : "report",
      body: O.content
    }).then(() => {
      T(!0), w("outputs"), J(!0), P("output");
    });
  }, [O, z]), At = y((c) => {
    const u = Rt(g, Et(c.title || c.kind)), k = {
      id: `artifact-file-${c.id}-${Date.now()}`,
      name: u,
      path: u,
      language: "markdown",
      content: c.body,
      dirty: !0,
      source: "generated"
    };
    R((C) => [...C, k]), ce(k), M(`Opened ${c.title} as editable file`);
  }, [g, ce]), St = y(() => {
    const c = window.prompt("Check command/name (manual capture only; Atomek will not execute it)");
    if (c === null) return;
    const u = c.trim();
    if (!u) {
      M("Manual check capture canceled — command/name was empty");
      return;
    }
    const k = window.prompt("Paste check output/result");
    if (k === null) return;
    const C = [
      "# Manual check result",
      "",
      `- Captured: ${(/* @__PURE__ */ new Date()).toISOString()}`,
      `- Command/name: \`${u.replace(/`/g, "\\`")}\``,
      "- Execution: manual user-provided output; Atomek did not run a shell command.",
      "",
      "```text",
      k,
      "```"
    ].join(`
`), G = {
      id: `manual-check-${Date.now()}`,
      title: `Manual check — ${u.slice(0, 80)}`,
      kind: "report",
      body: C,
      createdAt: Date.now(),
      source: "local"
    };
    et((ge) => [G, ...ge]), J(!0), P("output"), M(`Captured manual check: ${u}`);
  }, []), Re = y((c, u) => {
    const k = ci({
      body: u,
      files: g,
      sourceTitle: c,
      activeFile: O,
      versions: te
    }), C = {
      sourceTitle: k.sourceTitle,
      edits: k.edits.map(ys),
      skipped: k.skipped
    };
    return k.edits.length > 1 ? (He(C), Le(null), M(`Previewing AI workspace patch for ${k.edits.length} files`), !0) : k.edits.length === 1 ? (Le(C.edits[0]), He(null), M(`Previewing AI patch for ${C.edits[0].fileName}`), !0) : (M(k.skipped.length > 0 ? `No applicable edit found. ${k.skipped.slice(0, 2).join(" · ")}` : "No fenced replacement block or applicable unified diff found. Ask Atomek for an edit again."), !1);
  }, [O, te, g]), mn = y((c, u) => {
    const k = {
      id: `local-job-${Date.now()}`,
      title: c,
      kind: "report",
      body: u,
      createdAt: Date.now(),
      source: "local"
    };
    et((C) => [k, ...C]), T(!0), w("outputs"), J(!0), P("output"), M(`Saved local job output: ${c}`), (u.includes("```diff") || u.includes("--- a/")) && Re(c, u);
  }, [Re]), _a = y(() => {
    const c = x.trim();
    if (!c) return;
    F("");
    const u = ls(c);
    (async () => {
      const k = await Ne(c), C = await z.askAgent(c, { requestContext: k });
      if (!u || !C || C.status === "error") return;
      Re(C.body.split(`
`).find(Boolean)?.replace(/^#+\s*/, "").slice(0, 80) || "Atomek edit", C.body) || M("Edit request answered without a patch. Use Generate patch / Edit to request an applicable diff.");
    })();
  }, [z, Ne, x, Re]), Ha = y(() => {
    A && (E(null), me(ds(A)));
  }, [me, A]), qe = y((c) => {
    const u = xi(g, c);
    pt(u);
    const k = u.commands[0]?.command ?? "";
    nt(k), bt(""), kt(""), on("failed"), J(!0), P("terminal"), M(u.commands.length > 0 ? `Manual check ready: copy ${u.commands[0].command}` : "Manual check ready: enter a check command to copy");
  }, [g]), Ba = y((c) => {
    c.trim() && (Ze(c), nt(c), M(`Manual check command copied: ${c}`));
  }, []), Wa = y(() => {
    pt((c) => {
      if (!c) return c;
      const u = Ni(c, ft), k = u.commands.at(-1)?.command ?? "";
      return k && nt(k), u;
    }), bt("");
  }, [ft]), Ua = y(() => {
    if (!Oe || !tt.trim()) {
      M("Select or enter a manual check command before capturing output");
      return;
    }
    const c = tt.trim();
    pt((u) => u && Ai(u, c, at, gt)), kt(""), M(`Captured manual check result: ${c} (${at})`);
  }, [gt, tt, Oe, at]), Va = y(() => {
    Oe && me(Si(Oe));
  }, [me, Oe]), qa = y(() => {
    if (!se) return;
    const c = g.find((u) => u.id === se.fileId);
    if (!c) {
      M(`Cannot apply edit — ${se.fileName} is no longer open`), Le(null);
      return;
    }
    c.content !== se.originalContent && !window.confirm(`${se.fileName} changed after the preview was created. Apply the AI edit anyway?`) || (R((u) => u.map((k) => k.id === se.fileId ? { ...k, content: se.proposedContent, dirty: !0 } : k)), Ee(se.fileId), Be(`AI edit applied to ${c.name}. Save All to persist it to disk.`), Le(null), qe(`AI edit applied to ${c.name}`), M(`Applied AI edit to ${c.name} — unsaved; manual check ready`));
  }, [Ee, g, se, qe]), Ka = y(() => {
    if (!se) return;
    const c = Rt(g, `${Et(se.fileName)}-ai-edit`), u = {
      id: `pending-edit-${se.fileId}-${Date.now()}`,
      name: c,
      path: c,
      language: O?.language ?? "markdown",
      content: se.proposedContent,
      dirty: !0,
      source: "generated"
    };
    R((k) => [...k, u]), ce(u), Le(null), M(`Opened proposed edit as ${c}`);
  }, [O?.language, g, ce, se]), Ga = y(() => {
    if (!$e) return;
    const c = new Map($e.edits.map((k) => [k.fileId, k]));
    g.some((k) => {
      const C = c.get(k.id);
      return C && k.content !== C.originalContent;
    }) && !window.confirm("One or more files changed after the workspace patch preview was created. Apply anyway?") || (R((k) => k.map((C) => {
      const G = c.get(C.id);
      return G ? { ...C, content: G.proposedContent, dirty: !0 } : C;
    })), c.forEach((k, C) => Ee(C)), Be(`AI workspace patch applied to ${c.size} file${c.size === 1 ? "" : "s"}. Save All to persist changes.`), He(null), qe(`AI workspace patch applied to ${c.size} file${c.size === 1 ? "" : "s"}`), M(`Applied AI workspace patch to ${c.size} file${c.size === 1 ? "" : "s"} — unsaved; manual check ready`));
  }, [Ee, g, $e, qe]), Ja = y(() => {
    if (!$e) return;
    const c = [...g], u = $e.edits.map((k) => {
      const C = Rt(c, `${Et(k.fileName)}-ai-edit`), G = g.find((Ke) => Ke.id === k.fileId), ge = {
        id: `workspace-patch-${k.fileId}-${Date.now()}-${C}`,
        name: C,
        path: C,
        language: G?.language ?? "markdown",
        content: k.proposedContent,
        dirty: !0,
        source: "generated"
      };
      return c.push(ge), ge;
    });
    R((k) => [...k, ...u]), u[0] && ce(u[0]), He(null), M(`Opened ${u.length} proposed edit file${u.length === 1 ? "" : "s"}`);
  }, [g, ce, $e]), pn = y((c) => {
    if (c === "explain") {
      me("Explain the active file. Focus on purpose, structure, risks, and next useful edits.");
      return;
    }
    if (c === "improve") {
      me("Review the active file and propose the smallest concrete improvements. Include exact snippets if useful.");
      return;
    }
    if (c === "plan") {
      me("Create an implementation plan from the open editor context. Be specific, ordered, and call out blockers.");
      return;
    }
    if (c === "edit") {
      me("Edit the active file or open workspace files. Prefer one git-style unified diff in a fenced diff block, with paths matching opened files. If editing one file, a complete fenced replacement is also OK. Do not use provider-specific tools or model assumptions.");
      return;
    }
    me("Draft a concrete Markdown artifact from the open editor context. Make it ready to save as an output.");
  }, [me]);
  return Q(() => {
    const c = (u) => {
      (u.metaKey || u.ctrlKey) && (u.key.toLowerCase() === "o" && (u.preventDefault(), Ve()), u.key.toLowerCase() === "s" && (u.preventDefault(), vt()), u.key.toLowerCase() === "w" && (u.preventDefault(), Y && Ct(Y)), u.key.toLowerCase() === "b" && (u.preventDefault(), p((C) => !C)), u.shiftKey && u.key.toLowerCase() === "f" && (u.preventDefault(), s("search"), p(!0)), (u.key.toLowerCase() === "k" || u.key.toLowerCase() === "p") && (u.preventDefault(), ae(!0)));
    };
    return window.addEventListener("keydown", c), () => window.removeEventListener("keydown", c);
  }, [Y, Ct, Ve, vt]), Q(() => {
    const c = (u) => {
      he.length !== 0 && (u.preventDefault(), u.returnValue = "");
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, [he.length]), Q(() => {
    he.length === 0 && Be(null);
  }, [he.length]), Q(() => {
    const c = t.current;
    if (!c) return;
    const u = () => o(Math.round(c.getBoundingClientRect().width));
    u();
    const k = new ResizeObserver(u);
    return k.observe(c), () => k.disconnect();
  }, []), Q(() => {
    if (!n) return;
    const c = Lt(n);
    b((u) => lt(u, c.primaryMin, c.primaryMax)), q((u) => lt(u, c.secondaryMin, c.secondaryMax));
  }, [n]), Q(() => {
    const c = { primaryVisible: d, primaryWidth: f, secondaryVisible: I, secondaryWidth: B, markdownPreviewVisible: H };
    localStorage.setItem(da, JSON.stringify(c));
  }, [H, d, f, I, B]), Q(() => {
    localStorage.setItem(ha, JSON.stringify(Se));
  }, [Se]), /* @__PURE__ */ l(
    "div",
    {
      ref: t,
      className: `workbench-workbench ${d ? "" : "no-primary"} ${I ? "" : "no-secondary"} ${U ? "has-bottom-panel" : ""}`,
      "data-app": "workbench-vscode-base",
      style: { "--workbench-primary-width": `${f}px`, "--workbench-secondary-width": `${B}px` },
      children: [
        /* @__PURE__ */ a(Vi, { active: i, setActive: (c) => {
          s(c), p(!0);
        }, openSettings: rt, settingsActive: ot }),
        d && /* @__PURE__ */ l("div", { className: "workbench-primary-region", children: [
          /* @__PURE__ */ a(
            qi,
            {
              host: e,
              activity: i,
              folder: oe,
              files: i === "search" ? g : Ia,
              openEditors: ue,
              activeFileId: Y,
              query: be,
              setQuery: _e,
              openFile: Ve,
              openFolder: yt,
              openWorkbenchFile: ce,
              newFile: $t,
              recent: We,
              reopenRecent: Nt,
              setStatus: M,
              hasFsAccess: Bo(),
              attachSkillToChat: un,
              saveLocalJobOutput: mn,
              activeFile: O
            }
          ),
          /* @__PURE__ */ a("div", { className: "workbench-primary-resizer", onPointerDown: Ta, title: "Resize Explorer" })
        ] }),
        /* @__PURE__ */ l("main", { className: "workbench-editor-area", children: [
          /* @__PURE__ */ a("button", { className: "workbench-command-center", onClick: () => ae(!0), children: "Workspace" }),
          /* @__PURE__ */ l("section", { className: "workbench-editor-stack", children: [
            /* @__PURE__ */ a(
              Xi,
              {
                openEditors: ue,
                activeFileId: Y,
                showWelcome: wt,
                settingsOpen: tn,
                settingsActive: ot,
                setActiveFileId: de,
                closeEditor: Ct,
                saveFile: (c) => {
                  Ea(c);
                },
                closeWelcome: () => X(!0),
                openSettings: rt,
                closeSettings: dn,
                secondaryVisible: I,
                toggleSecondary: () => T((c) => !c),
                canPreview: O?.language === "markdown",
                previewVisible: H,
                togglePreview: () => ee((c) => !c)
              }
            ),
            /* @__PURE__ */ a(Ji, { file: O, folder: oe, showWelcome: wt }),
            an && he.length > 0 ? /* @__PURE__ */ l("div", { className: "workbench-ai-dirty-banner", children: [
              /* @__PURE__ */ a("span", { children: an }),
              /* @__PURE__ */ a("button", { onClick: () => {
                hn();
              }, children: "Save all" }),
              /* @__PURE__ */ a("button", { onClick: () => Be(null), title: "Dismiss", children: /* @__PURE__ */ a(we, { size: 13 }) })
            ] }) : null,
            /* @__PURE__ */ a("div", { className: "workbench-editor-content", children: O ? /* @__PURE__ */ l("div", { className: O.language === "markdown" && H ? "workbench-editor-split" : "workbench-editor-single", children: [
              /* @__PURE__ */ a("div", { className: "workbench-editor-pane", children: /* @__PURE__ */ a(Ya, { fallback: /* @__PURE__ */ a("div", { className: "workbench-empty-pane", children: "Loading editor…" }), children: /* @__PURE__ */ a(
                Fi,
                {
                  file: O,
                  revealLine: xa,
                  onChange: Oa,
                  onCursorChange: N,
                  onSelectionChange: j,
                  onSave: () => {
                    vt();
                  }
                },
                O.id
              ) }) }),
              O.language === "markdown" && H && /* @__PURE__ */ a(as, { content: O.content })
            ] }) : ot ? /* @__PURE__ */ a(
              hs,
              {
                host: e,
                chatSettings: Se,
                onChange: $a,
                onClose: dn
              }
            ) : wt ? /* @__PURE__ */ a(Zi, { host: e, openFile: Ve, openFolder: yt, newFile: $t, recent: We, reopenRecent: Nt, setStatus: M, openControlTower: () => {
              s("computer"), p(!0);
            }, openChat: () => {
              w("chat"), T(!0);
            } }) : /* @__PURE__ */ l("div", { className: "workbench-no-editor", children: [
              /* @__PURE__ */ a(ut, { size: 34 }),
              /* @__PURE__ */ a("p", { children: "No editor open" }),
              /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: () => X(!1), children: "Show Mission Control" })
            ] }) }),
            U && /* @__PURE__ */ a(
              rs,
              {
                tab: Z,
                setTab: P,
                outputs: Ie,
                clearOutputs: () => et([]),
                deleteArtifact: (c) => {
                  z.deleteArtifact(c);
                },
                runAiSynthesis: xt,
                captureManualCheck: St,
                openOutputAsFile: At,
                manualCheckSession: Oe,
                manualCheckCommandInput: ft,
                setManualCheckCommandInput: bt,
                manualCheckOutputInput: gt,
                setManualCheckOutputInput: kt,
                manualCheckSelectedCommand: tt,
                setManualCheckSelectedCommand: nt,
                manualCheckStatus: at,
                setManualCheckStatus: on,
                copyManualCheckCommand: Ba,
                addManualCheckCommand: Wa,
                recordManualCheckResult: Ua,
                askAgentFromManualChecks: Va,
                onClose: () => J(!1)
              }
            )
          ] })
        ] }),
        I && /* @__PURE__ */ a(
          is,
          {
            tab: h,
            setTab: w,
            chatInput: x,
            setChatInput: F,
            chatMessages: z.messages,
            chatThread: z.thread,
            chatThreads: z.threads,
            askAgent: _a,
            stopChat: z.stopChat,
            regenerateMessage: Fa,
            newChat: () => {
              z.newChat();
            },
            selectThread: (c) => {
              z.selectThread(c);
            },
            renameThread: (c, u) => {
              z.renameThread(c, u);
            },
            deleteThread: (c) => {
              z.deleteThread(c);
            },
            saveMessageAsArtifact: ja,
            rememberMessage: Da,
            previewEditFromMessage: (c) => Re(c.body.split(`
`).find(Boolean)?.replace(/^#+\s*/, "").slice(0, 80) || "Atomek answer", c.body),
            runQuickPrompt: pn,
            pendingPatchPrompt: A,
            generatePatchPrompt: Ha,
            workspaceFileCount: g.length,
            aiStatus: z.aiStatus,
            chatSettings: Se,
            openSettings: rt,
            busy: z.busy,
            memoryHitCount: z.memoryHits.length,
            outputs: Ie,
            runAiSynthesis: xt,
            captureManualCheck: St,
            openOutputAsFile: At,
            previewEditFromOutput: (c) => Re(c.title, c.body),
            canPreviewEdit: g.length > 0,
            clearOutputs: () => et([]),
            deleteArtifact: (c) => {
              z.deleteArtifact(c);
            },
            host: e,
            setStatus: M,
            activeFile: O,
            openEditors: ue,
            attachSkillToChat: un,
            saveLocalJobOutput: mn,
            contextScope: ne,
            setContextScope: ve,
            contextAttachments: Sa,
            removeContextAttachment: Ma,
            revealContextAttachment: La,
            projectIndexSummary: `${xe.snapshot.files.length} files · ${xe.snapshot.chunks.length} chunks`,
            projectIndexStale: xe.isStale,
            refreshProjectIndex: () => {
              const c = xe.refresh(g);
              M(`Project index refreshed: ${c.files.length} files · ${c.chunks.length} chunks`);
            },
            onResizeStart: Pa,
            onClose: () => T(!1)
          }
        ),
        D && /* @__PURE__ */ a(
          ns,
          {
            query: ie,
            setQuery: fe,
            files: g,
            activeFile: O,
            commands: [
              { label: "File: New File", detail: "Create an untitled Markdown file", run: $t },
              { label: "File: Open File...", detail: "Open one or more local files", run: () => {
                Ve();
              } },
              { label: "File: Open Folder...", detail: "Open a local folder with browser permission", run: () => {
                yt();
              } },
              ...We.map((c) => ({ label: `File: Open Recent — ${c.name}`, detail: c.path, run: () => Nt(c) })),
              { label: "File: Save All", detail: `${he.length} dirty file${he.length === 1 ? "" : "s"}`, run: () => {
                hn();
              }, disabled: he.length === 0 },
              { label: "File: Close All Editors", detail: `${ue.length} open editor${ue.length === 1 ? "" : "s"}`, run: Ra, disabled: ue.length === 0 },
              { label: "Search: Find in Files", detail: "Open the VS Code-style search side bar", run: () => {
                s("search"), p(!0);
              } },
              { label: "Help: Show Mission Control", detail: "Open the Atomek control tower landing page", run: () => {
                de(null), X(!1), s("computer"), p(!0);
              } },
              { label: "View: Toggle Primary Side Bar", detail: d ? "Hide Explorer side bar" : "Show Explorer side bar", run: () => p((c) => !c) },
              { label: "View: Toggle Chat Panel", detail: I ? "Hide right AI side bar" : "Show right AI side bar", run: () => T((c) => !c) },
              { label: "View: Toggle Bottom Panel", detail: U ? "Hide Problems/Output/Terminal panel" : "Show Problems/Output/Terminal panel", run: () => J((c) => !c) },
              { label: "Atomek: Open Settings", detail: "Open settings as an editor tab", run: rt },
              { label: "Checks: Open Manual Check Panel", detail: "Capture copy/paste check commands without host execution", run: () => qe("Manual check requested from command palette") },
              { label: "View: Toggle Markdown Preview", detail: O?.language === "markdown" ? "Show or hide Markdown preview split" : "Available for Markdown files", run: () => ee((c) => !c), disabled: O?.language !== "markdown" },
              { label: "Atomek: Create AI Synthesis", detail: O || ue.length > 0 ? "Ask AIL to produce a saved Markdown artifact" : "Open a file first", run: xt, disabled: !O && ue.length === 0 },
              { label: "AI: Explain Active File", detail: O ? `Ask Cortex to explain ${O.path}` : "Open a file first", run: () => me("Explain the active file. Focus on purpose, structure, risks, and next useful edits."), disabled: !O },
              { label: "AI: Improve Active File", detail: O ? `Ask Cortex for concrete edits to ${O.path}` : "Open a file first", run: () => me("Review the active file and propose the smallest concrete improvements. Include exact snippets if useful."), disabled: !O },
              { label: "AI: Draft Editable Replacement", detail: O ? `Ask Cortex for a full-file replacement for ${O.path}` : "Open a file first", run: () => pn("edit"), disabled: !O },
              { label: "AI: Plan Workspace Work", detail: ue.length > 0 ? "Use open editors as bounded context" : "Open files first", run: () => me("Create an implementation plan from the open editor context. Be specific and sequence the work."), disabled: ue.length === 0 },
              { label: "AI: Save Active File as Artifact", detail: O ? "Persist active file in host.ai artifacts" : "Open a file first", run: za, disabled: !O },
              { label: "AI: Capture Manual Check Output", detail: "Paste check output as an auditable local artifact; no shell execution", run: St },
              { label: "AI: Open Latest Artifact as File", detail: Ie[0] ? `Create editable file from ${Ie[0].title}` : "No outputs yet", run: () => Ie[0] && At(Ie[0]), disabled: Ie.length === 0 }
            ],
            openWorkbenchFile: ce,
            onClose: () => ae(!1)
          }
        ),
        se && /* @__PURE__ */ a(
          us,
          {
            edit: se,
            onApply: qa,
            onOpenAsFile: Ka,
            onClose: () => Le(null)
          }
        ),
        $e && /* @__PURE__ */ a(
          ms,
          {
            patch: $e,
            onApply: Ga,
            onOpenAsFiles: Ja,
            onClose: () => He(null)
          }
        ),
        /* @__PURE__ */ a(ks, { status: Na, file: O ?? ji, cursor: $, fileCount: g.length, dirtyCount: he.length })
      ]
    }
  );
}
function Vi({ active: e, setActive: t, openSettings: n, settingsActive: o }) {
  return /* @__PURE__ */ l("aside", { className: "workbench-activity-bar", "aria-label": "Activity Bar", children: [
    /* @__PURE__ */ a(Me, { icon: /* @__PURE__ */ a(Fn, { size: 25 }), label: "Explorer", active: e === "explorer", onClick: () => t("explorer") }),
    /* @__PURE__ */ a(Me, { icon: /* @__PURE__ */ a(To, { size: 25 }), label: "Search", active: e === "search", onClick: () => t("search") }),
    /* @__PURE__ */ a(Me, { icon: /* @__PURE__ */ a(Dn, { size: 25 }), label: "Source Control", active: e === "source-control", onClick: () => t("source-control") }),
    /* @__PURE__ */ a(Me, { icon: /* @__PURE__ */ a(En, { size: 25 }), label: "Run and Debug", active: e === "run", onClick: () => t("run") }),
    /* @__PURE__ */ a(Me, { icon: /* @__PURE__ */ a(Ut, { size: 25 }), label: "Control Tower", active: e === "computer", onClick: () => t("computer") }),
    /* @__PURE__ */ a("div", { className: "workbench-activity-spacer" }),
    /* @__PURE__ */ a(Me, { icon: /* @__PURE__ */ a(lo, { size: 23 }), label: "Accounts", active: !1, onClick: () => {
    } }),
    /* @__PURE__ */ a(Me, { icon: /* @__PURE__ */ a(Ro, { size: 23 }), label: "Settings", active: o, onClick: n })
  ] });
}
function Me({ icon: e, label: t, active: n, onClick: o }) {
  return /* @__PURE__ */ a("button", { className: `workbench-activity-button ${n ? "active" : ""}`, title: t, "aria-label": t, onClick: o, children: e });
}
function qi(e) {
  return e.activity === "search" ? /* @__PURE__ */ a(es, { files: e.files, query: e.query, setQuery: e.setQuery, openWorkbenchFile: e.openWorkbenchFile, activeFileId: e.activeFileId }) : e.activity === "source-control" ? /* @__PURE__ */ a(Tn, { title: "SOURCE CONTROL", body: "No source control provider registered. Git belongs here, not as a fake demo." }) : e.activity === "run" ? /* @__PURE__ */ a(Tn, { title: "RUN AND DEBUG", body: "Run configurations, terminals, and recipe execution will plug into this surface later." }) : e.activity === "computer" ? /* @__PURE__ */ a(Ca, { host: e.host, setStatus: e.setStatus, attachSkillToChat: e.attachSkillToChat, saveLocalJobOutput: e.saveLocalJobOutput, activeFile: e.activeFile, openEditors: e.openEditors }) : /* @__PURE__ */ a(Ki, { ...e });
}
function Ki(e) {
  const t = !e.folder, n = re(() => Gi(e.files, e.folder?.name), [e.files, e.folder?.name]), [o, r] = v(() => /* @__PURE__ */ new Set());
  Q(() => {
    const s = ga(n);
    r((d) => {
      const p = new Set(d);
      return s.forEach((f) => p.add(f)), p;
    });
  }, [n]);
  const i = y((s) => {
    r((d) => {
      const p = new Set(d);
      return p.has(s) ? p.delete(s) : p.add(s), p;
    });
  }, []);
  return /* @__PURE__ */ l("aside", { className: "workbench-sidebar", children: [
    /* @__PURE__ */ a("div", { className: "workbench-sidebar-title", children: "EXPLORER" }),
    /* @__PURE__ */ l("div", { className: "workbench-sidebar-scroll", children: [
      t ? /* @__PURE__ */ l(De, { children: [
        /* @__PURE__ */ a("p", { style: { fontWeight: 600, margin: "10px 0" }, children: "NO FOLDER OPENED" }),
        /* @__PURE__ */ a("p", { className: "workbench-muted", children: "You have not yet opened a folder." }),
        /* @__PURE__ */ a("button", { className: "workbench-button-blue", onClick: e.openFolder, children: "Open Folder" }),
        /* @__PURE__ */ a("button", { className: "workbench-button-blue", onClick: e.openFile, children: "Open File" }),
        /* @__PURE__ */ a("button", { className: "workbench-button-blue", onClick: () => e.recent[0] ? e.reopenRecent(e.recent[0]) : e.setStatus("No recent local workspace yet."), children: "Open Recent" }),
        /* @__PURE__ */ a("p", { className: "workbench-muted", children: e.hasFsAccess ? "Local files use browser-native File System Access API." : "Browser fallback may show a file chooser label." })
      ] }) : /* @__PURE__ */ l(De, { children: [
        /* @__PURE__ */ l("div", { className: "workbench-sidebar-actions", children: [
          /* @__PURE__ */ l("button", { className: "workbench-button-subtle", onClick: e.openFile, children: [
            /* @__PURE__ */ a(qt, { size: 14 }),
            "Open File"
          ] }),
          /* @__PURE__ */ l("button", { className: "workbench-button-subtle", onClick: e.openFolder, children: [
            /* @__PURE__ */ a(Kt, { size: 14 }),
            "Open Folder"
          ] })
        ] }),
        /* @__PURE__ */ a("input", { className: "workbench-input", value: e.query, onChange: (s) => e.setQuery(s.target.value), placeholder: "Search files" }),
        /* @__PURE__ */ l("div", { className: "workbench-section-title", children: [
          /* @__PURE__ */ a(ht, { size: 12 }),
          " Open Editors"
        ] }),
        e.openEditors.length === 0 ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No open editors" }) : e.openEditors.map((s) => /* @__PURE__ */ a(Zt, { file: s, active: s.id === e.activeFileId, onOpen: () => e.openWorkbenchFile(s), label: s.name, detail: s.path }, s.id)),
        /* @__PURE__ */ l("div", { className: "workbench-section-title", children: [
          /* @__PURE__ */ a(ht, { size: 12 }),
          " ",
          e.folder?.name ?? "Workspace"
        ] }),
        n.length === 0 ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No readable text files found." }) : ka(n, e.activeFileId, e.openWorkbenchFile, o, i)
      ] }),
      /* @__PURE__ */ a("div", { className: "workbench-section-title", children: "Recent" }),
      e.recent.length === 0 ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No recent folders yet." }) : e.recent.map((s) => /* @__PURE__ */ l("button", { className: "workbench-tree-row", onClick: () => e.reopenRecent(s), children: [
        /* @__PURE__ */ a(jn, { size: 14 }),
        /* @__PURE__ */ a("span", { className: "workbench-row-name", children: s.name })
      ] }, `${s.path}-${s.at}`))
    ] })
  ] });
}
function Zt({ file: e, active: t, onOpen: n, basePath: o, depth: r = 0, label: i, detail: s }) {
  const d = o && e.path.startsWith(`${o}/`) ? e.path.slice(o.length + 1) : e.path, p = r || Math.max(0, d.split("/").length - 1);
  return /* @__PURE__ */ l("button", { className: `workbench-file-row ${t ? "active" : ""}`, style: { "--workbench-depth": p }, onClick: n, title: e.path, children: [
    /* @__PURE__ */ a(Rn, { size: 14 }),
    /* @__PURE__ */ l("span", { className: "workbench-row-text", children: [
      /* @__PURE__ */ a("span", { className: "workbench-row-name", children: i ?? d }),
      s ? /* @__PURE__ */ a("span", { className: "workbench-row-detail", children: s }) : null
    ] }),
    e.dirty && /* @__PURE__ */ a("span", { className: "workbench-row-meta", children: "●" })
  ] });
}
function Gi(e, t) {
  const n = [], o = /* @__PURE__ */ new Map(), r = (s, d, p = n) => {
    const f = o.get(s);
    if (f) return f;
    const b = { name: d, path: s, children: [] };
    return o.set(s, b), p.push(b), b;
  };
  e.forEach((s) => {
    const d = t && s.path.startsWith(`${t}/`) ? s.path.slice(t.length + 1) : s.path, p = d.split("/").filter(Boolean);
    let f = n, b = "";
    p.slice(0, -1).forEach((h) => {
      b = b ? `${b}/${h}` : h, f = r(b, h, f).children;
    }), f.push({ name: p.at(-1) ?? s.name, path: d, file: s, children: [] });
  });
  const i = (s) => s.sort((d, p) => +!!d.file - +!!p.file || d.name.localeCompare(p.name)).map((d) => ({ ...d, children: i(d.children) }));
  return i(n);
}
function ga(e) {
  return e.flatMap((t) => t.file ? [] : [t.path, ...ga(t.children)]);
}
function ka(e, t, n, o, r, i = 0) {
  return e.map((s) => {
    if (s.file)
      return /* @__PURE__ */ a(Zt, { file: s.file, active: s.file.id === t, onOpen: () => n(s.file), depth: i, label: s.name }, s.file.id);
    const d = o.has(s.path);
    return /* @__PURE__ */ l("div", { children: [
      /* @__PURE__ */ l("button", { className: "workbench-folder-row", style: { "--workbench-depth": i }, onClick: () => r(s.path), title: d ? `Collapse ${s.name}` : `Expand ${s.name}`, children: [
        d ? /* @__PURE__ */ a(ht, { size: 12 }) : /* @__PURE__ */ a(ht, { className: "workbench-chevron-collapsed", size: 12 }),
        d ? /* @__PURE__ */ a(Kt, { size: 14 }) : /* @__PURE__ */ a(jn, { size: 14 }),
        /* @__PURE__ */ a("span", { className: "workbench-row-name", children: s.name }),
        /* @__PURE__ */ a("span", { className: "workbench-row-meta", children: s.children.length })
      ] }),
      d ? ka(s.children, t, n, o, r, i + 1) : null
    ] }, s.path);
  });
}
function Ji({ file: e, folder: t, showWelcome: n }) {
  const o = n ? ["Mission Control"] : e?.path.split("/").filter(Boolean) ?? [], r = t && o[0] === t.name ? o.slice(1) : o;
  return /* @__PURE__ */ a("div", { className: "workbench-breadcrumb", children: r.length === 0 ? /* @__PURE__ */ a("span", { children: "Workspace" }) : r.map((i, s) => /* @__PURE__ */ l("span", { className: "workbench-breadcrumb-part", children: [
    s > 0 && /* @__PURE__ */ a("span", { className: "workbench-breadcrumb-sep", children: "›" }),
    i
  ] }, `${i}-${s}`)) });
}
function Xi(e) {
  return /* @__PURE__ */ l("div", { className: "workbench-tabs", children: [
    e.showWelcome && /* @__PURE__ */ l("button", { className: "workbench-tab active", children: [
      /* @__PURE__ */ a(ut, { size: 15 }),
      /* @__PURE__ */ a("span", { className: "workbench-tab-name", children: "Mission Control" }),
      /* @__PURE__ */ a("span", { className: "workbench-tab-close", role: "button", tabIndex: 0, onClick: (t) => {
        t.stopPropagation(), e.closeWelcome();
      }, children: /* @__PURE__ */ a(we, { size: 13 }) })
    ] }),
    e.settingsOpen && /* @__PURE__ */ l("button", { className: `workbench-tab ${e.settingsActive ? "active" : ""}`, onClick: e.openSettings, title: "Atomek Settings", children: [
      /* @__PURE__ */ a(zn, { size: 15 }),
      /* @__PURE__ */ a("span", { className: "workbench-tab-name", children: "Atomek Settings" }),
      /* @__PURE__ */ a("span", { className: "workbench-tab-close", role: "button", tabIndex: 0, onClick: (t) => {
        t.stopPropagation(), e.closeSettings();
      }, children: /* @__PURE__ */ a(we, { size: 13 }) })
    ] }),
    e.openEditors.map((t) => /* @__PURE__ */ l("button", { className: `workbench-tab ${t.id === e.activeFileId ? "active" : ""}`, onClick: () => e.setActiveFileId(t.id), title: t.path, children: [
      /* @__PURE__ */ a(Rn, { size: 15 }),
      /* @__PURE__ */ l("span", { className: "workbench-tab-name", children: [
        t.dirty && /* @__PURE__ */ a("span", { className: "workbench-dirty-dot", children: "●" }),
        t.name
      ] }),
      t.dirty && /* @__PURE__ */ a("span", { className: "workbench-tab-save", role: "button", tabIndex: 0, title: "Save", onClick: (n) => {
        n.stopPropagation(), e.saveFile(t.id);
      }, children: "Save" }),
      /* @__PURE__ */ a("span", { className: "workbench-tab-close", role: "button", tabIndex: 0, onClick: (n) => {
        n.stopPropagation(), e.closeEditor(t.id);
      }, children: /* @__PURE__ */ a(we, { size: 13 }) })
    ] }, t.id)),
    /* @__PURE__ */ a("div", { style: { flex: 1 } }),
    e.canPreview && /* @__PURE__ */ a("button", { className: `workbench-editor-action ${e.previewVisible ? "active" : ""}`, title: "Toggle Markdown Preview", onClick: e.togglePreview, children: /* @__PURE__ */ a(Vt, { size: 16 }) }),
    /* @__PURE__ */ a("button", { className: `workbench-editor-action ${e.secondaryVisible ? "active" : ""}`, title: "Toggle Chat", onClick: e.toggleSecondary, children: /* @__PURE__ */ a(No, { size: 16 }) })
  ] });
}
function Yi(e) {
  const t = e?.resources ?? [], n = (r) => t.filter((i) => i.kind === r).length, o = t.filter((r) => r.status === "ready" || r.status === "available").length;
  return [
    { label: "Pods", value: n("pod-agent"), detail: "OpenClaw, Hermes, AIL pods" },
    { label: "Local agents", value: n("local-cli"), detail: "Claude, OpenCode, Codex, pi, Kimi" },
    { label: "Shared folders", value: n("shared-folder"), detail: "garagetytus + mission handoff" },
    { label: "App skills", value: n("app-skill"), detail: "Blender, JULI3TA, Remotion, tools" },
    { label: "Ready resources", value: o, detail: "usable now" }
  ];
}
function Qi(e) {
  const t = {
    "pod-agent": 0,
    "local-cli": 1,
    "shared-folder": 2,
    "app-skill": 3,
    "ail-route": 4,
    workspace: 5
  };
  return [...e?.resources ?? []].sort((n, o) => (t[n.kind] ?? 9) - (t[o.kind] ?? 9) || n.label.localeCompare(o.label)).slice(0, 8);
}
function Zi({
  host: e,
  openFile: t,
  openFolder: n,
  newFile: o,
  recent: r,
  reopenRecent: i,
  setStatus: s,
  openControlTower: d,
  openChat: p
}) {
  const [f, b] = v("Coordinate a Tytus mission across pods, local agents, shared folders, and app skills."), [h, w] = v(null), [I, T] = v([]), [B, q] = v(!1), [U, J] = v(null), [Z, P] = v(null), H = y(async () => {
    q(!0), P(null);
    try {
      const [g, R] = await Promise.all([
        e.resources?.list?.() ?? Promise.resolve(null),
        e.missions?.list?.().catch(() => []) ?? Promise.resolve([])
      ]);
      w(g ?? null), T(R), g && s(`Control Tower loaded · ${g.resources.length} resources · ${g.warnings.length} warnings`);
    } catch (g) {
      const R = g instanceof Error ? g.message : String(g);
      P(R), s(`Control Tower resource load failed: ${R}`);
    } finally {
      q(!1);
    }
  }, [e.missions, e.resources, s]);
  Q(() => {
    H();
  }, [H]);
  const ee = y(async () => {
    if (!e.missions?.create || !e.missions?.write) {
      s("Mission API unavailable in this Tytus host build"), d();
      return;
    }
    const g = f.trim() || "Coordinate a Tytus mission.";
    q(!0);
    try {
      const R = await e.missions.create({
        title: `Atomek Control Tower — ${(/* @__PURE__ */ new Date()).toLocaleString()}`,
        goal: g
      }), K = {
        missionId: R.missionId,
        title: R.title,
        goal: R.goal,
        rootPath: R.rootPath,
        name: R.rootPath.split("/").pop() || R.missionId,
        source: "tray"
      }, le = {
        ts: (/* @__PURE__ */ new Date()).toISOString(),
        kind: "mission.control.created",
        message: "Mission created from Atomek Control Tower home",
        data: { resourceCount: h?.resources.length ?? 0 }
      };
      await e.missions.write({
        rootPath: R.rootPath,
        files: [
          { path: "MISSION.md", content: Bt(K, h, null, [], g) },
          { path: "MISSION.json", content: ba(K, h, g) },
          { path: "RESOURCES.md", content: Wt(h) },
          { path: "TASKS.md", content: pa(Qe(g, h)) },
          { path: "HANDOFF.md", content: fa(K) },
          { path: "INBOX.md", content: `# Mission inbox

Drop incoming agent notes, pod outputs, and shared-folder discoveries here.
` },
          { path: "OUTBOX.md", content: `# Mission outbox

Approved handoffs, final artifacts, and user-ready summaries go here.
` },
          { path: "AUDIT.jsonl", content: `${JSON.stringify(le)}
` },
          { path: "NEXT.md", content: ["# Next actions", "", "- Pick resources for the mission.", "- Break goal into task cards.", "- Dispatch local/pod/app runs through Atomek.", "- Review approvals before applying outputs.", ""].join(`
`) }
        ]
      }), J(R), Ye(R), s(`Mission created: ${R.rootPath}`), d();
    } catch (R) {
      s(`Mission create failed: ${R instanceof Error ? R.message : String(R)}`);
    } finally {
      q(!1);
    }
  }, [f, h, e.missions, d, s]), _ = Yi(h), X = Qi(h), oe = h?.warnings ?? [], ye = Qe(f, h);
  return /* @__PURE__ */ l("div", { className: "workbench-welcome workbench-control-home", children: [
    /* @__PURE__ */ l("section", { className: "workbench-control-hero-main", children: [
      /* @__PURE__ */ a("div", { className: "workbench-control-kicker", children: "Tytus Control Tower" }),
      /* @__PURE__ */ a("h1", { children: "Coordinate missions, not tabs." }),
      /* @__PURE__ */ a("p", { children: "Atomek connects Tytus pods, local agents, shared folders, app skills, AIL routes, chat, files, outputs, and approvals around one durable mission folder." }),
      /* @__PURE__ */ l("div", { className: "workbench-control-goal-row", children: [
        /* @__PURE__ */ a("textarea", { value: f, onChange: (g) => b(g.target.value), rows: 3, "aria-label": "Mission goal" }),
        /* @__PURE__ */ l("div", { className: "workbench-control-hero-actions", children: [
          /* @__PURE__ */ a("button", { className: "workbench-button-primary", onClick: () => {
            ee();
          }, disabled: B, children: "Start mission" }),
          /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: d, children: "Inspect resources" }),
          /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: p, children: "Open chat" })
        ] })
      ] }),
      U ? /* @__PURE__ */ l("div", { className: "workbench-control-success", children: [
        "Mission ready: ",
        /* @__PURE__ */ a("code", { children: U.rootPath })
      ] }) : null,
      Z ? /* @__PURE__ */ a("div", { className: "workbench-inline-error", children: Z }) : null
    ] }),
    /* @__PURE__ */ l("section", { className: "workbench-control-grid", children: [
      /* @__PURE__ */ l("article", { className: "workbench-control-card wide", children: [
        /* @__PURE__ */ l("header", { children: [
          /* @__PURE__ */ a("strong", { children: "Available now" }),
          /* @__PURE__ */ l("button", { className: "workbench-button-subtle", onClick: () => {
            H();
          }, disabled: B, children: [
            /* @__PURE__ */ a(Xe, { size: 13 }),
            " ",
            B ? "Refreshing…" : "Refresh"
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "workbench-control-metrics", children: _.map((g) => /* @__PURE__ */ l("div", { className: "workbench-control-metric", children: [
          /* @__PURE__ */ a("strong", { children: g.value }),
          /* @__PURE__ */ a("span", { children: g.label }),
          /* @__PURE__ */ a("em", { children: g.detail })
        ] }, g.label)) })
      ] }),
      /* @__PURE__ */ l("article", { className: "workbench-control-card", children: [
        /* @__PURE__ */ a("header", { children: /* @__PURE__ */ a("strong", { children: "First missions" }) }),
        /* @__PURE__ */ a("button", { className: "workbench-control-preset", onClick: () => b("Review this repo with local OpenCode/Claude, then ask Codex or pi for an independent review. Save all transcripts and proposed patches in the mission folder."), children: "Review + patch repo" }),
        /* @__PURE__ */ a("button", { className: "workbench-control-preset", onClick: () => b("Use Hermes/OpenClaw pod for planning or copy, then a local agent for implementation. Keep shared context in the mission folder and approval-gate all edits."), children: "Pod + local agent" }),
        /* @__PURE__ */ a("button", { className: "workbench-control-preset", onClick: () => b("Coordinate creative output: script, audio, visuals, render assets, and final handoff through app skills and shared folders."), children: "Creative production" })
      ] }),
      /* @__PURE__ */ l("article", { className: "workbench-control-card", children: [
        /* @__PURE__ */ l("header", { children: [
          /* @__PURE__ */ a("strong", { children: "Resume" }),
          /* @__PURE__ */ a("span", { children: I.length ? `${I.length} missions` : "none yet" })
        ] }),
        I.length === 0 ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "Create a mission once; it stays in Tytus Home/Missions and can be resumed here." }) : null,
        I.slice(0, 4).map((g) => /* @__PURE__ */ l("button", { className: "workbench-control-preset", onClick: () => {
          Ye(g), d();
        }, title: g.rootPath, children: [
          g.title,
          /* @__PURE__ */ l("small", { children: [
            g.status ?? "active",
            " · ",
            g.taskCount ?? 0,
            " tasks · ",
            g.runCount ?? 0,
            " runs"
          ] })
        ] }, g.missionId))
      ] }),
      /* @__PURE__ */ l("article", { className: "workbench-control-card", children: [
        /* @__PURE__ */ a("header", { children: /* @__PURE__ */ a("strong", { children: "Workspace" }) }),
        /* @__PURE__ */ l("button", { className: "workbench-start-link", onClick: n, children: [
          /* @__PURE__ */ a(Kt, { size: 18 }),
          "Open workspace folder"
        ] }),
        /* @__PURE__ */ l("button", { className: "workbench-start-link", onClick: t, children: [
          /* @__PURE__ */ a(Fn, { size: 18 }),
          "Open file"
        ] }),
        /* @__PURE__ */ l("button", { className: "workbench-start-link", onClick: o, children: [
          /* @__PURE__ */ a(qt, { size: 18 }),
          "New mission note"
        ] }),
        r.length ? /* @__PURE__ */ l("div", { className: "workbench-control-recent", children: [
          /* @__PURE__ */ a("span", { children: "Recent" }),
          r.slice(0, 3).map((g) => /* @__PURE__ */ a("button", { onClick: () => i(g), children: g.name }, `${g.path}-${g.at}`))
        ] }) : null
      ] }),
      /* @__PURE__ */ l("article", { className: "workbench-control-card wide", children: [
        /* @__PURE__ */ l("header", { children: [
          /* @__PURE__ */ a("strong", { children: "Resource graph" }),
          /* @__PURE__ */ a("span", { children: h ? `${h.resources.length} discovered` : "not loaded" })
        ] }),
        /* @__PURE__ */ l("div", { className: "workbench-control-resource-list", children: [
          X.length === 0 ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No resource graph yet. Start Tytus tray beta30 or newer, then refresh." }) : null,
          X.map((g) => /* @__PURE__ */ l("div", { className: "workbench-control-resource", children: [
            /* @__PURE__ */ l("div", { children: [
              /* @__PURE__ */ a("strong", { children: g.label }),
              /* @__PURE__ */ l("span", { children: [
                g.kind,
                " · ",
                g.trustTier,
                " · ",
                g.capabilities.slice(0, 3).join(", ") || "status only"
              ] })
            ] }),
            /* @__PURE__ */ a("span", { className: `workbench-computer-pill ${g.status}`, children: g.status })
          ] }, g.id))
        ] }),
        oe.length ? /* @__PURE__ */ a("div", { className: "workbench-resource-warnings", children: oe.slice(0, 2).map((g) => /* @__PURE__ */ l("span", { children: [
          g.code,
          ": ",
          g.message
        ] }, `${g.code}-${g.resourceId ?? g.message}`)) }) : null
      ] }),
      /* @__PURE__ */ l("article", { className: "workbench-control-card wide", children: [
        /* @__PURE__ */ a("header", { children: /* @__PURE__ */ a("strong", { children: "Recommended task graph" }) }),
        /* @__PURE__ */ a("div", { className: "workbench-task-graph home", children: ye.map((g, R) => /* @__PURE__ */ l("button", { className: `workbench-task-card ${g.status}`, onClick: () => b(g.prompt), children: [
          /* @__PURE__ */ a("span", { children: R + 1 }),
          /* @__PURE__ */ a("strong", { children: g.title }),
          /* @__PURE__ */ a("em", { children: g.resourceHint })
        ] }, g.id)) })
      ] }),
      /* @__PURE__ */ l("article", { className: "workbench-control-card wide", children: [
        /* @__PURE__ */ a("header", { children: /* @__PURE__ */ a("strong", { children: "Control loop" }) }),
        /* @__PURE__ */ l("ol", { className: "workbench-control-loop", children: [
          /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ a("b", { children: "Mission" }),
            /* @__PURE__ */ a("span", { children: "Goal + shared context folder." })
          ] }),
          /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ a("b", { children: "Resources" }),
            /* @__PURE__ */ a("span", { children: "Pods, local agents, folders, app skills." })
          ] }),
          /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ a("b", { children: "Tasks" }),
            /* @__PURE__ */ a("span", { children: "Plan, implement, review, render, validate." })
          ] }),
          /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ a("b", { children: "Runs" }),
            /* @__PURE__ */ l("span", { children: [
              "Streams + transcripts saved under ",
              /* @__PURE__ */ a("code", { children: "runs/" }),
              "."
            ] })
          ] }),
          /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ a("b", { children: "Approvals" }),
            /* @__PURE__ */ a("span", { children: "Diffs/artifacts applied only after preview." })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function es({ files: e, query: t, setQuery: n, openWorkbenchFile: o, activeFileId: r }) {
  const i = re(() => ts(e, t), [e, t]), s = re(() => {
    const d = /* @__PURE__ */ new Map();
    return i.forEach((p) => d.set(p.file.id, [...d.get(p.file.id) ?? [], p])), Array.from(d.values()).slice(0, 50);
  }, [i]);
  return /* @__PURE__ */ l("aside", { className: "workbench-sidebar", children: [
    /* @__PURE__ */ a("div", { className: "workbench-sidebar-title", children: "SEARCH" }),
    /* @__PURE__ */ l("div", { className: "workbench-sidebar-scroll", children: [
      /* @__PURE__ */ a("input", { className: "workbench-input", value: t, onChange: (d) => n(d.target.value), placeholder: "Search files and text", autoFocus: !0 }),
      /* @__PURE__ */ l("div", { className: "workbench-section-title", children: [
        /* @__PURE__ */ a(ut, { size: 12 }),
        " Results"
      ] }),
      t.trim() ? s.length === 0 ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No matches." }) : s.map((d) => {
        const p = d[0].file;
        return /* @__PURE__ */ l("div", { className: "workbench-search-group", children: [
          /* @__PURE__ */ a(Zt, { file: p, active: p.id === r, onOpen: () => o(p) }),
          d.slice(0, 5).map((f) => /* @__PURE__ */ l("button", { className: "workbench-search-hit", onClick: () => o(p, f.lineNumber), title: f.line, children: [
            /* @__PURE__ */ a("span", { className: "workbench-search-line", children: f.lineNumber }),
            /* @__PURE__ */ a("span", { children: f.line })
          ] }, `${p.id}-${f.lineNumber}-${f.line}`)),
          d.length > 5 && /* @__PURE__ */ l("div", { className: "workbench-search-more", children: [
            "+",
            d.length - 5,
            " more matches"
          ] })
        ] }, p.id);
      }) : /* @__PURE__ */ a("p", { className: "workbench-muted", children: "Type to search filenames and text in the opened workspace." })
    ] })
  ] });
}
function ts(e, t) {
  const n = t.trim().toLowerCase();
  if (!n) return [];
  const o = [];
  return e.forEach((r) => {
    r.path.toLowerCase().includes(n) && o.push({ file: r, lineNumber: 1, line: r.path }), r.content.split(`
`).some((i, s) => i.toLowerCase().includes(n) ? (o.push({ file: r, lineNumber: s + 1, line: i.trim() || "(blank line)" }), o.length >= 200) : !1);
  }), o.slice(0, 200);
}
function ns(e) {
  const t = e.query.trim().toLowerCase(), n = e.files.slice(0, 80).map((r) => ({
    label: r.path,
    detail: `Open ${Hn(r.language)} file`,
    run: () => e.openWorkbenchFile(r)
  })), o = [...e.commands, ...n].filter((r) => !t || r.label.toLowerCase().includes(t) || r.detail.toLowerCase().includes(t)).slice(0, 12);
  return Q(() => {
    const r = (i) => {
      i.key === "Escape" && e.onClose();
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [e.onClose]), /* @__PURE__ */ a("div", { className: "workbench-command-overlay", role: "dialog", "aria-label": "Command Palette", children: /* @__PURE__ */ l("div", { className: "workbench-command-palette", children: [
    /* @__PURE__ */ a(
      "input",
      {
        className: "workbench-command-input",
        autoFocus: !0,
        value: e.query,
        onChange: (r) => e.setQuery(r.target.value),
        placeholder: "Type a command or file name...",
        onKeyDown: (r) => {
          r.key === "Enter" && o[0] && !o[0].disabled && (o[0].run(), e.onClose());
        }
      }
    ),
    /* @__PURE__ */ a("div", { className: "workbench-command-list", children: o.map((r) => /* @__PURE__ */ l(
      "button",
      {
        disabled: r.disabled,
        className: "workbench-command-item",
        onClick: () => {
          r.run(), e.onClose();
        },
        children: [
          /* @__PURE__ */ a("span", { children: r.label }),
          /* @__PURE__ */ a("small", { children: r.detail })
        ]
      },
      `${r.label}-${r.detail}`
    )) })
  ] }) });
}
function as({ content: e }) {
  const t = re(() => Kn(e), [e]);
  return /* @__PURE__ */ l("aside", { className: "workbench-markdown-preview", children: [
    /* @__PURE__ */ l("div", { className: "workbench-preview-title", children: [
      /* @__PURE__ */ a(Vt, { size: 13 }),
      " Preview"
    ] }),
    /* @__PURE__ */ a("div", { className: "workbench-preview-body", dangerouslySetInnerHTML: { __html: t } })
  ] });
}
function os(e) {
  const t = e.session ? Ii(e.session) : "pending";
  return /* @__PURE__ */ l("div", { className: "workbench-manual-check-panel", children: [
    /* @__PURE__ */ a("p", { className: "workbench-muted", children: "Terminal is parked. Atomek never executes host commands here; copy a command, run it yourself, then paste the result." }),
    e.session ? /* @__PURE__ */ l(De, { children: [
      /* @__PURE__ */ l("div", { className: "workbench-manual-check-head", children: [
        /* @__PURE__ */ a("strong", { children: "Manual edit-check loop" }),
        /* @__PURE__ */ a("span", { className: `workbench-check-status ${t}`, children: t }),
        /* @__PURE__ */ a("small", { children: e.session.reason })
      ] }),
      /* @__PURE__ */ l("div", { className: "workbench-manual-check-grid", children: [
        /* @__PURE__ */ l("section", { children: [
          /* @__PURE__ */ a("label", { children: "Check commands" }),
          e.session.commands.length === 0 ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No project check scripts detected from open files. Add the command you want to run." }) : null,
          /* @__PURE__ */ a("div", { className: "workbench-check-command-list", children: e.session.commands.map((n) => /* @__PURE__ */ l(
            "button",
            {
              className: e.selectedCommand === n.command ? "active" : "",
              onClick: () => e.setSelectedCommand(n.command),
              title: n.path ?? n.source,
              children: [
                /* @__PURE__ */ a("span", { children: n.command }),
                /* @__PURE__ */ a("small", { children: n.source === "package-script" ? n.label : "manual" })
              ]
            },
            n.id
          )) }),
          /* @__PURE__ */ l("div", { className: "workbench-check-add-row", children: [
            /* @__PURE__ */ a(
              "input",
              {
                value: e.commandInput,
                onChange: (n) => e.setCommandInput(n.target.value),
                placeholder: "Add manual command to copy"
              }
            ),
            /* @__PURE__ */ a("button", { onClick: e.addCommand, disabled: !e.commandInput.trim(), children: "Add" })
          ] }),
          /* @__PURE__ */ a("button", { className: "workbench-button-primary", onClick: () => e.copyCommand(e.selectedCommand), disabled: !e.selectedCommand.trim(), children: "Copy selected command" })
        ] }),
        /* @__PURE__ */ l("section", { children: [
          /* @__PURE__ */ a("label", { children: "Paste result" }),
          /* @__PURE__ */ l("select", { value: e.status, onChange: (n) => e.setStatus(n.target.value), children: [
            /* @__PURE__ */ a("option", { value: "failed", children: "failed" }),
            /* @__PURE__ */ a("option", { value: "passed", children: "passed" }),
            /* @__PURE__ */ a("option", { value: "pending", children: "pending/manual note" })
          ] }),
          /* @__PURE__ */ a(
            "textarea",
            {
              value: e.outputInput,
              onChange: (n) => e.setOutputInput(n.target.value),
              placeholder: "Paste stdout/stderr or a short manual QA note. Nothing runs in Atomek.",
              rows: 6
            }
          ),
          /* @__PURE__ */ l("div", { className: "workbench-check-actions", children: [
            /* @__PURE__ */ a("button", { onClick: e.recordResult, disabled: !e.selectedCommand.trim(), children: "Capture result" }),
            /* @__PURE__ */ a("button", { className: "workbench-button-primary", onClick: e.askAgent, disabled: e.session.results.length === 0, children: "Ask Atomek to continue" })
          ] })
        ] })
      ] }),
      e.session.results.length > 0 ? /* @__PURE__ */ l("div", { className: "workbench-check-results", children: [
        /* @__PURE__ */ a("label", { children: "Captured results" }),
        e.session.results.map((n, o) => /* @__PURE__ */ l("article", { children: [
          /* @__PURE__ */ a("strong", { children: n.command }),
          /* @__PURE__ */ a("span", { className: `workbench-check-status ${n.status}`, children: n.status }),
          /* @__PURE__ */ a("pre", { children: n.output || "(no output pasted)" })
        ] }, `${n.capturedAt}-${o}`))
      ] }) : null
    ] }) : /* @__PURE__ */ a("pre", { className: "workbench-terminal-placeholder", children: "$ open the command palette and run Checks: Open Manual Check Panel" })
  ] });
}
function rs(e) {
  return /* @__PURE__ */ l("section", { className: "workbench-bottom-panel", "aria-label": "Panel", children: [
    /* @__PURE__ */ l("div", { className: "workbench-bottom-tabs", children: [
      /* @__PURE__ */ a("button", { className: e.tab === "problems" ? "active" : "", onClick: () => e.setTab("problems"), children: "PROBLEMS" }),
      /* @__PURE__ */ a("button", { className: e.tab === "output" ? "active" : "", onClick: () => e.setTab("output"), children: "OUTPUT" }),
      /* @__PURE__ */ a("button", { className: e.tab === "terminal" ? "active" : "", onClick: () => e.setTab("terminal"), children: "TERMINAL" }),
      /* @__PURE__ */ a("span", {}),
      /* @__PURE__ */ a("button", { title: "Close Panel", onClick: e.onClose, children: /* @__PURE__ */ a(we, { size: 14 }) })
    ] }),
    /* @__PURE__ */ l("div", { className: "workbench-bottom-body", children: [
      e.tab === "problems" && /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No problems detected in open files. Diagnostics wire in after the base shell is approved." }),
      e.tab === "terminal" && /* @__PURE__ */ a(
        os,
        {
          session: e.manualCheckSession,
          commandInput: e.manualCheckCommandInput,
          setCommandInput: e.setManualCheckCommandInput,
          outputInput: e.manualCheckOutputInput,
          setOutputInput: e.setManualCheckOutputInput,
          selectedCommand: e.manualCheckSelectedCommand,
          setSelectedCommand: e.setManualCheckSelectedCommand,
          status: e.manualCheckStatus,
          setStatus: e.setManualCheckStatus,
          copyCommand: e.copyManualCheckCommand,
          addCommand: e.addManualCheckCommand,
          recordResult: e.recordManualCheckResult,
          askAgent: e.askAgentFromManualChecks
        }
      ),
      e.tab === "output" && /* @__PURE__ */ a(va, { outputs: e.outputs, clearOutputs: e.clearOutputs, deleteArtifact: e.deleteArtifact, runAiSynthesis: e.runAiSynthesis, captureManualCheck: e.captureManualCheck, openOutputAsFile: e.openOutputAsFile, compact: !0 })
    ] })
  ] });
}
function is(e) {
  return /* @__PURE__ */ l("aside", { className: "workbench-secondary", children: [
    /* @__PURE__ */ a("div", { className: "workbench-secondary-resizer", onPointerDown: e.onResizeStart, title: "Resize Chat" }),
    /* @__PURE__ */ l("div", { className: "workbench-secondary-tabs", children: [
      /* @__PURE__ */ l("div", { className: "workbench-secondary-tab-group", children: [
        /* @__PURE__ */ a("button", { className: `workbench-secondary-tab ${e.tab === "chat" ? "active" : ""}`, onClick: () => e.setTab("chat"), children: "CHAT" }),
        /* @__PURE__ */ a("button", { className: `workbench-secondary-tab ${e.tab === "agents" ? "active" : ""}`, onClick: () => e.setTab("agents"), children: "AGENTS" }),
        /* @__PURE__ */ a("button", { className: `workbench-secondary-tab ${e.tab === "outputs" ? "active" : ""}`, onClick: () => e.setTab("outputs"), children: "OUTPUTS" })
      ] }),
      /* @__PURE__ */ l("div", { className: "workbench-secondary-actions", children: [
        /* @__PURE__ */ a("button", { title: "New Chat", onClick: e.newChat, children: /* @__PURE__ */ a(Io, { size: 15 }) }),
        /* @__PURE__ */ a("button", { title: "Chat Settings", onClick: e.openSettings, children: /* @__PURE__ */ a(mo, { size: 16 }) }),
        /* @__PURE__ */ a("button", { title: "Close Chat", onClick: e.onClose, children: /* @__PURE__ */ a(we, { size: 15 }) })
      ] })
    ] }),
    e.tab === "chat" ? /* @__PURE__ */ a(ss, { ...e }) : e.tab === "agents" ? /* @__PURE__ */ a(
      Ca,
      {
        host: e.host,
        setStatus: e.setStatus,
        attachSkillToChat: e.attachSkillToChat,
        saveLocalJobOutput: e.saveLocalJobOutput,
        activeFile: e.activeFile,
        openEditors: e.openEditors,
        variant: "dock"
      }
    ) : /* @__PURE__ */ a(va, { outputs: e.outputs, clearOutputs: e.clearOutputs, deleteArtifact: e.deleteArtifact, runAiSynthesis: e.runAiSynthesis, captureManualCheck: e.captureManualCheck, openOutputAsFile: e.openOutputAsFile, previewEditFromOutput: e.previewEditFromOutput, canPreviewEdit: e.canPreviewEdit })
  ] });
}
function wa({ body: e }) {
  const t = re(() => zi(e), [e]), [n, o] = v(null), r = y((i, s) => {
    (async () => await Ze(s) && (o(i), window.setTimeout(() => o((p) => p === i ? null : p), 1200)))();
  }, []);
  return /* @__PURE__ */ a("div", { className: "workbench-rich-body", children: t.map((i) => {
    if (i.type === "code") {
      const s = n === i.key;
      return /* @__PURE__ */ l("div", { className: "workbench-rich-code", children: [
        /* @__PURE__ */ l("div", { className: "workbench-rich-code-head", children: [
          /* @__PURE__ */ a("span", { children: i.language }),
          /* @__PURE__ */ l("button", { onClick: () => r(i.key, i.body), title: "Copy code block", children: [
            s ? /* @__PURE__ */ a(io, { size: 12 }) : /* @__PURE__ */ a(jt, { size: 12 }),
            s ? "Copied" : "Copy"
          ] })
        ] }),
        /* @__PURE__ */ a("pre", { children: /* @__PURE__ */ a("code", { children: i.body }) })
      ] }, i.key);
    }
    return /* @__PURE__ */ a(
      "div",
      {
        className: "workbench-rich-markdown",
        dangerouslySetInnerHTML: { __html: Kn(i.body) }
      },
      i.key
    );
  }) });
}
function ss(e) {
  const t = e.chatInput.trim().length > 0 && !e.busy, n = ze(null), [o, r] = v(!0), [i, s] = v(!1), d = re(() => e.chatMessages.map((h) => `${h.id}:${h.status ?? ""}:${h.body.length}`).join("|"), [e.chatMessages]);
  Q(() => {
    const h = n.current;
    h && (o ? (h.scrollTop = h.scrollHeight, s(!1)) : s(!0));
  }, [o, d]);
  const p = y(() => {
    const h = n.current;
    if (!h) return;
    const I = h.scrollHeight - h.scrollTop - h.clientHeight < 48;
    r(I), I && s(!1);
  }, []), f = y(() => {
    const h = n.current;
    h && (h.scrollTop = h.scrollHeight, r(!0), s(!1));
  }, []), b = y((h) => {
    Ze(h.body);
  }, []);
  return /* @__PURE__ */ l("div", { className: "workbench-chat-wrap", children: [
    /* @__PURE__ */ l("div", { className: "workbench-chat-threadbar", children: [
      /* @__PURE__ */ l(
        "select",
        {
          value: e.chatThread?.id ?? "",
          onChange: (h) => e.selectThread(h.target.value),
          disabled: e.busy || e.chatThreads.length === 0,
          title: "Select chat thread",
          children: [
            e.chatThreads.length === 0 ? /* @__PURE__ */ a("option", { value: "", children: "No chats" }) : null,
            e.chatThreads.map((h) => /* @__PURE__ */ l("option", { value: h.id, children: [
              h.title,
              " · ",
              cs(h.lastMessageAt ?? h.updatedAt)
            ] }, h.id))
          ]
        }
      ),
      /* @__PURE__ */ a(
        "button",
        {
          onClick: () => {
            if (!e.chatThread) return;
            const h = window.prompt("Rename chat", e.chatThread.title);
            h !== null && e.renameThread(e.chatThread.id, h);
          },
          disabled: !e.chatThread || e.busy,
          children: "Rename"
        }
      ),
      /* @__PURE__ */ a(
        "button",
        {
          onClick: () => {
            e.chatThread && window.confirm(`Delete chat "${e.chatThread.title}"?`) && e.deleteThread(e.chatThread.id);
          },
          disabled: !e.chatThread || e.busy,
          children: "Delete"
        }
      )
    ] }),
    /* @__PURE__ */ l("div", { ref: n, className: "workbench-chat-transcript", onScroll: p, children: [
      e.chatMessages.length === 0 ? /* @__PURE__ */ a("div", { className: "workbench-chat-empty", children: /* @__PURE__ */ l("div", { children: [
        /* @__PURE__ */ a($o, { size: 48 }),
        /* @__PURE__ */ a("h3", { children: "Build with Agent" }),
        /* @__PURE__ */ a("p", { children: "Ask about open files, request a plan, or draft an artifact." }),
        /* @__PURE__ */ a("p", { className: "workbench-chat-empty-link", children: e.aiStatus.available ? e.aiStatus.label : e.aiStatus.reason ?? e.aiStatus.label })
      ] }) }) : e.chatMessages.map((h) => /* @__PURE__ */ l("div", { className: `workbench-chat-message ${h.role}`, children: [
        /* @__PURE__ */ a("strong", { children: h.role === "user" ? "You" : "Atomek" }),
        h.status === "streaming" ? /* @__PURE__ */ a("em", { children: " streaming" }) : null,
        h.status === "error" ? /* @__PURE__ */ a("em", { children: " error" }) : null,
        /* @__PURE__ */ a("br", {}),
        /* @__PURE__ */ a(wa, { body: h.body }),
        h.gatewayLabel ? /* @__PURE__ */ l(De, { children: [
          /* @__PURE__ */ a("br", {}),
          /* @__PURE__ */ a("small", { children: h.gatewayLabel })
        ] }) : null,
        h.role === "assistant" && h.status !== "streaming" && h.status !== "error" ? /* @__PURE__ */ l("div", { className: "workbench-chat-message-actions", children: [
          /* @__PURE__ */ l("button", { className: "workbench-chat-message-action", onClick: () => b(h), title: "Copy this answer", children: [
            /* @__PURE__ */ a(jt, { size: 12 }),
            " Copy"
          ] }),
          /* @__PURE__ */ l("button", { className: "workbench-chat-message-action", onClick: () => e.saveMessageAsArtifact(h), title: "Save this answer as an output artifact", children: [
            /* @__PURE__ */ a(qt, { size: 12 }),
            " Save"
          ] }),
          /* @__PURE__ */ l("button", { className: "workbench-chat-message-action", onClick: () => e.rememberMessage(h), title: "Store this answer in Atomek memory", children: [
            /* @__PURE__ */ a(Dn, { size: 12 }),
            " Remember"
          ] }),
          /* @__PURE__ */ l("button", { className: "workbench-chat-message-action", onClick: () => e.previewEditFromMessage(h), disabled: e.workspaceFileCount === 0, title: "Preview an editable patch from this answer", children: [
            /* @__PURE__ */ a(Vt, { size: 12 }),
            " Preview"
          ] }),
          /* @__PURE__ */ l("button", { className: "workbench-chat-message-action regen", onClick: () => e.regenerateMessage(h), disabled: e.busy, title: "Regenerate this answer", children: [
            /* @__PURE__ */ a(Xe, { size: 12 }),
            " Regenerate"
          ] })
        ] }) : null,
        h.role === "assistant" && h.status === "error" ? /* @__PURE__ */ l("div", { className: "workbench-chat-message-actions", children: [
          /* @__PURE__ */ l("button", { className: "workbench-chat-message-action", onClick: () => b(h), title: "Copy this error", children: [
            /* @__PURE__ */ a(jt, { size: 12 }),
            " Copy"
          ] }),
          /* @__PURE__ */ l("button", { className: "workbench-chat-message-action regen", onClick: () => e.regenerateMessage(h), disabled: e.busy, children: [
            /* @__PURE__ */ a(Xe, { size: 12 }),
            " Retry"
          ] })
        ] }) : null
      ] }, h.id)),
      i ? /* @__PURE__ */ a("button", { className: "workbench-chat-jump", onClick: f, children: "Jump to latest" }) : null
    ] }),
    /* @__PURE__ */ l("div", { className: "workbench-chat-composer", children: [
      /* @__PURE__ */ l("div", { className: "workbench-chat-tip", children: [
        /* @__PURE__ */ a("span", { children: "Context" }),
        /* @__PURE__ */ a("strong", { children: ar(e.contextScope) }),
        /* @__PURE__ */ a("em", { children: In(e.chatSettings, e.aiStatus.label, e.memoryHitCount) })
      ] }),
      /* @__PURE__ */ l("div", { className: "workbench-chat-box", children: [
        /* @__PURE__ */ l("div", { className: "workbench-chat-attachments", children: [
          /* @__PURE__ */ l(
            "select",
            {
              className: "workbench-chat-context-select",
              value: e.contextScope,
              onChange: (h) => e.setContextScope(h.target.value),
              disabled: e.busy,
              title: "Context scope for next message",
              children: [
                /* @__PURE__ */ a("option", { value: "none", children: "No context" }),
                /* @__PURE__ */ a("option", { value: "active-selection", children: "Selection" }),
                /* @__PURE__ */ a("option", { value: "active-file", children: "Active file" }),
                /* @__PURE__ */ a("option", { value: "open-editors", children: "Open editors" }),
                /* @__PURE__ */ a("option", { value: "indexed-project", children: "Indexed project" })
              ]
            }
          ),
          e.contextScope === "indexed-project" ? /* @__PURE__ */ l(De, { children: [
            /* @__PURE__ */ l("button", { className: "workbench-chat-chip-button", onClick: e.refreshProjectIndex, disabled: e.busy, children: [
              /* @__PURE__ */ a(Xe, { size: 12 }),
              " Index"
            ] }),
            /* @__PURE__ */ l("span", { className: `workbench-chat-chip ${e.projectIndexStale ? "warn" : "muted"}`, title: "Project index used for query-scoped retrieval", children: [
              /* @__PURE__ */ a(ut, { size: 13 }),
              " ",
              e.projectIndexSummary,
              e.projectIndexStale ? " · stale" : ""
            ] })
          ] }) : null,
          e.contextAttachments.length === 0 ? /* @__PURE__ */ l("span", { className: "workbench-chat-chip muted", children: [
            /* @__PURE__ */ a(bn, { size: 13 }),
            " No file context"
          ] }) : e.contextAttachments.map((h) => {
            const w = typeof h.score == "number" ? h.score.toFixed(2) : null, I = typeof h.vectorScore == "number" ? h.vectorScore.toFixed(2) : null, T = typeof h.keywordScore == "number" ? h.keywordScore.toFixed(1) : null, B = [
              h.path,
              h.range ? `${h.range.startLineNumber}:${h.range.startColumn}-${h.range.endLineNumber}:${h.range.endColumn}` : null,
              w ? `score ${w}` : null,
              I ? `vector ${I}` : null,
              T ? `keyword ${T}` : null,
              h.snippet,
              h.dirty ? "dirty" : null
            ].filter(Boolean).join(" · ");
            return /* @__PURE__ */ l("span", { className: "workbench-chat-chip", title: B, children: [
              /* @__PURE__ */ a("button", { className: "workbench-chat-chip-open", onClick: () => e.revealContextAttachment(h), disabled: !h.fileId, title: "Reveal context", children: /* @__PURE__ */ a(bn, { size: 13 }) }),
              h.label,
              w ? /* @__PURE__ */ a("small", { children: w }) : null,
              h.snippet ? /* @__PURE__ */ l("small", { children: [
                h.snippet.slice(0, 60),
                h.snippet.length > 60 ? "…" : ""
              ] }) : null,
              h.dirty ? /* @__PURE__ */ a("small", { children: "dirty" }) : null,
              h.removable ? /* @__PURE__ */ a("button", { className: "workbench-chat-chip-remove", onClick: () => e.removeContextAttachment(h), title: "Remove context", children: /* @__PURE__ */ a(we, { size: 11 }) }) : null
            ] }, h.id);
          }),
          /* @__PURE__ */ a("button", { className: "workbench-chat-chip-button", onClick: () => e.runQuickPrompt("explain"), disabled: !e.activeFile || e.busy, children: "Explain" }),
          /* @__PURE__ */ a("button", { className: "workbench-chat-chip-button", onClick: () => e.runQuickPrompt("improve"), disabled: !e.activeFile || e.busy, children: "Improve" }),
          /* @__PURE__ */ a("button", { className: "workbench-chat-chip-button", onClick: () => e.runQuickPrompt("edit"), disabled: !e.activeFile || e.busy, children: "Edit" }),
          /* @__PURE__ */ a("button", { className: "workbench-chat-chip-button", onClick: () => e.runQuickPrompt("draft"), disabled: e.busy, children: "Draft" })
        ] }),
        e.pendingPatchPrompt ? /* @__PURE__ */ a("button", { className: "workbench-chat-generate-patch", onClick: e.generatePatchPrompt, disabled: e.busy, children: "Generate patch for last edit request" }) : null,
        /* @__PURE__ */ a(
          "textarea",
          {
            className: "workbench-chat-textarea",
            value: e.chatInput,
            onChange: (h) => e.setChatInput(h.target.value),
            onKeyDown: (h) => {
              h.key === "Enter" && !h.shiftKey && (h.preventDefault(), e.busy || e.askAgent());
            },
            placeholder: "Ask Atomek about the open file or describe what to build...",
            rows: 3
          }
        ),
        /* @__PURE__ */ l("div", { className: "workbench-chat-toolbar compact", children: [
          /* @__PURE__ */ a("span", { className: "workbench-chat-route-summary", children: In(e.chatSettings, e.aiStatus.label, e.memoryHitCount) }),
          /* @__PURE__ */ a("span", {}),
          e.busy ? /* @__PURE__ */ a("button", { className: "workbench-chat-send stop", onClick: e.stopChat, title: "Stop", children: /* @__PURE__ */ a(Do, { size: 14 }) }) : /* @__PURE__ */ a("button", { className: `workbench-chat-send ${t ? "ready" : ""}`, onClick: e.askAgent, title: "Send", disabled: !t, "aria-label": "Send message", children: /* @__PURE__ */ a(Oo, { size: 16 }) })
        ] })
      ] })
    ] })
  ] });
}
function ya(e) {
  return e === "remote" ? "Remote AIL" : e === "local" ? "Local AIL" : "Auto";
}
function In(e, t, n) {
  const o = e.model.trim(), i = [e.gatewayPreference === "auto" ? t : ya(e.gatewayPreference)];
  return o && i.push(o), n > 0 && i.push(`${n} memories`), i.join(" · ");
}
function cs(e) {
  return !Number.isFinite(e) || e <= 0 ? "new" : new Date(e).toLocaleString(void 0, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function Mn(e) {
  return /```(?:diff|patch)\b/i.test(e) || /^diff --git /m.test(e) || /^--- .+\n\+\+\+ /m.test(e) || /```[\w.+-]*\s*\n[\s\S]{80,}```/.test(e);
}
function ls(e) {
  return /\b(change|edit|modify|replace|update|rename|fix|rewrite|apply)\b/i.test(e) && /\b(file|code|author|title|line|function|component|content|text|this|it)\b/i.test(e);
}
function ds(e) {
  return [
    e,
    "Atomek edit instruction: if this request should change an open file, return an applicable git-style unified diff in a fenced diff block. Use paths exactly as shown in the attached context. If one whole-file replacement is safer, return a fenced atomek-replace block. Do not claim a file changed unless you provide a patch/replacement Atomek can preview."
  ].join(`

`);
}
function hs(e) {
  const [t, n] = v([]), [o, r] = v("Loading gateway models…"), [i, s] = v([]), [d, p] = v("Checking embedding capability…");
  Q(() => {
    const w = new AbortController();
    return (async () => {
      if (!e.host.ai?.listModels) {
        n([]), r("This Tytus build does not expose model discovery yet.");
        return;
      }
      r("Loading gateway models…");
      try {
        const T = await e.host.ai.listModels({
          gatewayPreference: e.chatSettings.gatewayPreference,
          signal: w.signal
        });
        if (w.signal.aborted) return;
        n(T.map((B) => ({ id: B.id, gatewayLabel: B.gatewayLabel }))), r(T.length > 0 ? `${T.length} models discovered from AIL.` : "No models discovered. You can still enter any AIL alias manually.");
      } catch (T) {
        if (w.signal.aborted) return;
        n([]), r(`Model discovery failed: ${T instanceof Error ? T.message : String(T)}`);
      }
    })(), () => w.abort();
  }, [e.chatSettings.gatewayPreference, e.host.ai]), Q(() => {
    const w = new AbortController();
    return (async () => {
      const T = vi(e.host);
      if (T) {
        s([]), p(T);
        return;
      }
      p("Loading embedding-capable models from AIL…");
      try {
        const B = await yi(e.host, {
          gatewayPreference: e.chatSettings.gatewayPreference,
          signal: w.signal
        });
        if (w.signal.aborted) return;
        s(B.map((q) => ({ id: q.id, gatewayLabel: q.gatewayLabel ?? q.source ?? "AIL" }))), p(B.length > 0 ? `${B.length} embedding models discovered from AIL metadata.` : "AIL embedding API is present, but no embedding-capable model metadata was returned.");
      } catch (B) {
        if (w.signal.aborted) return;
        s([]), p(`Embedding model discovery failed: ${B instanceof Error ? B.message : String(B)}`);
      }
    })(), () => w.abort();
  }, [e.chatSettings.gatewayPreference, e.host]);
  const f = (w) => {
    e.onChange({ ...e.chatSettings, gatewayPreference: w });
  }, b = (w) => {
    e.onChange({ ...e.chatSettings, model: w });
  }, h = (w) => {
    e.onChange({ ...e.chatSettings, embeddingModel: w });
  };
  return /* @__PURE__ */ a("div", { className: "workbench-settings-tab", children: /* @__PURE__ */ l("section", { className: "workbench-settings-page", "aria-label": "Atomek Settings", children: [
    /* @__PURE__ */ l("header", { className: "workbench-settings-header", children: [
      /* @__PURE__ */ a(zn, { size: 15 }),
      /* @__PURE__ */ a("strong", { children: "Atomek Settings" }),
      /* @__PURE__ */ a("button", { onClick: e.onClose, title: "Close", children: /* @__PURE__ */ a(we, { size: 15 }) })
    ] }),
    /* @__PURE__ */ l("div", { className: "workbench-settings-body", children: [
      /* @__PURE__ */ l("div", { className: "workbench-settings-section", children: [
        /* @__PURE__ */ a("h3", { children: "Chat AI routing" }),
        /* @__PURE__ */ a("p", { children: "Choose which AIL gateway Atomek uses. Model names are not hardcoded here: enter an AIL alias/model from your global gateway config, or leave it empty for the gateway default." }),
        /* @__PURE__ */ l("label", { className: "workbench-settings-label", children: [
          "Gateway",
          /* @__PURE__ */ l(
            "select",
            {
              value: e.chatSettings.gatewayPreference,
              onChange: (w) => f(w.target.value),
              children: [
                /* @__PURE__ */ a("option", { value: "auto", children: "Auto failover" }),
                /* @__PURE__ */ a("option", { value: "remote", children: "Remote Tytus AIL only" }),
                /* @__PURE__ */ a("option", { value: "local", children: "Local AIL only" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ l("label", { className: "workbench-settings-label", children: [
          "Chat model alias",
          /* @__PURE__ */ a(
            "input",
            {
              value: e.chatSettings.model,
              onChange: (w) => b(w.target.value),
              list: "atomek-chat-models",
              placeholder: "Empty = AIL default/global alias",
              spellCheck: !1
            }
          ),
          /* @__PURE__ */ a("datalist", { id: "atomek-chat-models", children: t.map((w) => /* @__PURE__ */ a("option", { value: w.id, children: w.gatewayLabel }, `${w.gatewayLabel}:${w.id}`)) })
        ] }),
        /* @__PURE__ */ l("div", { className: "workbench-settings-note", children: [
          "Current request: ",
          ya(e.chatSettings.gatewayPreference),
          e.chatSettings.model.trim() ? ` · ${e.chatSettings.model.trim()}` : " · gateway default"
        ] }),
        /* @__PURE__ */ a("div", { className: "workbench-settings-note", children: o })
      ] }),
      /* @__PURE__ */ l("div", { className: "workbench-settings-section", children: [
        /* @__PURE__ */ a("h3", { children: "Project context / embeddings" }),
        /* @__PURE__ */ a("p", { children: "Atomek keeps retrieval model selection dynamic. Leave empty for AIL global defaults, or pin an AIL embedding alias exposed by your gateway." }),
        /* @__PURE__ */ l("label", { className: "workbench-settings-label", children: [
          "Embedding model alias",
          /* @__PURE__ */ a(
            "input",
            {
              value: e.chatSettings.embeddingModel,
              onChange: (w) => h(w.target.value),
              list: "atomek-embedding-models",
              placeholder: "Empty = AIL embedding default/global alias",
              spellCheck: !1
            }
          ),
          /* @__PURE__ */ a("datalist", { id: "atomek-embedding-models", children: i.map((w) => /* @__PURE__ */ a("option", { value: w.id, children: w.gatewayLabel }, `${w.gatewayLabel}:${w.id}`)) })
        ] }),
        /* @__PURE__ */ a("div", { className: "workbench-settings-note", children: e.chatSettings.embeddingModel.trim() ? `Embedding alias: ${e.chatSettings.embeddingModel.trim()}` : "Embedding alias: gateway default" }),
        /* @__PURE__ */ a("div", { className: "workbench-settings-note", children: d })
      ] })
    ] }),
    /* @__PURE__ */ l("footer", { className: "workbench-settings-footer", children: [
      /* @__PURE__ */ a("button", { onClick: () => e.onChange(dt), children: "Reset" }),
      /* @__PURE__ */ a("button", { onClick: e.onClose, children: "Close tab" })
    ] })
  ] }) });
}
function va({ outputs: e, clearOutputs: t, deleteArtifact: n, runAiSynthesis: o, captureManualCheck: r, openOutputAsFile: i, previewEditFromOutput: s, canPreviewEdit: d = !1, compact: p = !1 }) {
  return /* @__PURE__ */ l("div", { className: `workbench-panel-list ${p ? "compact" : ""}`, children: [
    /* @__PURE__ */ l("div", { style: { display: "flex", gap: 8, marginBottom: 10 }, children: [
      /* @__PURE__ */ l("button", { className: "workbench-button-subtle", onClick: o, children: [
        /* @__PURE__ */ a(Ut, { size: 14 }),
        "AI synthesis"
      ] }),
      /* @__PURE__ */ l("button", { className: "workbench-button-subtle", onClick: r, children: [
        /* @__PURE__ */ a(En, { size: 14 }),
        "Capture check"
      ] }),
      /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: t, children: "Clear" })
    ] }),
    e.length === 0 ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No outputs yet. Save an AI answer as an artifact or create an AI synthesis." }) : e.map((f) => /* @__PURE__ */ l("div", { className: "workbench-output-card", children: [
      /* @__PURE__ */ l("div", { className: "workbench-output-head", children: [
        /* @__PURE__ */ a("strong", { children: f.title }),
        /* @__PURE__ */ a("span", { children: f.source === "ai" ? `AI · ${f.kind}` : f.kind }),
        /* @__PURE__ */ a("button", { onClick: () => void Ze(f.body), children: "Copy" }),
        /* @__PURE__ */ a("button", { onClick: () => i(f), children: "Open as file" }),
        s ? /* @__PURE__ */ a(
          "button",
          {
            className: Mn(f.body) ? "workbench-output-edit-cta" : void 0,
            onClick: () => s(f),
            disabled: !d,
            children: Mn(f.body) ? "Preview/apply edit" : "Preview edit"
          }
        ) : null,
        f.source === "ai" ? /* @__PURE__ */ a("button", { onClick: () => n(f.id), children: "Delete" }) : null
      ] }),
      /* @__PURE__ */ a(wa, { body: f.body })
    ] }, f.id))
  ] });
}
function us({ edit: e, onApply: t, onOpenAsFile: n, onClose: o }) {
  return /* @__PURE__ */ a("div", { className: "workbench-edit-review-overlay", role: "dialog", "aria-label": "Review AI edit", children: /* @__PURE__ */ l("section", { className: "workbench-edit-review", children: [
    /* @__PURE__ */ l("header", { className: "workbench-edit-review-head", children: [
      /* @__PURE__ */ l("div", { children: [
        /* @__PURE__ */ a("strong", { children: "Review AI edit" }),
        /* @__PURE__ */ a("span", { children: e.fileName })
      ] }),
      /* @__PURE__ */ a("button", { title: "Close", onClick: o, children: /* @__PURE__ */ a(we, { size: 16 }) })
    ] }),
    /* @__PURE__ */ l("div", { className: "workbench-edit-review-meta", children: [
      /* @__PURE__ */ l("span", { children: [
        "Source: ",
        e.sourceTitle
      ] }),
      /* @__PURE__ */ a("span", { children: e.extractionLabel }),
      /* @__PURE__ */ l("span", { children: [
        "+",
        e.stats.added,
        " / -",
        e.stats.removed,
        " / ~",
        e.stats.changed
      ] })
    ] }),
    /* @__PURE__ */ l("div", { className: "workbench-edit-review-grid", children: [
      /* @__PURE__ */ l("div", { className: "workbench-edit-review-pane", children: [
        /* @__PURE__ */ a("h4", { children: "Current" }),
        /* @__PURE__ */ a("pre", { children: e.originalContent })
      ] }),
      /* @__PURE__ */ l("div", { className: "workbench-edit-review-pane proposed", children: [
        /* @__PURE__ */ a("h4", { children: "Proposed" }),
        /* @__PURE__ */ a("pre", { children: e.proposedContent })
      ] })
    ] }),
    /* @__PURE__ */ l("footer", { className: "workbench-edit-review-actions", children: [
      /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: n, children: "Open proposed as file" }),
      /* @__PURE__ */ a("button", { className: "workbench-button-primary", onClick: t, children: "Apply to active file" })
    ] })
  ] }) });
}
function ms({ patch: e, onApply: t, onOpenAsFiles: n, onClose: o }) {
  const r = e.edits.reduce((i, s) => ({
    added: i.added + s.stats.added,
    removed: i.removed + s.stats.removed,
    changed: i.changed + s.stats.changed
  }), { added: 0, removed: 0, changed: 0 });
  return /* @__PURE__ */ a("div", { className: "workbench-edit-review-overlay", role: "dialog", "aria-label": "Review AI workspace patch", children: /* @__PURE__ */ l("section", { className: "workbench-edit-review workspace", children: [
    /* @__PURE__ */ l("header", { className: "workbench-edit-review-head", children: [
      /* @__PURE__ */ l("div", { children: [
        /* @__PURE__ */ a("strong", { children: "Review AI workspace patch" }),
        /* @__PURE__ */ a("span", { children: e.sourceTitle })
      ] }),
      /* @__PURE__ */ a("button", { title: "Close", onClick: o, children: /* @__PURE__ */ a(we, { size: 16 }) })
    ] }),
    /* @__PURE__ */ l("div", { className: "workbench-edit-review-meta", children: [
      /* @__PURE__ */ l("span", { children: [
        e.edits.length,
        " files"
      ] }),
      /* @__PURE__ */ l("span", { children: [
        "+",
        r.added,
        " / -",
        r.removed,
        " / ~",
        r.changed
      ] }),
      e.skipped.length > 0 ? /* @__PURE__ */ l("span", { children: [
        e.skipped.length,
        " skipped"
      ] }) : null
    ] }),
    /* @__PURE__ */ l("div", { className: "workbench-workspace-patch-list", children: [
      e.edits.map((i) => /* @__PURE__ */ l("article", { className: "workbench-workspace-patch-card", children: [
        /* @__PURE__ */ l("header", { children: [
          /* @__PURE__ */ a("strong", { children: i.fileName }),
          /* @__PURE__ */ l("span", { children: [
            i.extractionLabel,
            " · +",
            i.stats.added,
            " / -",
            i.stats.removed,
            " / ~",
            i.stats.changed
          ] })
        ] }),
        /* @__PURE__ */ a("pre", { children: vs(i.proposedContent) })
      ] }, i.fileId)),
      e.skipped.length > 0 ? /* @__PURE__ */ l("article", { className: "workbench-workspace-patch-card skipped", children: [
        /* @__PURE__ */ l("header", { children: [
          /* @__PURE__ */ a("strong", { children: "Skipped" }),
          /* @__PURE__ */ a("span", { children: "Paths not open or hunks did not match" })
        ] }),
        /* @__PURE__ */ a("pre", { children: e.skipped.join(`
`) })
      ] }) : null
    ] }),
    /* @__PURE__ */ l("footer", { className: "workbench-edit-review-actions", children: [
      /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: n, children: "Open proposals as files" }),
      /* @__PURE__ */ a("button", { className: "workbench-button-primary", onClick: t, children: "Apply workspace patch" })
    ] })
  ] }) });
}
function ps(e, t = 9e3) {
  return e.length <= t ? e : `${e.slice(0, t)}

[Atomek clipped ${e.length - t} chars for local agent context]`;
}
function fs(e, t) {
  const n = [
    "Atomek local agent context:",
    "- You are being launched from Atomek, the TytusOS workspace/chat app.",
    "- Do not write files directly. Return findings, markdown, unified diffs, or fenced replacement blocks. Atomek previews edits before applying."
  ];
  if (e)
    n.push("", `Active file: ${e.path}`, `Language: ${e.language}`, `Dirty: ${e.dirty ? "yes" : "no"}`, "", "Active file content:", "```" + e.language, ps(e.content), "```");
  else if (t.length > 0) {
    n.push("", `Open editors (${t.length}):`);
    for (const o of t.slice(0, 8)) n.push(`- ${o.path} (${o.language}, ${o.content.length} chars${o.dirty ? ", dirty" : ""})`);
  } else
    n.push("", "No file is open. Ask clarifying questions only if the prompt cannot be answered safely.");
  return n.join(`
`);
}
function Pn(e) {
  if (!e?.path.startsWith("/")) return;
  const t = e.path.lastIndexOf("/");
  return t > 0 ? e.path.slice(0, t) : void 0;
}
function bs(e) {
  return e.kind === "terminal" ? "Open shell" : `Open ${e.label} in Terminal`;
}
function gs(e, t) {
  return t === e.id ? `${e.label} running…` : "Background review";
}
function Ca({
  host: e,
  setStatus: t,
  attachSkillToChat: n,
  saveLocalJobOutput: o,
  activeFile: r,
  openEditors: i,
  variant: s = "sidebar"
}) {
  const [d, p] = v([]), [f, b] = v([]), [h, w] = v(null), [I, T] = v(!1), [B, q] = v(null), [U, J] = v("Review the active Atomek context. Return concise findings. If you propose edits, output a unified diff or fenced replacement blocks so Atomek can preview before applying."), [Z, P] = v(null), [H, ee] = v([]), [_, X] = v(() => Bi()), [oe, ye] = v([]), [g, R] = v([]), K = H.find((m) => m.status === "running") ?? H[0] ?? null, le = s === "dock", Y = re(() => Qe(U || _?.goal || "", h), [U, _?.goal, h]), de = i.filter((m) => m.dirty).length, be = r ? `${r.path} · ${r.language} · ${r.content.length.toLocaleString()} chars${r.dirty ? " · dirty" : ""}` : i.length > 0 ? `${i.length} open editor${i.length === 1 ? "" : "s"}${de ? ` · ${de} dirty` : ""}` : "No active file — jobs run with only your typed prompt.", _e = re(() => [
    {
      label: "Review active file",
      prompt: "Review the active file for bugs, missing edge cases, confusing UX, and production risks. Return prioritized findings with exact file/line references when possible."
    },
    {
      label: "Plan patch",
      prompt: "Propose the smallest safe patch for the active Atomek context. Output a unified diff only if you are confident; otherwise list the exact files/functions to change."
    },
    {
      label: "Explain architecture",
      prompt: "Explain how the active file/context fits into the TytusOS/Atomek architecture. Point out any integration seams that do not make sense."
    }
  ], []), $ = y(async () => {
    if (!e.local?.listTools && !e.skills?.list && !e.resources?.list) {
      p([]), b([]), w(null), q("This Tytus host build does not expose local tools, resource graph, or skill registry yet.");
      return;
    }
    T(!0), q(null);
    try {
      const [m, S, A, E] = await Promise.all([
        e.local?.listTools?.().catch((x) => (t(`Local tool discovery failed: ${x instanceof Error ? x.message : String(x)}`), [])) ?? Promise.resolve([]),
        e.skills?.list?.().catch((x) => (t(`Skill registry discovery failed: ${x instanceof Error ? x.message : String(x)}`), [])) ?? Promise.resolve([]),
        e.resources?.list?.().catch((x) => (t(`Resource graph discovery failed: ${x instanceof Error ? x.message : String(x)}`), null)) ?? Promise.resolve(null),
        e.missions?.list?.().catch((x) => (t(`Mission list failed: ${x instanceof Error ? x.message : String(x)}`), [])) ?? Promise.resolve([])
      ]);
      p(m), b(S), w(A), ye(E), t(`Control Tower loaded · ${m.length} tools · ${S.length} skills · ${E.length} missions${A ? ` · ${A.resources.length} resources` : ""}`);
    } catch (m) {
      q(m instanceof Error ? m.message : String(m));
    } finally {
      T(!1);
    }
  }, [e.local, e.missions, e.resources, e.skills, t]);
  Q(() => {
    $();
  }, [$]), Q(() => {
    const m = (S) => {
      const A = S.detail;
      A?.missionId && X(A), $();
    };
    return window.addEventListener(Ht, m), () => window.removeEventListener(Ht, m);
  }, [$]);
  const N = y((m) => {
    const S = Wi(m);
    X(S), Ye(S), R([{
      ts: (/* @__PURE__ */ new Date()).toISOString(),
      kind: "mission.resume",
      message: `Mission resumed from Control Tower: ${S.rootPath ?? S.name}`,
      data: { runCount: m.runCount ?? 0, taskCount: m.taskCount ?? 0 }
    }]), J(m.goal || `Continue mission ${m.title}. Review MISSION.md, TASKS.md, RESOURCES.md, and runs/ before acting.`), t(`Resumed mission: ${m.rootPath}`);
  }, [t]), L = y(async (m, S, A = []) => {
    const E = [
      ...g,
      ...A,
      { ts: (/* @__PURE__ */ new Date()).toISOString(), kind: "mission.pack.write", message: "Mission context pack written from Atomek" }
    ], x = Qe(S || m.goal, h), F = [
      { path: "MISSION.md", content: Bt(m, h, r, i, S) },
      { path: "MISSION.json", content: ba(m, h, S) },
      { path: "RESOURCES.md", content: Wt(h) },
      { path: "TASKS.md", content: pa(x) },
      { path: "HANDOFF.md", content: fa(m) },
      { path: "INBOX.md", content: `# Mission inbox

Drop incoming agent notes, pod outputs, and shared-folder discoveries here.
` },
      { path: "OUTBOX.md", content: `# Mission outbox

Approved handoffs, final artifacts, and user-ready summaries go here.
` },
      { path: "AUDIT.jsonl", content: E.map((D) => JSON.stringify(D)).join(`
`) + `
` }
    ];
    if (m.rootPath && e.missions?.write)
      await e.missions.write({ rootPath: m.rootPath, files: F });
    else if (m.handle) {
      await Sn(m.handle, "runs");
      for (const D of F) await An(m.handle, D.path, D.content);
    } else
      throw new Error("Mission has neither tray rootPath nor browser folder handle");
    R(E), Ye(m);
  }, [r, e.missions, g, i, h]), j = y(async (m, S = {}) => {
    if (_)
      return await L(_, m), _;
    const A = `Atomek mission ${(/* @__PURE__ */ new Date()).toLocaleString()}`, E = m.trim() || "Coordinate Tytus resources for the current Atomek task.";
    let x = null;
    if (e.missions?.create) {
      const D = await e.missions.create({ title: A, goal: E });
      x = {
        missionId: D.missionId,
        title: D.title,
        goal: D.goal,
        rootPath: D.rootPath,
        name: D.rootPath.split("/").pop() || D.missionId,
        source: "tray"
      };
    } else if (S.allowBrowserPicker) {
      const D = await _i();
      if (!D)
        return t("Mission folder picker unavailable in this browser context"), null;
      x = {
        handle: D,
        name: D.name,
        missionId: `mission-${Date.now()}-${Hi(D.name)}`,
        title: A,
        goal: E,
        source: "browser"
      };
    }
    if (!x) return null;
    const F = { ts: (/* @__PURE__ */ new Date()).toISOString(), kind: "mission.folder.ready", message: `Mission folder ready: ${x.rootPath ?? x.name}` };
    return X(x), Ye(x), R([F]), await L(x, E, [F]), t(`Mission pack ready in ${x.rootPath ?? x.name}`), x;
  }, [e.missions, _, t, L]), te = y(async (m) => {
    if (!e.local?.openTerminal) {
      t("Terminal bridge unavailable in this host build");
      return;
    }
    try {
      const S = U.trim() || `Open ${m.label} from Atomek with current context.`, A = m.kind === "ai-cli" ? await j(S) : _;
      await e.local.openTerminal({
        toolId: m.id,
        command: m.command,
        cwd: A?.rootPath ?? Pn(r),
        prompt: A ? `Atomek mission pack ready at ${A.rootPath ?? A.name}. Read MISSION.md and RESOURCES.md. ${be}` : `Opened from Atomek. ${be}`
      }), t(m.kind === "ai-cli" ? `Opened ${m.label} in Tytus Terminal with mission context. Press Enter there to start it.` : "Opened Tytus Terminal");
    } catch (S) {
      t(`Terminal launch failed: ${S instanceof Error ? S.message : String(S)}`);
    }
  }, [r, be, j, e.local, U, _, t]), V = y(async () => {
    try {
      await j(U.trim(), { allowBrowserPicker: !0 }) || t("Mission folder setup skipped.");
    } catch (m) {
      t(`Mission folder setup failed: ${m instanceof Error ? m.message : String(m)}`);
    }
  }, [j, U, t]), ne = y(async (m, S, A, E = _) => {
    if (!E) return;
    const F = `${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}-${m.id}.md`, D = `runs/${F}`;
    if (E.rootPath && e.missions?.write)
      await e.missions.write({ rootPath: E.rootPath, files: [{ path: D, content: S }] });
    else if (E.handle) {
      const ae = await Sn(E.handle, "runs");
      await An(ae, F, S);
    }
    await L(E, U, [{
      ts: (/* @__PURE__ */ new Date()).toISOString(),
      kind: "local-cli.run.complete",
      message: `${m.label} exited ${A}; transcript saved to ${D}`,
      data: { toolId: m.id, exitCode: A, transcript: D }
    }]);
  }, [e.missions, U, _, L]), ve = y(async (m) => {
    if (!e.local?.runJob || !e.local?.streamJob) {
      t("Local job runner unavailable in this host build");
      return;
    }
    const S = U.trim();
    if (!S) {
      t("Local job prompt is empty");
      return;
    }
    let A = null;
    try {
      A = await j(S), A && await L(A, S, [{
        ts: (/* @__PURE__ */ new Date()).toISOString(),
        kind: "local-cli.run.start",
        message: `${m.label} background review started`,
        data: { toolId: m.id }
      }]);
    } catch (x) {
      t(`Mission pack failed before local job start: ${x instanceof Error ? x.message : String(x)}`);
      return;
    }
    P(m.id);
    const E = `local-run-${Date.now()}-${m.id}`;
    ee((x) => [{
      id: E,
      toolId: m.id,
      label: m.label,
      status: "running",
      startedAt: Date.now(),
      lines: [`[Atomek] Starting ${m.label} local job…`]
    }, ...x].slice(0, 6));
    try {
      const x = await e.local.runJob({
        toolId: m.id,
        prompt: A ? [
          "Tytus mission context pack is active.",
          `Mission: ${A.title}`,
          `Goal: ${A.goal}`,
          A.rootPath ? `Mission folder: ${A.rootPath}` : `Mission folder: ${A.name}`,
          "Read MISSION.md and RESOURCES.md from the mission folder when available.",
          "Use the attached Atomek context as source of truth. If you propose file writes, return a unified diff/replacement only; Atomek approval gate applies it.",
          "",
          S
        ].join(`
`) : S,
        cwd: A?.rootPath ?? Pn(r),
        context: [
          A ? Bt(A, h, r, i, S) : "",
          fs(r, i),
          h ? Wt(h) : ""
        ].filter(Boolean).join(`

---

`)
      }), F = [`[Atomek] Started ${m.label} local job ${x.id}`], D = (ae) => {
        ee((ie) => ie.map((fe) => fe.id === E ? ae(fe) : fe));
      };
      e.local.streamJob(x.id, {
        onLog: (ae) => {
          F.push(ae), D((ie) => ({ ...ie, lines: F.slice(-500) }));
        },
        onDone: (ae) => {
          ae && (F.push(ae), D((ie) => ({ ...ie, lines: F.slice(-500) })));
        },
        onFail: (ae) => {
          F.push(`[FAIL] ${ae}`), D((ie) => ({
            ...ie,
            status: "failed",
            finishedAt: Date.now(),
            lines: F.slice(-500)
          })), o(`${m.label} local job failed`, F.join(`
`)), ne(m, F.join(`
`), -1, A).catch((ie) => {
            t(`Mission transcript save failed: ${ie instanceof Error ? ie.message : String(ie)}`);
          }), P(null);
        },
        onExit: (ae) => {
          const ie = [
            `# Local job — ${m.label}`,
            "",
            `- Tool: ${m.id}`,
            `- Exit code: ${ae}`,
            `- Captured: ${(/* @__PURE__ */ new Date()).toISOString()}`,
            "",
            "```text",
            F.join(`
`),
            "```"
          ].join(`
`);
          D((fe) => ({
            ...fe,
            status: ae === 0 ? "complete" : "failed",
            exitCode: ae,
            finishedAt: Date.now(),
            lines: F.slice(-500)
          })), o(`${m.label} local job`, ie), ne(m, ie, ae, A).catch((fe) => {
            t(`Mission transcript save failed: ${fe instanceof Error ? fe.message : String(fe)}`);
          }), P(null);
        },
        onError: () => t(`Local job stream issue for ${m.label}`)
      }), t(`Started ${m.label} local job`);
    } catch (x) {
      P(null), ee((F) => F.map((D) => D.id === E ? {
        ...D,
        status: "failed",
        finishedAt: Date.now(),
        lines: [...D.lines, `[Atomek] Failed to start: ${x instanceof Error ? x.message : String(x)}`]
      } : D)), t(`Local job failed to start: ${x instanceof Error ? x.message : String(x)}`);
    }
  }, [r, j, e.local, U, i, h, o, ne, t, L]), Ae = y(async (m) => {
    const S = [
      `Use Tytus resource "${m.label}" (${m.kind}) for the next mission step.`,
      `Capabilities: ${m.capabilities.join(", ") || "status only"}.`,
      `Sandbox: ${m.sandbox}. Trust: ${m.trustTier}.`,
      m.allowedRoots.length ? `Allowed roots: ${m.allowedRoots.join(", ")}` : "No direct roots exposed.",
      "Return transcript/findings/artifacts only; edits require Atomek approval."
    ].join(`
`);
    J(S), _ && await L(_, S, [{
      ts: (/* @__PURE__ */ new Date()).toISOString(),
      kind: "resource.selected",
      message: `Selected resource ${m.label}`,
      data: { resourceId: m.id, kind: m.kind, status: m.status }
    }]), t(`Selected ${m.label} for mission`);
  }, [_, t, L]), Te = y((m) => {
    const S = m.setupAction, A = S?.commandPreview ? `${S.label}: ${S.commandPreview}` : S?.deepLink ? `${S.label}: ${S.deepLink}` : S?.label ?? `${m.label} needs setup`;
    t(A), Ze(S?.commandPreview ?? S?.deepLink ?? A);
  }, [t]);
  return /* @__PURE__ */ l("aside", { className: le ? "workbench-agent-dock" : "workbench-sidebar", children: [
    le ? null : /* @__PURE__ */ a("div", { className: "workbench-sidebar-title", children: "CONTROL TOWER" }),
    /* @__PURE__ */ l("div", { className: le ? "workbench-agent-dock-scroll" : "workbench-sidebar-scroll", children: [
      /* @__PURE__ */ l("div", { className: "workbench-computer-hero", children: [
        /* @__PURE__ */ a(Ut, { size: 18 }),
        /* @__PURE__ */ l("div", { children: [
          /* @__PURE__ */ a("strong", { children: le ? "Mission Runs" : "Tytus Control Tower" }),
          /* @__PURE__ */ a("p", { className: "workbench-muted", children: "Coordinate missions across local agents, Tytus pods, shared folders, app skills, and AIL routes. Open tools in Terminal when you want hands-on control; run background reviews when you want streamed, approval-gated output." })
        ] })
      ] }),
      /* @__PURE__ */ l("button", { className: "workbench-button-subtle workbench-computer-refresh", onClick: () => {
        $();
      }, disabled: I, children: [
        /* @__PURE__ */ a(Xe, { size: 14 }),
        " ",
        I ? "Refreshing…" : "Refresh capabilities"
      ] }),
      B && /* @__PURE__ */ a("div", { className: "workbench-inline-error", children: B }),
      /* @__PURE__ */ a("div", { className: "workbench-section-title", children: "MISSION PACK — SHARED CONTEXT" }),
      /* @__PURE__ */ l("div", { className: "workbench-computer-context-card mission", children: [
        /* @__PURE__ */ a("strong", { children: _ ? _.title : "No mission folder selected" }),
        /* @__PURE__ */ a("span", { children: _ ? `${_.rootPath ?? _.name} · ${_.source} · ${g.length} audit events · transcripts saved under runs/` : "Atomek creates this automatically before launching local agents. It is the shared folder agents read/write transcripts from." }),
        h ? /* @__PURE__ */ l("span", { children: [
          ma(h.resources),
          h.warnings.length ? ` · ${h.warnings.length} warnings` : ""
        ] }) : /* @__PURE__ */ a("span", { children: "Resource graph not loaded yet." })
      ] }),
      /* @__PURE__ */ l("div", { className: "workbench-computer-actions", children: [
        /* @__PURE__ */ a("button", { className: "workbench-button-subtle workbench-agent-primary-action", onClick: () => {
          V();
        }, children: _ ? "Refresh mission pack" : "Start mission pack" }),
        /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: () => _ && void L(_, U), disabled: !_, children: "Rewrite context files" })
      ] }),
      oe.length ? /* @__PURE__ */ l(De, { children: [
        /* @__PURE__ */ a("div", { className: "workbench-section-title", children: "RESUME MISSION" }),
        /* @__PURE__ */ a("div", { className: "workbench-mission-list", children: oe.slice(0, le ? 3 : 5).map((m) => /* @__PURE__ */ l(
          "button",
          {
            className: `workbench-mission-row ${_?.missionId === m.missionId ? "active" : ""}`,
            onClick: () => N(m),
            title: m.rootPath,
            children: [
              /* @__PURE__ */ a("strong", { children: m.title }),
              /* @__PURE__ */ l("span", { children: [
                m.status ?? "active",
                " · ",
                m.taskCount ?? 0,
                " tasks · ",
                m.runCount ?? 0,
                " runs"
              ] })
            ]
          },
          m.missionId
        )) })
      ] }) : null,
      h?.warnings.length ? /* @__PURE__ */ a("div", { className: "workbench-resource-warnings", children: h.warnings.slice(0, 3).map((m) => /* @__PURE__ */ l("span", { children: [
        m.code,
        ": ",
        m.message
      ] }, `${m.code}-${m.resourceId ?? m.message}`)) }) : null,
      /* @__PURE__ */ a("div", { className: "workbench-section-title", children: "ACTIVE CONTEXT" }),
      /* @__PURE__ */ l("div", { className: "workbench-computer-context-card", children: [
        /* @__PURE__ */ a("strong", { children: be }),
        /* @__PURE__ */ a("span", { children: r ? "Local agents receive clipped active-file content and must return previewable edits." : "Open a file to give local agents useful context." })
      ] }),
      /* @__PURE__ */ a("div", { className: "workbench-section-title", children: "TASK FOR LOCAL AGENT" }),
      /* @__PURE__ */ a("div", { className: "workbench-computer-presets", children: _e.map((m) => /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: () => J(m.prompt), children: m.label }, m.label)) }),
      /* @__PURE__ */ a(
        "textarea",
        {
          className: "workbench-computer-job-prompt",
          value: U,
          onChange: (m) => J(m.target.value),
          rows: 5
        }
      ),
      /* @__PURE__ */ a("div", { className: "workbench-section-title", children: "TASK GRAPH" }),
      /* @__PURE__ */ a("div", { className: "workbench-task-graph", children: Y.map((m, S) => /* @__PURE__ */ l(
        "button",
        {
          className: `workbench-task-card ${m.status}`,
          onClick: () => J(m.prompt),
          title: "Load this task prompt",
          children: [
            /* @__PURE__ */ a("span", { children: S + 1 }),
            /* @__PURE__ */ a("strong", { children: m.title }),
            /* @__PURE__ */ a("em", { children: m.resourceHint })
          ]
        },
        m.id
      )) }),
      K ? /* @__PURE__ */ l("div", { className: "workbench-agent-run", children: [
        /* @__PURE__ */ l("header", { children: [
          /* @__PURE__ */ l("div", { children: [
            /* @__PURE__ */ a("strong", { children: K.label }),
            /* @__PURE__ */ l("span", { children: [
              K.status,
              typeof K.exitCode == "number" ? ` · exit ${K.exitCode}` : ""
            ] })
          ] }),
          /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: () => o(`${K.label} local job`, K.lines.join(`
`)), disabled: K.lines.length === 0, children: "Save output" })
        ] }),
        /* @__PURE__ */ a("pre", { className: "workbench-computer-job-log", children: K.lines.join(`
`) || "[waiting for output]" })
      ] }) : null,
      /* @__PURE__ */ a("div", { className: "workbench-section-title", children: "RESOURCE GRAPH" }),
      /* @__PURE__ */ l("div", { className: "workbench-computer-list compact", children: [
        !h && !I ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No resource graph reported yet. Older Tytus host builds need `/api/resources`." }) : null,
        h?.resources.slice(0, le ? 8 : 5).map((m) => /* @__PURE__ */ l("div", { className: "workbench-resource-row", children: [
          /* @__PURE__ */ l("div", { children: [
            /* @__PURE__ */ a("strong", { children: m.label }),
            /* @__PURE__ */ l("span", { children: [
              m.kind,
              " · ",
              m.trustTier,
              " · ",
              m.capabilities.slice(0, 3).join(", ")
            ] })
          ] }),
          /* @__PURE__ */ l("div", { className: "workbench-resource-row-actions", children: [
            /* @__PURE__ */ a("span", { className: `workbench-computer-pill ${m.status}`, children: m.status }),
            /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: () => {
              Ae(m);
            }, children: "Use" }),
            m.status === "needs-setup" || m.setupAction ? /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: () => Te(m), children: "Setup" }) : null
          ] })
        ] }, m.id))
      ] }),
      /* @__PURE__ */ l("div", { className: "workbench-computer-explainer", children: [
        /* @__PURE__ */ a("strong", { children: "How launch works" }),
        /* @__PURE__ */ l("span", { children: [
          /* @__PURE__ */ a("b", { children: "Open in Terminal" }),
          ": opens the real Tytus Terminal, changes into the mission folder, types the CLI command, and waits for you to press Enter."
        ] }),
        /* @__PURE__ */ l("span", { children: [
          /* @__PURE__ */ a("b", { children: "Background review" }),
          ": runs the CLI through the tray in read-only/planning mode, streams output here, saves a transcript under ",
          /* @__PURE__ */ a("code", { children: "runs/" }),
          ", and never applies edits directly."
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: "workbench-section-title", children: "LOCAL AGENTS & TERMINAL" }),
      /* @__PURE__ */ l("div", { className: "workbench-computer-list", children: [
        d.length === 0 && !I ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No local tools reported yet." }) : null,
        d.map((m) => /* @__PURE__ */ l("div", { className: "workbench-computer-card", children: [
          /* @__PURE__ */ l("div", { className: "workbench-computer-card-head", children: [
            /* @__PURE__ */ l("div", { children: [
              /* @__PURE__ */ a("strong", { children: m.label }),
              /* @__PURE__ */ l("span", { children: [
                m.kind,
                m.version ? ` · ${m.version}` : ""
              ] })
            ] }),
            /* @__PURE__ */ a("span", { className: `workbench-computer-pill ${m.status}`, children: m.status })
          ] }),
          m.description ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: m.description }) : null,
          /* @__PURE__ */ l("div", { className: "workbench-computer-actions", children: [
            /* @__PURE__ */ a("button", { className: "workbench-button-subtle workbench-agent-primary-action", onClick: () => {
              te(m);
            }, disabled: m.status !== "available", title: "Launch this tool in the real Tytus Terminal with mission context prefilled. Atomek types the command; you press Enter to start it.", children: bs(m) }),
            m.kind === "ai-cli" ? /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: () => {
              ve(m);
            }, disabled: m.status !== "available" || Z !== null, title: "Run this local agent as a background read-only review inside Atomek and stream output here. It cannot write files directly.", children: gs(m, Z) }) : null
          ] })
        ] }, m.id))
      ] }),
      /* @__PURE__ */ a("div", { className: "workbench-section-title", children: "AGENTIC APP SKILLS" }),
      /* @__PURE__ */ l("div", { className: "workbench-computer-list", children: [
        f.length === 0 && !I ? /* @__PURE__ */ a("p", { className: "workbench-muted", children: "No skills reported yet." }) : null,
        f.map((m) => /* @__PURE__ */ l("div", { className: "workbench-computer-card", children: [
          /* @__PURE__ */ l("div", { className: "workbench-computer-card-head", children: [
            /* @__PURE__ */ l("div", { children: [
              /* @__PURE__ */ a("strong", { children: m.title }),
              /* @__PURE__ */ l("span", { children: [
                m.driver,
                " · ",
                m.source,
                m.appId ? ` · ${m.appId}` : ""
              ] })
            ] }),
            /* @__PURE__ */ a("span", { className: `workbench-computer-pill ${m.status}`, children: m.status })
          ] }),
          /* @__PURE__ */ a("p", { className: "workbench-muted", children: m.description }),
          m.triggers?.length ? /* @__PURE__ */ a("div", { className: "workbench-computer-triggers", children: m.triggers.slice(0, 4).map((S) => /* @__PURE__ */ a("span", { children: S }, S)) }) : null,
          /* @__PURE__ */ a("button", { className: "workbench-button-subtle", onClick: () => {
            n(m);
          }, disabled: m.status === "missing", title: "Insert this skill's instructions into chat so Atomek can use the app/tool correctly.", children: "Use in chat" })
        ] }, m.id))
      ] })
    ] })
  ] });
}
function Tn({ title: e, body: t }) {
  return /* @__PURE__ */ l("aside", { className: "workbench-sidebar", children: [
    /* @__PURE__ */ a("div", { className: "workbench-sidebar-title", children: e }),
    /* @__PURE__ */ a("div", { className: "workbench-empty-pane", children: t })
  ] });
}
function ks({ status: e, file: t, cursor: n, fileCount: o, dirtyCount: r }) {
  return /* @__PURE__ */ l("footer", { className: "workbench-statusbar", children: [
    /* @__PURE__ */ a("span", { children: "main" }),
    /* @__PURE__ */ l("span", { children: [
      o,
      " files"
    ] }),
    r > 0 && /* @__PURE__ */ l("span", { children: [
      r,
      " unsaved"
    ] }),
    /* @__PURE__ */ a("span", { className: "workbench-status-spacer" }),
    /* @__PURE__ */ a("span", { children: e }),
    /* @__PURE__ */ l("span", { children: [
      "Ln ",
      n.lineNumber,
      ", Col ",
      n.column
    ] }),
    /* @__PURE__ */ a("span", { children: "Spaces: 2" }),
    /* @__PURE__ */ a("span", { children: "UTF-8" }),
    /* @__PURE__ */ a("span", { children: "LF" }),
    /* @__PURE__ */ a("span", { children: Hn(t.language) })
  ] });
}
function Ot(e, t) {
  return e.length === 0 ? !0 : window.confirm(`${e.length} file${e.length === 1 ? "" : "s"} have unsaved changes. Continue to ${t}?`);
}
function ws(e, t) {
  const n = new Map(e.map((o) => [o.id, o]));
  return t.forEach((o) => n.set(o.id, o)), Array.from(n.values());
}
function Et(e) {
  return e.replace(/\.[a-z0-9]+$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 54) || "ai-artifact";
}
function Rt(e, t) {
  const n = new Set(e.map((i) => i.path));
  let o = `${t}.md`, r = 2;
  for (; n.has(o); )
    o = `${t}-${r}.md`, r += 1;
  return o;
}
function ys(e) {
  return {
    fileId: e.fileId,
    fileName: e.filePath,
    originalContent: e.originalContent,
    proposedContent: e.proposedContent,
    sourceTitle: e.sourceTitle,
    extractionLabel: e.extractionLabel,
    stats: e.stats
  };
}
function vs(e) {
  const t = e.split(`
`);
  return t.slice(0, 80).join(`
`) + (t.length > 80 ? `
…` : "");
}
function Cs() {
  try {
    const e = localStorage.getItem(la);
    if (!e) return [];
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.slice(0, 6) : [];
  } catch {
    return [];
  }
}
function $s() {
  const e = {
    primaryVisible: !0,
    primaryWidth: 300,
    secondaryVisible: !0,
    secondaryWidth: 520,
    markdownPreviewVisible: !0
  };
  try {
    const t = localStorage.getItem(da);
    if (!t) return e;
    const n = JSON.parse(t);
    return {
      primaryVisible: typeof n.primaryVisible == "boolean" ? n.primaryVisible : e.primaryVisible,
      primaryWidth: typeof n.primaryWidth == "number" ? Math.max(240, Math.min(460, n.primaryWidth)) : e.primaryWidth,
      secondaryVisible: typeof n.secondaryVisible == "boolean" ? n.secondaryVisible : e.secondaryVisible,
      secondaryWidth: typeof n.secondaryWidth == "number" ? Math.max(380, Math.min(760, n.secondaryWidth)) : e.secondaryWidth,
      markdownPreviewVisible: typeof n.markdownPreviewVisible == "boolean" ? n.markdownPreviewVisible : e.markdownPreviewVisible
    };
  } catch {
    return e;
  }
}
function xs() {
  try {
    const e = localStorage.getItem(ha);
    if (!e) return dt;
    const t = JSON.parse(e);
    return {
      gatewayPreference: t.gatewayPreference === "remote" || t.gatewayPreference === "local" || t.gatewayPreference === "auto" ? t.gatewayPreference : dt.gatewayPreference,
      model: typeof t.model == "string" ? t.model : "",
      embeddingModel: typeof t.embeddingModel == "string" ? t.embeddingModel : ""
    };
  } catch {
    return dt;
  }
}
function Ns({ host: e }) {
  return /* @__PURE__ */ a(Ui, { host: e });
}
function Is(e) {
  return function() {
    return /* @__PURE__ */ a(Ns, { host: e.host });
  };
}
export {
  Is as default
};
//# sourceMappingURL=index.js.map
