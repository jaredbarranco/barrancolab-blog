---
title: "Static Website with S3, Cloudfront, and Cloudflare"
date: 2023-12-30T20:53:37Z
image: /images/posts/github-to-cloudfront.jpg
categories:
  - AWS
post_id: B5430282-9F60-4E76-95F1-6CB1750DB9DE
draft: false
---

Hello World!

Setting up this static site was a project of patience, test of my prompt engineering, and Google search term skills.

## Goal of this Blog
My goal here is to document and share my path of discovery and exploration along new technologies. This is of course mostly for my reference, but if it can assist someone else, I am glad to have contributed!

This boiled down to three requirements:

  1. Static Site - this is a blog and basic skills demonstration site. Nothing fancy required.

  2. Automatic Deployment

  3. Available at my domain: [https://barrancolab.com](https://barrancolab.com)
 

## Step 1: Static Site Front End

My first step was to identify a front end framework. I am personally not passionate about page design, color picking, or even UI/UX in general. I like to make things work, and work well. My requirements were that the Front End Framework was well documented, the pages were generated from Markdown, and supported image imbedding.

One of the first Google searches for "Static Site Front End Github" is [Awesome Static Generators](https://github.com/myles/awesome-static-generators) Here is where I found the [StaticHunt](https://statichunt.com/) collection of static site front ends.

I picked out the [Hydrogen Theme](https://statichunt.com/themes/hugo-hydrogen) because NextJS appears to have great documentation and online support.

### Github Configuration
Just as any project, this one begins with the creation of a new repository in my Github. Thus, [jaredbarranco/barrancolab-blog](https://github.com/jaredbarranco/barrancolab-blog) was forked from the Hydrogen theme repository.

After cloning the main branch to my local working directory, I went into the Github Repository Settings and configured a deployment environment with my main branch and required approvals for deployments.

#### Deployment Environment
![production-deployment-environment](/images/posts/production-deployment-env.png)

#### Approval Required
![production-deployment-rules](/images/posts/production-deployment-rules.png)

### Updates to the Hydrogen repo
Hydrogen theme repo used NextJS and Tailwind. I won't be updating any of the Tailwind configuration - I chose the theme for a reason.


#### next.config.js

To get static output from a NextJS file, we need to "output: export" and enable "unoptimized" for the [Image Component](https://nextjs.org/docs/pages/api-reference/components/image#unoptimized)

```
  const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    images: {
      unoptimized: true,
    }
  };
```

#### Nav Bar Re-Org
I wanted to keep the "Home" page of my site as plain as possible, with minimal links. This means I needed to re-org the Nav Bar. 

The theme has three main page types: main, page, and post. The "main" page is the home landing page. The "page" type can be treated as a "subpage" since it contains a fast link back to "main". Finally, the "post" page is for blog posts. To begin, I [added a Dedicated blog page to the menu.json array](https://github.com/jaredbarranco/barrancolab-blog/commit/0bf2ce1b0a390f3a30b9ff7b587b60ce72009a78). 

All pages gets links added to them based on "Header.js". I found where the Nav Links are selected and added. I [reassigned](https://github.com/jaredbarranco/barrancolab-blog/commit/46d90b38bd388757fbc9b87de26b2b8cc2f9828a#diff-134f059f6afa4857c72a9b09e4a74672cba3f61299b8ad7f4311821d7f71541a) this functionality to the "/blog" page. Now, only the Blog will contain the categories identified by the taxonomy parser.

The Blog page's format is basically the lower half of the original Hydrogen theme. A quick copy/paste later, we have the [blog sub-page](https://github.com/jaredbarranco/barrancolab-blog/commit/9ed77496febc6aa0fb08ed103a398bdb24144cf1). The page's slug will automatically use this as the source.

#### Disqus Integration
Disqus is a discussionb board API and platform. I created a free account, setup a site, and [commmitted the updates to enable Disqus](https://github.com/jaredbarranco/barrancolab-blog/commit/d13a6938a0fca4a032b685ec59be56e622645c71).

#### template.md and scripts/new_post.sh
I wanted to make creating new posts as easy as running a quick script. I am quite familiar with bash. So I had ChatGPT generate me a [bash script](https://github.com/jaredbarranco/barrancolab-blog/commit/6aff51d7f0c43fe66fed44cc2dd1ce3a4f75b534) to copy/paste a new [template.md](https://github.com/jaredbarranco/barrancolab-blog/commit/aa2f3b4120dc4bd3fcb5ae50fdb400ce33188f50) file, and replace some key values that make the Discus integration mostly invisible to me in the future.

### Github Workflows
I have written tons of Github workflows for my "real job", so this one was mostly trivial after discovering the required runner permissions for [AWS integration](https://github.com/aws-actions/configure-aws-credentials) and the [Origin Access Control](https://aws.amazon.com/blogs/networking-and-content-delivery/amazon-cloudfront-introduces-origin-access-control-oac/) setup in AWS.

The workflow checks out the repostiory, installs npm, runs the build command, then uses S3 sync with a OAC defined role in my personal AWS VPC.

### Cloudfront and Cloudflare
I already own the domain "barrancolab.com" which is currently registered at Cloudflare. I have other services I run via their ZeroTrust tunnel, so I don't want to move it to AWS. I wanted to take advantage of the Cloudfront CDN, and since this is a static website, it should be an extremely short time to first paint!

There is some setup required though . . .

#### Amazon Certificate Manager
In order to [enable SSL/TLS](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html) via my "barrancolab.com" domain, we have to generate a Certificate. AWS Provides two options, one is DNS Validation and the other is manual validation via Email. The former will remain valid as long as the CNAME DNS entry exists. 

So to accomplish the above, I logged into the AWS Console, and followed [this set of instructions](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html#request-public-console) to create a new ACM Certificate for my Cloudflare domain. Next, I performed the [DNS Validation](https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html) by logging into my Cloudflare dashboard and adding the specified source and target values to my DNS settings as a CNAME. 

**IMPORTANT**
Make sure you are not "proxy"-ing any of the CNAME entries you create! We are simply allowing Cloudflare DNS to point the domain at the Cloudfront endpoint.


#### Cloudfront Configuration
Now that I have a certificate that can be used on Cloudfront, its time to connect all the elements together.

This is the [AWS Developer Guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started-cloudfront-overview.html) I followed, except I skipped anything dealing with Route53/DNS configuration since that is being handled by Cloudflare. Additionally, I am only hosting the webstie on my root domain, so I also skipped redirecting S3 API requests from root to subdomain (like "wwww"). 


At this point, my site was up and running. All thats left to say is:
```
  ___________
< Hello World >
  -----------
         \   ^__^ 
          \  (oo)\_______
             (__)\       )\/\\
                 ||----w |
                 ||     ||
```
