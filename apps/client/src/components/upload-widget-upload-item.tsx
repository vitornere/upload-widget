import * as Progress from "@radix-ui/react-progress";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { Upload } from "../store/uploads";
import { formatBytes } from "../utils/format-bytes";
import { useUploads } from "../store/uploads";
import { downloadUrl } from "../utils/download-url";

interface UploadWidgetUploadItemProps {
    uploadId: string
    upload: Upload
}

export function UploadWidgetUploadItem({
    uploadId,
    upload
}: UploadWidgetUploadItemProps) {
    const cancelUpload = useUploads(state => state.cancelUpload)
    const retryUpload = useUploads(state => state.retryUpload)
    const progress = Math.min(
        upload.compressedSizeInBytes ? Math.round(upload.uploadSizeInBytes / upload.compressedSizeInBytes * 100) : 0,
        100
    )

    return (
        <motion.div
            className="p-3 rounded-lg flex flex-col gap-3 shadow-shape-content bg-white/2 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex flex-col gap-1">
                <span className="text-xs font-medium flex items-center gap-1">
                    <ImageUp className="size-3 text-zinc-300" strokeWidth={1.5} />
                    <Tooltip.Provider>
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                                <span className="max-w-[180px] truncate">{upload.name}</span>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content
                                    className="rounded-md bg-zinc-800 px-4 py-2 text-sm text-zinc-400"
                                    sideOffset={5}
                                >
                                    {upload.name}
                                    <Tooltip.Arrow className="fill-zinc-800" />
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    </Tooltip.Provider>
                </span>

                <span className="text-xxs text-zinc-400 flex gap-1.5 items-center">
                    <span className="line-through">{formatBytes(upload.originalSizeInBytes)}</span>
                    <div className="size-1 rounded-full bg-zinc-700" />
                    <span>
                        {formatBytes(upload.compressedSizeInBytes ?? 0)}
                        <span className="text-green-400 ml-1">
                            -{Math.round((upload.originalSizeInBytes - (upload.compressedSizeInBytes ?? 0)) / upload.originalSizeInBytes * 100)}%
                        </span>
                    </span>
                    <div className="size-1 rounded-full bg-zinc-700" />
                    {upload.status === 'success' && (
                        <span className="text-green-400">
                            100%
                        </span>
                    )}
                    {upload.status === 'progress' && (
                        <span>
                            {progress}%
                        </span>
                    )}
                    {upload.status === 'error' && (
                        <span className="text-red-400">
                            Error
                        </span>
                    )}
                    {upload.status === 'cancelled' && (
                        <span className="text-yellow-400">
                            Cancelled
                        </span>
                    )}
                </span>
            </div>

            <Progress.Root
                data-status={upload.status}
                className="group bg-zinc-800 rounded-full h-1 overflow-hidden"
            >
                <Progress.Indicator
                    className="bg-indigo-500 h-1 group-data-[status=success]:bg-green-400 group-data-[status=error]:bg-red-400 group-data-[status=cancelled]:bg-yellow-400"
                    style={{ width: upload.status === 'progress' ? `${progress}%` : '100%' }}
                />
            </Progress.Root>

            <div className="absolute top-2 right-2 flex items-center gap-1">
                <Button size="icon-sm" disabled={!upload.remoteUrl} onClick={() => upload.remoteUrl && downloadUrl(upload.remoteUrl)}>
                        <Download className="size-4" strokeWidth={1.5} />
                        <span className="sr-only">Download compressed image</span>
                </Button>

                <Button size="icon-sm" disabled={!upload.remoteUrl} onClick={() => upload.remoteUrl && navigator.clipboard.writeText(upload.remoteUrl)}>
                    <Link2 className="size-4" strokeWidth={1.5} />
                    <span className="sr-only">Copy remote URL</span>
                </Button>

                <Button size="icon-sm" disabled={['progress', 'success'].includes(upload.status)} onClick={() => retryUpload(uploadId)}>
                    <RefreshCcw className="size-4" strokeWidth={1.5} />
                    <span className="sr-only">Retry upload</span>
                </Button>

                <Button disabled={upload.status !== 'progress'} size="icon-sm" onClick={() => cancelUpload(uploadId)}>
                    <X className="size-4" strokeWidth={1.5} />
                    <span className="sr-only">Cancel upload</span>
                </Button>
            </div>
        </motion.div>
    )
}