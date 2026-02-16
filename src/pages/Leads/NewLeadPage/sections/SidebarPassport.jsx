import { Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card';
import { Button } from '@/components/shadcn/ui/button';

export default function SidebarPassport({
  uploadValue,
  onFilesChange,
  onUploadSingle,
  onDelete,
  canEdit,
}) {
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newFiles = files.map((file) => ({
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      preview: URL.createObjectURL(file),
      file,
      source: 'local',
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
    }));
    onFilesChange?.((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => onUploadSingle?.(f));
  };

  const images = uploadValue || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pasport rasmlari</CardTitle>
      </CardHeader>
      <CardContent>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-[8px]">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square overflow-hidden rounded-[10px] border border-[var(--primary-border-color)]"
              >
                {img.isPdf ? (
                  <a
                    href={img.pdfUrl || img.preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full w-full items-center justify-center bg-[var(--filter-input-bg)] text-[12px] font-medium"
                    style={{ color: 'var(--secondary-color)' }}
                  >
                    PDF
                  </a>
                ) : (
                  <img
                    src={img.previewLarge || img.preview}
                    alt={img.fileName || 'passport'}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => onDelete?.(img.id)}
                    className="absolute right-[4px] top-[4px] flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full bg-red-500 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ✕
                  </button>
                )}
                {img.status === 'yuklanmoqda' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="h-[24px] w-[24px] animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-[8px] rounded-[12px] border border-dashed py-[24px]"
            style={{
              borderColor: 'var(--primary-border-color)',
              color: 'var(--secondary-color)',
            }}
          >
            <Upload size={20} />
            <span className="text-[13px]">Rasm yuklanmagan</span>
          </div>
        )}

        {canEdit && (
          <label className="mt-[12px] block">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <span>
                <Upload size={14} />
                Rasm yuklash
              </span>
            </Button>
            <input
              type="file"
              accept="image/*,.pdf"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        )}
      </CardContent>
    </Card>
  );
}
