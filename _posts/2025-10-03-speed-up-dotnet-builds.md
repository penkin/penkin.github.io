---
layout: post
title: Speeding up our .NET builds
description: Learn how we reduced .NET build times from 7+ minutes to under 1 minute using a custom BUILD_CACHE property and smart file change detection for hybrid applications with frontend assets.
categories: ["Development", ".NET"]
---

We've all been there; waiting for builds that seem to take forever, especially when you're working on applications that mix .NET backend code and javascript/css assets. Every small change triggers a full rebuild of everything, including npm packages that haven't changed in weeks.

Recently, a teammate introduced a simple but clever solution that cut our build times dramatically, a custom BUILD_CACHE property that intelligently decides when to rebuild frontend assets.

## The Problem

The project is an large monolith application with many .NET projects and quite a few of them need to build javascript and/or css assets.

The issue? Every build had expensive asset rebuilds. `npm ci` alone can take several minutes on a fresh install, and `npm run build` adds even more time for webpack to do its thing.

## The Solution

The fix was surprisingly elegant. Instead of always running the full npm build process, we created conditional MSBuild targets.

```xml
<Target Name="PreBuild" AfterTargets="PreBuildEvent" Condition="'$(BUILD_CACHE)' != 'true'">
  <Exec Command="npm ci" />
  <Exec Command="npm run build" />
</Target>
<Target Name="PreBuildCached" AfterTargets="PreBuildEvent" Condition="'$(BUILD_CACHE)' == 'true'">
  <Exec Command="node ../../if-changes.js" />
</Target>
```

When `BUILD_CACHE=true`, instead of blindly rebuilding everything, we run a custom Node.js script called `if-changes.js` that intelligently checks what's actually changed.

## How It Works

The magic happens in the `package.json` configuration of the various projects. We add the following `onlyIfChanged` section to it:

```json
"onlyIfChanged": [
  {
    "name": "dependencies",
    "globs": [
      "package-lock.json"
    ],
    "command": "npm ci"
  },
  {
    "name": "build",
    "globs": [
      "Scripts/**/*",
    ],
    "command": "npm run build"
  }
]
```

The script uses file globbing (__powered by fast-glob__) to check specific files and directories, only when these files change does it trigger the associated commands. No more rebuilding frontend assets when you've only touched C# code.

## Setting It Up

Here is how to set it up on both [Rider](https://www.jetbrains.com/rider/) and [Visual Studio](https://visualstudio.microsoft.com/).

### For Rider users:

Settings → Build, Execution, Deployment → Toolset and Build<br>
Edit `"MSBuild Global Properties"`<br>
Add `BUILD_CACHE=true`

### For Visual Studio users:

There is no built in way to do this in Visual Studio so we need to make use of environment variables within Windows.

Open System Properties → Advanced → Environment Variables<br>
Add `BUILD_CACHE=true` as a system variable<br>
Restart your computer **(yes, really!)**

Add the conditional targets to your `.csproj` file shown above and configure the `onlyIfChanged` section in your `package.json` file. Don't forget to install [fast-glob](https://www.npmjs.com/package/fast-glob) as a dependency.

## The Results
The speed improvement was immediate and significant. Local development builds that used to take 5-10 minutes now complete in 1 and developers stopped grabbing coffee during every build cycle (__not sure if that is a win or a lose__).

The results on my MacBook Pro with an M1 chip and 16GB of RAM. The gap was even more noticable on others running Windows... just saying :P

```
With cache    Build completed in 00:01:01.969
Without cache Build completed in 00:07:09.369
```

> I'm reposting this one of the most underrated inventions of our time. I've gone from Mobi effectively not starting up on my machine anymore to it starting up within seconds. **~ One happy customer in our slack channels**

The best part? It's completely transparent. Developers who haven't set up the caching still get working builds, they just take longer. Those who enable caching get the speed benefits without any downsides.
Sometimes the best optimisations aren't about fancy new tools or frameworks; they're about being smart about when you choose to skip work entirely.

## Bonus

Here is a link to the GitHub gist of our [if-changes.js](https://gist.github.com/penkin/1488fbc798a9c8fd21227d50d728440f) file.
