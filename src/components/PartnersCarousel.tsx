import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

type Partner = { name: string; url: string };

function PartnersCarousel({
  items,
  isRTL,
  fullBleed = false,
  sidePaddingPx = 50, 
}: {
  items: Partner[];
  isRTL: boolean;
  fullBleed?: boolean;
  sidePaddingPx?: number;   // <-- NEW

}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const stepRef = useRef(0);
  const indexRef = useRef(0); // current index in EXTENDED list (not logical index)
  const [visibleCount, setVisibleCount] = useState(1);

  const enabled = items.length > 1;
  const block = items.length;

  // Measure card step and how many fit in viewport
  const calcMetrics = () => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector('li') as HTMLLIElement | null;
    const rect = first?.getBoundingClientRect();
    const cs = getComputedStyle(track);
    const gap = parseFloat(cs.gap || '0') || 0;
    const cardW = rect?.width || Math.round(track.clientWidth / 3);
    stepRef.current = cardW + gap;

    const vis = Math.max(1, Math.floor(track.clientWidth / stepRef.current));
    setVisibleCount(vis);
  };

  // Build extended list: [tail clones] + items + [head clones]
  const extended = useMemo(() => {
    if (!block) return [];
    // Default to 1 until measured
    const v = Math.max(1, visibleCount);
    const head = items.slice(0, v);
    const tail = items.slice(-v);
    return [...tail, ...items, ...head];
  }, [items, block, visibleCount]);

  // Teleport helper (disable snap for one frame so the jump is invisible)
  const teleport = (targetIndex: number) => {
    const track = trackRef.current;
    if (!track || !stepRef.current) return;
    const prev = track.style.scrollSnapType;
    track.style.scrollSnapType = 'none';
    track.scrollTo({ left: stepRef.current * targetIndex, behavior: 'auto' });
    requestAnimationFrame(() => {
      track.style.scrollSnapType = prev || 'x mandatory';
    });
    indexRef.current = targetIndex;
  };

  // Keep index inside the real zone [visibleCount .. visibleCount+block-1]
  const normalizeIfNeeded = () => {
    const track = trackRef.current;
    if (!track || !stepRef.current) return;
    const iNow = Math.round(track.scrollLeft / stepRef.current);
    const zoneStart = visibleCount;
    const zoneEnd = visibleCount + block - 1;

    if (iNow < zoneStart) {
      // moved into left clones → jump forward by one full block
      teleport(iNow + block);
      return;
    }
    if (iNow > zoneEnd) {
      // moved into right clones → jump back by one full block
      teleport(iNow - block);
      return;
    }
    indexRef.current = iNow;
  };

  // Scroll exactly one card
  const scrollOne = (dir: 1 | -1) => {
    if (!enabled || !stepRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const signed = isRTL ? -dir : dir;
    const next = indexRef.current + signed;

    track.scrollTo({
      left: stepRef.current * next,
      behavior: 'smooth',
    });
    indexRef.current = next;
  };

  // Setup observers + initial position
  useEffect(() => {
    calcMetrics();

    const raf = requestAnimationFrame(() => {
      calcMetrics();
      // Start at the first REAL item (just after tail clones)
      teleport(visibleCount);
    });

    const onScroll = () => normalizeIfNeeded();
    trackRef.current?.addEventListener('scroll', onScroll, { passive: true });

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            const prevIndex = indexRef.current;
            calcMetrics();
            // Re-center on the same extended index after metric changes
            requestAnimationFrame(() => teleport(prevIndex));
          })
        : null;
    if (ro && trackRef.current) ro.observe(trackRef.current);

    return () => {
      cancelAnimationFrame(raf);
      trackRef.current?.removeEventListener('scroll', onScroll);
      ro?.disconnect();
    };
  }, [block]);

  // Recalc when images load (logos can affect intrinsic layout)
  const onImgLoad = () => calcMetrics();

  // Autoplay
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => scrollOne(1), 3800);
    return () => window.clearInterval(id);
  }, [enabled, isRTL, block, visibleCount]);

  return (
    <div
    className={
      fullBleed
        ? 'relative w-screen max-w-none left-1/2 right-1/2 -mx-[50vw]'
        : 'relative mx-auto'
    }
  >
      <div className="overflow-hidden px-10"
              style={{ paddingInline: `${sidePaddingPx}px` }}  
>
<ul
          ref={trackRef}
          role="list"
          dir="ltr"
          className="
            flex gap-8 overflow-x-auto py-4
            snap-x snap-mandatory
            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          "
          style={{ scrollBehavior: 'smooth' }}
        >
          {extended.map((p, i) => (
            <li
              key={`${i}-${p.name}`}
              className="snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[300px]"
              aria-label={p.name}
              title={p.name}
            >
              <div className="h-28 md:h-32 bg-white rounded-2xl flex items-center justify-center ring-1 ring-[#E5E7EB]/60 shadow-[0_4px_10px_rgba(46,65,102,0.06)]">
              <img
                  src={p.url}
                  alt={p.name}
                  className="max-h-14 md:max-h-16 object-contain"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onLoad={onImgLoad}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {enabled && (
        <>
          <button
            type="button"
            onClick={() => scrollOne(-1)}
            className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10 grid place-items-center h-10 w-10 rounded-full bg-[#2E4166] text-white hover:bg-[#2E4166]/90 shadow-lg"
            aria-label="Previous"
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => scrollOne(1)}
            className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10 grid place-items-center h-10 w-10 rounded-full bg-[#2E4166] text-white hover:bg-[#2E4166]/90 shadow-lg"
            aria-label="Next"
          >
            <ChevronsRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}

export { PartnersCarousel };
