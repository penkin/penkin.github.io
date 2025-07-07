---
layout: post
title: AI in Software Development
description: Exploring AI's impact on software development—from cutting-edge tools like GitHub Copilot and Cursor to agentic AI and the emerging Model Context Protocol (MCP).
categories: ["AI", "Development", "MCP", "Agentic AI"]
---

AI has been transforming software development in profound and practical ways. During a recent 30-minute talk at 
[Digital Solution Foundry](https://www.digitalsolutionfoundry.co.za/), I shared an overview of where we're at with 
AI in coding, some tools and paradigms that are emerging, and how we, as developers, can understand and leverage 
these evolving capabilities.

## Here’s what we covered:

1. AI and Software Development
2. What Agentic Development Means
3. Introduction to the Model Context Protocol (MCP)
4. Live Demo

## AI-Powered Development Tools

Today's developers are spoiled for choice when it comes to AI-enhanced tools. Whether you’re writing boilerplate
code, critiquing code, or generating tests, AI is finding its way into every dev workflow.

Here are just a few tools to know:

 - [GitHub Copilot](https://github.com/features/copilot): Needs no introduction at this point.
 - [Cursor](https://cursor.com/): Offers rich inline suggestions, feels snappy and intuitive.
 - [Windsurf](https://windsurf.com/): Another AI-driven environment built off Visual Studio Code.
 - [JetBrains AI](https://www.jetbrains.com/ai/): Integrated assistant for IntelliJ-based IDEs.
 - [Zed](https://zed.dev/): Lightweight, with an AI co-dev baked in.

All of these tools offer variations of:

 - Autocomplete magic
 - Automated boilerplate generation
 - Generating tests with almost no mental overhead

Ultimately, AI has the potential of making developers faster and more efficient—turning high-level ideas into 
runnable code more quickly than ever.

## So, What is “Agentic AI”?

“Agentic” AI refers to systems capable of taking initiative and making decisions on their own. You don’t just 
command them step-by-step — they can autonomously plan and act.

An agentic AI doesn't just respond; it draws from its internal model, gets context, plans a task, and implements 
the code — end-to-end.

## However, there's a big caveat.

Agents are only as good as the access and instructions you give them. If the inputs are unclear or the data and 
scope are limited, you'll get unclear or incorrect outputs.

> [Kent Beck](https://substack.com/@kentbeck) calls it his “genie.” You get exactly what you asked for, not what 
> you meant to ask for.

## What is the Model Context Protocol (MCP)?

Here’s where things get really interesting.

The Model Context Protocol (MCP) is shaping up to be a powerful paradigm in the AI workflow. MCP allows AI 
models to talk to tools via structured, documented interfaces.

<figure>
	<img src="{{ '/assets/img/mcp.jpg' | prepend: site.baseurl }}" alt="">
	<figcaption>Fig1. - MCP overview</figcaption>
</figure>

Think of it like plug-and-play for tools + AI. We're starting to get into the realms of this being our very own
Jarvis for Ironman. You can take something like [Claude Desktop](https://claude.ai/download) and connect it to 
various tools to create a personal assistant that knows about your data and can act on your behalf.

I'm not sure how ready I am for this step to be frank but the thought of being able to talk to an AI that knows
my calendar, my mails, my [Notion](https://www.notion.so/) documents... has my nerdy senses tingling. Who knows, maybe
my memory is short sinse it was not that long ago I wrote about leaving 
[Facebook]({{ site.url }}{% post_url 2019-02-28-facebook-free %}) and 
[Google]({{ site.url }}{% post_url 2019-01-23-google-free %}) behind.

[Docker](https://hub.docker.com/mcp) is doing something pretty interesting here, they are creating a hub for MCPs that
allow you to run contanerised versions of these tools. So you can install one for Postgres and/or Graphana and/or GitHub and 
then chat to your AI about your data in these external apps.

I still want to play around with Notion's MCP server and see how that pans out. I'm imagining that I can use Claude to add to
my notes, summarise them etc. Really keen to see where this all goes.

This isn't just chat-based prompts anymore. It’s AI with real-world integrations, acting like a personal agent across all your services.

## Final thoughts

I really love where this is going so far, it's really interesting using and playing with all these shiny toys. This however
are still in flux. So keep playing, don't tie into any one service. They are all improving and evolving. Try things out and 
see where it takes you.