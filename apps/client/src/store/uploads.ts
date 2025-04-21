import { create } from "zustand"
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from "immer"
import { uploadFileToStorage } from "../http/upload-file-to-storage"
import { CanceledError } from "axios"
import { useShallow } from "zustand/react/shallow"
import { compressImage } from "../utils/compress-image"

export type Upload = {
    name: string
    file: File
    abortController: AbortController
    status: 'progress' | 'success' | 'error' | 'cancelled'
    originalSizeInBytes: number
    compressedSizeInBytes?: number
    uploadSizeInBytes: number
    remoteUrl?: string
}

type UploadState = {
    uploads: Map<string, Upload>
    addUploads: (files: File[]) => void
    cancelUpload: (uploadId: string) => void
}

enableMapSet()

export const useUploads = create<UploadState, [['zustand/immer', never]]>(immer((set, get) => {
    function updateUpload(uploadId: string, data: Partial<Upload>) {
        const upload = get().uploads.get(uploadId)
        if (!upload) return

        set(state => {
            state.uploads.set(uploadId, { ...upload, ...data })
        })
    }

    async function processUpload(uploadId: string) {
        const upload = get().uploads.get(uploadId)
        if (!upload) return

        try {
            const compressedFile = await compressImage({
                file: upload.file,
                maxHeight: 1000,
                maxWidth: 1000,
                quality: 0.8,
            })

            updateUpload(uploadId, {
                compressedSizeInBytes: compressedFile.size,
            })

            const { url } = await uploadFileToStorage({
                file: compressedFile,
                onProgress: (sizeInBytes) => {
                    updateUpload(uploadId, {
                        uploadSizeInBytes: sizeInBytes,
                    })
                },
            }, {
                signal: upload.abortController.signal,
            })

            updateUpload(uploadId, {
                status: 'success',
                remoteUrl: url,
            })
        } catch (error) {
            console.error(error)

            if (error instanceof CanceledError) {
                updateUpload(uploadId, {
                    status: 'cancelled',
                })
            } else {
                updateUpload(uploadId, {
                    status: 'error',
                })
            }

        }
    }

    async function cancelUpload(uploadId: string) {
        const upload = get().uploads.get(uploadId)
        if (!upload) return

        upload.abortController.abort()
    }

    function addUploads(files: File[]) {
        for (const file of files) {
            const uploadId = crypto.randomUUID()
            const abortController = new AbortController()

            const upload: Upload = {
                name: file.name,
                file,
                status: 'progress',
                abortController,
                originalSizeInBytes: file.size,
                uploadSizeInBytes: 0,
            }

            set(state => {
                state.uploads.set(uploadId, upload)
            })

            processUpload(uploadId)
        }
    }

    return {
        uploads: new Map(),
        addUploads,
        cancelUpload,
    }
}))

export const usePendingUploads = () => {
    return useUploads(useShallow(store => {
        const isThereAnyPendingUploads = Array.from(store.uploads.values()).some(upload => upload.status === 'progress')

        if (!isThereAnyPendingUploads) {
            return {
                isThereAnyPendingUploads: false,
                globalPercentage: 100,
            }
        }

        const { total, uploaded } = Array.from(store.uploads.values()).reduce(
            (acc, upload) => {
                acc.total += upload.compressedSizeInBytes ?? 0
                acc.uploaded += upload.compressedSizeInBytes ?? 0

                return acc
            },
            {
                total: 0,
                uploaded: 0,
            }
        )

        const globalPercentage = Math.min(
            Math.round(uploaded / total * 100),
            100
        )

        return {
            isThereAnyPendingUploads: true,
            globalPercentage,
        }
    }))
}