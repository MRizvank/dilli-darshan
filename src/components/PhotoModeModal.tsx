import React, { useEffect, useMemo, useState } from 'react';
import { Camera, Check, Download, RefreshCw, Sparkles, Stamp, X } from 'lucide-react';
import { WEATHER_CONFIGS } from '../data/delhiWorld';
import type { WeatherType } from '../types/game';

export type PhotoFrameStyle = 'watermark' | 'postcard';

interface PhotoModeModalProps {
  rawSnapshotUrl: string;
  zoneName: string;
  playerName: string;
  weather: WeatherType;
  onRetake: () => void;
  onSaved: (style: PhotoFrameStyle) => void;
  onClose: () => void;
}

function buildWatermarkedImage(
  rawUrl: string,
  opts: {
    style: PhotoFrameStyle;
    zoneName: string;
    playerName: string;
    weatherLabel: string;
    dateLabel: string;
  }
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || 1280;
      const h = img.naturalHeight || 720;
      const out = document.createElement('canvas');
      const ctx = out.getContext('2d');
      if (!ctx) {
        resolve(rawUrl);
        return;
      }

      if (opts.style === 'watermark') {
        out.width = w;
        out.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        // Subtle warm architectural frame inset
        const inset = Math.max(12, Math.round(Math.min(w, h) * 0.022));
        ctx.strokeStyle = 'rgba(255, 253, 249, 0.55)';
        ctx.lineWidth = Math.max(1.5, Math.round(w * 0.0018));
        ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);

        // Bottom gradient scrim for crisp legibility
        const scrimHeight = Math.max(110, Math.round(h * 0.22));
        const grad = ctx.createLinearGradient(0, h - scrimHeight, 0, h);
        grad.addColorStop(0, 'rgba(30, 41, 59, 0)');
        grad.addColorStop(0.6, 'rgba(30, 41, 59, 0.45)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0.78)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, h - scrimHeight, w, scrimHeight);

        const padX = inset + Math.max(16, Math.round(w * 0.02));
        const baseY = h - inset - Math.max(16, Math.round(h * 0.022));

        // Bottom-left trip metadata
        const metaSize = Math.max(13, Math.round(w * 0.014));
        const subSize = Math.max(11, Math.round(w * 0.011));
        ctx.textBaseline = 'bottom';
        ctx.textAlign = 'left';

        ctx.fillStyle = '#FFFDF9';
        ctx.font = `700 ${metaSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(`${opts.zoneName} · Delhi NCR`, padX, baseY - subSize - 6);

        ctx.fillStyle = 'rgba(241, 232, 217, 0.92)';
        ctx.font = `500 ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(
          `Explorer ${opts.playerName} · ${opts.weatherLabel} · ${opts.dateLabel}`,
          padX,
          baseY
        );

        // Bottom-right Dilli Darshan watermark seal
        const brandSize = Math.max(22, Math.round(w * 0.026));
        const tagSize = Math.max(10, Math.round(w * 0.0095));
        ctx.textAlign = 'right';

        ctx.save();
        ctx.shadowColor = 'rgba(15, 23, 42, 0.55)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FFFDF9';
        ctx.font = `700 ${brandSize}px "Fraunces", Georgia, serif`;
        ctx.fillText('Dilli Darshan', w - padX, baseY - tagSize - 5);
        ctx.restore();

        ctx.fillStyle = '#FCD34D';
        ctx.font = `700 ${tagSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText('DELHI NCR EXPLORER POSTCARD', w - padX, baseY);
      } else {
        // Stamped Postcard Mat
        const pad = Math.max(24, Math.round(Math.min(w, h) * 0.04));
        const footerH = Math.max(88, Math.round(h * 0.13));
        out.width = w + pad * 2;
        out.height = h + pad * 2 + footerH;

        // Warm archival paper background
        ctx.fillStyle = '#FFFDF9';
        ctx.fillRect(0, 0, out.width, out.height);

        // Outer border & hairline rule
        ctx.strokeStyle = '#D6C7B2';
        ctx.lineWidth = Math.max(2, Math.round(out.width * 0.003));
        ctx.strokeRect(8, 8, out.width - 16, out.height - 16);

        // Framed viewport photo
        ctx.drawImage(img, pad, pad, w, h);
        ctx.strokeStyle = '#C84B31';
        ctx.lineWidth = Math.max(1.5, Math.round(out.width * 0.0018));
        ctx.strokeRect(pad, pad, w, h);

        const footerTop = pad + h;
        const centerY = footerTop + footerH * 0.5;

        // Left postcard details
        const titleSize = Math.max(16, Math.round(w * 0.017));
        const detailSize = Math.max(12, Math.round(w * 0.012));
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1E293B';
        ctx.font = `700 ${titleSize}px "Fraunces", Georgia, serif`;
        ctx.fillText(`Greetings from ${opts.zoneName}`, pad, centerY - detailSize * 0.72);

        ctx.fillStyle = '#64748B';
        ctx.font = `500 ${detailSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(
          `Captured by ${opts.playerName} · ${opts.weatherLabel} · ${opts.dateLabel}`,
          pad,
          centerY + detailSize * 0.88
        );

        // Right terracotta 'Dilli Darshan' watermark stamp
        const brandSize = Math.max(22, Math.round(w * 0.025));
        const subSize = Math.max(10, Math.round(w * 0.0095));
        ctx.textAlign = 'right';
        ctx.fillStyle = '#C84B31';
        ctx.font = `700 ${brandSize}px "Fraunces", Georgia, serif`;
        ctx.fillText('Dilli Darshan', out.width - pad, centerY - subSize * 0.6);

        ctx.fillStyle = '#7C5A3C';
        ctx.font = `700 ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText('OFFICIAL NCR SOUVENIR SNAPSHOT', out.width - pad, centerY + subSize * 1.1);
      }

      try {
        resolve(out.toDataURL('image/png'));
      } catch {
        resolve(rawUrl);
      }
    };
    img.onerror = () => resolve(rawUrl);
    img.src = rawUrl;
  });
}

export const PhotoModeModal: React.FC<PhotoModeModalProps> = ({
  rawSnapshotUrl,
  zoneName,
  playerName,
  weather,
  onRetake,
  onSaved,
  onClose,
}) => {
  const [frameStyle, setFrameStyle] = useState<PhotoFrameStyle>('watermark');
  const [watermarkedUrl, setWatermarkedUrl] = useState<string>(rawSnapshotUrl);
  const [rendering, setRendering] = useState(true);
  const [justSaved, setJustSaved] = useState(false);

  const weatherLabel = WEATHER_CONFIGS[weather].label;
  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    setRendering(true);
    setJustSaved(false);
    buildWatermarkedImage(rawSnapshotUrl, {
      style: frameStyle,
      zoneName,
      playerName,
      weatherLabel,
      dateLabel,
    }).then((resultUrl) => {
      if (!cancelled) {
        setWatermarkedUrl(resultUrl);
        setRendering(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [rawSnapshotUrl, frameStyle, zoneName, playerName, weatherLabel, dateLabel]);

  const handleDownload = () => {
    const slug = zoneName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `dilli-darshan-${slug || 'ncr'}-${stamp}.png`;

    const link = document.createElement('a');
    link.href = watermarkedUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setJustSaved(true);
    onSaved(frameStyle);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#1E293B]/65 p-4">
      <div className="w-full max-w-3xl bg-[#FFFDF9] border border-[#E2D5C3] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2D5C3] bg-[#FAF4E8]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#C84B31] text-white flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </span>
            <div>
              <h2
                className="text-lg font-bold text-[#1E293B] leading-tight"
                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
              >
                Photo Mode · Dilli Darshan
              </h2>
              <p className="text-xs text-[#64748B]">
                {zoneName} · {weatherLabel} · Ready to save to your device
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Photo Mode"
            className="p-1.5 rounded-lg hover:bg-[#EFE6D8] text-[#475569] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Style Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 border-b border-[#EFE6D8] bg-[#FFFDF9]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">Watermark Style:</span>
            <button
              type="button"
              onClick={() => setFrameStyle('watermark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                frameStyle === 'watermark'
                  ? 'bg-[#1E293B] border-[#1E293B] text-white'
                  : 'bg-[#FAF4E8] hover:bg-[#EFE6D8] border-[#E2D5C3] text-[#1E293B]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Classic Watermark</span>
            </button>
            <button
              type="button"
              onClick={() => setFrameStyle('postcard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                frameStyle === 'postcard'
                  ? 'bg-[#C84B31] border-[#C84B31] text-white'
                  : 'bg-[#FAF4E8] hover:bg-[#EFE6D8] border-[#E2D5C3] text-[#1E293B]'
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>Stamped Postcard</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onRetake}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF4E8] hover:bg-[#EFE6D8] border border-[#E2D5C3] text-[#1E293B] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Retake Snapshot</span>
          </button>
        </div>

        {/* Preview Stage */}
        <div className="p-4 sm:p-5 bg-[#EFE6D8]/70 flex items-center justify-center overflow-auto flex-1">
          <div className="relative rounded-xl overflow-hidden border border-[#D6C7B2] bg-[#1E293B]/5 shadow-md max-w-full">
            <img
              src={watermarkedUrl}
              alt={`Dilli Darshan snapshot at ${zoneName}`}
              className={`block max-w-full max-h-[54vh] object-contain transition-opacity duration-150 ${
                rendering ? 'opacity-60' : 'opacity-100'
              }`}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-[#E2D5C3] bg-[#FFFDF9]">
          <span className="text-xs text-[#64748B]">
            PNG snapshot includes the <strong className="text-[#1E293B]">Dilli Darshan</strong>{' '}
            watermark and location stamp.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF4E8] hover:bg-[#EFE6D8] border border-[#E2D5C3] text-[#1E293B] cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={rendering}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#15803D] hover:bg-[#166534] disabled:opacity-60 text-white shadow-xs transition-colors cursor-pointer"
            >
              {justSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved PNG! Save Again</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Save to Device</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
