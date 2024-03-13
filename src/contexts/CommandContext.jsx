import { createContext, useContext } from "react"

const commandContext = createContext(null)

export function CommandContext ({ commands, setCommands, children }) {
    return (
        <commandContext.Provider
            value={{ commands, setCommands }}
        >
            {children}
        </commandContext.Provider>
    )
}

export function useCommands () {
    const { commands, setCommands } = useContext(commandContext)
    return [commands, setCommands]
}