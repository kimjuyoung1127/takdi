"use client";

import type {
  Block,
  BannerStripBlock,
  ComparisonBlock,
  CtaBlock,
  DividerBlock,
  FaqBlock,
  HeroBlock,
  ImageFullBlock,
  ImageGridBlock,
  ImageTextBlock,
  NoticeBlock,
  PricePromoBlock,
  ReviewBlock,
  SellingPointBlock,
  SpecTableBlock,
  TextBlockBlock,
  TrustBadgeBlock,
  UsageStepsBlock,
  VideoBlock,
} from "@/types/blocks";
import { getFontFamily } from "@/lib/constants";

interface ReadOnlyBlockRendererProps {
  block: Block;
}

export function ReadOnlyBlockRenderer({ block }: ReadOnlyBlockRendererProps) {
  switch (block.type) {
    case "hero":
      return <HeroBlockView block={block} />;
    case "selling-point":
      return <SellingPointBlockView block={block} />;
    case "text-block":
      return <TextBlockView block={block} />;
    case "image-text":
      return <ImageTextBlockView block={block} />;
    case "image-full":
      return <ImageFullBlockView block={block} />;
    case "image-grid":
      return <ImageGridBlockView block={block} />;
    case "spec-table":
      return <SpecTableBlockView block={block} />;
    case "comparison":
      return <ComparisonBlockView block={block} />;
    case "review":
      return <ReviewBlockView block={block} />;
    case "divider":
      return <DividerBlockView block={block} />;
    case "video":
      return <VideoBlockView block={block} />;
    case "cta":
      return <CtaBlockView block={block} />;
    case "usage-steps":
      return <UsageStepsBlockView block={block} />;
    case "faq":
      return <FaqBlockView block={block} />;
    case "notice":
      return <NoticeBlockView block={block} />;
    case "banner-strip":
      return <BannerStripBlockView block={block} />;
    case "price-promo":
      return <PricePromoBlockView block={block} />;
    case "trust-badge":
      return <TrustBadgeBlockView block={block} />;
    default:
      return null;
  }
}

function HeroBlockView({ block }: { block: HeroBlock }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
      <img
        src={block.imageUrl}
        alt=""
        className="h-auto w-full object-cover"
        style={buildFilterStyle(block.imageFilters)}
      />
      {block.overlays.map((overlay) => (
        <div
          key={overlay.id}
          className="absolute whitespace-pre-wrap"
          style={{
            left: `${overlay.x}%`,
            top: `${overlay.y}%`,
            transform: "translate(-50%, -50%)",
            color: overlay.color,
            fontSize: overlay.fontSize,
            fontWeight: overlay.fontWeight,
            textAlign: overlay.textAlign,
            fontFamily: getFontFamily(overlay.fontFamily),
          }}
        >
          {overlay.text}
        </div>
      ))}
    </section>
  );
}

function SellingPointBlockView({ block }: { block: SellingPointBlock }) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        {block.items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="text-2xl">{item.icon}</div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TextBlockView({ block }: { block: TextBlockBlock }) {
  const fontSizeClass = {
    sm: "text-base",
    base: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  }[block.fontSize ?? "base"];

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm" style={{ textAlign: block.align }}>
      <h2 className="text-3xl font-semibold text-gray-900" style={{ fontFamily: getFontFamily(block.fontFamily) }}>
        {block.heading}
      </h2>
      <p className={`mt-4 whitespace-pre-wrap leading-8 text-gray-600 ${fontSizeClass}`} style={{ fontFamily: getFontFamily(block.fontFamily) }}>
        {block.body}
      </p>
    </section>
  );
}

function ImageTextBlockView({ block }: { block: ImageTextBlock }) {
  const media = (
    <img
      src={block.imageUrl}
      alt=""
      className="h-full w-full rounded-2xl object-cover"
      style={buildFilterStyle(block.imageFilters)}
    />
  );

  const text = (
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl font-semibold text-gray-900" style={{ fontFamily: getFontFamily(block.fontFamily) }}>
        {block.heading}
      </h2>
      <p className="mt-4 whitespace-pre-wrap text-lg leading-8 text-gray-600" style={{ fontFamily: getFontFamily(block.fontFamily) }}>
        {block.body}
      </p>
    </div>
  );

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        {block.imagePosition === "left" ? (
          <>
            {media}
            {text}
          </>
        ) : (
          <>
            {text}
            {media}
          </>
        )}
      </div>
    </section>
  );
}

