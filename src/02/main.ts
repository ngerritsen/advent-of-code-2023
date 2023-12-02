import { group, sum } from "radash";
import input from "./input.txt";

const elfQuery = { red: 12, green: 13, blue: 14 };
type Color = keyof typeof elfQuery;
type Draw = { color: Color; count: number };

const main = () => {
  const games = parseGames(input);

  console.log(getSatisfyingGamesTotal(games));
  console.log(getGamePowerTotal(games));
};

const getSatisfyingGamesTotal = (games: Draw[][]) =>
  sum(games.map((game, i) => (satisfiesElfQuery(game) ? i + 1 : 0)));

const satisfiesElfQuery = (game: Draw[]) =>
  game.every((draw) => draw.count <= elfQuery[draw.color]);

const getGamePowerTotal = (games: Draw[][]) => sum(games.map(getGamePower));

const getGamePower = (game: Draw[]) =>
  Object.values(group(game, (d) => d.color))
    .map((draws) => Math.max(...draws.map((d) => d.count)))
    .reduce((a, b) => a * b, 1);

const parseGames = (input: string) => input.split("\n").map(parseGame);

const parseGame = (line: string): Draw[] =>
  line.split(":")[1].split(";").flatMap(parseRound);

const parseRound = (roundStr: string) => roundStr.split(",").map(parseDraw);

const parseDraw = (drawStr: string) => {
  const [count, color] = drawStr.trim().split(" ");
  return { count: Number(count), color: color as Color };
};

main();
