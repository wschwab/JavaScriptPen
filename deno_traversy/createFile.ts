const encoder = new TextEncoder()

const greetText = encoder.encode('Hello World\nwhuddup')

await Deno.writeFile('greet.txt', greetText)
