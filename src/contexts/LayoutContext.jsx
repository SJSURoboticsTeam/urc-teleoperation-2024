import { createContext, useContext } from "react"

const layoutContext = createContext(null)

export function LayoutContext ({ layout, setLayout, children }) {
    return (
        <layoutContext.Provider
            value={{ layout, setLayout }}
        >
            {children}
        </layoutContext.Provider>
    )
}

export function useLayouts () {
    const { layout, setLayout } = useContext(layoutContext)
    return [layout, setLayout]
}