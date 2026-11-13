---
title: "What Has to Stay True: Formalising AArch64 Virtualisation in Lean 4"
date: 2026-11-13
summary: A Lean 4 study of EL2, Stage-2 translation and the KVM vCPU lifecycle on Arm Neoverse servers, and what a proof can and cannot certify.
---

*A study of EL2, Stage-2 translation and the KVM vCPU lifecycle on Arm Neoverse servers*

Most of my work is about one question: what has to stay true when nobody's looking? In identity, that's "only the right people have access." In a hypervisor, it's "a guest can only touch memory it's been given, and a virtual CPU only runs once it's properly set up."

This study, part of my Correctness Framework for Heterogeneous Accelerator Architectures, asks that question of AArch64 virtual machines on Cobalt-class Arm servers: Microsoft's Azure Cobalt 100 and 200, built on the Arm Neoverse N2 and V3 families. I reviewed a proposed execution model against the primary sources and formalised its key results in Lean 4.

## The questions

I set out five questions:

1. Does the chosen EL2 (hypervisor) profile give an EL1 guest a coherent trap and execution regime?
2. Do the Stage-2 translation registers, VMIDs and TLB maintenance actually support the isolation boundary being claimed?
3. Is the proposed KVM/arm64 vCPU state machine legal, including SVE configuration and migration?
4. Which claims are architectural, which are Linux ABI obligations, and which depend on the specific host?
5. Can every accepted claim be written down as an auditable trust object, with its source, scope, observation and test evidence?

The sources were the ones that settle arguments: the Arm Architecture Reference Manual (DDI0487K), the Armv9-A supplement (DDI0608A), the Neoverse N2 and V3 manuals, the Linux KVM API documentation and QEMU's target/arm code.

## Observational equivalence, briefly

The formal core is about what an outside observer can see. Two machine states are equivalent if they look the same from outside. A state refines another if what you observe of it sits below the other in an ordering. From four assumptions (transitions respect equivalence, the observation ordering is a preorder, embedding a state doesn't change what you see, and neither does migrating it) the proofs derive the useful results:

- Equivalent states can always take matching steps to equivalent states.
- Refinement is a proper preorder.
- Embedding and migration land in the same equivalence class as the original state.

In plain terms: if moving a VM doesn't change what can be observed, the moved VM is, for every purpose that matters, the same VM. The proof also tightens the original prose argument by deriving the reverse direction from the symmetry of equality, rather than leaving it informal.

## Three small Arm and KVM models

Alongside the theory, I wrote three deliberately small models that a reviewer can read in one sitting.

Stage-2 permissions. Access is allowed only if both Stage-1 (the guest's translation) and Stage-2 (the hypervisor's) allow it. The theorem stage2_denial_dominates proves the guest can't grant itself what the hypervisor denies.

The EL2 profile. The proposed model required HCR_EL2.TGE=0 everywhere. The proof shows that's true for the chosen non-VHE profile, and a counter-model shows it isn't universal: a VHE configuration with TGE=1 is valid too.

The vCPU lifecycle. The model proves there is no legal step from "configured" straight to "running". A vCPU has to be finalised first, the vector-length selection can't change after finalisation, and a successful migration restore lands back in a finalised state.

## What the review found

The model came out conditionally conformant after correction. The headline findings:

- Correction: Cobalt 100 is Neoverse N2 and Armv9.0-A, not Armv8.5-A.
- Correction: the vCPU state machine needs an explicit finalised state before the first KVM_RUN.
- Precision: setting the SVE vector lengths selects them; it's KVM_ARM_VCPU_FINALIZE that locks them.
- Precision: TGE=0 belongs to the non-VHE profile, not to every configuration.
- Verification gaps: Cobalt 200 feature exposure, VMID and TLB invalidation under reuse and migration, Stage-2 memory types against the real device map, and side-channel mitigations per host generation.

## What Lean proves, and what it doesn't

This is the part I most want to get across. Lean proves the consequences of the model I declared. It doesn't certify a particular Azure host, kernel, QEMU build or firmware image. A proof can reject a bad deduction, but only hardware and ABI tests can show the real system matches the model.

So the study keeps three kinds of premise apart: kernel propositions that Lean checks, specification premises taken from the Arm and KVM documents, and measured premises (ID registers, IPA width, vector-length bitmap, firmware, SKU) that have to come from a real machine.

And one more honest boundary: the environment I produced the study in had no Lean executable. The proof source contains no sorry, axiom or admit, but the final check, running `lean FormalResults.lean` and getting zero errors, is recorded as a required gate rather than claimed as done. The study's own disposition is "Formalised; kernel check and platform evidence pending." I'd rather say that than call it verified early.

## What I took from it

Product names aren't evidence. "Cobalt" covers two different cores with different features, and the only reliable answer comes from the host's own ID registers.

Small models win reviews. A proof someone can read is worth more than a big one nobody checks.

Write down what you haven't proven. A verification gap with an owner is progress. A gap hidden behind a confident claim is a future incident.

Next steps are the ones the study lists: run the Lean check in CI, add negative lifecycle tests, and collect SKU-level evidence from real N2 and V3 hosts.

The Lean artefact is on [GitHub](https://github.com/whatheheckisthis/Intent-to-Auditable-Trust-Object-v7), and you can [read the full study](https://www.dropbox.com/scl/fi/nfrnwf5lten7b74ud1fbn/A64-CBLT-STUDY-001-eca7fe16806a.pdf?rlkey=rl6pegel190x12yx8mhkpbn7s&st=kjv0iqll&dl=0).
