import asyncio
import websockets


async def handler(websocket, path):

    while True:
        try:
            message = await websocket.recv()  # Wait for client message
            if message.lower() == "update":
                response = f"Updated message: {asyncio.get_event_loop().time()}"
                await websocket.send(response)  # Send updated string
            else:
                await websocket.send("Unknown command. Send 'update' to get a new message.")
        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected")
            break

async def main():
    port = 8765  # Change this if needed
    async with websockets.serve(handler, "0.0.0.0", port):
        print(f"WebSocket server running on ws://localhost:{port}")
        await asyncio.Future()  # Keep running forever

# Run the server
asyncio.create_task(asyncio.to_thread(main))
print("hello world")