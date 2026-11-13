---
title: "The Storage Path Is the New Compute: How Azure and Next-Generation Arm Will Change Storage"
date: 2026-11-13
summary: Why offload silicon, on-chip accelerators and confidential I/O are moving storage off the host CPU, and what that means for performance and assurance.
---

*Why the interesting work in storage is moving off the CPU, and what that means for how we prove it's safe*

For most of cloud history, storage performance was a disk problem. Get faster drives, add more of them, and the numbers go up. That era is ending. With Azure's new generation of Azure Boost and Arm servers like Cobalt 200, the drive is rarely the limit any more. The limit is the path data takes to get there, and who has to touch it on the way.

This is my view of where that's heading. The facts come from Microsoft's own announcements; the conclusions are mine.

## Where storage time actually goes

Every read or write in a VM used to pass through layers of software on the host: the hypervisor, a virtual storage stack, encryption, sometimes compression. Each layer costs CPU cycles and adds latency and jitter. In confidential computing it gets worse. Because a confidential VM's memory is encrypted with a key devices can't see, every I/O has to be copied into a shared bounce buffer first. That's an extra copy and an extra encrypt and decrypt on every operation.

I spent a long time on this pattern in my FPGA to GPU work. The hard rule there was zero CPU payload copies, and any silent fallback to a staged copy counted as a failure. The cloud is now running into the same rule at enormous scale.

## Change one: storage moves onto its own silicon

The [new generation of Azure Boost](https://techcommunity.microsoft.com/blog/azurecompute/announcing-the-general-availability-of-the-next-generation-of-azure-boost/4519136), generally available since May 2026, is a PCIe card built around one ASIC with three parts: an ASIC and FPGA hybrid for storage and network data paths, the MANA network adapter, and a separate Arm-based SoC that runs the card's control plane without touching customer data.

The key shift is that most storage and networking data now moves through hardened ASIC logic, not software or even the FPGA. Microsoft quotes up to 1 million remote storage IOPS and up to 21 million local NVMe IOPS for the platform, and says the host core savings have released millions of CPU cores back to customer workloads.

Put simply, storage is becoming a device with its own processor, its own security boundary and its own firmware, not a service the host CPU provides.

## Change two: the CPU gets storage-shaped accelerators

On the compute side, [Cobalt 200](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/announcing-cobalt-200-azure%E2%80%99s-next-cloud-native-cpu/4469807) adds dedicated compression and cryptography blocks, after Microsoft's modelling found those operations heavily used in over 30% of cloud workloads. Both are storage's oldest taxes. Databases compress pages and encrypt them at rest. Doing that in fixed-function silicon means the cores stay free for queries.

Its VMs already show the combined effect against Cobalt 100: 20% higher remote storage IOPS and 10% higher remote storage throughput with NVMe, plus a new Lpsv5 family with up to 23 TB of local NVMe for data staging, search and analytics.

## Change three: encrypted end to end, without the copy

This is the change I think matters most. Microsoft's coming Azure Boost Confidential Device lets a confidential VM attest the Boost hardware and then let it read encrypted VM memory directly, over IDE-encrypted PCIe links using the PCI-SIG TDISP standard. No bounce buffer, no extra copy. Microsoft says attested confidential offloads perform at near parity with ordinary VMs in its benchmarks.

That feature is starting on Intel and AMD platforms, and Microsoft says Arm-based families will also ship on this Boost generation. On the Arm side, Cobalt 200 already implements Arm's Confidential Compute Architecture and encrypts memory by default. Put those together and the direction is clear: data stays encrypted from the VM to the device, and the device has to prove what it is before it's trusted with it.

## What this means in practice

**The bottleneck moves.** When the CPU isn't copying, compressing and encrypting, storage performance depends on the data path design: queue depth, request size, where the offload sits and how it fails. Teams that only watch disk metrics will miss it.

**Local and remote converge on NVMe.** VMs see NVMe interfaces whether storage is local or remote, so the gap becomes a question of latency and placement more than protocol.

**Assurance becomes attestation.** If a storage device can read your encrypted memory, "do we trust the cloud?" becomes "can this device prove its firmware and identity right now?" Azure Boost is anchored by Cerberus, a hardware root of trust certified to NIST SP 800-193, and devices that fail attestation are taken out of service. For regulated workloads that's a different kind of evidence: cryptographic rather than contractual.

**Silent fallbacks become the risk.** The more an I/O path depends on special hardware, the more important it is to know when you're not on it. A VM that quietly drops back to a software or bounce-buffer path will just get slower and nobody will know why. That's a monitoring problem, and an assurance one.

## What I'd watch next

Three things will show whether this lands: how quickly confidential I/O reaches Arm SKUs, whether remote storage encryption by default becomes standard across VM families as Microsoft has signalled, and whether providers expose enough telemetry for customers to see which data path their I/O actually took.

Storage used to be the slow part we threw hardware at. It's becoming a piece of trusted infrastructure in its own right, with its own silicon and its own proof obligations. That's the bit I find exciting.

If you work on cloud storage, confidential computing or platform assurance, I'd like to hear how you're thinking about it. More of my work is on [my site](https://whatheheckisthis.github.io/).
