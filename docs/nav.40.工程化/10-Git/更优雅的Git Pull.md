---
title: 更优雅的Git Pull
---
# 更优雅的Git Pull
## 1）更新remote tracking branches（比如origin/master）
```
git remote update -p
```
## 2）尝试使用fast-forward方式更新本地分支
如果成功，整个过程结束
如果失敗，执行步骤三
```
git merge --ff-only @{u}
```
## 3）rebase
```
git rebase -p @{u}
```
## 4）Review
```
log --graph --oneline --decorate --date-order --color --boundary @{u}..
```
