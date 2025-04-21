export async function downloadUrl(url: string) {
    try {
        const response = await fetch(url, {
            mode: 'no-cors'
        })
        const blob = await response.blob()
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        const fileName = url.split('/').pop()

        if (!fileName) {
            throw new Error('No file name found')
        }

        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('Error downloading file', error)
    }
}