function ImageFullBlockView({ block }: { block: ImageFullBlock }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
      <img
        src={block.imageUrl}
        alt=""
        className="h-auto w-full object-cover"
        style={buildFilterStyle(block.imageFilters)}
      />
      {block.overlays.map((overlay) => (
        <div
          key={overlay.id}
          className="absolute whitespace-pre-wrap"
          style={{
            left: `${overlay.x}%`,
            top: `${overlay.y}%`,
            transform: "translate(-50%, -50%)",
            color: overlay.color,
            fontSize: overlay.fontSize,
            fontWeight: overlay.fontWeight,
            textAlign: overlay.textAlign,
            fontFamily: getFontFamily(overlay.fontFamily),
          }}
        >
          {overlay.text}
        </div>
      ))}
    </section>
  );
}

function ImageGridBlockView({ block }: { block: ImageGridBlock }) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <div className={`grid gap-4 ${block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {block.images.map((image, index) => (
          <figure key={`${image.url}-${index}`} className="overflow-hidden rounded-2xl bg-gray-50">
            <img
              src={image.url}
              alt={image.caption}
              className="aspect-square w-full object-cover"
              style={buildFilterStyle(block.imageFilters)}
            />
            {image.caption ? <figcaption className="p-3 text-sm text-gray-600">{image.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

function SpecTableBlockView({ block }: { block: SpecTableBlock }) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">{block.title}</h2>
      <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
        {block.rows.map((row, index) => (
          <div
            key={`${row.label}-${index}`}
            className="grid grid-cols-[minmax(120px,220px)_1fr] border-b border-gray-100 last:border-b-0"
          >
            <div className="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">{row.label}</div>
            <div className="px-4 py-3 text-sm text-gray-600">{row.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComparisonBlockView({ block }: { block: ComparisonBlock }) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">{block.title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ComparisonCard label={block.before.label} imageUrl={block.before.imageUrl} filters={block.imageFilters} />
        <ComparisonCard label={block.after.label} imageUrl={block.after.imageUrl} filters={block.imageFilters} />
      </div>
    </section>
  );
}

function ComparisonCard({
  label,
  imageUrl,
  filters,
}: {
  label: string;
  imageUrl: string;
  filters: HeroBlock["imageFilters"];
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100">
      <div className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">{label}</div>
      <img src={imageUrl} alt={label} className="aspect-square w-full object-cover" style={buildFilterStyle(filters)} />
    </article>
  );
}

function ReviewBlockView({ block }: { block: ReviewBlock }) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">{block.title}</h2>
      <div className="mt-5 grid gap-4">
        {block.reviews.map((review, index) => (
          <article key={`${review.author}-${index}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="font-medium text-gray-900">{review.author}</div>
              <div className="text-amber-500">{"★".repeat(Math.max(0, Math.min(5, review.rating)))}</div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">{review.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DividerBlockView({ block }: { block: DividerBlock }) {
  if (block.style === "space") {
    return <div style={{ height: block.height }} />;
  }

  if (block.style === "dot") {
    return (
      <div className="flex justify-center py-4">
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="h-px w-full bg-gray-200" style={{ minHeight: block.height > 1 ? 2 : 1 }} />
    </div>
  );
}

function VideoBlockView({ block }: { block: VideoBlock }) {
  if (block.mediaType === "gif") {
    return (
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <img src={block.posterUrl || block.videoUrl} alt="" className="h-auto w-full object-cover" />
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <video className="h-auto w-full" src={block.videoUrl} poster={block.posterUrl} controls muted playsInline />
    </section>
  );
}

function CtaBlockView({ block }: { block: CtaBlock }) {
  return (
    <section
      className="rounded-3xl p-8 text-center shadow-sm"
      style={{ backgroundColor: block.bgColor ?? "#111827", color: "#ffffff" }}
    >
      <h2 className="text-3xl font-semibold">{block.text}</h2>
      {block.subtext ? <p className="mt-3 text-base text-white/80">{block.subtext}</p> : null}
      <div className="mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold" style={{ backgroundColor: block.buttonColor ?? "#ffffff", color: block.bgColor ?? "#111827" }}>
        {block.buttonLabel || "Learn more"}
      </div>
    </section>
  );
}

function UsageStepsBlockView({ block }: { block: UsageStepsBlock }) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">{block.title}</h2>
      <div className="mt-5 grid gap-4">
        {block.steps.map((step, index) => (
          <article key={`${step.label}-${index}`} className="grid gap-4 rounded-2xl border border-gray-100 p-4 md:grid-cols-[120px_1fr]">
            <img src={step.imageUrl} alt={step.label} className="aspect-square w-full rounded-xl object-cover" />
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Step {index + 1}</div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{step.label}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const NOTICE_ICON_MAP: Record<string, string> = {
  truck: "🚚", refresh: "🔄", shield: "🛡️", info: "ℹ️",
  alert: "⚠️", clock: "⏰", phone: "📞", gift: "🎁",
};

const BADGE_ICON_MAP: Record<string, string> = {
  "check-circle": "✅", shield: "🛡️", award: "🏆", leaf: "🌿",
  heart: "❤️", star: "⭐", lock: "🔒", "thumbs-up": "👍",
  lab: "🧪", globe: "🌐",
};

function FaqBlockView({ block }: { block: FaqBlock }) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">{block.title}</h2>
      <div className="mt-5 space-y-3">
        {block.items.map((item, index) => (
          <details key={`${item.question}-${index}`} className="rounded-2xl border border-gray-100">
            <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-gray-900">
              {item.question}
            </summary>
            <div className="border-t border-gray-100 px-5 py-4 text-sm leading-6 text-gray-600">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function NoticeBlockView({ block }: { block: NoticeBlock }) {
  return (
    <section className="rounded-3xl bg-gray-50 p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-700">{block.title}</h2>
      <div className="mt-4 space-y-2">
        {block.items.map((item, index) => (
          <div key={`${item.text}-${index}`} className="flex items-start gap-2">
            <span className="shrink-0 text-sm">{NOTICE_ICON_MAP[item.icon] ?? "ℹ️"}</span>
            <p className="text-xs leading-5 text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BannerStripBlockView({ block }: { block: BannerStripBlock }) {
  return (
    <section
      className="rounded-3xl px-8 py-5 text-center shadow-sm"
      style={{ backgroundColor: block.bgColor ?? "#4f46e5", color: block.textColor ?? "#ffffff" }}
    >
      <p className="text-lg font-bold">{block.text}</p>
      {block.subtext ? <p className="mt-1 text-sm opacity-80">{block.subtext}</p> : null}
    </section>
  );
}

function PricePromoBlockView({ block }: { block: PricePromoBlock }) {
  const discountRate = block.originalPrice > 0
    ? Math.round(((block.originalPrice - block.salePrice) / block.originalPrice) * 100)
    : 0;

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      {block.badge ? (
        <span className="mb-3 inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
          {block.badge}
        </span>
      ) : null}
      <h2 className="text-2xl font-semibold text-gray-900">{block.productName}</h2>
      <div className="mt-4 flex items-end gap-3">
        {discountRate > 0 && <span className="text-3xl font-extrabold text-red-500">{discountRate}%</span>}
        <div>
          {block.originalPrice > 0 && block.originalPrice !== block.salePrice && (
            <p className="text-sm text-gray-400 line-through">{block.originalPrice.toLocaleString("ko-KR")}원</p>
          )}
          <p className="text-3xl font-bold text-gray-900">{block.salePrice.toLocaleString("ko-KR")}원</p>
        </div>
      </div>
      {block.expiresLabel ? <p className="mt-3 text-sm text-red-400">{block.expiresLabel}</p> : null}
    </section>
  );
}

function TrustBadgeBlockView({ block }: { block: TrustBadgeBlock }) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900">{block.title}</h2>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-6">
        {block.badges.map((badge, index) => (
          <div key={`${badge.label}-${index}`} className="flex flex-col items-center gap-2">
            <span className="text-4xl">{BADGE_ICON_MAP[badge.icon] ?? "✅"}</span>
            <span className="text-sm font-medium text-gray-600">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildFilterStyle(filters?: HeroBlock["imageFilters"]) {
  if (!filters) {
    return undefined;
  }

  return {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)`,
  };
}
