// The grid sits inside max-w-4xl (896px), with 16/24px side padding
// and 16px gaps. Keep these sizes aligned with RouteLandingPage.
export const GALLERY_SIZES =
  "(min-width: 1024px) 272px, (min-width: 896px) 416px, (min-width: 768px) calc((100vw - 64px) / 2), (min-width: 640px) calc((100vw - 48px) / 2), calc(100vw - 32px)";

export function galleryImageProps(src: string) {
  // Leave already-optimized WebP assets and non-gallery images unchanged.
  if (!/^\/img\/.+\.(png|jpe?g)$/i.test(src)) return { src };
  const base = src.replace(/\.(png|jpe?g)$/i, "");
  return {
    src: `${base}-800.webp`,
    srcSet: [400, 800, 1200].map((width) => `${base}-${width}.webp ${width}w`).join(", "),
    sizes: GALLERY_SIZES,
  };
}
