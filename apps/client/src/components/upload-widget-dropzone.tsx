import { useDropzone } from "react-dropzone"

export function UploadWidgetDropzone() {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: true,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg']
        },
        onDrop: (acceptedFiles) => {
            console.log(acceptedFiles)
        }
    })

    return (
        <div className="px-3 flex flex-col gap-3">
            <div
                data-active={isDragActive}
                {...getRootProps()} 
                className="cursor-pointer text-zinc-400 bg-black/20 p-2 rounded-lg border border-zinc-700 border-dashed h-32 flex flex-col items-center justify-center gap-1 hover:border-zinc-600 transition-colors data-[active=true]:bg-indigo-500/10 data-[active=true]:border-indigo-500 data-[active=true]:text-indigo-400"
            >
                <input {...getInputProps()} />

                <span className="text-xs">Drop your files here or </span>
                <span className="text-xs underline">click to open picker</span>
            </div>

            <span className="text-xs text-zinc-400">Only PNG and JPG files are supported.</span>
        </div>
    )
}