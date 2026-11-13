---
title: "From Intent to Evidence: Building IĀTŌ, an Index That Turns Identity Data Into Proof"
date: 2026-11-13
summary: How IĀTŌ normalises SailPoint and Entra ID data and checks it against access-control rules written as code, with an honest status of what is built.
---

*Why "we have a policy for that" isn't the same as "we can show you"*

Every access review I've been near has the same awkward moment. Someone asks, "Do all our privileged accounts have MFA?" and the honest answer is, "They should." There's a policy. There's an intent. What's missing is evidence an auditor can actually trace.

IĀTŌ (the Intent-to-Auditable-Trust-Object Index) is my attempt to close that gap. It's a read-only collector and policy harness: it pulls identity data from the systems that hold it, puts it into one shape, and checks it against access-control rules written as code. The output isn't a dashboard. It's a record that says what was checked, against what, and what came back.

## The problem: identity lives in too many places

In a typical hybrid estate, identity governance sits in one tool and the directory sits in another. SailPoint IdentityIQ knows who should have access. Microsoft Entra ID knows who actually does. Neither, on its own, answers the auditor's question.

So the first job is boring and essential: normalisation. IĀTŌ reads SailPoint IIQ XML exports and Entra ID snapshots and turns both into a single JSON document with the same fields, whichever system they came from. Once identity data looks the same, you can ask the same question of all of it.

## How it works

There are three moving parts.

1. Collectors and normalisers. A SailPoint IIQ XML normaliser and a live Entra ID collector built on Microsoft Graph. There's also an AWS IAM collector, which works on its own but isn't wired into the main CLI yet.

2. Policies as code. Controls are written in Rego, the language behind Open Policy Agent. A control is a small, readable rule that denies when the evidence doesn't hold up.

3. A test harness. Unit tests check the parts, and mutation fixtures check the policies themselves: known PASS and FAIL cases that a policy has to get right before I trust it on real data.

Running it looks like this:

```sh
python -m iato.cli --sailpoint-xml input/iiq-export.xml --entra-json input/entra-snapshot.json
```

## The first two controls

I started with the two controls that come up in nearly every privileged-access conversation.

IATO-AC-012, MFA for privileged accounts. It denies when an account is privileged and MFA isn't enabled.

IATO-AC-013, standing privileged access elimination. It denies when an account is privileged and holds that privilege permanently rather than just in time.

Each control carries crosswalk tags to the frameworks people actually get audited against: NZISM, the Essential Eight, ISO 27001 and SOC 2. AC-012 maps to the Essential Eight's Multi-factor Authentication at ML3, for example, and AC-013 to Restrict Administrative Privileges at ML3. Those tags are indicators, not certification. An assessor still has to validate them, and the tool says so.

## Why "trust object"?

The name comes from the idea at the heart of the project. A claim about access ("privileged accounts use MFA") should travel with everything needed to check it: where the data came from, what scope it covers, what was observed and what test was run. Bundle those together and you get a trust object. It isn't a promise, it's a receipt.

That idea turned out to be bigger than identity. I used the same structure in my formal work on Arm virtualisation, where every accepted claim had to carry its source, scope, observation and test evidence. Different domain, same question: how do you know?

## Where it stands

I'd rather be precise than impressive, so here's the honest status:

- The multi-source CLI, the IIQ normaliser and the Entra ID collector are implemented in Python.
- Two controls are implemented. The compliance crosswalk lists 40, so 38 are still planned, across access control, configuration management, AI governance, backup and recovery, incident management and supply-chain integrity.
- It ships as a container image built on python:3.12-slim. There are no Kubernetes manifests yet.

## What I learned

Start with the question an auditor will ask, then work backwards to the data. It's tempting to build the collector first and figure out the controls later. Doing it the other way round kept the scope honest: every field I collect exists because a control needs it.

Test the rules, not just the code. A policy that silently passes everything looks exactly like a policy that works. Mutation fixtures, deliberately broken inputs that must fail, were the cheapest way to catch that.

Label the gaps. Saying "2 implemented, 38 planned" out loud is more useful to a reviewer than a vague "in progress". It's also more useful to me.

## What's next

More access-control rules from the crosswalk, wiring the AWS collector into the CLI, and tightening the evidence each check leaves behind. If you work on identity governance or access assurance and want to compare notes, I'd like to hear from you.

The code, docs and crosswalk are on [GitHub](https://github.com/whatheheckisthis/Intent-to-Auditable-Trust-Object-Index). You can find more of my work on [my site](https://whatheheckisthis.github.io/).
