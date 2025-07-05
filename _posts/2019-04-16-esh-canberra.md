---
layout: post
title: ESH Canberra 2019
description: Highlights from the Evidence Synthesis Hackathon in Canberra—collaborating on open-source tools, software development, and scientific innovation.
image: esh_logo_canberra2019.png
categories: ["Evidence Synthesis Hackathon", "Software Development"]
---

The Evidence Synthesis Hackathon is an event created to support the growth of new ideas, software and collaboration for improved evidence synthesis. The first event was held in 2018 in Stockholm Sweden and this year it was held in Canberra Australia.

> Evidence synthesis is the process of converting scientific outputs – such as articles, reports and data – into reliable and digestible evidence that can inform management and policy.
> [https://evidencesynthesishackathon.com](https://evidencesynthesishackathon.com)

## How does the ESH work?

A number of people are invited from various backgrounds within evidence synthesis, either from a purely academic side, software engineer side or a little of both. There is a list of potential “problems” to solve either by writing a paper on the topic or creating software to ease the pain of the current process. As a software developer with little to no academic background, I end up trying to write software to make a specific process a little less painful.

I find this amazingly fulfilling and interesting. 1. I need to understand the problem sphere to be able to make anything useful to those that need the solution and 2. any help given is normally hugely appreciated.

## What I worked on.

So the problem I found the most intriguing was the problem of grey literature research. In evidence synthesis it is relatively easy to find published literature on a given topic, and to record what the search string was used in which database, how many records were found, how many were used or not used and why.

All that is solved with expensive published databases. What if you want the same sort of transparency and repeatability for grey literature searches which can quite literally be done on any website on the internet

## Our Solution

There are two parts to our solution, 1. a Google Chrome extension and 2. a web application to manage the results of the Google Chrome extension.

### Google Chrome Extension

What I started working on with partner on the project, Mandlenkosi, is a [Google Chrome extension](https://developer.chrome.com/extensions) that you train on the search results of the current website that you are on. It will then record the results – as [JSON](https://en.wikipedia.org/wiki/JSON), [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) and potentially [RIS](https://en.wikipedia.org/wiki/RIS_(file_format)) – as well as the URL of the site and the search string used.

The reason we decided on a Chrome extension for this part of the problem is to keep the solution as generic as possible without the need to keep a library of web-scraping scripts for all possible – or most used – websites that can easily go out of date if those sites structures are ever changed. With the extension you can easily start your search, click on the extension and tell it where the 1st result item is, tag all the relevant data in that result and automatically scrape the rest of the results and pages. Even if the markup changes for the site the next time you go to it will not matter as the extension is shown each time what elements on the page you’re interested in.

### Web Application

The 2nd part of the solution is to create a web application that can take the results of the Chrome extension and retrieve all the metadata around what you’ve extracted like link details, attached PDFs etc.

The way I imagine this all working is that you will also be able to select results you want to use, and discard those that you do not want to use with reasons for your decision.

## The Result

There is only so much a jet-lagged, sleep-deprived person can do in three days. What we do have so far is a good proof of concept. Our code for the Google Chrome extension is available on [GitHub](https://github.com/ESHackathon/grey-literature-recorder) if you want to contribute in any way. It’s still very raw and we need a lot of polish around the readme, contribution and licensing docs.
