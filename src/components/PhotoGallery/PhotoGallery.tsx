'use client';

import { useState, useEffect } from 'react';
import { Camera, Users, Lock, Download, Trash2, X } from 'lucide-react';
import styles from './PhotoGallery.module.css';

interface MediaFile {
    id: string;
    filename: string;
    originalName: string;
    type: 'image' | 'video';
    mimeType: string;
}

interface Album {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    userId: string;
    user?: { name: string; email: string };
    files: MediaFile[];
    _count?: { files: number };
    createdAt: string;
}

export default function PhotoGallery() {
    const [activeTab, setActiveTab] = useState<'own' | 'public'>('own');
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchAlbums = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/albums?view=${activeTab}`);
            if (res.ok) {
                const data = await res.json();
                setAlbums(data.albums);
            }
        } catch (error) {
            console.error('Error fetching albums:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, [activeTab]);

    const openAlbum = async (albumId: string) => {
        try {
            const res = await fetch(`/api/albums/${albumId}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedAlbum(data.album);
                setIsOwner(data.isOwner);
            }
        } catch (error) {
            console.error('Error fetching album:', error);
        }
    };

    const downloadFile = (albumId: string, filename: string, originalName: string) => {
        const link = document.createElement('a');
        link.href = `/uploads/albums/${albumId}/${filename}`;
        link.download = originalName;
        link.click();
    };

    const deleteFile = async (fileId: string) => {
        if (!confirm('¿Eliminar este archivo?')) return;
        try {
            const res = await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
            if (res.ok) {
                setSelectedAlbum((prev) => prev ? {
                    ...prev,
                    files: prev.files.filter(f => f.id !== fileId)
                } : null);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const deleteAlbum = async (albumId: string) => {
        if (!confirm('¿Eliminar álbum completo?')) return;
        try {
            const res = await fetch(`/api/albums/${albumId}`, { method: 'DELETE' });
            if (res.ok) {
                setSelectedAlbum(null);
                fetchAlbums();
            }
        } catch (error) {
            console.error('Error deleting album:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'own' ? styles.active : ''}`}
                    onClick={() => setActiveTab('own')}
                >
                    <Camera size={18} />
                    Mis Álbumes
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'public' ? styles.active : ''}`}
                    onClick={() => setActiveTab('public')}
                >
                    <Users size={18} />
                    Álbumes Públicos
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>Cargando...</div>
            ) : (
                <div className={styles.grid}>
                    {albums.map((album) => (
                        <div key={album.id} className={styles.albumCard} onClick={() => openAlbum(album.id)}>
                            <div className={styles.thumbnail}>
                                {album.files[0] ? (
                                    album.files[0].type === 'image' ? (
                                        <img src={`/uploads/albums/${album.id}/${album.files[0].filename}`} alt={album.name} />
                                    ) : (
                                        <video src={`/uploads/albums/${album.id}/${album.files[0].filename}`} />
                                    )
                                ) : (
                                    <div className={styles.emptyThumbnail}>📷</div>
                                )}
                            </div>
                            <div className={styles.albumInfo}>
                                <h3>{album.name}</h3>
                                <div className={styles.meta}>
                                    <span>{album._count?.files || album.files.length} archivo(s)</span>
                                    {!album.isPublic && <Lock size={14} />}
                                </div>
                                {activeTab === 'public' && album.user && (
                                    <p className={styles.owner}>Por: {album.user.name}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedAlbum && (
                <div className={styles.lightbox} onClick={() => setSelectedAlbum(null)}>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedAlbum(null)}>
                            <X />
                        </button>
                        <h2>{selectedAlbum.name}</h2>
                        {selectedAlbum.description && <p>{selectedAlbum.description}</p>}
                        {isOwner && (
                            <button className={styles.deleteAlbumBtn} onClick={() => deleteAlbum(selectedAlbum.id)}>
                                <Trash2 size={16} /> Eliminar Álbum
                            </button>
                        )}
                        <div className={styles.mediaGrid}>
                            {selectedAlbum.files.map((file) => (
                                <div key={file.id} className={styles.mediaItem}>
                                    {file.type === 'image' ? (
                                        <img src={`/uploads/albums/${selectedAlbum.id}/${file.filename}`} alt={file.originalName} />
                                    ) : (
                                        <video controls>
                                            <source src={`/uploads/albums/${selectedAlbum.id}/${file.filename}`} type={file.mimeType} />
                                        </video>
                                    )}
                                    <div className={styles.mediaActions}>
                                        <button onClick={() => downloadFile(selectedAlbum.id, file.filename, file.originalName)}>
                                            <Download size={16} /> Descargar
                                        </button>
                                        {isOwner && (
                                            <button onClick={() => deleteFile(file.id)}>
                                                <Trash2 size={16} /> Eliminar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
