---
title: "Azure Boost and the Zero-Trust I/O Path in the Age of GDPR"
date: 2026-11-13
summary: How Azure Boost moves storage and networking onto attested silicon, why removing bounce buffers matters for confidential data, and what it means for GDPR evidence.
---

*Your data is only as private as the path it takes to disk and network*

We spend a lot of effort encrypting data at rest and in transit. The gap is usually in between: the moment data leaves a VM's memory and passes through the host on its way to storage or the network. In a zero-trust model, that path is part of the attack surface. Under GDPR, it's part of the processing you're responsible for securing.

Azure Boost is Microsoft's answer to that path, and its newest generation is a good example of zero trust applied to I/O.

## What Azure Boost is

Azure Boost offloads virtualisation, networking and storage from the host onto dedicated hardware. The [new generation](https://techcommunity.microsoft.com/blog/azurecompute/announcing-the-general-availability-of-the-next-generation-of-azure-boost/4519136), generally available since May 2026, is a PCIe card built around a single ASIC with three parts:

- an ASIC and FPGA hybrid that handles storage acceleration, virtual network encryption, remote storage encryption and the data path;
- the Microsoft Azure Network Adapter (MANA), with up to 400 Gbps of networking;
- a separate Arm-based SoC that runs the card's control plane and is physically isolated from both the customer VM and the data path.

Cobalt 200 systems have the latest Boost capabilities built in. Against Cobalt 100, Microsoft quotes 20% higher remote storage IOPS and 15% higher network bandwidth for Cobalt 200 VMs.

## Zero trust, applied to the card

What stands out in Microsoft's description is how closely Boost's security model follows zero-trust principles.

**Verify before trust.** Every Boost device is anchored by Cerberus, Microsoft's open-sourced hardware root of trust, certified to NIST SP 800-193. Cerberus measures and attests firmware before Boost is allowed to start. If anything is off, the card doesn't come up.

**Keep verifying.** The Azure Attestation Service periodically checks that each device is running known-good firmware and software. Devices that fail are taken out of service automatically. That's continuous verification, not a one-off check at install.

**Separate control from data.** The Arm SoC manages the card without touching customer data. Networking and storage I/O are cryptographically separated per tenant on the data path, and critical components are written in memory-safe languages.

**Minimise the host.** Because Boost owns the I/O path, the host runs a smaller, hardened software stack with fewer privileged components. Less software that can see your data means less to trust.

## The bounce-buffer problem

The most interesting part for privacy is what Microsoft calls the Azure Boost Confidential Device.

In confidential computing today, a VM's memory is encrypted with a key that devices can't see. So every I/O has to be copied from private memory into a shared "bounce buffer" before a network card or storage controller can use it. That's an extra copy and an extra encrypt and decrypt cycle on every operation. It costs performance, and it creates a staging area that sits outside the VM's protected memory.

The Boost Confidential Device removes that step. A confidential VM attests the Boost hardware and firmware using TDISP, a PCI-SIG standard, and then lets the attested device read encrypted VM memory directly over IDE-encrypted PCIe links. No bounce buffer. The Arm SoC stays outside the trust boundary; only the attested ASIC, FPGA and real-time firmware are included. Microsoft says these attested offloads perform at near parity with general-purpose VMs.

That's zero trust in its purest form: the device is trusted with data only after it proves what it is, and only the parts that need access get it.

A note on timing: Microsoft says the hardware foundation ships on every card today, with VM sizes using it entering preview on Intel first and AMD after, and that Arm-based families will also ship on this Boost generation. The confidential I/O feature on Arm isn't something to assume yet.

## Why this matters under GDPR

**Article 32, security of processing.** It asks for encryption and for the ongoing confidentiality and integrity of processing systems, taking into account the state of the art. Per-tenant cryptographic isolation on the I/O path and encrypted PCIe links are exactly that kind of technical measure. As this becomes the state of the art, it becomes part of the baseline.

**Article 32(1)(d), testing.** GDPR asks for a process to regularly test and evaluate security measures. Continuous attestation, where non-compliant devices are pulled from service, is a measurable version of that.

**Article 25, by design and by default.** Microsoft has signalled remote storage encryption enabled by default as this Boost generation spreads across VM families. Default encryption is protection by default.

**Article 34, breach communication.** Where breached data was encrypted and unintelligible to unauthorised people, notifying affected individuals may not be required. Keeping data encrypted along the whole I/O path, not just at the endpoints, helps keep that true.

**Assurance you can show.** Microsoft's own framing is that hardware root of trust and attestation let customers and regulators verify the platform "cryptographically, not contractually". That's the shift worth paying attention to. GDPR accountability (Article 5(2)) asks controllers to demonstrate compliance, and attestation evidence is far stronger than a clause in a contract.

## What I'd still check

- Which VM sizes actually run on the new Boost generation, and which confidential I/O features they expose today.
- Whether remote storage encryption is on by default for your specific SKU, not just announced.
- Whether you can get attestation evidence into your own records. Evidence the provider holds but you can't produce is weaker in an audit.
- What happens on fallback. If a VM ever drops back to a software or bounce-buffer path, you want to know, not discover it later.

## The bigger picture

Zero trust used to mean "don't trust the network". Azure Boost pushes it further: don't trust the host, don't trust the card until it proves itself, and don't copy data anywhere it doesn't need to go. Under GDPR, that turns secure I/O from a promise into something you can evidence.

*This is my technical view, not legal advice.* More of my work is on [my site](https://whatheheckisthis.github.io/).
