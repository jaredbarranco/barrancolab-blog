---
title: "Static Website with S3, Cloudfront, and Cloudflare"
date: 2023-12-30T20:53:37Z
image: /images/posts/github-to-cloudfront.jpg
categories:
  - AWS
post_id: B5430282-9F60-4E76-95F1-6CB1750DB9DE
draft: true
---

Hello World!

Setting up this static site was a project of patience, test of my prompt engineering, and Google search term skills.

### Goal of this Blog
My goal here is to document and share my path of discovery and exploration along new technologies. This is of course mostly for my reference, but if it can assist someone else, I am glad to have contributed!

This boiled down to three requirements:

  1. Static Site - this is a blog and basic skills demonstration site. Nothing fancy required.

  2. Automatic Deployment

  3. Available at my domain: [https://barrancolab.com](https://barrancolab.com)
 

### Step 1: Static Site Front End

My first step was to identify a front end framework. I am personally not passionate about page design, color picking, or even UI/UX in general. I like to make things work, and work well. My requirements were that the Front End Framework was well documented, the pages were generated from Markdown, and supported image imbedding.

One of the first Google searches for "Static Site Front End Github" is [Awesome Static Generators](https://github.com/myles/awesome-static-generators) Here is where I found the (StaticHunt)[https://statichunt.com/] collection of static site front ends.

I picked out the [Hydrogen Theme](https://statichunt.com/themes/hugo-hydrogen) because NextJS appears to have great documentation and online support.

#### Github Configuration
Just as any project, this one begins with the creation of a new repository in my Github. Thus, [jaredbarranco/barrancolab-blog](https://github.com/jaredbarranco/barrancolab-blog) was forked from the Hydrogen theme repository.

After cloning `main` to my local working directory, I went into the Github Repository Settings and configured a deployment environment with my main branch and required approvals for deployments.

##### Deployment Environment
![production-deployment-environment](/images/posts/production-deployment-env.png)

##### Approval Required
![production-deployment-rules](/images/posts/production-deployment-rules.png)


### Work From Home

Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo vel ad consectetur ut aperiam. Itaque eligendi natus aperiam? Excepturi repellendus consequatur quibusdam optio expedita praesentium est adipisci dolorem ut eius! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo vel ad consectetur ut aperiam. Itaque eligendi natus aperiam? Excepturi repellendus consequatur quibusdam optio expedita praesentium est adipisci dolorem ut eius!

Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo vel ad consectetur ut aperiam. Itaque eligendi natus aperiam? Excepturi repellendus consequatur quibusdam optio expedita praesentium est adipisci dolorem ut eius! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo vel ad consectetur ut aperiam. Itaque eligendi natus aperiam? Excepturi repellendus consequatur quibusdam optio expedita praesentium est adipisci dolorem ut eius!
