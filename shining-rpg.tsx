"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GameState {
  currentRoom: string
  inventory: string[]
  health: number
  sanity: number
  hasKey: boolean
  gameOver: boolean
  victory: boolean
}

interface Room {
  name: string
  description: string
  ascii: string
  choices: Choice[]
  items?: string[]
}

interface Choice {
  text: string
  action: () => void
  condition?: () => boolean
}

export default function Component() {
  const [gameState, setGameState] = useState<GameState>({
    currentRoom: "lobby",
    inventory: [],
    health: 100,
    sanity: 100,
    hasKey: false,
    gameOver: false,
    victory: false,
  })

  const [gameText, setGameText] = useState<string[]>([
    "Welcome to the Overlook Hotel...",
    "The winter caretaker position seemed like a dream job.",
    "Now, as snow blocks all exits, you realize the truth.",
    "The hotel has a dark history, and you're not alone.",
  ])

  const addText = (text: string) => {
    setGameText((prev) => [...prev, text])
  }

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }))
  }

  const addToInventory = (item: string) => {
    setGameState((prev) => ({
      ...prev,
      inventory: [...prev.inventory, item],
    }))
    addText(`You picked up: ${item}`)
  }

  const rooms: Record<string, Room> = {
    lobby: {
      name: "Hotel Lobby",
      description: "The grand lobby stretches before you. Dust particles dance in the dim light.",
      ascii: `
    ╔══════════════════════════════════╗
    ║     ___________________          ║
    ║    |  OVERLOOK  HOTEL  |         ║
    ║    |___________________|         ║
    ║                                 ║
    ║  🕯️     [RECEPTION]     🕯️      ║
    ║                                 ║
    ║    🪑              🪑           ║
    ║         📺                      ║
    ║    🪑              🪑           ║
    ╚══════════════════════════════════╝`,
      choices: [
        {
          text: "Go to Room 237",
          action: () => {
            updateGameState({ currentRoom: "room237" })
            addText("You walk down the eerie hallway to Room 237...")
          },
        },
        {
          text: "Visit the Bar",
          action: () => {
            updateGameState({ currentRoom: "bar" })
            addText("You enter the Gold Room bar...")
          },
        },
        {
          text: "Check the Kitchen",
          action: () => {
            updateGameState({ currentRoom: "kitchen" })
            addText("You push through the swinging doors into the kitchen...")
          },
        },
        {
          text: "Go to the Hedge Maze",
          action: () => {
            updateGameState({ currentRoom: "maze" })
            addText("You step outside into the frozen hedge maze...")
          },
        },
      ],
    },
    room237: {
      name: "Room 237",
      description: "The door creaks open. The room feels wrong, twisted by unseen forces.",
      ascii: `
    ╔══════════════════════════════════╗
    ║                                 ║
    ║     🛏️           🪟             ║
    ║                                 ║
    ║  👻 ← Something moves...         ║
    ║                                 ║
    ║     🚪                          ║
    ║                                 ║
    ║           237                   ║
    ╚══════════════════════════════════╝`,
      choices: [
        {
          text: "Investigate the bathroom",
          action: () => {
            updateGameState({ sanity: gameState.sanity - 20 })
            addText("You see something horrifying in the bathtub... Your sanity decreases!")
            if (gameState.sanity <= 20) {
              updateGameState({ gameOver: true })
              addText("The horror overwhelms you. GAME OVER.")
            }
          },
        },
        {
          text: "Search for clues",
          action: () => {
            if (!gameState.inventory.includes("Hotel Key")) {
              addToInventory("Hotel Key")
              updateGameState({ hasKey: true })
            } else {
              addText("You've already searched this room thoroughly.")
            }
          },
        },
        {
          text: "Leave quickly",
          action: () => {
            updateGameState({ currentRoom: "lobby" })
            addText("You flee back to the lobby, heart pounding...")
          },
        },
      ],
    },
    bar: {
      name: "Gold Room Bar",
      description: "The elegant bar stretches endlessly. Ghostly figures seem to move in your peripheral vision.",
      ascii: `
    ╔══════════════════════════════════╗
    ║  🍾🥃🍾🥃🍾🥃🍾🥃🍾🥃🍾🥃      ║
    ║  ═══════════════════════════     ║
    ║                                 ║
    ║  👤 "What'll it be?"            ║
    ║                                 ║
    ║  🪑  🪑  🪑  🪑  🪑  🪑         ║
    ║                                 ║
    ║     🕺💃🕺💃 ← Ghostly party     ║
    ╚══════════════════════════════════╝`,
      choices: [
        {
          text: "Talk to the bartender",
          action: () => {
            addText("Lloyd the bartender pours you a drink...")
            addText("'You've always been the caretaker here, Mr. Torrance.'")
            updateGameState({ sanity: gameState.sanity - 15 })
          },
        },
        {
          text: "Join the ghostly party",
          action: () => {
            addText("You dance with the spirits of the past...")
            updateGameState({ sanity: gameState.sanity - 25 })
            if (gameState.sanity <= 0) {
              updateGameState({ gameOver: true })
              addText("You become one with the hotel's ghosts forever. GAME OVER.")
            }
          },
        },
        {
          text: "Return to lobby",
          action: () => {
            updateGameState({ currentRoom: "lobby" })
            addText("You back away from the supernatural gathering...")
          },
        },
      ],
    },
    kitchen: {
      name: "Hotel Kitchen",
      description: "Industrial kitchen equipment looms in the shadows. Something feels off about this place.",
      ascii: `
    ╔══════════════════════════════════╗
    ║  🔥🍳🔥    🥄🔪🥄    ❄️🧊❄️     ║
    ║                                 ║
    ║     [STOVE]   [PREP]  [FREEZER] ║
    ║                                 ║
    ║  🥫🥫🥫                         ║
    ║                                 ║
    ║        ⚠️ DANGER ⚠️             ║
    ║                                 ║
    ╚══════════════════════════════════╝`,
      items: ["Axe"],
      choices: [
        {
          text: "Check the freezer",
          action: () => {
            addText("The freezer is locked tight. You hear strange sounds from within...")
            updateGameState({ sanity: gameState.sanity - 10 })
          },
        },
        {
          text: "Take the axe",
          action: () => {
            if (!gameState.inventory.includes("Axe")) {
              addToInventory("Axe")
              addText("You grip the heavy axe. It feels familiar in your hands...")
            } else {
              addText("You already have the axe.")
            }
          },
        },
        {
          text: "Return to lobby",
          action: () => {
            updateGameState({ currentRoom: "lobby" })
            addText("You leave the ominous kitchen behind...")
          },
        },
      ],
    },
    maze: {
      name: "Hedge Maze",
      description: "Snow falls heavily as you navigate the frozen maze. Your breath forms clouds in the frigid air.",
      ascii: `
    ╔══════════════════════════════════╗
    ║  ❄️ ████ ❄️ ████ ❄️ ████ ❄️    ║
    ║     ████    ████    ████        ║
    ║  ❄️      ❄️      ❄️      ❄️    ║
    ║     ████    ████    ████        ║
    ║  ❄️ ████ ❄️ ████ ❄️ ████ ❄️    ║
    ║                                 ║
    ║        🚶 ← You are here        ║
    ║                                 ║
    ╚══════════════════════════════════╝`,
      choices: [
        {
          text: "Navigate deeper into the maze",
          action: () => {
            const random = Math.random()
            if (random < 0.3) {
              addText("You find a way out of the maze!")
              if (gameState.hasKey && gameState.inventory.includes("Axe")) {
                updateGameState({ victory: true })
                addText("With the key and axe, you escape the hotel's curse! YOU WIN!")
              } else {
                addText("But without the right tools, you're still trapped...")
              }
            } else if (random < 0.6) {
              addText("You're getting lost in the maze...")
              updateGameState({ health: gameState.health - 15 })
            } else {
              addText("You hear footsteps behind you in the snow...")
              updateGameState({ sanity: gameState.sanity - 20 })
            }
          },
        },
        {
          text: "Return to the hotel",
          action: () => {
            updateGameState({ currentRoom: "lobby" })
            addText("You retreat back to the warmth of the hotel...")
          },
        },
        {
          text: "Hide and wait",
          action: () => {
            addText("You crouch behind a hedge, waiting...")
            addText("'Danny... Danny...' - a voice calls through the snow.")
            updateGameState({ sanity: gameState.sanity - 10 })
          },
        },
      ],
    },
  }

  const currentRoom = rooms[gameState.currentRoom]

  const resetGame = () => {
    setGameState({
      currentRoom: "lobby",
      inventory: [],
      health: 100,
      sanity: 100,
      hasKey: false,
      gameOver: false,
      victory: false,
    })
    setGameText([
      "Welcome to the Overlook Hotel...",
      "The winter caretaker position seemed like a dream job.",
      "Now, as snow blocks all exits, you realize the truth.",
      "The hotel has a dark history, and you're not alone.",
    ])
  }

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-gray-900 text-green-400 p-4 font-mono">
        <Card className="max-w-4xl mx-auto bg-black border-red-600">
          <CardHeader>
            <CardTitle className="text-red-500 text-center text-2xl">GAME OVER</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <pre className="text-red-400 mb-4">
              {`
    ╔══════════════════════════════════╗
    ║                                 ║
    ║           💀 R.I.P 💀           ║
    ║                                 ║
    ║    You have become part of      ║
    ║      the hotel's history        ║
    ║                                 ║
    ║         Forever...              ║
    ║                                 ║
    ╚══════════════════════════════════╝
`}
            </pre>
            <Button onClick={resetGame} className="bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState.victory) {
    return (
      <div className="min-h-screen bg-gray-900 text-green-400 p-4 font-mono">
        <Card className="max-w-4xl mx-auto bg-black border-green-600">
          <CardHeader>
            <CardTitle className="text-green-500 text-center text-2xl">VICTORY!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <pre className="text-green-400 mb-4">
              {`
    ╔══════════════════════════════════╗
    ║                                 ║
    ║           🎉 SUCCESS! 🎉        ║
    ║                                 ║
    ║    You escaped the Overlook     ║
    ║         Hotel's curse!          ║
    ║                                 ║
    ║      The nightmare is over      ║
    ║                                 ║
    ╚══════════════════════════════════╝
`}
            </pre>
            <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-4 font-mono">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <Card className="bg-black border-green-600">
          <CardHeader>
            <CardTitle className="text-center text-xl text-red-500">THE SHINING - Text Adventure</CardTitle>
            <CardDescription className="text-center text-green-300">
              Survive the horrors of the Overlook Hotel
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-black border-green-600">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-red-400">Health</div>
                <div className="text-xl">{gameState.health}%</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black border-green-600">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-blue-400">Sanity</div>
                <div className="text-xl">{gameState.sanity}%</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black border-green-600">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-yellow-400">Items</div>
                <div className="text-sm">{gameState.inventory.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Room */}
        <Card className="bg-black border-green-600">
          <CardHeader>
            <CardTitle className="text-green-400">{currentRoom.name}</CardTitle>
            <CardDescription className="text-green-300">{currentRoom.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-green-400 text-xs overflow-x-auto">{currentRoom.ascii}</pre>
          </CardContent>
        </Card>

        {/* Inventory */}
        {gameState.inventory.length > 0 && (
          <Card className="bg-black border-green-600">
            <CardHeader>
              <CardTitle className="text-yellow-400">Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {gameState.inventory.map((item, index) => (
                  <Badge key={index} variant="outline" className="border-yellow-400 text-yellow-400">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Text */}
        <Card className="bg-black border-green-600">
          <CardHeader>
            <CardTitle className="text-green-400">Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {gameText.slice(-8).map((text, index) => (
                <p key={index} className="text-green-300 text-sm">
                  {"> "}
                  {text}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Choices */}
        <Card className="bg-black border-green-600">
          <CardHeader>
            <CardTitle className="text-green-400">What do you do?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {currentRoom.choices
                .filter((choice) => !choice.condition || choice.condition())
                .map((choice, index) => (
                  <Button
                    key={index}
                    onClick={choice.action}
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-900 justify-start"
                  >
                    {choice.text}
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="text-center">
          <Button onClick={resetGame} variant="outline" className="border-red-600 text-red-400 hover:bg-red-900">
            Restart Game
          </Button>
        </div>
      </div>
    </div>
  )
}
