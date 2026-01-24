'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import styles from './AlbumUpload.module.css';

interface AlbumUploadProps {
    onSuccess?: () => void;
}

export default function AlbumUpload({ onSuccess }: AlbumUploadProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
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

    const addFiles = (files: File[]) => {
        // Filter valid files
        const validFiles = files.filter(f =>
            f.type.startsWith('image/') || f.type.startsWith('video/')
        );

        setSelectedFiles(prev => [...prev, ...validFiles]);

        // Create previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || selectedFiles.length === 0) {
            alert('Nombre y archivos son requeridos');
            return;
        }

        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append('name', name);
        if (description) formData.append('description', description);
        formData.append('isPublic', isPublic.toString());

        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            const res = await fetch('/api/albums', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                alert('Álbum creado exitosamente');
                setName('');
                setDescription('');
                setIsPublic(false);
                setSelectedFiles([]);
                setPreviews([]);
                onSuccess?.();
            } else {
                alert('Error al crear álbum');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error al subir archivos');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Crear Álbum</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label>Nombre del Álbum</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Buzios 2026"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Descripción (opcional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Nuestro viaje a Brasil..."
                        rows={3}
                    />
                </div>

                <div className={styles.checkboxGroup}>
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <label htmlFor="isPublic">Hacer público (otros usuarios pueden ver)</label>
                </div>

                <div
                    className={styles.dropZone}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload size={48} />
                    <p>Arrastra fotos/videos o haz clic para seleccionar</p>
                    <span>Formatos: JPG, PNG, WEBP, MP4, WEBM, MOV</span>
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
                                    <div className={styles.videoPreview}>
                                        <Video size={32} />
                                        <span>{file.name}</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={() => removeFile(index)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={uploading}>
                    {uploading ? `Subiendo... ${progress}%` : 'Crear Álbum'}
                </button>
            </form>
        </div>
    );
}
