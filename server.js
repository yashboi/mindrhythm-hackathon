const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "static");
const port = Number(process.env.PORT || 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const server = http.createServer((request, response) => {
  response.setHeader("Connection", "close");
  response.setHeader("Cache-Control", "no-store, max-age=0");
  if (request.method === "POST" && request.url === "/api/stabilization") {
    readBody(request, async (error, body) => {
      if (error) {
        sendJson(response, 400, { error: "Could not read request body." });
        return;
      }
      if (!process.env.OPENAI_API_KEY) {
        sendJson(response, 200, {
          source: "fallback",
          plan: [
            "Keep the local driver-based plan in place.",
            "Use the strongest current signal to choose one small stabilizing action."
          ]
        });
        return;
      }
      try {
        const payload = JSON.parse(body || "{}");
        const apiResponse = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-5.1-mini",
            input: [
              {
                role: "system",
                content: "You write brief, non-diagnostic wellness support plans. Do not claim diagnosis, treatment, or medical certainty. Include crisis-safe language when appropriate. Return only JSON with a steps array of 3 to 5 short strings."
              },
              {
                role: "user",
                content: JSON.stringify(payload)
              }
            ],
            text: {
              format: {
                type: "json_schema",
                name: "stabilization_plan",
                schema: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    steps: {
                      type: "array",
                      minItems: 3,
                      maxItems: 5,
                      items: { type: "string" }
                    }
                  },
                  required: ["steps"]
                },
                strict: true
              }
            }
          })
        });
        if (!apiResponse.ok) {
          sendJson(response, 200, { source: "fallback", plan: [`OpenAI request failed with ${apiResponse.status}; using local stabilization plan.`] });
          return;
        }
        const data = await apiResponse.json();
        const text = data.output_text || data.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text || "{}";
        const parsed = JSON.parse(text);
        sendJson(response, 200, { source: "openai", plan: parsed.steps || [] });
      } catch (err) {
        sendJson(response, 200, { source: "fallback", plan: ["OpenAI plan generation hit an error; using the local stabilization plan."] });
      }
    });
    return;
  }
  const urlPath = decodeURIComponent(new URL(request.url, `http://localhost:${port}`).pathname);
  const filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(root, "index.html"), (fallbackError, fallbackData) => {
        if (fallbackError) {
          response.writeHead(404);
          response.end("Not found");
          return;
        }
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(fallbackData);
      });
      return;
    }
    response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    response.end(data);
  });
});

server.listen(port, () => {
  console.log(`MindRhythm running at http://localhost:${port}`);
});

function readBody(request, callback) {
  let body = "";
  request.on("data", (chunk) => {
    body += chunk;
    if (body.length > 100000) request.destroy();
  });
  request.on("end", () => callback(null, body));
  request.on("error", callback);
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}
