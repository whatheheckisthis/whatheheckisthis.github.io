---
title: "Cobalt 200 and the New Shape of Cloud Compute"
date: 2026-11-13
summary: What Microsoft's second Arm CPU actually changes for compute, from Neoverse V3 cores to on-chip accelerators, and why the spec sheet is only half the story.
---

*What Microsoft's second-generation Arm CPU changes, and what you should still check yourself*

When I worked through Stage-2 translation and the KVM vCPU lifecycle on Cobalt-class servers, one finding kept coming back: Cobalt 100 and Cobalt 200 are not the same machine with a bigger number. They're different cores, built on different Arm generations. Now that Cobalt 200 virtual machines are in preview, it's worth looking at what that difference means for anyone running real workloads.

## What Cobalt 200 is

Microsoft [announced Cobalt 200](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/announcing-cobalt-200-azure%E2%80%99s-next-cloud-native-cpu/4469807) in November 2025. It's built on Arm's Neoverse Compute Subsystems V3 (CSS V3), and Arm called it the first publicly announced silicon on that platform. The headline numbers:

- 132 active cores per SoC, built from two chiplets
- 3 MB of L2 cache per core and 192 MB of L3 system cache
- TSMC's 3nm process
- Per-core dynamic voltage and frequency scaling, so each of the 132 cores can run at its own performance level
- A custom memory controller with memory encryption on by default
- Arm's Confidential Compute Architecture (CCA), which isolates VM memory from the hypervisor and host OS
- Dedicated compression and cryptography accelerators on the die

Cobalt 100, by comparison, is Neoverse N2 and Armv9.0-A. Cobalt 200 moves to the V-series, Arm's performance line.

## Designed from telemetry, not benchmarks

The part of the announcement I found most interesting wasn't a spec. Microsoft said standard CPU benchmarks didn't match what it saw in Azure's own telemetry, because they lean towards core-bound work and miss how real applications use network and storage. So the team built over 140 benchmark variants from real usage patterns, then modelled them against 2,800 combinations of design parameters (core count, cache size, memory speed, server topology, power and rack layout). That's more than 350,000 configuration candidates evaluated before picking a design point.

One result of that modelling: compression, decompression and encryption showed up as heavy users of CPU time in over 30% of cloud workloads. That's why those operations got their own silicon instead of more cores.

## What the VMs deliver

Cobalt 200 VMs [entered early access preview](https://azure.microsoft.com/en-us/blog/new-azure-cobalt-200-vms-deliver-50-performance-improvement-fully-optimized-for-modern-agentic-ai-workloads) at Microsoft Build in June 2026. Compared to Cobalt 100 VMs, Microsoft quotes:

- up to 50% better CPU performance
- 20% higher remote storage IOPS and 10% better remote storage throughput with NVMe
- 15% higher network bandwidth
- up to 135% better performance on cloud database workloads, 80% on caching, 45% on communication encryption and 40% on web serving

Sizes go up to 128 vCPUs, and each vCPU is a full physical core. Two new families join the line-up: high-memory Mpsv4 (16 GiB per vCPU) and storage-dense Lpsv5 (up to 23 TB of local NVMe). The preview regions listed were West US3, East US2, Central US, Sweden Central, East US, West US2, Spain Central and Indonesia Central.

Every one of those figures is "up to", and Microsoft says results vary by workload. Treat them as a reason to benchmark, not a promise.

## What actually changes for compute

**The CPU stops doing chores.** For years, a big slice of server CPU went on work the application didn't care about: compressing pages, encrypting traffic, moving bytes. Cobalt 200 puts compression and crypto on dedicated blocks, and Azure Boost takes networking and storage off the host. Azure SQL is the example Microsoft gives, offloading compression and encryption so cores go to queries. The CPU is becoming the part of the server that runs your code, and very little else.

**Per-core behaviour matters more than per-socket.** With per-core DVFS, a dedicated 3 MB L2 per core and no shared hyperthreads, two neighbouring workloads interfere less. Microsoft pitches this at agent sandboxes, but it helps anything that needs predictable latency.

**Security moves into the silicon.** Memory encryption on by default and CCA support mean confidentiality is becoming a property of the hardware, not a configuration someone remembered to turn on. For anyone who works in assurance, that changes the question from "is it enabled?" to "can the platform prove it?"

## What I'd still check

This is where my own study comes in. In that review, Cobalt 200 feature exposure was a verification gap, not a conclusion, and it still is for anyone migrating. "Fully compatible with Cobalt 100 workloads" is a statement about software running. It isn't a statement that every feature, vector length or mitigation is identical.

Before moving anything serious, I'd:

1. Read the guest's own ID registers and SVE vector-length set on both generations, rather than trusting the product name.
2. Define the CPU contract a workload needs and test it on N2 and V3 hosts separately.
3. Benchmark with real request sizes, concurrency and failure behaviour. A synthetic CPU loop tells you almost nothing about a storage-heavy service.
4. Record the evidence: SKU, region, kernel, firmware and results, so the next person doesn't have to guess.

## Why it matters

Cobalt 200 is the clearest sign yet that the cloud CPU is being designed around what the cloud actually does: lots of small, encrypted, compressed, networked work. The compute you rent is getting faster, but it's also getting more specialised. That makes it more important, not less, to know exactly what you're running on.

If you're evaluating Arm in Azure, or working on how to prove what a platform does, I'd like to compare notes. More of my work is on [my site](https://whatheheckisthis.github.io/).
