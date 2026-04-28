process.env.LOGGER_DISABLE_CONSOLE_INTERCEPT = "true";
console.debug = () => {};

import { writeFileSync } from "fs";

const { default: client } = await import("@pay-com/core-configurations");

const { failureCodeMessages } = await client.getAllFailureCodeMessages({});

writeFileSync(
  "src/data/failure-codes.json",
  JSON.stringify({ failureCodeMessages }, null, 2) + "\n",
);

console.log(
  `Wrote ${failureCodeMessages.length} failure codes to src/data/failure-codes.json`,
);
