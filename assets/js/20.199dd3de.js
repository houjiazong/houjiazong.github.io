(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{427:function(a,t,e){"use strict";e.r(t);var r=e(52),s=Object(r.a)({},(function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[e("h1",{attrs:{id:"更优雅的git-pull"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#更优雅的git-pull"}},[a._v("#")]),a._v(" 更优雅的Git Pull")]),a._v(" "),e("h2",{attrs:{id:"_1-更新remote-tracking-branches-比如origin-master"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-更新remote-tracking-branches-比如origin-master"}},[a._v("#")]),a._v(" 1）更新remote tracking branches（比如origin/master）")]),a._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[a._v("git remote update -p\n")])])]),e("h2",{attrs:{id:"_2-尝试使用fast-forward方式更新本地分支"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-尝试使用fast-forward方式更新本地分支"}},[a._v("#")]),a._v(" 2）尝试使用fast-forward方式更新本地分支")]),a._v(" "),e("p",[a._v("如果成功，整个过程结束\n如果失敗，执行步骤三")]),a._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[a._v("git merge --ff-only @{u}\n")])])]),e("h2",{attrs:{id:"_3-rebase"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-rebase"}},[a._v("#")]),a._v(" 3）rebase")]),a._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[a._v("git rebase -p @{u}\n")])])]),e("h2",{attrs:{id:"_4-review"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-review"}},[a._v("#")]),a._v(" 4）Review")]),a._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[a._v("log --graph --oneline --decorate --date-order --color --boundary @{u}..\n")])])])])}),[],!1,null,null,null);t.default=s.exports}}]);