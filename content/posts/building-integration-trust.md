---
title: "building-integration-trust"
date: 2025-08-11T23:34:00Z
image: /images/posts/post-9.jpg
categories:
  - Technology
post_id: FE2B6C97-8CAF-4527-AA97-B52BC7FADA47
draft: false
---

The dicipline of Software Engineering is built on the successes and progress of those that came before. Each advancement either further replaces or abstracts the code surface from the 1s and 0s. Each layer transition represents an interface contract, or **schema** that is used to communicate up or down the abstraction stack.

Our conclusion here should be that **schemas** should not change without warning or planning, particularly those which are considered standard. There are a variety of ways that standard schema is determined.

1. Governing Organizations: ISO standards for datetime, unit of measurements, and many other categories of "schema" used to communicate across languages

2. Community Coordination: For a more modern example . . . MCP server schema for both client and server. While there is an MCP organization, the LLM development community rapidly prototypes and finds the best implementation pattern which is then added to the official MCP schema.

3. 


The discipline of Software Engineering is built on the successes and progress of those that came before.
Each advancement either replaces or further abstracts the code surface from the 1s and 0s.
Each layer transition represents an interface contract — or schema — used to communicate up or down the abstraction stack.

We accept this without question in modern software stacks:

- If your frontend sends malformed JSON to your backend, the API call fails.

- If your serializer produces invalid bytes, the service crashes.

- If a database query expects a column that no longer exists, you get an immediate error.

When the contract is broken, the system stops working — and no one is surprised.

So why do we treat file-based interfaces between trading partners differently?
When a schema breaks in an X12, EDIFACT, or custom CSV format, we often just log it, patch around it, or ignore it entirely… until the damage has propagated.

## Who decides what "schema" is?

There are a variety of ways a standard schema is determined:

- Governing Organizations
    - ISO datetime standards (e.g., ISO 8601)
    - Units of measurement (SI)
    - Structured data interchange formats

These are slow to change, but extremely stable and broadly adopted.

- Community Coordination
    - For a modern example: the MCP server schema for client-server LLM integrations.
      While there is an MCP organization, the LLM development community rapidly prototypes and iterates on patterns — the best ones are then codified into the official MCP schema.

Allows innovation while still preserving a stable, shared contract.

  - Trading Partner Agreements
    - The EDI “Implementation Guides” that define which segments and elements are used.
    - Custom flat-file or XML definitions that evolve as the business relationship changes.

These are effectively bespoke standards — which makes schema validation even more critical.


## Can you trust your system?

I recently began an integration effort with a trading partner which does not have traditional EDI software. From the outside, it seems like a home-brewed ERP with what they described as "X12 Inspired" flatfiles. 

The resulting integration has proven to be brittle, and with nearly every new scenario that is tested, breaks further.

1. Type Codes (Multiple): Their system uses three character US Customs Commodity codes. X12 uses their own limited set of 2 character codes. The trading partner just overloads the field and tells us to figure it out based on a list of several hundred possible options. Not only does this break the X12 schema, but its adding maintenance overhead.

2. Loss of Data Heirarchy: Their system doesn't enforce accurate data entry (or accurate integration) for data with a heirarchy. Think: Which products are on which pallet? Thats important information for logistics operators to know about and plan for!

Between these two aspects, it has proven difficult to maintain a robust integration layer because our trading partner doesn't know if their system will break X12 schema, and has no way to report or predict violations.

## Okay so I can't trust my schema... what now?
Unfortuntately, when trust can't be built, accountability must be enforced. 

From my perspective and experience, the only way to effectively implement an integration with a trading partner who's schema you can't trust is via monitoring and reporting. I am implmenting a weekly report to detect
