import { dayOfYear, currentDayOfYear } from "https://deno.land/std/datetime/mod.ts"

const dayNum: number = currentDayOfYear()

console.log(dayOfYear(new Date('2020-04-01')))
console.log(dayNum)
