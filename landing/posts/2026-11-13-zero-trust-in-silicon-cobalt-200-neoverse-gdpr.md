---
title: "Zero Trust Starts in the Silicon: Cobalt 200, Neoverse V3 and GDPR"
date: 2026-11-13
summary: How Cobalt 200 and Arm Neoverse CSS V3 move zero trust below the hypervisor, and why that matters for meeting GDPR's security and by-design duties.
---

*What happens to zero trust when the processor stops trusting the host*

Zero trust has a simple core: never grant trust because of where something sits, always verify, and assume breach. Most of the time we apply it to users, devices and networks. But under all of that is a machine that, until recently, everyone simply had to trust: the cloud host, its hypervisor and its operators.

GDPR doesn't let that blind spot slide. Article 32 requires controllers and processors to protect personal data with measures "appropriate to the risk", naming encryption and the ongoing confidentiality and integrity of processing systems. Article 25 asks for data protection by design and by default. If the host can read your VM's memory, you're trusting it, whether you meant to or not.

Microsoft's Cobalt 200, built on Arm Neoverse, is a useful case study in pushing zero trust down into the silicon.

## The hardware

[Cobalt 200](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/announcing-cobalt-200-azure%E2%80%99s-next-cloud-native-cpu/4469807), announced in November 2025, is Microsoft's second Arm server CPU. It's built on Arm Neoverse Compute Subsystems V3 (CSS V3), with 132 active cores, 3 MB of L2 cache per core, 192 MB of L3 system cache and TSMC's 3nm process. Its VMs [entered early access preview](https://azure.microsoft.com/en-us/blog/new-azure-cobalt-200-vms-deliver-50-performance-improvement-fully-optimized-for-modern-agentic-ai-workloads) in June 2026, with up to 128 vCPUs, each a full physical core.

The performance claims (up to 50% over Cobalt 100) get the headlines. For zero trust, three other design choices matter more.

## 1. Memory encrypted by default

Microsoft built a custom memory controller for Cobalt 200 so that memory encryption is on by default, with what it describes as negligible performance impact.

"By default" is the important phrase. Article 25(2) asks for protection by default, not protection someone remembers to switch on. A control that can't be forgotten is a control you don't have to audit for drift. In zero-trust terms, it removes an implicit assumption that physical memory is safe because it's inside the data centre.

## 2. The hypervisor stops being trusted

Cobalt 200 implements Arm's Confidential Compute Architecture (CCA), which supports hardware-based isolation of VM memory from the hypervisor and host OS.

This is zero trust's "no implicit trust by location" applied to the stack itself. In a traditional VM, the hypervisor sits above the guest and can, in principle, see everything. Under CCA's model, the guest's memory is isolated from that layer by the hardware. The cloud operator's software becomes something to verify, not something to assume.

For GDPR, that changes the shape of the processor relationship. A controller still needs a lawful basis, a processing agreement under Article 28 and appropriate safeguards. But "the provider's staff and software could technically read the data" becomes a weaker statement when hardware isolates it, and that matters for the risk assessments Articles 32 and 35 require.

## 3. Cryptography without the performance excuse

Microsoft's design modelling found compression, decompression and encryption heavily used in over 30% of cloud workloads, so Cobalt 200 carries dedicated compression and cryptography accelerators on the die. Azure SQL is the example Microsoft gives, offloading that work so cores stay on queries.

This matters for privacy more than it first appears. Article 32 weighs "the state of the art" and "the costs of implementation". When encryption is cheap in hardware, the cost argument for not encrypting gets weaker, and the expected baseline rises with it.

## Where Neoverse fits

Neoverse is Arm's infrastructure platform, and CSS V3 is a pre-integrated subsystem: cores, mesh and memory fabric that partners like Microsoft build custom chips around. That has a zero-trust upside and a catch.

The upside is a shared architecture. Features like CCA come from Arm's architecture, so the isolation model isn't a one-vendor invention.

The catch is that a shared architecture isn't a shared implementation. In my own formal study of AArch64 virtualisation, Cobalt 100 (Neoverse N2) and Cobalt 200 (Neoverse V3) turned out not to be interchangeable. What a guest can actually see and rely on has to be read from the host's own ID registers, not inferred from a product name. Zero trust says the same thing: verify the platform you're actually on.

## What this means for GDPR compliance

None of this makes a workload GDPR-compliant on its own. Hardware isolation doesn't decide your lawful basis, your retention periods or your international transfers. What it does is change the evidence you can bring:

- **Article 32:** encryption by default and hardware isolation are concrete technical measures, not policy statements.
- **Article 25:** protection that's on by default is closer to what "by design and by default" asks for than a setting in a runbook.
- **Article 34:** if a breach affects data that was encrypted and unintelligible to anyone unauthorised, communication to individuals may not be required. Encryption as a default strengthens that position.

## The zero-trust caveat

Hardware that can isolate memory is only useful if you can prove it's doing so for your workload. That means attestation (evidence of what the platform is and how it booted), and it means not taking "supported" as "enabled". Microsoft's announcements describe CCA support and default memory encryption; what a specific VM size exposes to a specific guest is something to confirm, record and re-check.

That's the real shift. Zero trust used to stop at the hypervisor. With Cobalt 200 and Neoverse V3, it can reach the memory controller. Under GDPR, the question becomes whether you can show it did.

*This is my technical view, not legal advice.* More of my work is on [my site](https://whatheheckisthis.github.io/).
