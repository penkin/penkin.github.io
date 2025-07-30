---
layout: post
title: How I built this blog
description: Build a Jekyll blog with Tailwind CSS and GitHub Pages hosting in one weekend. Simple setup guide with pagination, RSS feeds, and dark mode.
categories: ["blog", "jekyll", "github-pages"]
---

There are quite a few static site generators that can be used to build a quick little blog and thought I'd share just how I built this little space on the internet. Setting up this blog took a weekend and most of that time was me playing with a design I liked that would work on all form factors as well as implementing a dark mode that respected the user's selected system colour scheme. I probably could have easily used an existing theme but I wanted something that was more mine.

Below is a brief overview of the stack I used to build this blog.

## The stack

- [Jekyll](#jekyll)
  - [Jekyll Paginate](#jekyll-paginate)
  - [Jekyll Feed](#jekyll-feed)
  - [Jekyll Sitemap](#jekyll-sitemap)
- [Tailwind CSS](#tailwind-css)
- [GitHub Pages](#github-pages)

## Jekyll

[Jekyll](https://jekyllrb.com/) is a static site generator that can be used to build a static websites like this little blog. What makes it great is that you can create your content in something simple like [Markdown](https://en.wikipedia.org/wiki/Markdown) and Jekyll will take care of the rest. It also has some nice little features that let you organise your files in ways that are easy to maintain. You can have various layout files to define the structure of your pages and posts, and you can use [Front Matter](https://jekyllrb.com/docs/front-matter/) to define metadata for your pages and posts.

I chose Jekyll mainly because it seemed really simple to get started. The main purpose of this blog is to practise writing, I did not want to get bogged down with complex setups, CI/CD pipelines etc. Jekyll is a great fit especially when hosting the site within GitHub Pages as it has a very low barrier to entry. There is a [Ruby](https://www.ruby-lang.org/en/) dependency but as a software developer I already had that installed.

The other great thing about Jekyll are the [plugins](https://jekyllrb.com/docs/plugins/). Below are the plugins that I used.

### Jekyll Paginate

[Jekyll Paginate](https://jekyllrb.com/docs/pagination/) is as simple as it sounds. It adds a `paginator` object to your page that you can then show a page of posts and add some navigation to move between the pages. You can then use `paginator.posts` to iterate through to show that page's posts and `paginator.total_pages`, `paginator.previous_page` and `paginator.next_page` to construct your paging navigation.

To get pagination working you'll need to include `jekyll-paginate` in your `Gemfile` and add the following to your `_config.yml` file where `paginate` is the number of items you want on the page and `paginate_path` is the URL path to the page.

{%- highlight yml -%}
paginate: 10
paginate_path: "/blog/page:num/"

plugins:
  - jekyll-paginate
{%- endhighlight -%}

 > Note that pagination only works in `html` files and not `markdown` files.

### Jekyll Feed

[Jekyll Feed](https://github.com/jekyll/jekyll-feed) adds all that Atom/RSS magic to the blog so that readers can read your posts from the comfort of their own feed readers.

Again a pretty simple setup that has you adding `jekyll-feed` to your `Gemfile` file. The config is also pretty straightforward. All I did was to update the icon with the following:

{%- highlight yml -%}
feed:
  icon: /assets/img/favicon-192x192.png\

plugins:
  - jekyll-feed
{%- endhighlight -%}

There are a lot more config options available but I kept mine simple with the above but you can [see the rest here](https://github.com/jekyll/jekyll-feed?tab=readme-ov-file#usage).

### Jekyll Sitemap

[Jekyll Sitemap](https://github.com/jekyll/jekyll-sitemap) helps with all that search engine love. I added it to generate a sitemaps.org compliant sitemap to help with indexing the site on various search engines.

Oh and guess what? That's right! Add `jekyll-sitemap` to your `Gemfile` file and in the config you would add the `url` and the plugin name to the `plugins` section.

{%- highlight yml -%}
url: "https://www.penkin.me"

plugins:
  - jekyll-sitemap
{%- endhighlight -%}

## Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) is a beautiful composable CSS framework that allows you to build your design within HTML. When I initially planned to start blogging again I wanted to also make this a little space that I can play around in. One of those things was to play more with Tailwind as well as implement dark mode abilities within the site and whatever else catches my fancy in the future.

Tailwind has some [comprehensive getting started guides](https://tailwindcss.com/docs/installation/tailwind-cli) on how to use it within your site or app.

What I did to keep things simple within this blog is to simply add the following build scripts within my `package.json` file:

{%- highlight json -%}
{
  "scripts": {
    "build:dev": "npx @tailwindcss/cli -i ./src/css/main.css -o ./assets/css/main.min.css --watch",
    "build:prod": "NODE_ENV=production npx @tailwindcss/cli -i ./src/css/main.css -o ./assets/css/main.min.css --minify"
  }
}
{%- endhighlight -%}

All it's doing is taking my input CSS file and outputting it to the assets folder after tailwind does its magic. I have not set up any CI/CD pipelines to automate the build of the CSS currently as it almost never changes. I wanted to focus on the writing aspect of this site and if I change any styles I simply run the `npm run build:dev` while I build. Once I am happy I run `npm run build:prod` and commit the file.

## GitHub Pages

[GitHub Pages](https://pages.github.com/) is a free static site hosting service offered by [GitHub](https://github.com/). Nothing beats free and they also have some [Jekyll is fully supported](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll) for simple little sites like this one.

Since I am hosting within GitHub Pages, I added the following to the `Gemfile`, `gem "github-pages", group: :jekyll_plugins`. The `github-pages` gem ensures my local development environment matches exactly what GitHub Pages will build, preventing the frustrating situation where my site works perfectly locally but breaks when deployed.

GitHub Pages does have a default set of plugins that it supports out of the box that helps you get setup with no mess or fuss. I believe though if you do want to go outside of these defaults that there is some additional setup that is required. I did not need anything outside of what I have above so it all just worked.

## What's Next?

Next I guess is writing. The plan is to focus on getting one post out every month, if there are more, great, if not, fine. The setup is simple so that I can get that done. If I see some CSS or JS stuff I want to try I can also play with that here. Time will tell.

For now though... write. Commit. Push. Done!
