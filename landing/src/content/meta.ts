import { SITE } from "./site";
import { findPost } from "./posts";

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  type: "website" | "article";
}

export function metaFor(path: string): PageMeta {
  if (path === "/case-studies/") {
    return {
      title: `Case Studies | ${SITE.name}`,
      description: "FPGA to GPU peer-to-peer pipeline: zero-copy P2P over PCIe, DMA bus mastering and SMMU address translation on Arm Neoverse.",
      path,
      type: "article",
    };
  }
  if (path === "/blog/") {
    return { title: `Blog | ${SITE.name}`, description: `Notes on identity, access and assurance by ${SITE.name}.`, path, type: "website" };
  }
  const m = /^\/blog\/([^/]+)\/$/.exec(path);
  const post = m?.[1] ? findPost(m[1]) : undefined;
  if (post) {
    return { title: `${post.title} | ${SITE.name}`, description: post.summary, path, type: "article" };
  }
  return { title: `${SITE.name}, Identity Engineer`, description: SITE.description, path: "/", type: "website" };
}
