---
title: "Race Conditions in Event Streaming Dependent Services"
date: 2024-01-19T16:31:34Z
image: /images/posts/post-8.jpg
categories:
  - Design
  - Architecture
post_id: 8AFAF878-4187-4CFD-9F38-5F9A97D6E262
draft: false
---

# Race Conditions in Event Streaming Dependent Services

**Disclaimer:** Details below have been changed to retain some level of obfuscation to my employer's tech stack, ERP systems, etc.

## "Standard Operating Procedure"

Everyone with a year or more experience in almost any industry has heard the phrase: "It's standard operating procedure." For me personally, this phrase sets off alarm bells when stated in a requirements or business logic discovery meeting. There is an other common phrase, typically said less in the workplace, and I feel its an appropriate dichotomy to SOP. That is: "Rules are meant to be broken."

If a business leader ever states, "Its standard operating procedure" or "That should never happen". You should bet the house on the exact thing occurring within 6 months of pushing a feature or product that depends on SOP being followed. When that same leader comes to your desk and says "Well I didn't mean _that_ process, or _that_ customer!". 


## Required Reading

My employer operates in the Transportation and Logistics industry. This industry is a notoriously difficult one for "disruptors" to establish themselves, regardelss of how much [VC money they collect](https://www.geekwire.com/2023/convoy-collapse-read-ceos-memo-detailing-sudden-shutdown-of-seattle-trucking-startup/). I will probably write another blog post about why I think this is, but for this article, you just need to know that the majority of data entered, configured, or communicated about shipments has a human being typing, scanning, or literally writing it down prior to any automated processes get involved. The other context you need to know is that there are typically three minimum "documents" required for moving goods: Shipments, Routings, and Invoices. **Shipments** represent the customer's view (Supplier Warehouse to customer's store). **Routings** represent the legs of the shipment (Truck from warehouse to ocean port, ocean port to ocean port, then finally ocean port to customer). **Invoices** - well those are obvious - its how we get paid after successful execution of the shipment.


**Standard Operating Procedure**:

1. An overseas agent is responsible for booking shipments into a company's ERP system on behalf of customers looking to import to the US. They also are required to enter the first Routings to coordinate moves from origin to origin ocean port. These agents are graded on metrics like "number of clicks to booking", or "minutes spent on document entry". Their incentives are such that they will find ways to do things as fast as possible.


2. Data from the ERP system is extracted via an asynchronous polling job (1 minute intervals) based on change capture tables. This data is streamed into Kafka topics.


3. "Middleware" system disects the Kafka stream based on business segment, vertical or customer for use in downstream integrations.


## The Problem Statement
The below flowchart illustrates the data feed coming from the ERP, entering Kafka Topics, and a few relevant microservices who are subscribed to them.


![StreamingFlow](/images/posts/kafka-overpressure-start.jpg)


As anyone familiar with Kafka or flow charts would be able to tell you, there is a very obvious race condition in this architecture. If a document from ERP system reaches the dispatcher prior to getting registered to one or more of our "domains" (this is the specific business segment, vertical, or customer), it will fail to be dispatched to the downstream consumers who are patiently waiting for that data.

This race condition can really only happen under a couple of scenarios, both of which are outside "SOP":


1. Changes to parent/child documents occur in the same polling interval window (1 minute)


2. An outage occurs (either Middleware or ERP system) and there is a large backlog of data.


The outage scenario is on our engineering team to solve, however, due to the nature of our ERP integration, its relatively straighforward to "rewind" any missed data, so this was much less of a concern.


### Discovery
This issue was only discovered because in our UAT, the testers were using non-SOP data entry methods. They would pre-populate both the Shipment and Routing documents, then save both in rapid succession. This was not defined in the business's SOP, but it occured twice in UAT testing. This, combined with the KPIs used to grade our overseas agents, and knowing they will be doing everything they can to enter data as quickly as possible, a solution was required.

## Solution

The team put their heads together and came up with some ideas:

- **Upstream Seeding:** Trigger new **dispatcher** events after business segment registration.
    - Pro: Guaranteed matching for same-batch messages
    - Con: O(n) x (Number of Linked documents - 1) rather than just O(n)


- **Forced Order:** Designate the order of document extract in each polling batch from the ERP so that Shipments would always be processed prior to Routings
    - Pro: Guarantees order of dependent documents
    - Con: Works for this specific scenario, but what if a business segment is registered by Routings? Then the Shipments would never find a registered Routing.


- **Delay Queue:** Delay processing of the router by a few seconds
    - Pro: Will solve this specific race condition, and allows for future scenarios unlike #2.
    - Con: Has the potential to need longer delays as the system scales
    - Con: will constantly run application until the next message is older than set lag.



We elected to implement the Delay Queue. Not only was it a straightforward code change, but the lag can be extended in the future to buy us time to find a more scalable solution. Additionally, due to our chosen Cloud Provider, we pay for our compute whether we are using the resources or not. Running the router and having it exit after a few lines of code has no impact on our compute spend.

The DelayQueue was implemented in two hours into our UAT environment and confirmed working the following business day.

## Lessons Learned

Rules are meant to, and will be broken.


