import _ from "lodash";
import * as day05 from "./day05.ts";

type Solution = (input: string) => any;

const solutions: Record<number, Solution[]> = {
  [5]: [day05.part1, day05.part2],
};

const handleIndex = async (): Promise<Response> => {
  return new Response(await Bun.file("index.html").bytes(), {
    headers: { "Content-Type": "text/html" },
    status: 200,
  });
};

const handleSolution = async (
  uri: URL,
  request: Request,
): Promise<Response> => {
  const params = uri.searchParams;

  const day = params.get("day");
  const part = params.get("part");

  if (
    !day ||
    !part ||
    !_.isNumber(+day) ||
    !_.isNumber(+part) ||
    ![1, 2].includes(+part) ||
    !((+day) in solutions)
  ) {
    return new Response(null, { status: 400 });
  }

  const input = await request.text();
  const solution = solutions[+day][+part - 1];

  try {
    const start = performance.now();
    const result = solution(input);
    const elapsed = performance.now() - start;
    return new Response(
      JSON.stringify({
        result,
        elapsed,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response("Malformed input", { status: 400 });
  }
};

const handleNotFound = async (): Promise<Response> => {
  return new Response(await Bun.file("not_found.html").bytes(), {
    headers: {
      "Content-Type": "text/html",
    },
  });
};

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(request) {
    const uri = new URL(request.url);

    if (uri.pathname === "" || uri.pathname === "/") {
      return handleIndex();
    }

    if (uri.pathname === "/solve") {
      return handleSolution(uri, request);
    }

    return handleNotFound();
  },
});

console.log(`Server listening on port: ${server.port}`);
