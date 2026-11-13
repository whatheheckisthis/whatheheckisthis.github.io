---
title: "Writing the Spec Before the Benchmarks: An FPGA to GPU Peer-to-Peer Pipeline on Arm"
date: 2026-11-13
summary: Designing a low-latency FPGA to GPU peer-to-peer data path on Arm, and why the most important column in the spec says pending.
---

*What I learned designing a low-latency accelerator data path, and why the most important column in the spec says "pending"*

Moving data between accelerators sounds simple until you look at the path it takes. A frame arrives at an FPGA, gets parsed, and needs to reach GPU memory. The slow way goes through the CPU: copy it into host memory, then copy it again to the GPU. The fast way skips the CPU entirely, with the FPGA writing straight into GPU memory over PCIe. That's peer-to-peer (P2P) DMA.

This project, part of my Correctness Framework for Heterogeneous Accelerator Architectures, ran from 6 April 2024 to 30 January 2025. The goal was an ultra-low-latency FPGA to GPU pipeline on a virtualised Arm Neoverse N2/V3 platform, using QEMU/KVM and VFIO for device isolation and AF_XDP for control.

## Two tracks, not one

The key design decision was to split the pipeline in two.

The control track carries small things: descriptors and doorbells. The CPU touches these, but only bounded metadata, written to the FPGA through write-combined MMIO.

The payload track carries the data itself, straight from the FPGA to GPU peer memory. In direct mode, the CPU isn't allowed to touch it. The spec writes that as an invariant: zero CPU payload copies.

The fallback is pinned host staging, the slow-but-safe path. One rule mattered more than any latency number: switching to the fallback must never happen silently. A hidden fallback counts as a test failure, because a pipeline that quietly gets slower is a pipeline nobody can reason about.

## A descriptor that can't lie

Every unit of work is a 64-byte descriptor: an ABI version and opcode, a queue and tenant ID, the target address, offset, length, a sequence number, a generation (epoch) and a completion target. Each field has a validation rule. Addresses must fall in a registered range, lengths must be non-zero and bounded, and reserved bits must be zero.

The sequence number and epoch exist for one nasty bug class: stale completions. If a late completion from an old run could recycle a buffer that's now in use, you get corrupted data with no error. So a buffer can only be reused after its epoch and sequence are checked, and a reset bumps the epoch.

## Safety before speed

The requirements put things in a strict order: DMA safety first, then ownership correctness, then tail latency, then throughput. The hard-fail conditions follow from that:

- any DMA outside the active registered region;
- any malformed frame reaching payload memory after the parser rejects it;
- any buffer reuse before completion and generation are validated;
- any silent switch from direct P2P to a staged or CPU copy path.

Isolation comes from the Arm SMMU and VFIO. Each device mapping is a tuple of stream ID, domain, address range, permission, tenant and epoch, and the negative tests try to break it: DMA below the base, past the end, writes to read-only memory, stale addresses after unmap, and reaching into an adjacent tenant. Teardown has a fixed order: stop admission, drain, disable bus mastering, unmap, then reset.

Overload gets the same treatment. When the GPU can't keep up, the pipeline has to drop at the edge or throttle the source, and every lost frame must be accounted for. Ingress has to equal accepted frames plus each category of drop, with an unexplained residual of exactly zero.

## The honest part

Here's what the final document actually says. The architecture, test matrices and acceptance limits were produced. Forty failure cases are defined across five suites: malformed input, GPU overload, SMMU negative DMA, recovery and security. But the raw evidence (benchmark data, FPGA counter dumps, PMU traces, SMMU fault logs and a platform manifest) isn't attached to the specification. So the spec counts 40 defined cases and 0 verified outcomes, and the KPIs read PENDING or LIMITED rather than PASS.

The practical constraints were real: a dedicated bare-metal N2/V3 host, PCIe routing and ACS behaviour that cloud firmware may not allow, GPU peer-memory driver support, SMMU and VFIO privileges, and PMU counter access that a provider may hide. Several of these were still "unknown" when the project period ended.

So the outcome is "conditional", and host staged transfer remains the required fallback. I could have written that up as a success. I don't think it would have survived a good reviewer, and it wouldn't help anyone who tries to build on it.

## What I'd tell someone starting this

Write the acceptance criteria before the benchmarks. Deciding up front that tail latency means p50, p99, p99.9 and max, not the mean, stops you choosing the flattering number later.

Make the slow path visible. Fallbacks are fine. Silent fallbacks aren't.

Separate "we designed it" from "we proved it". A specification with an honest PENDING column is something you can pick up and finish. One that claims everything passed is a trap.

Treat topology as a property, not an assumption. Whether two devices can talk peer-to-peer depends on the PCIe hierarchy, the ACS settings and the SMMU, not on what the software expects.

You can [read the full specification and evidence register](https://www.dropbox.com/scl/fi/lrntb1t05v04yb1wz4ei8/CBLT-2-1cf710990566.pdf?rlkey=rp2c40yxcu7wo0m9yqnl13ckc&st=1x4jym61&dl=0), and more of my work is on [my site](https://whatheheckisthis.github.io/).
