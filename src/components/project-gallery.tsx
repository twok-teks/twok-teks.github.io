"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ContentMedia } from "@/content/types";
import { Icon } from "./icon";

function PdfPageCanvas({
  src,
  page,
  label,
}: {
  src: string;
  page: number;
  label: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    let cancelWork: (() => void) | undefined;

    async function renderPage() {
      await Promise.resolve();
      if (!cancelled) setStatus("loading");
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const loadingTask = pdfjs.getDocument({ url: src });
        cancelWork = () => {
          void loadingTask.destroy();
        };
        const document = await loadingTask.promise;
        const pdfPage = await document.getPage(page);
        const viewport = pdfPage.getViewport({ scale: 1.8 });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) {
          await loadingTask.destroy();
          return;
        }
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const renderTask = pdfPage.render({ canvas, viewport });
        cancelWork = () => renderTask.cancel();
        await renderTask.promise;
        await loadingTask.destroy();
        if (!cancelled) setStatus("ready");
      } catch (error) {
        if (
          !cancelled &&
          (error as Error).name !== "RenderingCancelledException"
        ) {
          setStatus("error");
        }
      }
    }

    void renderPage();
    return () => {
      cancelled = true;
      cancelWork?.();
    };
  }, [page, src]);

  return (
    <div className="project-pdf-page" data-status={status}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`${label}, page ${page}`}
      />
      {status === "loading" && <span>Rendering page {page}…</span>}
      {status === "error" && (
        <a href={`${src}#page=${page}`}>Open page {page} in the PDF</a>
      )}
    </div>
  );
}
export function ProjectGallery({
  items,
  title,
  variant = "preview",
}: {
  items: ContentMedia[];
  title: string;
  variant?: "preview" | "detail";
}) {
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const item = items[index];
  const isPdf = item.type === "pdf";
  const total = isPdf ? item.pageCount : items.length;
  const position = isPdf ? page : index + 1;
  const canMove = total > 1;

  function move(direction: -1 | 1) {
    if (isPdf) {
      setPage((current) => ((current - 1 + direction + total) % total) + 1);
      return;
    }
    setPage(1);
    setIndex((current) => (current + direction + items.length) % items.length);
  }

  return (
    <figure
      className={`project-gallery project-gallery-${variant}`}
      aria-label={`${title} media gallery`}
    >
      <div className="project-gallery-stage">
        {item.type === "image" ? (
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            priority={item.priority}
            sizes={
              variant === "detail"
                ? "(max-width: 768px) 100vw, 1160px"
                : "(max-width: 800px) 100vw, 700px"
            }
          />
        ) : item.type === "pdf" ? (
          <PdfPageCanvas
            key={`${item.src}-${page}`}
            src={item.src}
            page={page}
            label={item.label}
          />
        ) : item.type === "video" ? (
          <video
            controls
            playsInline
            preload="metadata"
            poster={item.poster}
            aria-label={item.label}
          >
            <source src={item.src} />
            <track
              kind="captions"
              src={item.captions}
              srcLang="en"
              label="English"
              default
            />
          </video>
        ) : (
          <div className="code-media">
            <span className="meta-label">{item.language}</span>
            <pre>
              <code>{item.code}</code>
            </pre>
          </div>
        )}
        {canMove && (
          <div className="project-gallery-controls">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label={isPdf ? "Previous page" : "Previous image"}
            >
              <Icon name="arrow-left" size={17} />
            </button>
            <span aria-live="polite">
              {isPdf ? "PAGE" : "IMAGE"} {String(position).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label={isPdf ? "Next page" : "Next image"}
            >
              <Icon name="arrow-right" size={17} />
            </button>
          </div>
        )}
      </div>
      <figcaption>{item.caption}</figcaption>
    </figure>
  );
}
