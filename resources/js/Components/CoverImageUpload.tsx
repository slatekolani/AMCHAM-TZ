import { useEffect, useState } from 'react';

type CoverImageUploadProps = {
    currentImage?: string | null;
    error?: string;
    onChange: (file: File | null) => void;
    label?: string;
};

export default function CoverImageUpload({ currentImage, error, onChange, label = 'Cover image' }: CoverImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage ?? null);

    useEffect(() => () => {
        if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    }, [preview]);

    const selectImage = (file: File | null) => {
        if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
        setPreview(file ? URL.createObjectURL(file) : (currentImage ?? null));
        onChange(file);
    };

    return (
        <label className="grid gap-2 text-sm font-bold text-[#14234a]">
            {label}
            {preview && <img src={preview} alt="Cover preview" className="h-44 w-full rounded-md border border-[#d7c8a9] bg-white object-cover" />}
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => selectImage(event.target.files?.[0] ?? null)}
                className="border-[#d7c8a9] bg-white"
            />
            <span className="text-xs font-normal text-[#667085]">JPG, PNG or WebP, up to 5 MB.</span>
            {error && <span className="text-xs font-semibold text-[#cf2f3b]">{error}</span>}
        </label>
    );
}
