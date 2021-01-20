---
title: Deleting “bin” & “obj” folders in a .NET solution.
layout: post
date: 2020-01-25
description: Recently I ran into an issue where none of my breakpoints for my solution would get activated when I ran a pretty large .NET Core solution.
image: code.jpg
categories: ["Software Development"]
---

Recently I ran into an issue where none of my breakpoints for my solution would get activated when I ran a pretty large [.NET Core](https://docs.microsoft.com/en-us/dotnet/core/) solution. I tried cleaning the project and rebuilding which did not work. I was even desperate enough to reboot my machine, that’s when I know I’m at the end of my tether.

![](/img/code1.jpg)

## Bash Solution

Since the project I’m working on is pretty big, going through all the directories manually is super tedious. I work on OSX so I needed something that works in bash and here is what I came up with.

I created a file in the solution’s root directory called DeleteBinObjFolders.sh. I wrote the following in the file;

```
echo "Deleting all bin and obj folders..."
find . -iname "bin" -o -iname "obj" | xargs rm -rf
echo "Your bin and obj folders deleted!"
```

All that is left is to make the file executable with chmod +x DeleteBinObjFolders.sh. Now we are all good to run the file by entering ./DeleteBinObjFolders.sh in your terminal.

**BAM!** All your bin and obj files are a thing of the past.

## BAT Solution

I found the following solution on [Alper Ebiçoğlu’s post](https://medium.com/volosoft/deleting-all-bin-obj-folders-in-a-solution-93e401372e69) about the same issue. Basically do exactly the same as above but instead of using the ```.sh``` extension, use ```.bat```.

```
@echo off
@echo Deleting all BIN and OBJ folders…for /d /r . %%d in (bin,obj) do @if exist “%%d” rd /s/q “%%d”@echo BIN and OBJ folders successfully deleted :) Close the window.pause > nul
```

Double click the bat file and **BAM! Victory!**