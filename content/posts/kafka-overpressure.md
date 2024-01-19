---
title: "kafka-overpressure"
date: 2024-01-19T16:31:34Z
image: /images/posts/post-1.jpg
categories:
  - Design
  - Architecture
post_id: 8AFAF878-4187-4CFD-9F38-5F9A97D6E262
draft: true
---

# Streaming Overpressure on Dependent Services

**Disclaimer:** Details below have been changed to retain some level of obfuscation to my employer's tech stack, ERP systems, etc.

## "Standard Operating Procedure"

Everyone with a year or more experience in almost any industry has heard the phrase: "It's standard operating procedure." For me personally, this phrase sets off alarm bells when stated in a requirements or business logic discovery meeting. There is an other common phrase, typically said less in the workplace, and I feel its an appropriate dichotomy to SOP. That is: "Rules are meant to be broken."

If a business leader ever states, "Its standard operating procedure" or "That should never happen". You should bet the house on the exact thing occurring within 6 months of pushing a feature or product that depends on SOP being followed. When that same leader comes to your desk and says "Well I didn't mean _that_ process, or _that_ customer!". 


## Scenario

My employer operates in the Transportation and Logistics industry. This industry is a notoriously difficult one for "disruptors" to establish themselves, regardelss of how much VC money they collect. I will probably write another blog post about why I think this is, but for this article, you just need to know that the majority of data entered, configured, or communicated about shipments has a human being typing, scanning, or literally writing it down prior to any automated processes get involved.


Enter the scenario:

1. An overseas agent is responsible for booking shipments into a company's ERP system on behalf of customers looking to import to the US. Their agents are graded on metrics like "number of clicks to booking", or "minutes spent on document entry". Their incentives are such that they will find ways to do things as fast as possible.

2. The ERP system has no synchronous API, Webhook, or integration capabilities. Any data extraction has to be done asynchronously. Thankfully, there are relatively robust change tracking tables in the system, so polling for changes that have occured in the last set interval is simple (more on this later). My team has setup a polling interval of one minute to the ERP system to find all documents that have been updated by our operations teams. This is all ran through what we call "Middleware". The middlware uses Apache Kafka as an event streaming solution, and many microservices have been hooked up to the feeds of data coming from the ERP.

3. Due to the lack of direct integration capabilities, our Middleware system has to support external integrations where the data feed from the ERP has to be disected based on business vertical, segment, or customer.


## The Problem
The below flowchart illustrates the data feed coming from the ERD, entering Kafka Topics, and a few relevant microservices who are subscribed to them.




As anyone familiar with Kafka would be able to tell you, there is a very obvious race condition that will happen here. If a document from ERP system reaches the dispatcher prior to getting registered to one or more of our "domains" (this is the specific business segment, vertical, or customer), it will fail to be dispatched to the downstream consumers who are patiently waiting for that data.

This race condition can really only happen under a few scenarios:

