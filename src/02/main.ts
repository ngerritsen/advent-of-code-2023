import input from "./input.txt";
import { add, groupBy, mul } from "../utils";

const elfQuery = { red: 12, green: 13, blue: 14 };
type Color = keyof typeof elfQuery;
type Draw = { color: Color; count: number };

const main = () => {
  const games = input.trim().split("\n").map(parseGame);

  console.log(getSatisfyingGamesTotal(games));
  console.log(getGamePowerTotal(games));
};

const getSatisfyingGamesTotal = (games: Draw[][]) =>
  games.map((game, i) => (satisfiesElfQuery(game) ? i + 1 : 0)).reduce(add);

const satisfiesElfQuery = (game: Draw[]) =>
  game.every((draw) => draw.count <= elfQuery[draw.color]);

const getGamePowerTotal = (games: Draw[][]) =>
  games.map(getGamePower).reduce(add);

const getGamePower = (game: Draw[]) =>
  Object.values(groupBy(game, (d) => d.color))
    .map((draws) => Math.max(...draws.map((d) => d.count)))
    .reduce(mul, 1);

const parseGame = (line: string): Draw[] => {
  return line.split(":")[1].split(/,|;/).map(parseDraw);
};

const parseDraw = (drawStr: string) => {
  const [count, color] = drawStr.trim().split(" ");
  return { count: Number(count), color: color as Color };
};

main();
