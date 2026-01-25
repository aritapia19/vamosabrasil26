'use client';

import { useState, useRef } from 'react';
import { Upload, X, Video } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import styles from './PhotosUpload.module.css';

interface PhotosUploadProps {
    albumId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function PhotosUpload({ albumId, onSuccess, onCancel }: PhotosUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            addFiles(files);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        addFiles(files);
    };

    const addFiles = async (files: File[]) => {
        const validFiles = files.filter(f =>
            f.type.startsWith('image/') || f.type.startsWith('video/')
        );

        setCompressing(true);
        const processedFiles: File[] = [];

        for (const file of validFiles) {
            try {
                let processedFile: File = file;

                if (file.type.startsWith('image/')) {
                    const options = {
                        maxSizeMB: 0.8,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    };
                    const compressedBlob = await imageCompression(file, options);

                    processedFile = new File([compressedBlob], file.name, {
                        type: compressedBlob.type || file.type,
                        lastModified: Date.now(),
                    });
                }
                processedFiles.push(processedFile);

                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(processedFile);
            } catch (error) {
                console.error('Error processing file:', error);
                processedFiles.push(file);
            }
        }

        setSelectedFiles(prev => [...prev, ...processedFiles]);
        setCompressing(false);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setProgress(0);

        const failedFiles: string[] = [];
        let completed = 0;
        const total = selectedFiles.length;

        for (const file of selectedFiles) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch(`/api/albums/${albumId}/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) throw new Error('Upload failed');

                completed++;
                setProgress(Math.round((completed / total) * 100));
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                failedFiles.push(file.name);
            }
        }

        setUploading(false);
        setProgress(0);

        if (failedFiles.length > 0) {
            alert(`Algunos archivos fallaron:\n${failedFiles.join('\n')}`);
        } else {
            alert('¡Archivos subidos exitosamente!');
        }

        onSuccess();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Agregar Fotos</h3>
                <button type="button" onClick={onCancel} className={styles.closeBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
                <div
                    className={styles.dropZone}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload size={32} />
                    <p>Arrastra o selecciona fotos</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                </div>

                {selectedFiles.length > 0 && (
                    <div className={styles.previewGrid}>
                        {selectedFiles.map((file, index) => (
                            <div key={index} className={styles.previewItem}>
                                {file.type.startsWith('image/') ? (
                                    <img src={previews[index]} alt={file.name} />
                                ) : (
                                    <div className={styles.videoPreview}><Video size={24} /></div>
                                )}
                                <button type="button" onClick={() => removeFile(index)} className={styles.removeBtn}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.actions}>
                    <button type="button" onClick={onCancel} className={styles.cancelBtn} disabled={uploading}>
                        Cancelar
                    </button>
                    <button type="submit" className={styles.submitBtn} disabled={uploading || compressing || selectedFiles.length === 0}>
                        {compressing ? 'Comprimiendo...' : (uploading ? `Subiendo ${progress}%` : 'Subir Fotos')}
                    </button>
                </div>
            </form>
        </div>
    );
}
