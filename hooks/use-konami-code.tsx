import { useEffect, useState } from "react"

const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
]

export function useKonamiCode(callback: () => void) {
    const [keys, setKeys] = useState<string[]>([])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setKeys((prevKeys) => {
                const newKeys = [...prevKeys, e.key].slice(-KONAMI_CODE.length)

                // Check if the sequence matches
                const matches = KONAMI_CODE.every((key, index) => key === newKeys[index])

                if (matches) {
                    callback()
                    return [] // Reset after successful match
                }

                return newKeys
            })
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [callback])

    return keys
}
